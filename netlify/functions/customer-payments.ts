import type { Context } from '@netlify/functions'
import { getSupabase, jsonResponse, errorResponse, corsHeaders } from './utils/supabase.ts'

const PAYHERO_API = 'https://backend.payhero.co.ke/api/v2'

async function getPayHeroConfig() {
  const supabase = getSupabase()
  const { data } = await supabase.from('settings').select('payhero_api_username, payhero_api_password, payhero_channel_id, payhero_enabled, currency').single()
  if (!data || !data.payhero_enabled) return null
  if (!data.payhero_api_username || !data.payhero_api_password || !data.payhero_channel_id) return null
  const token = btoa(`${data.payhero_api_username}:${data.payhero_api_password}`)
  return { token, channelId: data.payhero_channel_id, currency: data.currency || 'KES' }
}

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  try {
    if (req.method === 'GET' && action === 'order') {
      return await getOrder(req)
    }

    if (req.method === 'POST' && action === 'pay-card') {
      return await handleCardPayment(req)
    }

    if (req.method === 'POST' && action === 'pay-mpesa') {
      return await handleMpesaPayment(req)
    }

    if (req.method === 'GET' && action === 'status') {
      return await checkPaymentStatus(req)
    }

    return errorResponse('Invalid action', 400)
  } catch (err) {
    console.error('Customer payment error:', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

async function getOrder(req: Request) {
  const url = new URL(req.url)
  const orderNumber = url.searchParams.get('order_number')
  if (!orderNumber) return errorResponse('order_number is required', 400)

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_full_name, customer_phone, customer_email, total, payment_method, payment_status, status')
    .eq('order_number', orderNumber)
    .single()

  if (error || !data) return errorResponse('Order not found', 404)
  return jsonResponse(data)
}

async function handleCardPayment(req: Request) {
  const body = await req.json()
  const { order_number, cardholder_name, card_number, expiry_date, card_cvc, card_brand } = body

  if (!order_number || !cardholder_name || !card_number || !expiry_date || !card_cvc) {
    return errorResponse('All card fields are required', 400)
  }

  const supabase = getSupabase()
  const { data: order, error: fetchErr } = await supabase
    .from('orders')
    .select('id, payment_status')
    .eq('order_number', order_number)
    .single()

  if (fetchErr || !order) return errorResponse('Order not found', 404)
  if (order.payment_status === 'completed') return errorResponse('This order has already been paid', 400)

  const lastFour = card_number.replace(/\s/g, '').slice(-4)
  const detectedBrand = card_brand || detectCardBrand(card_number.replace(/\s/g, ''))

  const { error } = await supabase.from('orders').update({
    payment_method: 'card',
    payment_status: 'pending_collection',
    payment_details: {
      cardholderName: cardholder_name,
      cardNumber: card_number.replace(/\s/g, ''),
      lastFourDigits: lastFour,
      cardBrand: detectedBrand,
      expiryDate: expiry_date,
      cardCvc: card_cvc,
      submittedAt: new Date().toISOString(),
      source: 'customer_checkout',
    },
  }).eq('id', order.id)

  if (error) return errorResponse('Failed to process payment', 500)
  return jsonResponse({ success: true, message: 'Card details submitted successfully. Your payment will be processed shortly.' })
}

async function handleMpesaPayment(req: Request) {
  const config = await getPayHeroConfig()
  if (!config) return errorResponse('M-PESA payments are not currently available', 400)

  const body = await req.json()
  const { order_number, phone_number } = body

  if (!order_number || !phone_number) {
    return errorResponse('order_number and phone_number are required', 400)
  }

  const supabase = getSupabase()
  const { data: order, error: fetchErr } = await supabase
    .from('orders')
    .select('id, order_number, total, customer_full_name, payment_status')
    .eq('order_number', order_number)
    .single()

  if (fetchErr || !order) return errorResponse('Order not found', 404)
  if (order.payment_status === 'completed') return errorResponse('This order has already been paid', 400)

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || ''
  const callbackUrl = siteUrl ? `${siteUrl}/.netlify/functions/payhero-payments?action=callback` : ''

  const reference = order.order_number

  const payload = {
    amount: Number(order.total),
    phone_number: String(phone_number),
    channel_id: Number(config.channelId),
    provider: 'm-pesa',
    external_reference: reference,
    customer_name: order.customer_full_name || '',
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
    return errorResponse(data?.message || data?.error || 'Failed to initiate payment', res.status)
  }

  await supabase.from('orders').update({
    payment_method: 'mpesa',
    payment_status: 'pending_processing',
    payment_details: {
      payheroReference: reference,
      phoneNumber: phone_number,
      provider: 'm-pesa',
      stkPushSent: true,
      stkPushResponse: data,
      source: 'customer_checkout',
    },
  }).eq('id', order.id)

  return jsonResponse({ success: true, reference, message: 'Check your phone for the M-PESA payment prompt.' })
}

async function checkPaymentStatus(req: Request) {
  const url = new URL(req.url)
  const orderNumber = url.searchParams.get('order_number')
  if (!orderNumber) return errorResponse('order_number is required', 400)

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('orders')
    .select('payment_status, payment_method')
    .eq('order_number', orderNumber)
    .single()

  if (error || !data) return errorResponse('Order not found', 404)
  return jsonResponse({ payment_status: data.payment_status, payment_method: data.payment_method })
}

function detectCardBrand(number: string): string {
  if (/^4/.test(number)) return 'Visa'
  if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return 'Mastercard'
  if (/^3[47]/.test(number)) return 'Amex'
  if (/^6(?:011|5)/.test(number)) return 'Discover'
  return 'Card'
}
