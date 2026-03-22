import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, X, Package, Download, Upload, Eye, Palette } from 'lucide-react'
import { useAdmin, type AdminProduct } from '@/lib/admin-store'
import { ImageUpload } from '@/components/ImageUpload'
import { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showDeleteConfirm, showError } from '@/lib/sweet-alert'

export const Route = createFileRoute('/admin/products')({
  component: AdminProducts,
})

type ModalMode = 'closed' | 'add' | 'edit'

const defaultColors = [
  { name: 'Black', value: '#000000' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Charcoal', value: '#36454f' },
  { name: 'Burgundy', value: '#800020' },
  { name: 'White', value: '#ffffff' },
  { name: 'Beige', value: '#f5f5dc' },
  { name: 'Brown', value: '#8b4513' },
  { name: 'Grey', value: '#808080' },
  { name: 'Olive', value: '#556b2f' },
  { name: 'Tan', value: '#d2b48c' },
  { name: 'Blue', value: '#0066cc' },
  { name: 'Red', value: '#cc0000' },
]

const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useAdmin()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [modal, setModal] = useState<ModalMode>('closed')
  const [editItem, setEditItem] = useState<AdminProduct | null>(null)
  const [viewItem, setViewItem] = useState<AdminProduct | null>(null)

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCategory || p.category === filterCategory
    return matchSearch && matchCat
  })

  const openEdit = (p: AdminProduct) => { setEditItem(p); setModal('edit') }
  const openAdd = () => { setEditItem(null); setModal('add') }
  const handleDelete = async (id: string) => {
    const confirmed = await showDeleteConfirm('product')
    if (confirmed) {
      const ok = await deleteProduct(id)
      if (ok) showDeleteSuccess('Product')
      else showError('Delete Failed')
    }
  }

  const handleExport = () => {
    const csv = 'Title,Category,Price,SKU,Stock,Status,Fabric,Tag\n' + products.map((p) =>
      `"${p.title}","${p.category}","${p.price}","${p.sku}",${p.stock},"${p.status}","${p.fabric}","${p.tag || ''}"`
    ).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products-export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        const lines = text.split('\n').slice(1).filter((l) => l.trim())
        lines.forEach((line) => {
          const parts = line.match(/(".*?"|[^,]+)/g)?.map((s) => s.replace(/^"|"$/g, ''))
          if (parts && parts.length >= 3) {
            addProduct({
              title: parts[0],
              category: parts[1] || categories[0]?.name || 'General',
              price: parts[2] || '$0',
              numericPrice: parseFloat(parts[2]?.replace(/[^0-9.]/g, '') || '0'),
              sku: parts[3] || 'BRM-' + Date.now().toString(36).toUpperCase().slice(-8),
              stock: parseInt(parts[4] || '0', 10),
              status: (parts[5] as AdminProduct['status']) || 'active',
              fabric: parts[6] || '',
              tag: parts[7] || null,
              image: '',
              colors: [{ name: 'Black', value: '#000000' }],
              sizes: ['S', 'M', 'L', 'XL'],
              description: '',
            } as AdminProduct)
          }
        })
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} /> Export
          </button>
          <button onClick={handleImport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Upload size={16} /> Import
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black outline-none">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded border-gray-300" disabled /></th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-black truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-black">{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{p.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      {p.tag === 'New' && <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded uppercase">New</span>}
                      {p.salePrice && <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded uppercase">Offer</span>}
                      {!p.tag && !p.salePrice && (
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                          p.status === 'active' ? 'bg-green-50 text-green-700' :
                          p.status === 'draft' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{p.status}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewItem(p)} className="p-1.5 text-gray-400 hover:text-black transition-colors" title="View"><Eye size={15} /></button>
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-black transition-colors" title="Edit"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-14 text-center text-gray-400"><Package size={36} className="mx-auto mb-3 text-gray-300" /><p className="text-sm">No products found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewItem(null)} />
          <div className="relative bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-black">Product Details</h2>
              <button onClick={() => setViewItem(null)} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img src={viewItem.image} alt={viewItem.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-black mb-1">{viewItem.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{viewItem.category} | {viewItem.fabric}</p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><span className="text-gray-400">Price:</span> <span className="font-semibold text-black">{viewItem.price}</span></div>
                <div><span className="text-gray-400">SKU:</span> <span className="font-mono text-gray-700">{viewItem.sku}</span></div>
                <div><span className="text-gray-400">Stock:</span> <span className={viewItem.stock <= 5 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{viewItem.stock}</span></div>
                <div><span className="text-gray-400">Status:</span> <span className="capitalize text-gray-700">{viewItem.status}</span></div>
              </div>
              {viewItem.colors.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1.5">Colors:</p>
                  <div className="flex gap-2">{viewItem.colors.map((c) => (
                    <span key={c.name} className="w-6 h-6 rounded-full ring-1 ring-gray-200" style={{ backgroundColor: c.value }} title={c.name} />
                  ))}</div>
                </div>
              )}
              {viewItem.sizes.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1.5">Sizes:</p>
                  <div className="flex flex-wrap gap-1.5">{viewItem.sizes.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">{s}</span>
                  ))}</div>
                </div>
              )}
              {viewItem.description && <p className="text-sm text-gray-500 mt-3">{viewItem.description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Product Modal (Add/Edit) */}
      {modal !== 'closed' && (
        <ProductModal
          mode={modal}
          product={editItem}
          categories={categories.map((c) => c.name)}
          onClose={() => setModal('closed')}
          onSave={async (data) => {
            if (modal === 'edit' && editItem) {
              const ok = await updateProduct(editItem.id, data)
              if (ok) showUpdateSuccess('Product')
              else showError('Update Failed')
            } else {
              const ok = await addProduct({
                ...data,
                colors: data.colors || [],
                sizes: data.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
                sku: 'BRM-' + Date.now().toString(36).toUpperCase().slice(-8),
              } as AdminProduct)
              if (ok) showCreateSuccess('Product')
              else showError('Create Failed')
            }
            setModal('closed')
          }}
        />
      )}

    </div>
  )
}

/* ── Comprehensive Product Modal ── */
function ProductModal({
  mode,
  product,
  categories,
  onClose,
  onSave,
}: {
  mode: ModalMode
  product: AdminProduct | null
  categories: string[]
  onClose: () => void
  onSave: (data: Partial<AdminProduct>) => void
}) {
  const [title, setTitle] = useState(product?.title || '')
  const [category, setCategory] = useState(product?.category || categories[0] || '')
  const [fabric, setFabric] = useState(product?.fabric || '')
  const [price, setPrice] = useState(product?.price || '')
  const [numericPrice, setNumericPrice] = useState(product?.numericPrice || 0)
  const [salePrice, setSalePrice] = useState(product?.salePrice || '')
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || '')
  const [image, setImage] = useState(product?.image || '')
  const [tag, setTag] = useState(product?.tag || '')
  const [description, setDescription] = useState(product?.description || '')
  const [status, setStatus] = useState(product?.status || 'active')
  const [stock, setStock] = useState(product?.stock || 0)
  const [selectedColors, setSelectedColors] = useState<{ name: string; value: string }[]>(product?.colors || [])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(product?.sizes || ['S', 'M', 'L', 'XL', 'XXL'])
  const [customColorName, setCustomColorName] = useState('')
  const [customColorValue, setCustomColorValue] = useState('#000000')

  const handlePriceChange = (val: string) => {
    setPrice(val)
    const num = parseFloat(val.replace(/[^0-9.]/g, ''))
    if (!isNaN(num)) setNumericPrice(num)
  }

  const toggleColor = (color: { name: string; value: string }) => {
    setSelectedColors((prev) =>
      prev.some((c) => c.name === color.name)
        ? prev.filter((c) => c.name !== color.name)
        : [...prev, color]
    )
  }

  const addCustomColor = () => {
    if (customColorName.trim() && !selectedColors.some((c) => c.name === customColorName)) {
      setSelectedColors((prev) => [...prev, { name: customColorName.trim(), value: customColorValue }])
      setCustomColorName('')
      setCustomColorValue('#000000')
    }
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title, category, fabric, price, numericPrice, salePrice: salePrice || undefined,
      originalPrice: originalPrice || undefined, image,
      tag: tag || null, description, status, stock,
      colors: selectedColors, sizes: selectedSizes,
    })
  }

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-black">{mode === 'add' ? 'Add Product' : 'Edit Product'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic Information</h3>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Product Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. The Midnight Navy" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Fabric / Material</label>
                <input value={fabric} onChange={(e) => setFabric(e.target.value)} placeholder="e.g. Super 150s Wool" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe your product..." className={inputCls + " resize-y"} />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Price (Display) *</label>
                <input value={price} onChange={(e) => handlePriceChange(e.target.value)} placeholder="$280.00" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Numeric Price *</label>
                <input type="number" value={numericPrice} onChange={(e) => setNumericPrice(Number(e.target.value))} min={0} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Sale Price</label>
                <input value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="$200.00 (leave empty if no sale)" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Original Price (strikethrough)</label>
                <input value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="$350.00" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Media</h3>
            <ImageUpload value={image} onChange={(url) => setImage(url)} label="Product Image" />
            {image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} /> Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {defaultColors.map((c) => {
                const isSelected = selectedColors.some((sc) => sc.name === c.name)
                return (
                  <button key={c.name} type="button" onClick={() => toggleColor(c)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                    }`}>
                    <span className="w-3.5 h-3.5 rounded-full ring-1 ring-gray-300" style={{ backgroundColor: c.value }} />
                    {c.name}
                  </button>
                )
              })}
            </div>
            {/* Selected custom colors */}
            {selectedColors.filter((c) => !defaultColors.some((dc) => dc.name === c.name)).map((c) => (
              <span key={c.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-black bg-black text-white mr-1">
                <span className="w-3 h-3 rounded-full ring-1 ring-white/30" style={{ backgroundColor: c.value }} />
                {c.name}
                <button type="button" onClick={() => setSelectedColors((p) => p.filter((x) => x.name !== c.name))} className="ml-1 hover:text-gray-300">&times;</button>
              </span>
            ))}
            {/* Custom color */}
            <div className="flex items-center gap-2 pt-1">
              <input type="color" value={customColorValue} onChange={(e) => setCustomColorValue(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
              <input value={customColorName} onChange={(e) => setCustomColorName(e.target.value)} placeholder="Custom color name" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" />
              <button type="button" onClick={addCustomColor} disabled={!customColorName.trim()} className="px-3 py-2 bg-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors">Add</button>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((s) => {
                const isSelected = selectedSizes.includes(s)
                return (
                  <button key={s} type="button" onClick={() => toggleSize(s)}
                    className={`min-w-[44px] h-10 px-3 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                      isSelected
                        ? 'bg-black text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
                    }`}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Inventory & Status */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inventory & Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Stock</label>
                <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} min={0} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Tag / Badge</label>
                <select value={tag} onChange={(e) => setTag(e.target.value)} className={inputCls}>
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Popular">Popular</option>
                  <option value="Sale">Sale</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as AdminProduct['status'])} className={inputCls}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
              {mode === 'add' ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
