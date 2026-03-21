import { createFileRoute, Link } from '@tanstack/react-router'
import { Package, Tag, Gift, ShoppingCart, ArrowRight, Eye } from 'lucide-react'
import { useAdmin } from '@/lib/admin-store'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { products, categories, offers, orders, settings, heroBanners, popupOffers } = useAdmin()
  const activeOffers = heroBanners.filter((b) => b.isActive).length + popupOffers.filter((p) => p.isActive).length + offers.filter((o) => o.status === 'active').length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const recentProducts = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here's an overview of your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="TOTAL PRODUCTS"
          value={products.length}
          subtitle="In store"
          icon={<Package size={20} className="text-gray-400" />}
        />
        <StatCard
          label="CATEGORIES"
          value={categories.filter((c) => c.status === 'active').length}
          subtitle="Active"
          icon={<Tag size={20} className="text-gray-400" />}
        />
        <StatCard
          label="ACTIVE OFFERS"
          value={activeOffers}
          subtitle="Running"
          icon={<Gift size={20} className="text-gray-400" />}
        />
        <StatCard
          label="TOTAL ORDERS"
          value={orders.length}
          subtitle={`${settings.currency} ${totalRevenue.toLocaleString()} revenue`}
          icon={<ShoppingCart size={20} className="text-gray-400" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/admin/products"
          className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <Package size={20} className="text-gray-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-black">Manage Products</h3>
            <p className="text-xs text-gray-400">Add, edit or remove products</p>
          </div>
        </Link>
        <Link
          to="/admin/orders"
          className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <ShoppingCart size={20} className="text-gray-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-black">View Orders</h3>
            <p className="text-xs text-gray-400">Manage customer orders</p>
          </div>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <Eye size={20} className="text-gray-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-black">View Store</h3>
            <p className="text-xs text-gray-400">See how customers see it</p>
          </div>
        </Link>
      </div>

      {/* Recent Products & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-black">Recent Products</h2>
            <Link to="/admin/products" className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">No products yet</p>
            ) : (
              recentProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <Package size={16} className="text-gray-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-black whitespace-nowrap">{p.price}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-black">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">No orders yet</p>
            ) : (
              recentOrders.map((o) => (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3">
                  <ShoppingCart size={16} className="text-gray-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{o.orderNumber}</p>
                    <p className="text-xs text-gray-400">{o.customer.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black whitespace-nowrap">
                      {settings.currency} {o.total.toLocaleString()}
                    </p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      o.status === 'pending' ? 'text-yellow-600' :
                      o.status === 'confirmed' ? 'text-blue-600' :
                      o.status === 'delivered' ? 'text-green-600' :
                      o.status === 'cancelled' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, subtitle, icon }: { label: string; value: number; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">{label}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-black">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  )
}
