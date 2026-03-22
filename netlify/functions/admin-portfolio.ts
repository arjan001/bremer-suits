import type { Context } from '@netlify/functions'
import { getSupabase, jsonResponse, errorResponse, corsHeaders } from './utils/supabase.ts'

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    const supabase = getSupabase()
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    /* ── GET: list all portfolio items (or filter by status/tag) ── */
    if (req.method === 'GET') {
      let query = supabase.from('portfolio').select('*')

      const status = url.searchParams.get('status')
      if (status) query = query.eq('status', status)

      const tag = url.searchParams.get('tag')
      if (tag) query = query.eq('tag', tag)

      const category = url.searchParams.get('category')
      if (category) query = query.eq('category', category)

      const featured = url.searchParams.get('featured')
      if (featured === 'true') query = query.eq('is_featured', true)

      query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data)
    }

    /* ── POST: create a new portfolio item ── */
    if (req.method === 'POST') {
      const body = await req.json()
      const { data, error } = await supabase.from('portfolio').insert(body).select().single()
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data, 201)
    }

    /* ── PUT: update a portfolio item ── */
    if (req.method === 'PUT') {
      if (!id) return errorResponse('Missing id parameter')
      const body = await req.json()
      const { data, error } = await supabase.from('portfolio').update(body).eq('id', id).select().single()
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data)
    }

    /* ── DELETE: remove a portfolio item ── */
    if (req.method === 'DELETE') {
      if (!id) return errorResponse('Missing id parameter')
      const { error } = await supabase.from('portfolio').delete().eq('id', id)
      if (error) return errorResponse(error.message, 500)
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
