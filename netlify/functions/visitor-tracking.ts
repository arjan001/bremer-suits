import type { Context } from '@netlify/functions'
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

interface DailyVisitorSummary {
  date: string
  totalVisits: number
  uniqueIPs: Record<string, number>
  countries: Record<string, number>
  cities: Record<string, number>
  paths: Record<string, number>
  referers: Record<string, number>
  recentVisitors: VisitorRecord[]
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

function maskIP(ip: string): string {
  if (!ip || ip === 'unknown') return 'unknown'
  // Mask last octet for privacy: 192.168.1.100 -> 192.168.1.***
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.***`
  }
  // IPv6: mask last segment
  const v6Parts = ip.split(':')
  if (v6Parts.length > 1) {
    v6Parts[v6Parts.length - 1] = '****'
    return v6Parts.join(':')
  }
  return ip
}

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  if (req.method !== 'GET') {
    return errorResponse('Method not allowed', 405)
  }

  try {
    const store = getStore('visitor-tracking')
    const url = new URL(req.url)
    const days = Math.min(Math.max(1, Number.parseInt(url.searchParams.get('days') || '14', 10)), 60)

    const now = new Date()
    const dailySummaries: DailyVisitorSummary[] = []

    for (let i = 0; i < days; i++) {
      const d = new Date(now)
      d.setUTCDate(now.getUTCDate() - (days - 1 - i))
      const dateKey = d.toISOString().slice(0, 10)
      const summary = await store.get(`daily-visitors:${dateKey}`, { type: 'json' }) as DailyVisitorSummary | null
      dailySummaries.push(summary || {
        date: dateKey,
        totalVisits: 0,
        uniqueIPs: {},
        countries: {},
        cities: {},
        paths: {},
        referers: {},
        recentVisitors: [],
      })
    }

    // Aggregate totals
    let totalVisits = 0
    const allIPs: Record<string, number> = {}
    const allCountries: Record<string, number> = {}
    const allCities: Record<string, number> = {}
    const allReferers: Record<string, number> = {}
    const allRecentVisitors: VisitorRecord[] = []

    for (const day of dailySummaries) {
      totalVisits += day.totalVisits
      for (const [ip, count] of Object.entries(day.uniqueIPs || {})) {
        allIPs[ip] = (allIPs[ip] || 0) + count
      }
      for (const [country, count] of Object.entries(day.countries || {})) {
        allCountries[country] = (allCountries[country] || 0) + count
      }
      for (const [city, count] of Object.entries(day.cities || {})) {
        allCities[city] = (allCities[city] || 0) + count
      }
      for (const [ref, count] of Object.entries(day.referers || {})) {
        allReferers[ref] = (allReferers[ref] || 0) + count
      }
      allRecentVisitors.push(...(day.recentVisitors || []))
    }

    // Sort recent visitors by timestamp descending, take latest 100
    allRecentVisitors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const recentVisitors = allRecentVisitors.slice(0, 100).map((v) => ({
      ...v,
      ip: maskIP(v.ip),
    }))

    const topCountries = Object.entries(allCountries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, visits]) => ({ name, visits }))

    const topCities = Object.entries(allCities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, visits]) => ({ name, visits }))

    const topReferers = Object.entries(allReferers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([domain, visits]) => ({ domain, visits }))

    const daily = dailySummaries.map((day) => ({
      date: day.date,
      totalVisits: day.totalVisits,
      uniqueVisitors: Object.keys(day.uniqueIPs || {}).length,
    }))

    return jsonResponse({
      periodDays: days,
      totals: {
        totalVisits,
        uniqueIPs: Object.keys(allIPs).length,
      },
      topCountries,
      topCities,
      topReferers,
      daily,
      recentVisitors,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
