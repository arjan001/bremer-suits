import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

type EventType = 'page_view' | 'click' | 'page_time' | 'session_end'

interface AnalyticsEvent {
  eventType: EventType
  sessionId: string
  visitorId: string
  path: string
  target?: string
  durationMs?: number
  pageViewsInSession?: number
  ts: string
}

interface DailyAggregate {
  date: string
  pageViews: number
  clicks: number
  pageTimeMs: number
  pageTimeEvents: number
  sessionsEnded: number
  bouncedSessions: number
  sessionDurationMs: number
  pageCounts: Record<string, number>
  pageTimeByPath: Record<string, number>
  clickTargets: Record<string, number>
  uniqueVisitors: Record<string, number>
}

const STORE = getStore('website-analytics')

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  }
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status)
}

function sanitizeText(value: unknown, max = 300): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function parseInteger(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value))
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) return Math.max(0, parsed)
  }
  return undefined
}

function toDateKey(iso: string) {
  return iso.slice(0, 10)
}

function dailyKey(dateKey: string) {
  return `daily:${dateKey}`
}

function eventKey(event: AnalyticsEvent) {
  const random = Math.random().toString(36).slice(2, 8)
  return `event:${event.ts}:${random}`
}

function createDaily(date: string): DailyAggregate {
  return {
    date,
    pageViews: 0,
    clicks: 0,
    pageTimeMs: 0,
    pageTimeEvents: 0,
    sessionsEnded: 0,
    bouncedSessions: 0,
    sessionDurationMs: 0,
    pageCounts: {},
    pageTimeByPath: {},
    clickTargets: {},
    uniqueVisitors: {},
  }
}

function trackUniqueVisitor(daily: DailyAggregate, visitorId: string) {
  if (!visitorId) return
  daily.uniqueVisitors[visitorId] = 1
}

function normalizePath(path: string): string {
  if (!path || !path.startsWith('/')) return '/'
  return path.split('?')[0] || '/'
}

async function updateDailyAggregate(event: AnalyticsEvent) {
  const dateKey = toDateKey(event.ts)
  const key = dailyKey(dateKey)
  const existing = (await STORE.get(key, { type: 'json' })) as DailyAggregate | null
  const daily = existing || createDaily(dateKey)

  trackUniqueVisitor(daily, event.visitorId)

  if (event.eventType === 'page_view') {
    daily.pageViews += 1
    daily.pageCounts[event.path] = (daily.pageCounts[event.path] || 0) + 1
  }

  if (event.eventType === 'click') {
    daily.clicks += 1
    if (event.target) {
      daily.clickTargets[event.target] = (daily.clickTargets[event.target] || 0) + 1
    }
  }

  if (event.eventType === 'page_time' && typeof event.durationMs === 'number') {
    daily.pageTimeMs += event.durationMs
    daily.pageTimeEvents += 1
    daily.pageTimeByPath[event.path] = (daily.pageTimeByPath[event.path] || 0) + event.durationMs
  }

  if (event.eventType === 'session_end' && typeof event.durationMs === 'number') {
    daily.sessionsEnded += 1
    daily.sessionDurationMs += event.durationMs
    if ((event.pageViewsInSession || 0) <= 1) {
      daily.bouncedSessions += 1
    }
  }

  await STORE.setJSON(key, daily)
}

function toAnalyticsEvent(body: Record<string, unknown>): AnalyticsEvent {
  const eventTypeRaw = sanitizeText(body.eventType, 30)
  const eventType: EventType =
    eventTypeRaw === 'page_view' ||
    eventTypeRaw === 'click' ||
    eventTypeRaw === 'page_time' ||
    eventTypeRaw === 'session_end'
      ? eventTypeRaw
      : 'page_view'

  const ts = sanitizeText(body.ts, 40) || new Date().toISOString()

  return {
    eventType,
    sessionId: sanitizeText(body.sessionId, 80),
    visitorId: sanitizeText(body.visitorId, 80),
    path: normalizePath(sanitizeText(body.path, 240) || '/'),
    target: sanitizeText(body.target, 120),
    durationMs: parseInteger(body.durationMs),
    pageViewsInSession: parseInteger(body.pageViewsInSession),
    ts,
  }
}

async function loadDailySeries(days: number): Promise<DailyAggregate[]> {
  const safeDays = Math.max(1, Math.min(days, 60))
  const now = new Date()
  const keys = Array.from({ length: safeDays }, (_, index) => {
    const copy = new Date(now)
    copy.setUTCDate(now.getUTCDate() - (safeDays - 1 - index))
    return copy.toISOString().slice(0, 10)
  })

  const entries = await Promise.all(
    keys.map(async (dateKey) => {
      const stored = await STORE.get(dailyKey(dateKey), { type: 'json' }) as DailyAggregate | null
      return stored || createDaily(dateKey)
    }),
  )

  return entries
}

function aggregateReport(dailySeries: DailyAggregate[]) {
  const totals = dailySeries.reduce(
    (acc, day) => {
      acc.pageViews += day.pageViews
      acc.clicks += day.clicks
      acc.sessionsEnded += day.sessionsEnded
      acc.bouncedSessions += day.bouncedSessions
      acc.sessionDurationMs += day.sessionDurationMs
      acc.uniqueVisitors += Object.keys(day.uniqueVisitors || {}).length
      acc.pageTimeMs += day.pageTimeMs
      acc.pageTimeEvents += day.pageTimeEvents

      for (const [path, count] of Object.entries(day.pageCounts || {})) {
        acc.pageCounts[path] = (acc.pageCounts[path] || 0) + count
      }
      for (const [target, count] of Object.entries(day.clickTargets || {})) {
        acc.clickTargets[target] = (acc.clickTargets[target] || 0) + count
      }
      for (const [path, duration] of Object.entries(day.pageTimeByPath || {})) {
        acc.pageTimeByPath[path] = (acc.pageTimeByPath[path] || 0) + duration
      }

      return acc
    },
    {
      pageViews: 0,
      clicks: 0,
      sessionsEnded: 0,
      bouncedSessions: 0,
      sessionDurationMs: 0,
      uniqueVisitors: 0,
      pageTimeMs: 0,
      pageTimeEvents: 0,
      pageCounts: {} as Record<string, number>,
      clickTargets: {} as Record<string, number>,
      pageTimeByPath: {} as Record<string, number>,
    },
  )

  const topPages = Object.entries(totals.pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, views]) => ({
      path,
      views,
      avgTimeSeconds: Math.round(((totals.pageTimeByPath[path] || 0) / Math.max(views, 1)) / 1000),
    }))

  const topClicks = Object.entries(totals.clickTargets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([target, count]) => ({ target, count }))

  const daily = dailySeries.map((day) => ({
    date: day.date,
    pageViews: day.pageViews,
    clicks: day.clicks,
    visitors: Object.keys(day.uniqueVisitors || {}).length,
    sessions: day.sessionsEnded,
    avgSessionSeconds:
      day.sessionsEnded > 0 ? Math.round((day.sessionDurationMs / day.sessionsEnded) / 1000) : 0,
  }))

  return {
    periodDays: dailySeries.length,
    totals: {
      pageViews: totals.pageViews,
      clicks: totals.clicks,
      uniqueVisitors: totals.uniqueVisitors,
      sessions: totals.sessionsEnded,
      avgSessionSeconds:
        totals.sessionsEnded > 0 ? Math.round((totals.sessionDurationMs / totals.sessionsEnded) / 1000) : 0,
      bounceRate:
        totals.sessionsEnded > 0 ? Number(((totals.bouncedSessions / totals.sessionsEnded) * 100).toFixed(1)) : 0,
      avgPageTimeSeconds:
        totals.pageTimeEvents > 0 ? Math.round((totals.pageTimeMs / totals.pageTimeEvents) / 1000) : 0,
    },
    topPages,
    topClicks,
    daily,
  }
}

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    if (req.method === 'POST') {
      const body = await req.json() as Record<string, unknown>
      const event = toAnalyticsEvent(body)

      if (!event.sessionId || !event.visitorId) {
        return errorResponse('sessionId and visitorId are required', 400)
      }

      await Promise.all([
        STORE.setJSON(eventKey(event), event),
        updateDailyAggregate(event),
      ])

      return jsonResponse({ ok: true })
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const days = Number.parseInt(url.searchParams.get('days') || '14', 10)
      const dailySeries = await loadDailySeries(days)
      const report = aggregateReport(dailySeries)
      return jsonResponse(report)
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
