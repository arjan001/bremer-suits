import type { Context, Config } from '@netlify/edge-functions'
import { getStore } from '@netlify/blobs'

interface VisitorRecord {
  id: string
  ip: string
  country: string
  countryCode: string
  city: string
  region: string
  regionCode: string
  latitude: number | null
  longitude: number | null
  timezone: string
  postalCode: string
  userAgent: string
  path: string
  referer: string
  timestamp: string
}

export default async (req: Request, context: Context) => {
  // Only track page navigations (GET requests for HTML pages)
  const url = new URL(req.url)
  const path = url.pathname

  // Skip tracking for static assets, API calls, and admin pages
  if (
    path.startsWith('/.netlify/') ||
    path.startsWith('/api/') ||
    path.startsWith('/_') ||
    path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|json)$/)
  ) {
    return
  }

  const accept = req.headers.get('accept') || ''
  if (!accept.includes('text/html')) {
    return
  }

  try {
    const store = getStore('visitor-tracking')

    const now = new Date()
    const id = `${now.toISOString().slice(0, 10)}:${now.getTime()}:${crypto.randomUUID().slice(0, 8)}`

    const visitor: VisitorRecord = {
      id,
      ip: context.ip || 'unknown',
      country: context.geo?.country?.name || 'Unknown',
      countryCode: context.geo?.country?.code || '',
      city: context.geo?.city || 'Unknown',
      region: context.geo?.subdivision?.name || '',
      regionCode: context.geo?.subdivision?.code || '',
      latitude: context.geo?.latitude ?? null,
      longitude: context.geo?.longitude ?? null,
      timezone: context.geo?.timezone || '',
      postalCode: context.geo?.postalCode || '',
      userAgent: req.headers.get('user-agent') || '',
      path,
      referer: req.headers.get('referer') || '',
      timestamp: now.toISOString(),
    }

    // Store individual visitor record
    context.waitUntil(
      store.setJSON(`visit:${id}`, visitor)
    )

    // Also update daily visitor summary
    context.waitUntil(
      updateDailySummary(store, visitor, now)
    )
  } catch {
    // Silently fail — don't block the page load
  }

  // Don't return a response — let the request pass through to the origin
  return
}

async function updateDailySummary(
  store: ReturnType<typeof getStore>,
  visitor: VisitorRecord,
  now: Date
) {
  const dateKey = now.toISOString().slice(0, 10)
  const summaryKey = `daily-visitors:${dateKey}`

  const existing = await store.get(summaryKey, { type: 'json' }) as {
    date: string
    totalVisits: number
    uniqueIPs: Record<string, number>
    countries: Record<string, number>
    cities: Record<string, number>
    paths: Record<string, number>
    referers: Record<string, number>
    recentVisitors: VisitorRecord[]
  } | null

  const summary = existing || {
    date: dateKey,
    totalVisits: 0,
    uniqueIPs: {},
    countries: {},
    cities: {},
    paths: {},
    referers: {},
    recentVisitors: [],
  }

  summary.totalVisits += 1
  summary.uniqueIPs[visitor.ip] = (summary.uniqueIPs[visitor.ip] || 0) + 1

  if (visitor.country && visitor.country !== 'Unknown') {
    summary.countries[visitor.country] = (summary.countries[visitor.country] || 0) + 1
  }

  if (visitor.city && visitor.city !== 'Unknown') {
    const cityKey = `${visitor.city}, ${visitor.countryCode}`
    summary.cities[cityKey] = (summary.cities[cityKey] || 0) + 1
  }

  summary.paths[visitor.path] = (summary.paths[visitor.path] || 0) + 1

  if (visitor.referer) {
    try {
      const refHost = new URL(visitor.referer).hostname
      if (refHost) {
        summary.referers[refHost] = (summary.referers[refHost] || 0) + 1
      }
    } catch {
      // Invalid referer URL, skip
    }
  }

  // Keep last 50 recent visitors for the day
  summary.recentVisitors.unshift(visitor)
  if (summary.recentVisitors.length > 50) {
    summary.recentVisitors = summary.recentVisitors.slice(0, 50)
  }

  await store.setJSON(summaryKey, summary)
}

export const config: Config = {
  path: '/*',
  excludedPath: ['/.netlify/*', '/api/*'],
}
