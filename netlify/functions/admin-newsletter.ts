import type { Context } from '@netlify/functions'
import { getSupabase, jsonResponse, errorResponse, corsHeaders } from './utils/supabase.ts'
import { logAudit } from './utils/audit.ts'

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    const supabase = getSupabase()
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const resource = url.searchParams.get('resource') || 'subscribers'

    if (resource === 'campaigns') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('email_campaigns').select('*').order('sent_at', { ascending: false })
        if (error) return errorResponse(error.message, 500)
        return jsonResponse(data)
      }
      if (req.method === 'POST') {
        const body = await req.json()
        const { data, error } = await supabase.from('email_campaigns').insert(body).select().single()
        if (error) return errorResponse(error.message, 500)
        await logAudit(supabase, req, {
          action: 'create',
          resource: 'email_campaigns',
          resourceId: data?.id,
          description: `Sent email campaign "${data?.subject ?? ''}" to ${data?.recipient_count ?? 0} subscribers`,
          metadata: { after: { id: data?.id, subject: data?.subject, recipient_count: data?.recipient_count } },
        })
        return jsonResponse(data, 201)
      }
      if (req.method === 'PUT') {
        if (!id) return errorResponse('Missing id parameter')
        const body = await req.json()
        const { data, error } = await supabase.from('email_campaigns').update(body).eq('id', id).select().single()
        if (error) return errorResponse(error.message, 500)
        await logAudit(supabase, req, {
          action: 'update',
          resource: 'email_campaigns',
          resourceId: id,
          description: `Updated email campaign "${data?.subject ?? ''}"`,
          metadata: { changes: body },
        })
        return jsonResponse(data)
      }
      if (req.method === 'DELETE') {
        if (!id) return errorResponse('Missing id parameter')
        const { data: before } = await supabase.from('email_campaigns').select('id, subject').eq('id', id).single()
        const { error } = await supabase.from('email_campaigns').delete().eq('id', id)
        if (error) return errorResponse(error.message, 500)
        await logAudit(supabase, req, {
          action: 'delete',
          resource: 'email_campaigns',
          resourceId: id,
          description: `Deleted email campaign "${before?.subject ?? id}"`,
          metadata: { before },
        })
        return jsonResponse({ success: true })
      }
      return errorResponse('Method not allowed', 405)
    }

    // Subscribers
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data)
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert(body)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'create',
        resource: 'newsletter_subscribers',
        resourceId: data?.id,
        description: `Added subscriber ${data?.email ?? ''}`,
        metadata: { after: data },
      })
      return jsonResponse(data, 201)
    }

    if (req.method === 'PUT') {
      if (!id) return errorResponse('Missing id parameter')
      const body = await req.json()
      const { data: before } = await supabase.from('newsletter_subscribers').select('*').eq('id', id).single()
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'update',
        resource: 'newsletter_subscribers',
        resourceId: id,
        description: `Updated subscriber ${data?.email ?? id}`,
        metadata: { before, after: data, changes: body },
      })
      return jsonResponse(data)
    }

    if (req.method === 'DELETE') {
      if (!id) return errorResponse('Missing id parameter')
      const { data: before } = await supabase.from('newsletter_subscribers').select('*').eq('id', id).single()
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'delete',
        resource: 'newsletter_subscribers',
        resourceId: id,
        description: `Removed subscriber ${before?.email ?? id}`,
        metadata: { before },
      })
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
