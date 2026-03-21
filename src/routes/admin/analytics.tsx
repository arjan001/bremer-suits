import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp, ShoppingCart, Users, DollarSign } from 'lucide-react'
import { useAdmin } from '@/lib/admin-store'

export const Route = createFileRoute('/admin/analytics')({
  component: AdminAnalytics,
})

function AdminAnalytics() {
  const { orders, products, subscribers, settings } = useAdmin()

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length

  // Top products by order count
  const productOrderCount: Record<string, number> = {}
  orders.forEach((o) => {
    o.items.forEach((item) => {
      productOrderCount[item.title] = (productOrderCount[item.title] || 0) + item.quantity
    })
  })
  const topProducts = Object.entries(productOrderCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Payment method breakdown
  const paymentBreakdown: Record<string, number> = {}
  orders.forEach((o) => {
    paymentBreakdown[o.paymentMethod] = (paymentBreakdown[o.paymentMethod] || 0) + 1
  })

  // Revenue by status
  const revenueByStatus: Record<string, number> = {}
  orders.forEach((o) => {
    revenueByStatus[o.status] = (revenueByStatus[o.status] || 0) + o.total
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Store performance overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={<DollarSign size={18} />} label="Total Revenue" value={`${settings.currency} ${totalRevenue.toLocaleString()}`} color="bg-green-50 text-green-600" />
        <MetricCard icon={<ShoppingCart size={18} />} label="Total Orders" value={orders.length.toString()} color="bg-blue-50 text-blue-600" />
        <MetricCard icon={<TrendingUp size={18} />} label="Avg Order Value" value={`${settings.currency} ${avgOrderValue.toLocaleString()}`} color="bg-purple-50 text-purple-600" />
        <MetricCard icon={<Users size={18} />} label="Subscribers" value={subscribers.filter((s) => s.status === 'active').length.toString()} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Order Status</h2>
          <div className="space-y-3">
            <StatusBar label="Delivered" count={deliveredOrders} total={orders.length} color="bg-green-500" />
            <StatusBar label="Pending" count={pendingOrders} total={orders.length} color="bg-yellow-500" />
            <StatusBar label="Processing" count={orders.filter((o) => o.status === 'processing').length} total={orders.length} color="bg-purple-500" />
            <StatusBar label="Shipped" count={orders.filter((o) => o.status === 'shipped').length} total={orders.length} color="bg-indigo-500" />
            <StatusBar label="Cancelled" count={cancelledOrders} total={orders.length} color="bg-red-500" />
          </div>
          {orders.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No orders data yet</p>}
        </div>

        {/* Payment Methods */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {Object.entries(paymentBreakdown).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${
                    method === 'mpesa' ? 'bg-green-500' :
                    method === 'card' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm text-gray-700 uppercase">{method}</span>
                </div>
                <span className="text-sm font-bold text-black">{count} orders</span>
              </div>
            ))}
            {Object.keys(paymentBreakdown).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No payment data yet</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map(([title, count], i) => (
              <div key={title} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                <span className="flex-1 text-sm text-gray-700 truncate">{title}</span>
                <span className="text-sm font-bold text-black">{count} sold</span>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No sales data yet</p>}
          </div>
        </div>

        {/* Product Inventory */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Inventory Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Products</span>
              <span className="text-sm font-bold text-black">{products.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-sm font-bold text-green-600">{products.filter((p) => p.status === 'active').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Draft</span>
              <span className="text-sm font-bold text-yellow-600">{products.filter((p) => p.status === 'draft').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Stock (&lt;5)</span>
              <span className="text-sm font-bold text-red-600">{products.filter((p) => p.stock < 5).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Stock Units</span>
              <span className="text-sm font-bold text-black">{products.reduce((s, p) => s + p.stock, 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>{icon}</div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-black mt-1">{value}</p>
    </div>
  )
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-black">{count} ({pct}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
