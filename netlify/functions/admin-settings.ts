import type { Context } from '@netlify/functions'
import { getSupabase, jsonResponse, errorResponse, corsHeaders } from './utils/supabase.ts'

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    const supabase = getSupabase()

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()
      if (error && error.code !== 'PGRST116') return errorResponse(error.message, 500)
      return jsonResponse(data || {})
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { data, error } = await supabase
        .from('settings')
        .insert(body)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data, 201)
    }

    if (req.method === 'PUT') {
      const body = await req.json()
      // Upsert settings (single row)
      const { data: existing } = await supabase.from('settings').select('id').single()
      if (existing) {
        const { data, error } = await supabase
          .from('settings')
          .update({ ...body, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) return errorResponse(error.message, 500)
        return jsonResponse(data)
      } else {
        const { data, error } = await supabase
          .from('settings')
          .insert(body)
          .select()
          .single()
        if (error) return errorResponse(error.message, 500)
        return jsonResponse(data, 201)
      }
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url)
      const id = url.searchParams.get('id')
      if (!id) return errorResponse('Missing id parameter')
      const { error } = await supabase.from('settings').delete().eq('id', id)
      if (error) return errorResponse(error.message, 500)
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed. Use GET, POST, PUT, or DELETE.', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
