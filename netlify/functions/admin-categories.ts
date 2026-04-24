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
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data)
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { data, error } = await supabase
        .from('categories')
        .insert(body)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'create',
        resource: 'categories',
        resourceId: data?.id,
        description: `Created category "${data?.name ?? ''}"`,
        metadata: { after: data },
      })
      return jsonResponse(data, 201)
    }

    if (req.method === 'PUT') {
      if (!id) return errorResponse('Missing id parameter')
      const body = await req.json()
      const { data: before } = await supabase.from('categories').select('*').eq('id', id).single()
      const { data, error } = await supabase
        .from('categories')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'update',
        resource: 'categories',
        resourceId: id,
        description: `Updated category "${data?.name ?? ''}"`,
        metadata: { before, after: data, changes: body },
      })
      return jsonResponse(data)
    }

    if (req.method === 'DELETE') {
      if (!id) return errorResponse('Missing id parameter')
      const { data: before } = await supabase.from('categories').select('*').eq('id', id).single()
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'delete',
        resource: 'categories',
        resourceId: id,
        description: `Deleted category "${before?.name ?? id}"`,
        metadata: { before },
      })
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
