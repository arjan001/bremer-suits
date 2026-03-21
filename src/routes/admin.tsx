import { createFileRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  CreditCard,
  Gift,
  Mail,
  Truck,
  BarChart3,
  FileText,
  Users,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { AdminProvider, useAdmin } from '@/lib/admin-store'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

const sidebarItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart, hasBadge: true },
  { to: '/admin/card-details', label: 'Card Details', icon: CreditCard },
  { to: '/admin/offers', label: 'Offers & Banners', icon: Gift },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/delivery', label: 'Delivery', icon: Truck },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/policies', label: 'Policies', icon: FileText },
  { to: '/admin/users', label: 'Users & Roles', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
] as const

function AdminLayoutInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = router.state.location.pathname
  const { orders, settings } = useAdmin()
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            BS Admin
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Bremer Suits Admin</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {sidebarItems.map((item) => {
            const active = isActive(item.to, 'exact' in item ? item.exact : false)
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 mb-0.5 ${
                  active
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {'hasBadge' in item && pendingOrders > 0 && (
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    active ? 'bg-white text-black' : 'bg-red-500 text-white'
                  }`}>
                    {pendingOrders}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <Settings size={16} className="text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate">{settings.storeName}</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-black transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
              <span>Admin</span>
              <span>&rsaquo;</span>
              <span className="text-black font-medium">
                {sidebarItems.find((i) => isActive(i.to, 'exact' in i ? i.exact : false))?.label || 'Dashboard'}
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{settings.storeEmail}</span>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">View Store</span>
            </Link>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors">
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function AdminLayout() {
  return (
    <AdminProvider>
      <AdminLayoutInner />
    </AdminProvider>
  )
}
