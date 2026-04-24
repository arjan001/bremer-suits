/**
 * Role & permission model for the admin panel.
 *
 * Every user has a `role` (from admin_users.role). A user may also have an
 * explicit `permissions` map in the DB that overrides the role defaults.
 * `super_admin` always has full access regardless of stored permissions.
 */

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer'

export type PermissionAction = 'view' | 'edit' | 'delete'

export type ResourceKey =
  | 'products'
  | 'orders'
  | 'categories'
  | 'offers'
  | 'newsletter'
  | 'delivery'
  | 'analytics'
  | 'policies'
  | 'users'
  | 'settings'
  | 'portfolio'
  | 'cardDetails'

export type ResourcePermissions = Partial<Record<PermissionAction, boolean>>
export type PermissionMap = Partial<Record<ResourceKey, ResourcePermissions>>

export const ALL_RESOURCES: { key: ResourceKey; label: string }[] = [
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'categories', label: 'Categories' },
  { key: 'offers', label: 'Offers & Banners' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'policies', label: 'Policies' },
  { key: 'users', label: 'Users & Roles' },
  { key: 'settings', label: 'Settings' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'cardDetails', label: 'Card Details' },
]

export const ALL_ACTIONS: PermissionAction[] = ['view', 'edit', 'delete']

function fullAccess(): ResourcePermissions {
  return { view: true, edit: true, delete: true }
}

function viewOnly(): ResourcePermissions {
  return { view: true, edit: false, delete: false }
}

function viewEdit(): ResourcePermissions {
  return { view: true, edit: true, delete: false }
}

function buildMap(factory: () => ResourcePermissions): PermissionMap {
  const out: PermissionMap = {}
  for (const r of ALL_RESOURCES) out[r.key] = factory()
  return out
}

export function defaultPermissionsForRole(role: AdminRole): PermissionMap {
  switch (role) {
    case 'super_admin':
      return buildMap(fullAccess)
    case 'admin': {
      const map = buildMap(fullAccess)
      map.users = viewEdit()
      map.settings = viewEdit()
      return map
    }
    case 'editor': {
      const map = buildMap(viewEdit)
      map.users = viewOnly()
      map.settings = viewOnly()
      map.analytics = viewOnly()
      return map
    }
    case 'viewer':
    default:
      return buildMap(viewOnly)
  }
}

/** Merge stored per-user permissions with role defaults. */
export function resolvePermissions(
  role: AdminRole,
  stored?: PermissionMap | null,
): PermissionMap {
  const base = defaultPermissionsForRole(role)
  if (!stored) return base
  const out: PermissionMap = { ...base }
  for (const [k, v] of Object.entries(stored) as [ResourceKey, ResourcePermissions][]) {
    out[k] = { ...(base[k] || {}), ...(v || {}) }
  }
  return out
}

export function can(
  role: AdminRole,
  stored: PermissionMap | null | undefined,
  resource: ResourceKey,
  action: PermissionAction,
): boolean {
  if (role === 'super_admin') return true
  const resolved = resolvePermissions(role, stored)
  return Boolean(resolved[resource]?.[action])
}

export const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}
