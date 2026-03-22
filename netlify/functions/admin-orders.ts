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

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data)
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { items, ...orderData } = body
      // Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()
      if (orderError) return errorResponse(orderError.message, 500)
      // Insert order items
      if (items && items.length > 0) {
        const orderItems = items.map((item: Record<string, unknown>) => ({
          ...item,
          order_id: order.id,
        }))
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)
        if (itemsError) return errorResponse(itemsError.message, 500)
      }
      return jsonResponse(order, 201)
    }

    if (req.method === 'PUT') {
      if (!id) return errorResponse('Missing id parameter')
      const body = await req.json()
      const { data, error } = await supabase
        .from('orders')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data)
    }

    if (req.method === 'DELETE') {
      if (!id) return errorResponse('Missing id parameter')
      // Delete order items first (cascade should handle this, but explicit)
      const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', id)
      if (itemsError) return errorResponse(itemsError.message, 500)
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)
      if (error) return errorResponse(error.message, 500)
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
