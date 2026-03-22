import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAdmin, type AdminPortfolioItem } from '@/lib/admin-store'
import { imagesApi } from '@/lib/admin-api'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Star,
  StarOff,
  Image,
  Search,
  Filter,
} from 'lucide-react'

export const Route = createFileRoute('/admin/portfolio')({
  component: AdminPortfolio,
})

const TAG_OPTIONS = ['new', 'partnership', 'featured', 'gallery']
const CATEGORY_OPTIONS = ['Recent Work', 'Partnerships', 'Gallery']
const STATUS_OPTIONS = ['active', 'draft', 'archived'] as const

function AdminPortfolio() {
  const {
    portfolioItems,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
  } = useAdmin()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminPortfolioItem | null>(null)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [uploading, setUploading] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [tag, setTag] = useState('')
  const [category, setCategory] = useState('')
  const [clientName, setClientName] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [sortOrder, setSortOrder] = useState(0)
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active')

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setImage('')
    setTag('')
    setCategory('')
    setClientName('')
    setIsFeatured(false)
    setSortOrder(0)
    setStatus('active')
    setEditing(null)
    setShowForm(false)
  }

  const openEdit = (item: AdminPortfolioItem) => {
    setEditing(item)
    setTitle(item.title)
    setDescription(item.description || '')
    setImage(item.image || '')
    setTag(item.tag || '')
    setCategory(item.category || '')
    setClientName(item.clientName || '')
    setIsFeatured(item.isFeatured)
    setSortOrder(item.sortOrder || 0)
    setStatus(item.status)
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await imagesApi.upload(file)
      setImage(url)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const data = {
      title: title.trim(),
      description: description.trim(),
      image,
      tag,
      category,
      clientName: clientName.trim(),
      isFeatured,
      sortOrder,
      status,
    }

    if (editing) {
      await updatePortfolioItem(editing.id, data)
    } else {
      await addPortfolioItem(data)
    }
    resetForm()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      await deletePortfolioItem(id)
    }
  }

  const toggleFeatured = async (item: AdminPortfolioItem) => {
    await updatePortfolioItem(item.id, { isFeatured: !item.isFeatured })
  }

  // Filter items
  const filtered = portfolioItems.filter((item) => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.clientName?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterTag && item.tag !== filterTag) return false
    if (filterCategory && item.category !== filterCategory) return false
    return true
  })

  const getTagColor = (t: string) => {
    switch (t) {
      case 'new': return 'bg-green-100 text-green-700'
      case 'partnership': return 'bg-blue-100 text-blue-700'
      case 'featured': return 'bg-amber-100 text-amber-700'
      case 'gallery': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your portfolio showcasing recent work, partnerships, and gallery items.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="pl-8 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none appearance-none"
            >
              <option value="">All Tags</option>
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <p className="text-2xl font-bold text-black">{portfolioItems.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Items</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <p className="text-2xl font-bold text-black">{portfolioItems.filter((i) => i.status === 'active').length}</p>
          <p className="text-xs text-gray-500 mt-1">Active</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <p className="text-2xl font-bold text-black">{portfolioItems.filter((i) => i.isFeatured).length}</p>
          <p className="text-xs text-gray-500 mt-1">Featured</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <p className="text-2xl font-bold text-black">{portfolioItems.filter((i) => i.tag === 'partnership').length}</p>
          <p className="text-xs text-gray-500 mt-1">Partnerships</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-black">
                {editing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                {image ? (
                  <div className="relative group">
                    <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors">
                    {uploading ? (
                      <div className="text-sm text-gray-500">Uploading...</div>
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload image</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Or enter image URL directly"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Executive Three-Piece Collection"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the project, work, or partnership..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-none"
                />
              </div>

              {/* Tag & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tag</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none"
                  >
                    <option value="">Select tag</option>
                    {TAG_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none"
                  >
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g., James Kariuki"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as typeof status)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-black outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort Order & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured item</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {editing ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={32} className="text-gray-300" />
                  </div>
                )}

                {/* Tag badge */}
                {item.tag && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTagColor(item.tag)}`}>
                    {item.tag}
                  </span>
                )}

                {/* Status badge */}
                {item.status !== 'active' && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {item.status}
                  </span>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Pencil size={16} className="text-black" />
                  </button>
                  <button
                    onClick={() => toggleFeatured(item)}
                    className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                    title={item.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    {item.isFeatured ? <StarOff size={16} className="text-amber-500" /> : <Star size={16} className="text-gray-400" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-black line-clamp-1">{item.title}</h3>
                  {item.isFeatured && <Star size={14} className="text-amber-400 fill-amber-400 shrink-0 mt-0.5" />}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.category && (
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{item.category}</span>
                    )}
                  </div>
                  {item.clientName && (
                    <span className="text-xs text-gray-500 italic">{item.clientName}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Image size={28} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No portfolio items found</h3>
          <p className="text-sm text-gray-400 mb-4">
            {search || filterTag || filterCategory ? 'Try adjusting your filters.' : 'Start by adding your first portfolio item.'}
          </p>
          {!search && !filterTag && !filterCategory && (
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} /> Add Your First Item
            </button>
          )}
        </div>
      )}
    </div>
  )
}
