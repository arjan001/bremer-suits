import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { signup } from '@netlify/identity'
import { corsHeaders, errorResponse, jsonResponse } from './utils/supabase.ts'

interface AdminBootstrapState {
  email: string
  name: string
  createdAt: string
}

interface IdentityUser {
  email?: string
}

const STORE = getStore('admin-auth')
const ADMIN_BOOTSTRAP_KEY = 'bootstrap'

function sanitizeText(value: unknown, max = 160): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function readBootstrapState(): Promise<AdminBootstrapState | null> {
  return await STORE.get(ADMIN_BOOTSTRAP_KEY, { type: 'json' }) as AdminBootstrapState | null
}

async function getSessionUserFromCookie(req: Request): Promise<IdentityUser | null> {
  const identityCookie = req.headers.get('cookie')
  if (!identityCookie?.includes('nf_jwt=')) {
    return null
  }

  try {
    const requestUrl = new URL(req.url)
    const sessionEndpoint = new URL('/.netlify/identity/user', requestUrl.origin)

    const sessionResponse = await fetch(sessionEndpoint, {
      headers: {
        cookie: identityCookie,
      },
    })

    if (!sessionResponse.ok) {
      return null
    }

    return await sessionResponse.json() as IdentityUser
  } catch {
    return null
  }
}

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    const url = new URL(req.url)
    const action = sanitizeText(url.searchParams.get('action'), 40) || 'status'

    if (req.method === 'GET' && action === 'status') {
      const bootstrap = await readBootstrapState()
      return jsonResponse({
        hasAdmin: Boolean(bootstrap),
        adminEmail: bootstrap?.email || null,
      })
    }

    if (req.method === 'GET' && action === 'session') {
      const bootstrap = await readBootstrapState()
      const user = await getSessionUserFromCookie(req)
      const email = sanitizeText(user?.email, 160).toLowerCase()
      const isAdmin = Boolean(bootstrap && email && bootstrap.email.toLowerCase() === email)

      return jsonResponse({
        hasAdmin: Boolean(bootstrap),
        authenticated: Boolean(user),
        isAdmin,
        email: email || null,
      })
    }

    if (req.method === 'POST' && action === 'register') {
      const existing = await readBootstrapState()
      if (existing) {
        return errorResponse('Admin account already configured. Please login.', 409)
      }

      const body = await req.json() as Record<string, unknown>
      const name = sanitizeText(body.name, 120)
      const email = sanitizeText(body.email, 160).toLowerCase()
      const password = typeof body.password === 'string' ? body.password : ''

      if (!name) return errorResponse('Name is required', 422)
      if (!email || !validateEmail(email)) return errorResponse('Valid email is required', 422)
      if (password.length < 8) return errorResponse('Password must be at least 8 characters', 422)

      const user = await signup(email, password, {
        full_name: name,
      })

      await STORE.setJSON(ADMIN_BOOTSTRAP_KEY, {
        email,
        name,
        createdAt: new Date().toISOString(),
      } satisfies AdminBootstrapState)

      return jsonResponse({
        success: true,
        email,
        requiresEmailConfirmation: !user.emailVerified,
      }, 201)
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
