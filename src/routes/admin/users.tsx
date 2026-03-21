import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Users, Shield, ShieldCheck, Eye, Pencil } from 'lucide-react'
import { useAdmin, type AdminUser } from '@/lib/admin-store'

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
})

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}
const roleColors: Record<string, string> = {
  super_admin: 'bg-red-50 text-red-700',
  admin: 'bg-purple-50 text-purple-700',
  editor: 'bg-blue-50 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
}
const roleIcons: Record<string, typeof Shield> = {
  super_admin: ShieldCheck,
  admin: Shield,
  editor: Pencil,
  viewer: Eye,
}

function AdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useAdmin()
  const [modal, setModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editItem, setEditItem] = useState<AdminUser | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Users & Roles</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} team members</p>
        </div>
        <button onClick={() => { setEditItem(null); setModal('add') }} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
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
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${roleColors[u.role]}`}>
                      <RoleIcon size={12} /> {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{new Date(u.lastLogin).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                      u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditItem(u); setModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                      {u.role !== 'super_admin' && (
                        <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400"><Users size={32} className="mx-auto mb-2 text-gray-300" />No users</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal !== 'closed' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal('closed')} />
          <div className="relative bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-black">{modal === 'add' ? 'Add User' : 'Edit User'}</h2>
              <button onClick={() => setModal('closed')} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <UserForm
              item={editItem}
              onSave={(data) => {
                if (modal === 'edit' && editItem) updateUser(editItem.id, data)
                else addUser(data as Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>)
                setModal('closed')
              }}
              onCancel={() => setModal('closed')}
            />
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-black mb-2">Delete User</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={() => { deleteUser(deleteConfirm); setDeleteConfirm(null) }} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function UserForm({ item, onSave, onCancel }: { item: AdminUser | null; onSave: (d: Partial<AdminUser>) => void; onCancel: () => void }) {
  const [name, setName] = useState(item?.name || '')
  const [email, setEmail] = useState(item?.email || '')
  const [role, setRole] = useState(item?.role || 'viewer')
  const [status, setStatus] = useState(item?.status || 'active')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name, email, role, status }) }} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Email *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value as AdminUser['role'])} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none">
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save</button>
      </div>
    </form>
  )
}
