import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Edit2, FileText, Save, X, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAdmin, type AdminPolicy } from '@/lib/admin-store'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

export const Route = createFileRoute('/admin/policies')({
  component: AdminPolicies,
})

function AdminPolicies() {
  const { policies, addPolicy, updatePolicy, deletePolicy } = useAdmin()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editContent, setEditContent] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newContent, setNewContent] = useState('')
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const startEdit = (p: AdminPolicy) => {
    setEditingId(p.id)
    setEditTitle(p.title)
    setEditSlug(p.slug)
    setEditContent(p.content)
    setPreviewId(null)
  }

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      updatePolicy(editingId, {
        title: editTitle.trim(),
        slug: editSlug.trim() || slugify(editTitle),
        content: editContent,
      })
      setEditingId(null)
    }
  }

  const handleAdd = () => {
    if (newTitle.trim()) {
      addPolicy({
        title: newTitle.trim(),
        slug: newSlug.trim() || slugify(newTitle),
        content: newContent || '<p></p>',
      })
      setShowAdd(false)
      setNewTitle('')
      setNewSlug('')
      setNewContent('')
    }
  }

  const handleDelete = (id: string) => {
    deletePolicy(id)
    setDeleteConfirm(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Policies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage store policies ({policies.length})</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); setPreviewId(null) }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> Add Policy
        </button>
      </div>

      {/* Add Policy Form */}
      {showAdd && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">New Policy</h3>
              <button onClick={() => { setShowAdd(false); setNewTitle(''); setNewSlug(''); setNewContent('') }} className="p-1.5 text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value)
                    if (!newSlug || newSlug === slugify(newTitle)) {
                      setNewSlug(slugify(e.target.value))
                    }
                  }}
                  placeholder="e.g. Privacy Policy"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Slug (URL path)</label>
                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="e.g. privacy-policy"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none font-mono"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
              <RichTextEditor
                content={newContent}
                onChange={setNewContent}
                placeholder="Write your policy content here..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowAdd(false); setNewTitle(''); setNewSlug(''); setNewContent('') }} className="px-4 py-2 text-sm text-gray-600 hover:text-black border border-gray-200 rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="flex items-center gap-1 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={14} /> Add Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy list */}
      {policies.length === 0 && !showAdd ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No policies yet</h3>
          <p className="text-sm text-gray-400 mb-4">Create your first store policy to get started.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
          >
            <Plus size={16} /> Add Policy
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {policies.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {editingId === p.id ? (
                /* Edit mode */
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-black">Editing Policy</h3>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
                        <Save size={14} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:text-black"><X size={18} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
                      <input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                    <RichTextEditor
                      content={editContent}
                      onChange={setEditContent}
                      placeholder="Write your policy content here..."
                    />
                  </div>
                </div>
              ) : previewId === p.id ? (
                /* Preview mode */
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      <h3 className="text-lg font-bold text-black">{p.title}</h3>
                    </div>
                    <button onClick={() => setPreviewId(null)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black border border-gray-200 rounded-lg hover:border-gray-300">
                      <EyeOff size={14} /> Close Preview
                    </button>
                  </div>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: p.content }}
                  />
                </div>
              ) : (
                /* List view */
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      <div>
                        <h3 className="text-sm font-bold text-black">{p.title}</h3>
                        <p className="text-xs text-gray-400">/{p.slug} &middot; Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPreviewId(p.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <Eye size={14} /> Preview
                      </button>
                      <button onClick={() => startEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                    {p.content.replace(/<[^>]*>/g, '').slice(0, 200)}
                    {p.content.replace(/<[^>]*>/g, '').length > 200 ? '...' : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-black mb-2">Delete Policy</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this policy? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-black border border-gray-200 rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
