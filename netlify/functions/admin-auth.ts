import type { Context } from '@netlify/functions'
import { getSupabase, jsonResponse, errorResponse, corsHeaders } from './utils/supabase.ts'
import { logAudit } from './utils/audit.ts'

/**
 * Admin auth endpoint.
 *
 *   POST /admin-auth
 *     { action: 'change-password', email, currentPassword, newPassword }
 *        – verifies current credentials then rotates the password.
 *
 *     { action: 'reset-password', email, redirectTo? }
 *        – sends a password reset email via Supabase Auth.
 *
 *     { action: 'set-user-password', userId, password }
 *        – super-admin only flow: sets another admin's password by admin_users id.
 *
 *     { action: 'login', email } | { action: 'logout', email }
 *        – client-reported auth signals for audit-trail purposes.
 */

async function handleChangePassword(body: Record<string, unknown>, req: Request) {
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : ''
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''
  if (!email || !currentPassword || !newPassword) {
    return errorResponse('Missing email, currentPassword, or newPassword')
  }
  if (newPassword.length < 8) {
    return errorResponse('New password must be at least 8 characters')
  }

  const supabase = getSupabase()
  // Verify current password. The service-role client bypasses RLS but
  // signInWithPassword still requires a valid credential.
  const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  })
  if (signInErr || !signIn?.user) {
    await logAudit(supabase, req, {
      action: 'password_change',
      resource: 'auth',
      description: `Failed password change for ${email} (invalid current password)`,
      status: 'failure',
    })
    return errorResponse('Current password is incorrect', 401)
  }

  const { error: updateErr } = await supabase.auth.admin.updateUserById(signIn.user.id, {
    password: newPassword,
  })
  if (updateErr) {
    await logAudit(supabase, req, {
      action: 'password_change',
      resource: 'auth',
      description: `Password change failed for ${email}: ${updateErr.message}`,
      status: 'failure',
    })
    return errorResponse(updateErr.message, 400)
  }

  await logAudit(supabase, req, {
    action: 'password_change',
    resource: 'auth',
    resourceId: signIn.user.id,
    description: `Admin ${email} changed their password`,
  })

  return jsonResponse({ success: true })
}

async function handleResetPassword(body: Record<string, unknown>, req: Request) {
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email) return errorResponse('Missing email')

  const origin = req.headers.get('origin') || new URL(req.url).origin
  const redirectTo =
    (typeof body.redirectTo === 'string' && body.redirectTo) ||
    `${origin}/admin-login`

  const supabase = getSupabase()
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) {
    await logAudit(supabase, req, {
      action: 'password_reset',
      resource: 'auth',
      description: `Password-reset request failed for ${email}: ${error.message}`,
      status: 'failure',
    })
    return errorResponse(error.message, 400)
  }
  await logAudit(supabase, req, {
    action: 'password_reset',
    resource: 'auth',
    description: `Password reset email sent to ${email}`,
  })
  return jsonResponse({ success: true })
}

async function handleSetUserPassword(body: Record<string, unknown>, req: Request) {
  const userId = typeof body.userId === 'string' ? body.userId : ''
  const password = typeof body.password === 'string' ? body.password : ''
  if (!userId || !password) return errorResponse('Missing userId or password')
  if (password.length < 8) return errorResponse('Password must be at least 8 characters')

  const supabase = getSupabase()
  const { data: row, error: lookupErr } = await supabase
    .from('admin_users')
    .select('auth_user_id, email')
    .eq('id', userId)
    .single()
  if (lookupErr || !row) return errorResponse('Admin user not found', 404)

  if (row.auth_user_id) {
    const { error } = await supabase.auth.admin.updateUserById(row.auth_user_id, { password })
    if (error) return errorResponse(error.message, 400)
  } else if (row.email) {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: row.email,
      password,
      email_confirm: true,
    })
    if (error) return errorResponse(error.message, 400)
    if (created?.user?.id) {
      await supabase
        .from('admin_users')
        .update({ auth_user_id: created.user.id })
        .eq('id', userId)
    }
  } else {
    return errorResponse('Admin user has no email', 400)
  }

  await logAudit(supabase, req, {
    action: 'password_change',
    resource: 'users',
    resourceId: userId,
    description: `Admin password set for ${row.email ?? userId} (super-admin action)`,
  })

  return jsonResponse({ success: true })
}

async function handleLoginSignal(body: Record<string, unknown>, req: Request, action: 'login' | 'logout') {
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email) return errorResponse('Missing email')
  const supabase = getSupabase()
  await logAudit(supabase, req, {
    action,
    resource: 'auth',
    description: action === 'login' ? `Admin signed in: ${email}` : `Admin signed out: ${email}`,
    metadata: { email },
  })
  return jsonResponse({ success: true })
}

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }
  if (req.method !== 'POST') return errorResponse('Method not allowed', 405)

  try {
    const body = (await req.json()) as Record<string, unknown>
    const action = typeof body.action === 'string' ? body.action : ''

    switch (action) {
      case 'change-password':
        return await handleChangePassword(body, req)
      case 'reset-password':
        return await handleResetPassword(body, req)
      case 'set-user-password':
        return await handleSetUserPassword(body, req)
      case 'login':
        return await handleLoginSignal(body, req, 'login')
      case 'logout':
        return await handleLoginSignal(body, req, 'logout')
      default:
        return errorResponse('Unknown action')
    }
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
