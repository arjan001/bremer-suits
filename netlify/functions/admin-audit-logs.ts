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

    if (req.method === 'GET') {
      let query = supabase.from('audit_logs').select('*', { count: 'exact' })

      const action = url.searchParams.get('action')
      if (action) query = query.eq('action', action)

      const resource = url.searchParams.get('resource')
      if (resource) query = query.eq('resource', resource)

      const actor = url.searchParams.get('actor_email') || url.searchParams.get('actor')
      if (actor) query = query.ilike('actor_email', `%${actor}%`)

      const status = url.searchParams.get('status')
      if (status) query = query.eq('status', status)

      const search = url.searchParams.get('search')
      if (search) query = query.ilike('description', `%${search}%`)

      const from = url.searchParams.get('from')
      if (from) query = query.gte('created_at', from)

      const to = url.searchParams.get('to')
      if (to) query = query.lte('created_at', to)

      const limitRaw = url.searchParams.get('limit')
      const pageRaw = url.searchParams.get('page')
      const limit = Math.min(Math.max(parseInt(limitRaw || '100', 10) || 100, 1), 500)
      const page = Math.max(parseInt(pageRaw || '1', 10) || 1, 1)
      const start = (page - 1) * limit
      const end = start + limit - 1

      query = query.order('created_at', { ascending: false }).range(start, end)

      const { data, error, count } = await query
      if (error) return errorResponse(error.message, 500)
      return jsonResponse({ data: data || [], total: count || 0, page, limit })
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => null)
      if (!body || !body.action || !body.resource) {
        return errorResponse('Missing required fields: action, resource')
      }
      await logAudit(supabase, req, {
        action: body.action,
        resource: body.resource,
        resourceId: body.resource_id || body.resourceId || null,
        description: body.description,
        metadata: body.metadata || {},
        status: body.status || 'success',
      })
      return jsonResponse({ success: true }, 201)
    }

    if (req.method === 'DELETE') {
      const before = url.searchParams.get('before')
      if (!before) {
        return errorResponse('Missing required "before" ISO date parameter; audit logs cannot be cleared wholesale.')
      }
      const { error, count } = await supabase
        .from('audit_logs')
        .delete({ count: 'exact' })
        .lt('created_at', before)
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'purge',
        resource: 'audit_logs',
        description: `Purged audit entries older than ${before}`,
        metadata: { before, deleted: count },
      })
      return jsonResponse({ success: true, deleted: count })
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
