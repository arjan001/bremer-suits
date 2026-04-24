import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Users,
  Shield,
  ShieldCheck,
  Eye,
  Pencil,
  KeyRound,
  Lock,
  EyeOff,
  CheckCircle,
} from 'lucide-react'
import { useAdmin, type AdminUser } from '@/lib/admin-store'
import {
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showDeleteConfirm,
  showError,
  showSuccess,
} from '@/lib/sweet-alert'
import {
  requestAdminPasswordReset,
  setAdminUserPassword,
  toAdminAuthError,
} from '@/lib/admin-auth'
import {
  ALL_ACTIONS,
  ALL_RESOURCES,
  defaultPermissionsForRole,
  resolvePermissions,
  type AdminRole,
  type PermissionAction,
  type PermissionMap,
  type ResourceKey,
} from '@/lib/permissions'

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
})

const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}
const roleColors: Record<AdminRole, string> = {
  super_admin: 'bg-red-50 text-red-700',
  admin: 'bg-purple-50 text-purple-700',
  editor: 'bg-blue-50 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
}
const roleIcons: Record<AdminRole, typeof Shield> = {
  super_admin: ShieldCheck,
  admin: Shield,
  editor: Pencil,
  viewer: Eye,
}

function AdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useAdmin()
  const [modal, setModal] = useState<'closed' | 'add' | 'edit' | 'password'>('closed')
  const [editItem, setEditItem] = useState<AdminUser | null>(null)

  async function handleSendReset(email: string) {
    try {
      await requestAdminPasswordReset(email)
      await showSuccess('Reset Link Sent', `Sent reset email to ${email}.`)
    } catch (err) {
      await showError('Failed to Send Reset Link', toAdminAuthError(err))
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-black"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Users & Roles
          </h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} team members</p>
        </div>
        <button
          onClick={() => {
            setEditItem(null)
            setModal('add')
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Last Login</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => {
              const RoleIcon = roleIcons[u.role] || Shield
              return (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-black">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${roleColors[u.role]}`}
                    >
                      <RoleIcon size={12} /> {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(u.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditItem(u)
                          setModal('edit')
                        }}
                        title="Edit"
                        className="p-1.5 text-gray-400 hover:text-black transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setEditItem(u)
                          setModal('password')
                        }}
                        title="Set password"
                        className="p-1.5 text-gray-400 hover:text-black transition-colors"
                      >
                        <Lock size={15} />
                      </button>
                      <button
                        onClick={() => handleSendReset(u.email)}
                        title="Send reset link"
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <KeyRound size={15} />
                      </button>
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={async () => {
                            const confirmed = await showDeleteConfirm('user')
                            if (confirmed) {
                              const ok = await deleteUser(u.id)
                              if (ok) await showDeleteSuccess('User')
                              else await showError('Delete Failed')
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  <Users size={32} className="mx-auto mb-2 text-gray-300" />
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal('closed')} />
          <div className="relative bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-black">
                {modal === 'add' ? 'Add User' : 'Edit User'}
              </h2>
              <button onClick={() => setModal('closed')} className="p-1 text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            <UserForm
              item={editItem}
              isNew={modal === 'add'}
              onSave={async (data) => {
                if (modal === 'edit' && editItem) {
                  const ok = await updateUser(editItem.id, data)
                  if (ok) await showUpdateSuccess('User')
                  else await showError('Update Failed')
                } else {
                  const ok = await addUser(
                    data as Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>,
                  )
                  if (ok) await showCreateSuccess('User')
                  else await showError('Create Failed')
                }
                setModal('closed')
              }}
              onCancel={() => setModal('closed')}
            />
          </div>
        </div>
      )}

      {modal === 'password' && editItem && (
        <SetPasswordModal
          user={editItem}
          onClose={() => setModal('closed')}
        />
      )}
    </div>
  )
}

function UserForm({
  item,
  isNew,
  onSave,
  onCancel,
}: {
  item: AdminUser | null
  isNew: boolean
  onSave: (d: Partial<AdminUser>) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(item?.name || '')
  const [email, setEmail] = useState(item?.email || '')
  const [role, setRole] = useState<AdminRole>((item?.role as AdminRole) || 'viewer')
  const [status, setStatus] = useState<AdminUser['status']>(item?.status || 'active')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [permissions, setPermissions] = useState<PermissionMap>(
    item?.permissions ?? defaultPermissionsForRole((item?.role as AdminRole) || 'viewer'),
  )

  const resolved = resolvePermissions(role, permissions)

  function togglePerm(resource: ResourceKey, action: PermissionAction) {
    setPermissions((prev) => {
      const current = prev[resource] || resolved[resource] || {}
      return {
        ...prev,
        [resource]: { ...current, [action]: !current[action] },
      }
    })
  }

  function handleRoleChange(nextRole: AdminRole) {
    setRole(nextRole)
    // Reset to defaults for the new role – keeps the matrix predictable.
    setPermissions(defaultPermissionsForRole(nextRole))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const payload: Partial<AdminUser> = { name, email, role, status, permissions }
        if (isNew && password) payload.password = password
        onSave(payload)
      }}
      className="p-6 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!isNew}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      {isNew && (
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Initial Password (optional)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              placeholder="Leave blank to invite via reset link"
              className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            If provided, we will create the Supabase Auth account for this user in the same step.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none"
          >
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminUser['status'])}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-black">Permissions</label>
          <button
            type="button"
            onClick={() => setPermissions(defaultPermissionsForRole(role))}
            className="text-xs text-gray-500 hover:text-black"
          >
            Reset to role defaults
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Resource
                </th>
                {ALL_ACTIONS.map((a) => (
                  <th
                    key={a}
                    className="text-center px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider"
                  >
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ALL_RESOURCES.map(({ key, label }) => (
                <tr key={key}>
                  <td className="px-3 py-2 text-gray-700">{label}</td>
                  {ALL_ACTIONS.map((a) => {
                    const checked = role === 'super_admin'
                      ? true
                      : Boolean(resolved[key]?.[a])
                    return (
                      <td key={a} className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={role === 'super_admin'}
                          onChange={() => togglePerm(key, a)}
                          className="h-4 w-4 accent-black disabled:opacity-60"
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {role === 'super_admin' && (
          <p className="text-xs text-gray-400 mt-2 inline-flex items-center gap-1">
            <CheckCircle size={12} /> Super Admin always has all permissions.
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
        >
          Save
        </button>
      </div>
    </form>
  )
}

function SetPasswordModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      showError('Password too short', 'Use at least 8 characters.')
      return
    }
    if (password !== confirm) {
      showError('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await setAdminUserPassword(user.id, password)
      await showSuccess('Password Updated', `Password for ${user.email} has been set.`)
      onClose()
    } catch (err) {
      await showError('Update Failed', toAdminAuthError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-black">Set Password</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Setting a new password for <span className="font-medium text-black">{user.email}</span>.
          </p>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">New Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Confirm Password</label>
            <input
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Set Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
