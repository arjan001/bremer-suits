import type { Context } from '@netlify/functions'
import { getSupabase, jsonResponse, errorResponse, corsHeaders } from './utils/supabase.ts'
import { logAudit } from './utils/audit.ts'

/**
 * Admin Users endpoint.
 *
 * GET   /admin-users          – list admin_users merged with Supabase Auth users.
 *                               Any auth user not yet in admin_users is inserted
 *                               with role='viewer' (or super_admin if it is the
 *                               configured default admin email).
 * POST  /admin-users          – create admin user (optionally creating the
 *                               Supabase Auth account when password is provided).
 * PUT   /admin-users?id=...   – update admin user row.
 * DELETE /admin-users?id=...  – delete admin user row (blocks super_admin).
 */

const DEFAULT_ADMIN_EMAIL = (process.env.DEFAULT_ADMIN_EMAIL || '').trim().toLowerCase()

type AdminUserRow = {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  last_login: string
  created_at: string
  permissions: Record<string, Record<string, boolean>> | null
  auth_user_id: string | null
}

async function syncAuthUsers(supabase: ReturnType<typeof getSupabase>): Promise<void> {
  // Pull current admin_users rows keyed by email
  const { data: rows } = await supabase.from('admin_users').select('*')
  const byEmail = new Map<string, AdminUserRow>()
  for (const r of (rows || []) as AdminUserRow[]) {
    byEmail.set(r.email.toLowerCase(), r)
  }

  // List Supabase Auth users (paginated – first page covers typical admin team sizes)
  const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  })
  if (authErr || !authData) return

  for (const user of authData.users) {
    const email = (user.email || '').toLowerCase()
    if (!email) continue

    const existing = byEmail.get(email)
    if (existing) {
      // Backfill auth_user_id if missing
      if (!existing.auth_user_id) {
        await supabase
          .from('admin_users')
          .update({ auth_user_id: user.id })
          .eq('id', existing.id)
      }
      continue
    }

    const isDefault = DEFAULT_ADMIN_EMAIL && email === DEFAULT_ADMIN_EMAIL
    await supabase.from('admin_users').insert({
      name:
        (user.user_metadata?.name as string | undefined) ||
        (user.user_metadata?.full_name as string | undefined) ||
        email.split('@')[0],
      email,
      role: isDefault ? 'super_admin' : 'viewer',
      status: 'active',
      auth_user_id: user.id,
      last_login: user.last_sign_in_at || new Date().toISOString(),
    })
  }
}

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    const supabase = getSupabase()
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (req.method === 'GET') {
      // Best-effort sync; if it fails we still return whatever is in admin_users.
      try {
        await syncAuthUsers(supabase)
      } catch (err) {
        console.error('admin_users auth sync failed:', err)
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) return errorResponse(error.message, 500)
      return jsonResponse(data)
    }

    if (req.method === 'POST') {
      const body = await req.json() as Record<string, unknown> & {
        password?: string
        email?: string
        name?: string
      }

      const password = typeof body.password === 'string' ? body.password : ''
      const email = typeof body.email === 'string' ? body.email.trim() : ''
      const name = typeof body.name === 'string' ? body.name : email.split('@')[0]

      // Remove transient fields from DB payload
      const row: Record<string, unknown> = { ...body }
      delete row.password

      // Always create a Supabase Auth account alongside the admin_users row so
      // the user can actually sign in. If no password was supplied we generate a
      // temporary one – the caller should send a reset link afterwards.
      if (email) {
        const effectivePassword = password || `tmp-${crypto.randomUUID()}`
        const { data: created, error: authErr } = await supabase.auth.admin.createUser({
          email,
          password: effectivePassword,
          email_confirm: true,
          user_metadata: { name },
        })
        if (authErr) {
          // If the auth user already exists, look it up instead of failing.
          const { data: existing } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 200,
          })
          const match = existing?.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase())
          if (!match) return errorResponse(authErr.message, 400)
          row.auth_user_id = match.id
        } else if (created?.user?.id) {
          row.auth_user_id = created.user.id
        }
      }

      const { data, error } = await supabase
        .from('admin_users')
        .insert(row)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'create',
        resource: 'users',
        resourceId: data?.id,
        description: `Created admin user ${data?.email ?? ''} (role: ${data?.role ?? 'viewer'})`,
        metadata: { after: { ...data, auth_user_id: data?.auth_user_id } },
      })
      return jsonResponse(data, 201)
    }

    if (req.method === 'PUT') {
      if (!id) return errorResponse('Missing id parameter')
      const body = await req.json() as Record<string, unknown> & { password?: string }

      const password = typeof body.password === 'string' ? body.password : ''
      const update: Record<string, unknown> = { ...body }
      delete update.password

      const { data: before } = await supabase.from('admin_users').select('*').eq('id', id).single()

      // If caller asked to set/change the password, do it against auth.users.
      if (password) {
        const { data: existing } = await supabase
          .from('admin_users')
          .select('auth_user_id, email')
          .eq('id', id)
          .single()
        if (existing?.auth_user_id) {
          const { error: authErr } = await supabase.auth.admin.updateUserById(
            existing.auth_user_id,
            { password },
          )
          if (authErr) return errorResponse(authErr.message, 400)
        } else if (existing?.email) {
          const { data: created, error: authErr } = await supabase.auth.admin.createUser({
            email: existing.email,
            password,
            email_confirm: true,
          })
          if (authErr) return errorResponse(authErr.message, 400)
          if (created?.user?.id) update.auth_user_id = created.user.id
        }
        await logAudit(supabase, req, {
          action: 'password_change',
          resource: 'users',
          resourceId: id,
          description: `Password set for ${before?.email ?? id}`,
          metadata: { by: 'admin_panel' },
        })
      }

      const { data, error } = await supabase
        .from('admin_users')
        .update(update)
        .eq('id', id)
        .select()
        .single()
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'update',
        resource: 'users',
        resourceId: id,
        description: `Updated admin user ${data?.email ?? id}${before?.role && data?.role && before.role !== data.role ? ` (role: ${before.role} → ${data.role})` : ''}`,
        metadata: { before, after: data, changes: { ...body, password: password ? '[REDACTED]' : undefined } },
      })
      return jsonResponse(data)
    }

    if (req.method === 'DELETE') {
      if (!id) return errorResponse('Missing id parameter')
      const { data: user } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', id)
        .single()
      if (user?.role === 'super_admin') {
        await logAudit(supabase, req, {
          action: 'delete',
          resource: 'users',
          resourceId: id,
          description: `Blocked delete of super_admin ${user?.email ?? id}`,
          metadata: { before: user },
          status: 'failure',
        })
        return errorResponse('Cannot delete super admin user', 403)
      }
      if (user?.auth_user_id) {
        await supabase.auth.admin.deleteUser(user.auth_user_id).catch(() => undefined)
      }
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id)
      if (error) return errorResponse(error.message, 500)
      await logAudit(supabase, req, {
        action: 'delete',
        resource: 'users',
        resourceId: id,
        description: `Deleted admin user ${user?.email ?? id}`,
        metadata: { before: user },
      })
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
