import type { SupabaseClient } from '@supabase/supabase-js'

export interface AuditEntry {
  action: string
  resource: string
  resourceId?: string | null
  description?: string
  metadata?: Record<string, unknown>
  status?: 'success' | 'failure'
}

function getHeader(req: Request | undefined, name: string): string | null {
  if (!req) return null
  try {
    return req.headers.get(name)
  } catch {
    return null
  }
}

function extractActor(req: Request | undefined) {
  const actor_email =
    getHeader(req, 'x-admin-email') ||
    getHeader(req, 'x-user-email') ||
    null
  const actor_id =
    getHeader(req, 'x-admin-id') ||
    getHeader(req, 'x-user-id') ||
    null
  const actor_role = getHeader(req, 'x-admin-role') || null
  return { actor_email, actor_id, actor_role }
}

function extractClient(req: Request | undefined) {
  const ip =
    getHeader(req, 'x-nf-client-connection-ip') ||
    getHeader(req, 'x-forwarded-for') ||
    getHeader(req, 'client-ip') ||
    null
  const user_agent = getHeader(req, 'user-agent')
  return { ip_address: ip, user_agent }
}

/**
 * Best-effort audit log writer. Never throws; audit failures must never block
 * the underlying admin operation.
 */
export async function logAudit(
  supabase: SupabaseClient,
  req: Request | undefined,
  entry: AuditEntry,
): Promise<void> {
  try {
    const { actor_email, actor_id, actor_role } = extractActor(req)
    const { ip_address, user_agent } = extractClient(req)
    await supabase.from('audit_logs').insert({
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resourceId ?? null,
      description: entry.description ?? null,
      metadata: entry.metadata ?? {},
      actor_email,
      actor_id,
      actor_role,
      ip_address,
      user_agent,
      status: entry.status ?? 'success',
    })
  } catch (err) {
    console.error('Failed to write audit log', err)
  }
}

/** Convenience method used inside try/catch to record failures without crashing. */
export async function logAuditFailure(
  supabase: SupabaseClient,
  req: Request | undefined,
  entry: AuditEntry,
  err: unknown,
): Promise<void> {
  const message = err instanceof Error ? err.message : String(err)
  await logAudit(supabase, req, {
    ...entry,
    status: 'failure',
    metadata: { ...(entry.metadata || {}), error: message },
  })
}
