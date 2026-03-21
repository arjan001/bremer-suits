import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Edit2, FileText, Save, X } from 'lucide-react'
import { useAdmin, type AdminPolicy } from '@/lib/admin-store'

export const Route = createFileRoute('/admin/policies')({
  component: AdminPolicies,
})

function AdminPolicies() {
  const { policies, updatePolicy } = useAdmin()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const startEdit = (p: AdminPolicy) => {
    setEditingId(p.id)
    setEditTitle(p.title)
    setEditContent(p.content)
  }

  const saveEdit = () => {
    if (editingId) {
      updatePolicy(editingId, { title: editTitle, content: editContent })
      setEditingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Policies</h1>
        <p className="text-sm text-gray-500 mt-1">Manage store policies</p>
      </div>

      <div className="space-y-4">
        {policies.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {editingId === p.id ? (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-lg font-bold text-black bg-transparent border-b border-gray-200 outline-none focus:border-black pb-1 flex-1 mr-4" />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
                      <Save size={14} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:text-black"><X size={18} /></button>
                  </div>
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y font-mono"
                />
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <h3 className="text-sm font-bold text-black">{p.title}</h3>
                      <p className="text-xs text-gray-400">/{p.slug} &middot; Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => startEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3 line-clamp-3">{p.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
