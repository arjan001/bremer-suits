import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Search, Image } from 'lucide-react'
import { useAdmin, type AdminCategory } from '@/lib/admin-store'
import { ImageUpload } from '@/components/ImageUpload'
import { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showDeleteConfirm, showError } from '@/lib/sweet-alert'

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategories,
})

function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useAdmin()
  const [modal, setModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editItem, setEditItem] = useState<AdminCategory | null>(null)
  const [search, setSearch] = useState('')

  const getProductCount = (catName: string) => products.filter((p) => p.category === catName).length

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (c: AdminCategory) => { setEditItem(c); setModal('edit') }
  const openAdd = () => { setEditItem(null); setModal('add') }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
      </div>

      {/* Category Grid with Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const count = getProductCount(c.name)
          return (
            <div key={c.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
              {/* Category Image */}
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={32} className="text-gray-300" />
                  </div>
                )}
              </div>
              {/* Category Info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-black">{c.name}</h3>
                    <p className="text-xs text-gray-400">{count} products</p>
                    <p className="text-xs text-gray-400">/{c.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={14} /></button>
                    <button onClick={async () => {
                      const confirmed = await showDeleteConfirm('category')
                      if (confirmed) {
                        const ok = await deleteCategory(c.id)
                        if (ok) showDeleteSuccess('Category')
                        else showError('Delete Failed')
                      }
                    }} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
          <Image size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No categories found</p>
        </div>
      )}

      {/* Modal */}
      {modal !== 'closed' && (
        <CategoryModal
          mode={modal}
          category={editItem}
          onClose={() => setModal('closed')}
          onSave={async (data) => {
            if (modal === 'edit' && editItem) {
              const ok = await updateCategory(editItem.id, data)
              if (ok) showUpdateSuccess('Category')
              else showError('Update Failed')
            } else {
              const ok = await addCategory(data as AdminCategory)
              if (ok) showCreateSuccess('Category')
              else showError('Create Failed')
            }
            setModal('closed')
          }}
        />
      )}

    </div>
  )
}

function CategoryModal({ mode, category, onClose, onSave }: {
  mode: string
  category: AdminCategory | null
  onClose: () => void
  onSave: (data: Partial<AdminCategory>) => void
}) {
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [description, setDescription] = useState(category?.description || '')
  const [image, setImage] = useState(category?.image || '')
  const [status, setStatus] = useState(category?.status || 'active')

  const handleNameChange = (val: string) => {
    setName(val)
    if (!category) setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-black">{mode === 'add' ? 'Add Category' : 'Edit Category'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ name, slug, description, image, status }) }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Name *</label>
            <input value={name} onChange={(e) => handleNameChange(e.target.value)} required className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">This also serves as the collection name on the storefront.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} />
          </div>
          <div>
            <ImageUpload value={image} onChange={(url) => setImage(url)} label="Category Image" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls + " resize-y"} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')} className={inputCls}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">{mode === 'add' ? 'Add Category' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
