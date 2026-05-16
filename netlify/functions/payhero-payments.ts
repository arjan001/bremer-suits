import type { Context } from '@netlify/functions'
import { getSupabase, jsonResponse, errorResponse, corsHeaders } from './utils/supabase.ts'
import { logAudit } from './utils/audit.ts'

async function getPayHeroConfig() {
  const supabase = getSupabase()
  const { data } = await supabase.from('settings').select('payhero_api_username, payhero_api_password, payhero_channel_id, payhero_enabled').single()
  if (!data || !data.payhero_enabled) return null
  if (!data.payhero_api_username || !data.payhero_api_password || !data.payhero_channel_id) return null
  const token = btoa(`${data.payhero_api_username}:${data.payhero_api_password}`)
  return { token, channelId: data.payhero_channel_id }
}

const PAYHERO_API = 'https://backend.payhero.co.ke/api/v2'

export default async function handler(req: Request, context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  try {
    if (req.method === 'POST' && action === 'stk-push') {
      return await handleStkPush(req)
    }

    if (req.method === 'GET' && action === 'status') {
      return await handleStatusCheck(req)
    }

    if (req.method === 'POST' && action === 'callback') {
      return await handleCallback(req)
    }

    return errorResponse('Invalid action. Use: stk-push, status, or callback', 400)
  } catch (err) {
    console.error('PayHero function error:', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

async function handleStkPush(req: Request) {
  const config = await getPayHeroConfig()
  if (!config) return errorResponse('PayHero is not configured or not enabled. Set API credentials in Admin Settings.', 400)

  const body = await req.json()
  const { amount, phone_number, external_reference, customer_name, order_id } = body

  if (!amount || !phone_number) {
    return errorResponse('amount and phone_number are required', 400)
  }

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || ''
  const callbackUrl = siteUrl ? `${siteUrl}/.netlify/functions/payhero-payments?action=callback` : ''

  const payload = {
    amount: Number(amount),
    phone_number: String(phone_number),
    channel_id: Number(config.channelId),
    provider: 'm-pesa',
    external_reference: external_reference || `BRM-${Date.now().toString(36).toUpperCase()}`,
    customer_name: customer_name || '',
    ...(callbackUrl ? { callback_url: callbackUrl } : {}),
  }

  const res = await fetch(`${PAYHERO_API}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${config.token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    return errorResponse(data?.message || data?.error || 'PayHero STK Push failed', res.status)
  }

  const supabase = getSupabase()
  if (order_id) {
    await supabase.from('orders').update({
      payment_status: 'pending_processing',
      payment_details: {
        payheroReference: payload.external_reference,
        phoneNumber: phone_number,
        provider: 'm-pesa',
        stkPushSent: true,
        stkPushResponse: data,
      },
    }).eq('id', order_id)
  }

  await logAudit(supabase, req, {
    action: 'payhero_stk_push',
    resource: 'payments',
    resourceId: order_id || null,
    description: `Initiated PayHero STK Push to ${phone_number} for ${amount}`,
    metadata: { reference: payload.external_reference, amount, phone: phone_number },
  })

  return jsonResponse({ success: true, reference: payload.external_reference, ...data })
}

async function handleStatusCheck(req: Request) {
  const config = await getPayHeroConfig()
  if (!config) return errorResponse('PayHero is not configured', 400)

  const url = new URL(req.url)
  const reference = url.searchParams.get('reference')
  if (!reference) return errorResponse('reference query parameter is required', 400)

  const res = await fetch(`${PAYHERO_API}/transactions?reference=${encodeURIComponent(reference)}`, {
    headers: {
      'Authorization': `Basic ${config.token}`,
    },
  })

  const data = await res.json()
  if (!res.ok) {
    return errorResponse(data?.message || 'Failed to check status', res.status)
  }

  return jsonResponse(data)
}

async function handleCallback(req: Request) {
  const body = await req.json()
  const supabase = getSupabase()

  const reference = body?.external_reference || body?.ExternalReference || body?.reference
  const status = body?.status || body?.Status
  const transactionId = body?.transaction_id || body?.TransactionId || body?.mpesa_receipt || ''

  if (reference) {
    const paymentStatus = (status === 'SUCCESS' || status === 'success' || status === 'completed') ? 'completed' : 'failed'

    const { data: orders } = await supabase
      .from('orders')
      .select('id, payment_details')
      .filter('payment_details->>payheroReference', 'eq', reference)

    if (orders && orders.length > 0) {
      for (const order of orders) {
        const existingDetails = (order.payment_details as Record<string, unknown>) || {}
        await supabase.from('orders').update({
          payment_status: paymentStatus,
          payment_details: {
            ...existingDetails,
            transactionId,
            callbackStatus: status,
            callbackData: body,
            completedAt: new Date().toISOString(),
          },
        }).eq('id', order.id)
      }
    }

    await logAudit(supabase, undefined, {
      action: 'payhero_callback',
      resource: 'payments',
      description: `PayHero callback: ${reference} → ${paymentStatus}`,
      metadata: { reference, status, transactionId },
    })
  }

  return jsonResponse({ success: true })
}
