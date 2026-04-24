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

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .order('title', { ascending: true })
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data)
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { data, error } = await supabase
        .from('policies')
        .insert({ ...body, updated_at: new Date().toISOString() })
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'create',
        resource: 'policies',
        resourceId: data?.id,
        description: `Created policy "${data?.title ?? ''}"`,
        metadata: { after: data },
      })
      return jsonResponse(data, 201)
    }

    if (req.method === 'PUT') {
      if (!id) return errorResponse('Missing id parameter')
      const body = await req.json()
      const { data: before } = await supabase.from('policies').select('*').eq('id', id).single()
      const { data, error } = await supabase
        .from('policies')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'update',
        resource: 'policies',
        resourceId: id,
        description: `Updated policy "${data?.title ?? ''}"`,
        metadata: { before, after: data, changes: body },
      })
      return jsonResponse(data)
    }

    if (req.method === 'DELETE') {
      if (!id) return errorResponse('Missing id parameter')
      const { data: before } = await supabase.from('policies').select('*').eq('id', id).single()
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', id)
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'delete',
        resource: 'policies',
        resourceId: id,
        description: `Deleted policy "${before?.title ?? id}"`,
        metadata: { before },
      })
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
