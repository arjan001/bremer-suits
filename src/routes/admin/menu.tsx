import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit2, Trash2, X, BookOpen, GripVertical } from 'lucide-react'
import { useAdmin, type AdminMenuItem } from '@/lib/admin-store'
import { ImageUpload } from '@/components/ImageUpload'

export const Route = createFileRoute('/admin/menu')({
  component: AdminMenu,
})

function AdminMenu() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useAdmin()
  const [modal, setModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editItem, setEditItem] = useState<AdminMenuItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const sortedItems = [...menuItems].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  const handleDelete = () => {
    if (!deleteConfirm) return
    deleteMenuItem(deleteConfirm)
    setDeleteConfirm(null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Menu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the &ldquo;Our Specials&rdquo; menu section on your homepage. Items here are separate from your product catalog.
          </p>
        </div>
        <button
          onClick={() => { setEditItem(null); setModal('add') }}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> Add Menu Item
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Menu vs Products:</strong> Items added here appear exclusively in the &ldquo;Our Specials&rdquo; section on the homepage.
          Regular products uploaded in the Products section will not appear here. Use this section to curate a separate specials/menu display.
        </p>
      </div>

      {/* Menu Items List */}
      <div className="space-y-3">
        {sortedItems.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
            <div className="text-gray-300 cursor-grab shrink-0">
              <GripVertical size={18} />
            </div>
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen size={18} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-black text-sm">{item.title}</p>
                <span className="text-sm font-semibold text-gray-600">{item.price}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">Order: {item.sortOrder || 0}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updateMenuItem(item.id, { isActive: !item.isActive })}
                className={`w-11 h-6 rounded-full transition-colors relative ${item.isActive ? 'bg-gray-800' : 'bg-gray-300'}`}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{ left: item.isActive ? '22px' : '2px' }}
                />
              </button>
              <button
                onClick={() => { setEditItem(item); setModal('edit') }}
                className="p-1.5 text-gray-400 hover:text-black transition-colors"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => setDeleteConfirm(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {menuItems.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
            <BookOpen size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium mb-1">No menu items yet</p>
            <p className="text-xs">Add items to display in the &ldquo;Our Specials&rdquo; section on the homepage.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal !== 'closed' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal('closed')} />
          <div className="relative bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-black">
                {modal === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
              </h2>
              <button onClick={() => setModal('closed')} className="p-1 text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            <MenuItemForm
              item={editItem}
              onSave={(data) => {
                if (modal === 'edit' && editItem) updateMenuItem(editItem.id, data)
                else addMenuItem(data as AdminMenuItem)
                setModal('closed')
              }}
              onCancel={() => setModal('closed')}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-black mb-2">Delete Menu Item</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"

function MenuItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: AdminMenuItem | null
  onSave: (d: Partial<AdminMenuItem>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(item?.title || '')
  const [description, setDescription] = useState(item?.description || '')
  const [price, setPrice] = useState(item?.price || '')
  const [image, setImage] = useState(item?.image || '')
  const [sortOrder, setSortOrder] = useState(item?.sortOrder || 0)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ title, description, price, image, sortOrder, isActive: item?.isActive ?? true })
      }}
      className="p-6 space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Modern Silhouette" className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Brief description of this menu item"
          className={inputCls + " resize-y"}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Price *</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="85$" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Sort Order</label>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} min={0} className={inputCls} />
        </div>
      </div>
      <ImageUpload value={image} onChange={(url) => setImage(url)} label="Image" />
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
          Save
        </button>
      </div>
    </form>
  )
}
