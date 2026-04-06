import { createFileRoute } from '@tanstack/react-router'
import { Activity, MousePointerClick, Timer, Users, RefreshCw, Clock3 } from 'lucide-react'
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

function AdminAnalytics() {
  const [days, setDays] = useState(14)
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<AnalyticsReport>(EMPTY_REPORT)

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

  const maxDailyViews = useMemo(
    () => Math.max(1, ...report.daily.map((day) => day.pageViews)),
    [report.daily],
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Website Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Live visitor behavior, page activity, and engagement metrics.</p>
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
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

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
    </div>
  )
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
