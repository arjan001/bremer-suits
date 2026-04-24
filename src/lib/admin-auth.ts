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
  return {
    authenticated: true,
    isAdmin: true,
    email: data.user?.email ?? null,
  }
}

export async function logoutAdmin(): Promise<void> {
  const supabase = getSupabaseClient()
  await supabase.auth.signOut()
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession()
  return session.isAdmin
}
