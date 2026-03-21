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

    return errorResponse('Method not allowed. Use GET or PUT.', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
