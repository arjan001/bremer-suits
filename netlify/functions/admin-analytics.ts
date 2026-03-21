import type { Context } from '@netlify/functions'
import { getSupabase, jsonResponse, errorResponse, corsHeaders } from './utils/supabase.ts'

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    const supabase = getSupabase()

    // Analytics is read-only - aggregates data from multiple tables
    if (req.method !== 'GET') {
      return errorResponse('Method not allowed. Analytics is read-only.', 405)
    }

    // Fetch all required data in parallel
    const [ordersRes, productsRes, subscribersRes] = await Promise.all([
      supabase.from('orders').select('id, total, status, payment_method, created_at, order_items(title, quantity)'),
      supabase.from('products').select('id, title, status, stock'),
      supabase.from('newsletter_subscribers').select('id, status'),
    ])

    const orders = ordersRes.data || []
    const products = productsRes.data || []
    const subscribers = subscribersRes.data || []

    const totalRevenue = orders.reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0)
    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

    // Status breakdown
    const statusBreakdown: Record<string, number> = {}
    orders.forEach((o: { status: string }) => {
      statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1
    })

    // Payment breakdown
    const paymentBreakdown: Record<string, number> = {}
    orders.forEach((o: { payment_method: string }) => {
      paymentBreakdown[o.payment_method] = (paymentBreakdown[o.payment_method] || 0) + 1
    })

    // Top products
    const productCount: Record<string, number> = {}
    orders.forEach((o: { order_items: { title: string; quantity: number }[] }) => {
      (o.order_items || []).forEach((item) => {
        productCount[item.title] = (productCount[item.title] || 0) + item.quantity
      })
    })
    const topProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, count }))

    // Inventory
    const activeProducts = products.filter((p: { status: string }) => p.status === 'active').length
    const draftProducts = products.filter((p: { status: string }) => p.status === 'draft').length
    const lowStock = products.filter((p: { stock: number }) => p.stock < 5).length
    const totalStock = products.reduce((sum: number, p: { stock: number }) => sum + (p.stock || 0), 0)

    return jsonResponse({
      totalRevenue,
      totalOrders: orders.length,
      avgOrderValue,
      activeSubscribers: subscribers.filter((s: { status: string }) => s.status === 'active').length,
      statusBreakdown,
      paymentBreakdown,
      topProducts,
      inventory: {
        total: products.length,
        active: activeProducts,
        draft: draftProducts,
        lowStock,
        totalStock,
      },
    })
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
