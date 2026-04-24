import { AuthError } from '@supabase/supabase-js'
import { getSupabaseClient } from './supabase-client'

export interface AdminSession {
  authenticated: boolean
  isAdmin: boolean
  email: string | null
}

export function toAdminAuthError(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.status === 400) return 'Invalid email or password.'
    if (error.status === 401) return 'Invalid email or password.'
    if (error.status === 422) return 'Invalid email or password format.'
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Unexpected authentication error'
}

export async function getAdminSession(): Promise<AdminSession> {
  try {
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    if (!user) {
      return { authenticated: false, isAdmin: false, email: null }
    }
    return {
      authenticated: true,
      isAdmin: true,
      email: user.email ?? null,
    }
  } catch {
    return { authenticated: false, isAdmin: false, email: null }
  }
}

export async function loginAdmin(email: string, password: string): Promise<AdminSession> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
  if (error) throw error
  // Best-effort login audit log. Never let audit failures block sign-in.
  try {
    await fetch('/.netlify/functions/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-email': data.user?.email ?? email },
      body: JSON.stringify({ action: 'login', email: data.user?.email ?? email }),
    })
  } catch {
    /* ignore */
  }
  return {
    authenticated: true,
    isAdmin: true,
    email: data.user?.email ?? null,
  }
}

export async function logoutAdmin(): Promise<void> {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.getSession()
  const email = data.session?.user?.email ?? null
  await supabase.auth.signOut()
  if (email) {
    try {
      await fetch('/.netlify/functions/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-email': email },
        body: JSON.stringify({ action: 'logout', email }),
      })
    } catch {
      /* ignore */
    }
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession()
  return session.isAdmin
}

async function callAuthFn(body: Record<string, unknown>): Promise<void> {
  const res = await fetch('/.netlify/functions/admin-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`)
}

/** Change the currently signed-in admin's password. */
export async function changeAdminPassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await callAuthFn({
    action: 'change-password',
    email,
    currentPassword,
    newPassword,
  })
}

/** Send a password-reset email to any admin address. */
export async function requestAdminPasswordReset(email: string): Promise<void> {
  const redirectTo =
    typeof window !== 'undefined' ? `${window.location.origin}/admin-login` : undefined
  await callAuthFn({ action: 'reset-password', email, redirectTo })
}

/** Super-admin flow: set another admin's password by admin_users id. */
export async function setAdminUserPassword(userId: string, password: string): Promise<void> {
  await callAuthFn({ action: 'set-user-password', userId, password })
}
