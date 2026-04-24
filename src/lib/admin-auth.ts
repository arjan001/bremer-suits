import { AuthError, MissingIdentityError, getUser, login, logout } from '@netlify/identity'

const BASE = '/.netlify/functions/admin-auth'

export interface AdminStatus {
  hasAdmin: boolean
  adminEmail: string | null
}

export interface AdminSession {
  hasAdmin: boolean
  authenticated: boolean
  isAdmin: boolean
  email: string | null
}

interface RegisterResult {
  success: boolean
  email: string
  requiresEmailConfirmation: boolean
}

export function toAdminAuthError(error: unknown): string {
  if (error instanceof MissingIdentityError) {
    return 'Netlify Identity is not enabled yet. Run this app through Netlify and enable Identity.'
  }

  if (error instanceof AuthError) {
    if (error.status === 401) return 'Invalid email or password.'
    if (error.status === 422) return 'Invalid email/password format.'
    if (error.status === 403) return 'Authentication action is not allowed.'
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected authentication error'
}

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })

  const json = await res.json() as T & { error?: string }
  if (!res.ok) {
    throw new Error(json.error || `Request failed (${res.status})`)
  }

  return json
}

export async function getAdminStatus(): Promise<AdminStatus> {
  return await apiRequest<AdminStatus>(`${BASE}?action=status`)
}

export async function getAdminSession(): Promise<AdminSession> {
  return await apiRequest<AdminSession>(`${BASE}?action=session`)
}

export async function registerFirstAdmin(payload: {
  name: string
  email: string
  password: string
}): Promise<RegisterResult> {
  return await apiRequest<RegisterResult>(`${BASE}?action=register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function loginAdmin(email: string, password: string) {
  await login(email, password)

  const session = await getAdminSession()
  if (!session.isAdmin) {
    await logout().catch(() => {})
    throw new Error('This account does not have admin access.')
  }

  return session
}

export async function logoutAdmin() {
  await logout()
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const user = await getUser()
  if (!user) return false

  const session = await getAdminSession()
  return session.isAdmin
}
