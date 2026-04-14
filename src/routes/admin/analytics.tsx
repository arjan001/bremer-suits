import { createFileRoute } from '@tanstack/react-router'
import { Activity, MousePointerClick, Timer, Users, RefreshCw, Clock3, Globe, MapPin, Eye, ExternalLink } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/admin/analytics')({
  component: AdminAnalytics,
})

interface AnalyticsReport {
  periodDays: number
  totals: {
    pageViews: number
    clicks: number
    uniqueVisitors: number
    sessions: number
    avgSessionSeconds: number
    bounceRate: number
    avgPageTimeSeconds: number
  }
  topPages: Array<{ path: string; views: number; avgTimeSeconds: number }>
  topClicks: Array<{ target: string; count: number }>
  daily: Array<{
    date: string
    pageViews: number
    clicks: number
    visitors: number
    sessions: number
    avgSessionSeconds: number
  }>
}

interface VisitorRecord {
  id: string
  ip: string
  country: string
  countryCode: string
  city: string
  region: string
  timezone: string
  userAgent: string
  path: string
  referer: string
  timestamp: string
}

interface VisitorTrackingReport {
  periodDays: number
  totals: {
    totalVisits: number
    uniqueIPs: number
  }
  topCountries: Array<{ name: string; visits: number }>
  topCities: Array<{ name: string; visits: number }>
  topReferers: Array<{ domain: string; visits: number }>
  daily: Array<{ date: string; totalVisits: number; uniqueVisitors: number }>
  recentVisitors: VisitorRecord[]
}

const EMPTY_REPORT: AnalyticsReport = {
  periodDays: 14,
  totals: {
    pageViews: 0,
    clicks: 0,
    uniqueVisitors: 0,
    sessions: 0,
    avgSessionSeconds: 0,
    bounceRate: 0,
    avgPageTimeSeconds: 0,
  },
  topPages: [],
  topClicks: [],
  daily: [],
}

const EMPTY_VISITOR_REPORT: VisitorTrackingReport = {
  periodDays: 14,
  totals: { totalVisits: 0, uniqueIPs: 0 },
  topCountries: [],
  topCities: [],
  topReferers: [],
  daily: [],
  recentVisitors: [],
}

function AdminAnalytics() {
  const [days, setDays] = useState(14)
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<AnalyticsReport>(EMPTY_REPORT)
  const [visitorReport, setVisitorReport] = useState<VisitorTrackingReport>(EMPTY_VISITOR_REPORT)
  const [visitorLoading, setVisitorLoading] = useState(false)
  const [visitorError, setVisitorError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'visitors'>('overview')

  useEffect(() => {
    let cancelled = false
    async function loadReport() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`/.netlify/functions/website-analytics?days=${days}`)
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error || 'Could not load analytics report')
        }
        const data = (await response.json()) as AnalyticsReport
        if (!cancelled) setReport(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load analytics')
          setReport(EMPTY_REPORT)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadReport()
    return () => {
      cancelled = true
    }
  }, [days, refreshKey])

  useEffect(() => {
    let cancelled = false
    async function loadVisitorReport() {
      setVisitorLoading(true)
      setVisitorError('')
      try {
        const response = await fetch(`/.netlify/functions/visitor-tracking?days=${days}`)
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error || 'Could not load visitor tracking data')
        }
        const data = (await response.json()) as VisitorTrackingReport
        if (!cancelled) setVisitorReport(data)
      } catch (err) {
        if (!cancelled) {
          setVisitorError(err instanceof Error ? err.message : 'Unable to load visitor data')
          setVisitorReport(EMPTY_VISITOR_REPORT)
        }
      } finally {
        if (!cancelled) setVisitorLoading(false)
      }
    }

    loadVisitorReport()
    return () => {
      cancelled = true
    }
  }, [days, refreshKey])

  const maxDailyViews = useMemo(
    () => Math.max(1, ...report.daily.map((day) => day.pageViews)),
    [report.daily],
  )

  const isLoading = loading || visitorLoading

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Website Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Live visitor behavior, page activity, engagement metrics, and visitor tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <button
            onClick={() => setRefreshKey((value) => value + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50"
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('visitors')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'visitors' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Visitor Tracking
        </button>
      </div>

      {activeTab === 'overview' && (
        <OverviewTab
          report={report}
          error={error}
          maxDailyViews={maxDailyViews}
        />
      )}

      {activeTab === 'visitors' && (
        <VisitorTrackingTab
          report={visitorReport}
          error={visitorError}
        />
      )}
    </div>
  )
}

/* ---------- Overview Tab ---------- */

function OverviewTab({ report, error, maxDailyViews }: { report: AnalyticsReport; error: string; maxDailyViews: number }) {
  return (
    <>
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={<Activity size={18} />} label="Page Views" value={report.totals.pageViews.toLocaleString()} color="bg-blue-50 text-blue-600" />
        <MetricCard icon={<MousePointerClick size={18} />} label="Clicks" value={report.totals.clicks.toLocaleString()} color="bg-emerald-50 text-emerald-600" />
        <MetricCard icon={<Users size={18} />} label="Visitors" value={report.totals.uniqueVisitors.toLocaleString()} color="bg-orange-50 text-orange-600" />
        <MetricCard icon={<Clock3 size={18} />} label="Avg Session" value={`${report.totals.avgSessionSeconds}s`} color="bg-violet-50 text-violet-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Engagement Quality</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Sessions</span>
              <span className="font-semibold text-black">{report.totals.sessions.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="font-semibold text-black">{report.totals.bounceRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg Time on Page</span>
              <span className="font-semibold text-black">{report.totals.avgPageTimeSeconds}s</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 lg:col-span-2">
          <h2 className="text-sm font-bold text-black mb-4">Daily Traffic Trend</h2>
          {report.daily.length > 0 ? (
            <div className="space-y-3">
              {report.daily.map((day) => (
                <div key={day.date}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-gray-500">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-black font-semibold">{day.pageViews} views / {day.clicks} clicks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-black transition-all"
                      style={{ width: `${Math.max(2, Math.round((day.pageViews / maxDailyViews) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4">No analytics events have been captured yet.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Top Pages</h2>
          {report.topPages.length > 0 ? (
            <div className="space-y-3">
              {report.topPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 truncate">{page.path}</span>
                  <span className="text-sm font-semibold text-black whitespace-nowrap">{page.views} views · {page.avgTimeSeconds}s</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-2">No page data yet.</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Top Click Targets</h2>
          {report.topClicks.length > 0 ? (
            <div className="space-y-3">
              {report.topClicks.map((item) => (
                <div key={item.target} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 truncate">{item.target}</span>
                  <span className="text-sm font-semibold text-black whitespace-nowrap">{item.count} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-2">No click data yet.</p>
          )}
        </div>
      </div>
    </>
  )
}

/* ---------- Visitor Tracking Tab ---------- */

function VisitorTrackingTab({ report, error }: { report: VisitorTrackingReport; error: string }) {
  const maxDailyVisits = useMemo(
    () => Math.max(1, ...report.daily.map((d) => d.totalVisits)),
    [report.daily],
  )

  return (
    <>
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={<Eye size={18} />} label="Total Visits" value={report.totals.totalVisits.toLocaleString()} color="bg-blue-50 text-blue-600" />
        <MetricCard icon={<Users size={18} />} label="Unique IPs" value={report.totals.uniqueIPs.toLocaleString()} color="bg-emerald-50 text-emerald-600" />
        <MetricCard icon={<Globe size={18} />} label="Countries" value={report.topCountries.length.toLocaleString()} color="bg-orange-50 text-orange-600" />
        <MetricCard icon={<MapPin size={18} />} label="Cities" value={report.topCities.length.toLocaleString()} color="bg-violet-50 text-violet-600" />
      </div>

      {/* Geo breakdown + daily trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Top Countries</h2>
          {report.topCountries.length > 0 ? (
            <div className="space-y-3">
              {report.topCountries.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 truncate flex items-center gap-2">
                    <Globe size={14} className="text-gray-400 shrink-0" />
                    {c.name}
                  </span>
                  <span className="text-sm font-semibold text-black whitespace-nowrap">{c.visits}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-2">No country data yet.</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Top Cities</h2>
          {report.topCities.length > 0 ? (
            <div className="space-y-3">
              {report.topCities.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 truncate flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    {c.name}
                  </span>
                  <span className="text-sm font-semibold text-black whitespace-nowrap">{c.visits}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-2">No city data yet.</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-black mb-4">Top Referrers</h2>
          {report.topReferers.length > 0 ? (
            <div className="space-y-3">
              {report.topReferers.map((r) => (
                <div key={r.domain} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 truncate flex items-center gap-2">
                    <ExternalLink size={14} className="text-gray-400 shrink-0" />
                    {r.domain}
                  </span>
                  <span className="text-sm font-semibold text-black whitespace-nowrap">{r.visits}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-2">No referrer data yet.</p>
          )}
        </div>
      </div>

      {/* Daily visitor trend */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
        <h2 className="text-sm font-bold text-black mb-4">Daily Visitor Trend</h2>
        {report.daily.length > 0 ? (
          <div className="space-y-3">
            {report.daily.map((day) => (
              <div key={day.date}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-gray-500">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="text-black font-semibold">{day.totalVisits} visits / {day.uniqueVisitors} unique</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-black transition-all"
                    style={{ width: `${Math.max(2, Math.round((day.totalVisits / maxDailyVisits) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-4">No visitor data captured yet.</p>
        )}
      </div>

      {/* Recent visitors table */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-bold text-black mb-4">Recent Visitors</h2>
        {report.recentVisitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">IP (masked)</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Page</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Device</th>
                </tr>
              </thead>
              <tbody>
                {report.recentVisitors.map((visitor) => (
                  <tr key={visitor.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-2.5 px-2 text-gray-500 whitespace-nowrap">
                      {new Date(visitor.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-xs text-gray-600">{visitor.ip}</td>
                    <td className="py-2.5 px-2 text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {[visitor.city, visitor.region, visitor.country].filter(Boolean).join(', ') || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-gray-700 truncate max-w-[150px]">{visitor.path}</td>
                    <td className="py-2.5 px-2 text-gray-500 truncate max-w-[200px] hidden lg:table-cell">
                      {parseUserAgent(visitor.userAgent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-4">No visitor data captured yet. Visitors will appear here once the edge function starts tracking.</p>
        )}
      </div>
    </>
  )
}

/* ---------- Helpers ---------- */

function parseUserAgent(ua: string): string {
  if (!ua) return 'Unknown'
  // Simple parser for common browsers
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  if (ua.includes('bot') || ua.includes('Bot') || ua.includes('crawl')) return 'Bot'
  return 'Other'
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>{icon}</div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-black mt-1 flex items-center gap-1.5">
        {label === 'Avg Session' && <Timer size={16} className="text-gray-400" />}
        {value}
      </p>
    </div>
  )
}
