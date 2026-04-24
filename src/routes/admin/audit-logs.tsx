import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  User,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  X,
} from 'lucide-react'
import { auditLogsApi } from '@/lib/admin-api'

export const Route = createFileRoute('/admin/audit-logs')({
  component: AdminAuditLogs,
})

interface AuditLogRow {
  id: string
  action: string
  resource: string
  resource_id: string | null
  actor_email: string | null
  actor_id: string | null
  actor_role: string | null
  description: string | null
  metadata: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  status: 'success' | 'failure'
  created_at: string
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-50 text-green-700 border-green-200',
  update: 'bg-blue-50 text-blue-700 border-blue-200',
  delete: 'bg-red-50 text-red-700 border-red-200',
  login: 'bg-purple-50 text-purple-700 border-purple-200',
  logout: 'bg-gray-50 text-gray-700 border-gray-200',
  password_change: 'bg-amber-50 text-amber-700 border-amber-200',
  password_reset: 'bg-amber-50 text-amber-700 border-amber-200',
  purge: 'bg-red-50 text-red-700 border-red-200',
}

function actionClass(a: string) {
  return ACTION_COLORS[a] || 'bg-gray-50 text-gray-700 border-gray-200'
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

const LIMIT_OPTIONS = [25, 50, 100, 200]

function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLogRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [resource, setResource] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [viewItem, setViewItem] = useState<AuditLogRow | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const load = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(limit),
      }
      if (search) params.search = search
      if (action) params.action = action
      if (resource) params.resource = resource
      if (statusFilter) params.status = statusFilter
      if (fromDate) params.from = new Date(fromDate).toISOString()
      if (toDate) params.to = new Date(`${toDate}T23:59:59`).toISOString()
      const res = await auditLogsApi.list(params)
      setLogs(res.data as unknown as AuditLogRow[])
      setTotal(res.total)
    } catch (err) {
      console.error('Failed to load audit logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  const handleApplyFilters = () => {
    setPage(1)
    load()
  }

  const handleExport = () => {
    const header = ['Time', 'Actor', 'Action', 'Resource', 'Resource ID', 'Status', 'Description', 'IP'].join(',')
    const rows = logs.map((l) =>
      [
        l.created_at,
        l.actor_email || '',
        l.action,
        l.resource,
        l.resource_id || '',
        l.status,
        (l.description || '').replace(/"/g, '""'),
        l.ip_address || '',
      ]
        .map((s) => `"${s}"`)
        .join(','),
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = useMemo(() => {
    const success = logs.filter((l) => l.status === 'success').length
    const failure = logs.filter((l) => l.status === 'failure').length
    const uniqueActors = new Set(logs.map((l) => l.actor_email).filter(Boolean)).size
    return { success, failure, uniqueActors }
  }, [logs])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-black"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Audit Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Full, immutable history of every admin action taken across the dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => load()}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total (page)" value={logs.length} icon={Activity} />
        <StatCard label="Successes" value={stats.success} icon={CheckCircle2} tint="green" />
        <StatCard label="Failures" value={stats.failure} icon={AlertTriangle} tint="red" />
        <StatCard label="Actors" value={stats.uniqueActors} icon={User} />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black outline-none"
            />
          </div>
          <select value={action} onChange={(e) => setAction(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none">
            <option value="">All actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="password_change">Password Change</option>
            <option value="password_reset">Password Reset</option>
            <option value="purge">Purge</option>
          </select>
          <select value={resource} onChange={(e) => setResource(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none">
            <option value="">All resources</option>
            <option value="products">Products</option>
            <option value="categories">Categories</option>
            <option value="orders">Orders</option>
            <option value="users">Users</option>
            <option value="portfolio">Portfolio</option>
            <option value="auth">Auth</option>
            <option value="settings">Settings</option>
            <option value="policies">Policies</option>
            <option value="delivery_zones">Delivery</option>
            <option value="card_details">Card Details</option>
            <option value="newsletter_subscribers">Newsletter</option>
            <option value="email_campaigns">Campaigns</option>
            <option value="hero_banners">Hero Banners</option>
            <option value="banners">Banners</option>
            <option value="carousels">Carousels</option>
            <option value="navbar_offers">Navbar Offers</option>
            <option value="popup_offers">Popup Offers</option>
            <option value="menu_items">Menu Items</option>
            <option value="discount_codes">Discount Codes</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none">
            <option value="">Any status</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Apply
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Rows per page</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value))
                setPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none"
            >
              {LIMIT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch('')
                setAction('')
                setResource('')
                setStatusFilter('')
                setFromDate('')
                setToDate('')
                setPage(1)
                load()
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Resource</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">IP</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    Loading audit log...
                  </td>
                </tr>
              )}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-gray-400">
                    <Activity size={36} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No audit entries found for these filters.</p>
                  </td>
                </tr>
              )}
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatDate(l.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-black truncate max-w-[180px]">{l.actor_email || 'system'}</span>
                      {l.actor_role && <span className="text-[11px] text-gray-400">{l.actor_role}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 border rounded-full text-[11px] font-semibold uppercase tracking-wide ${actionClass(l.action)}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{l.resource}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-md">
                    <div className="flex items-center gap-2">
                      {l.status === 'failure' ? <AlertTriangle size={14} className="text-red-500 shrink-0" /> : <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                      <span className="truncate">{l.description || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs hidden lg:table-cell">{l.ip_address || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setViewItem(l)}
                      className="p-1.5 text-gray-400 hover:text-black transition-colors"
                      title="View details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/40">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-3 text-xs font-semibold text-gray-700">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {viewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewItem(null)} />
          <div className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-black">Audit Log Detail</h2>
              <button onClick={() => setViewItem(null)} className="p-1 text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <Row label="Time">{formatDate(viewItem.created_at)}</Row>
              <Row label="Actor">{viewItem.actor_email || 'system'}{viewItem.actor_role ? ` (${viewItem.actor_role})` : ''}</Row>
              <Row label="Action">
                <span className={`inline-flex px-2 py-0.5 border rounded-full text-[11px] font-semibold uppercase ${actionClass(viewItem.action)}`}>{viewItem.action}</span>
              </Row>
              <Row label="Resource">{viewItem.resource}</Row>
              {viewItem.resource_id && <Row label="Resource ID"><code className="text-xs">{viewItem.resource_id}</code></Row>}
              <Row label="Status">{viewItem.status}</Row>
              <Row label="Description">{viewItem.description || '—'}</Row>
              <Row label="IP">{viewItem.ip_address || '—'}</Row>
              {viewItem.user_agent && <Row label="User Agent"><span className="text-xs text-gray-500">{viewItem.user_agent}</span></Row>}
              {viewItem.metadata && Object.keys(viewItem.metadata).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Metadata</p>
                  <pre className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs overflow-x-auto max-h-80">{JSON.stringify(viewItem.metadata, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-32 shrink-0 text-xs font-semibold text-gray-500 uppercase tracking-wider pt-0.5">{label}</span>
      <span className="text-gray-800 flex-1 break-words">{children}</span>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ size?: number; className?: string }>
  tint?: 'green' | 'red'
}) {
  const iconClass =
    tint === 'green' ? 'text-green-600 bg-green-50' :
    tint === 'red' ? 'text-red-600 bg-red-50' :
    'text-gray-500 bg-gray-100'
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xl font-bold text-black leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}
