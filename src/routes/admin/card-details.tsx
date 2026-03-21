import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit2, Trash2, X, CreditCard, Phone, Building2 } from 'lucide-react'
import { useAdmin, type AdminCardDetail } from '@/lib/admin-store'

export const Route = createFileRoute('/admin/card-details')({
  component: AdminCardDetails,
})

const typeIcons = { mpesa: Phone, bank: Building2, card_gateway: CreditCard }
const typeLabels = { mpesa: 'M-PESA', bank: 'Bank Account', card_gateway: 'Card Gateway' }

function AdminCardDetails() {
  const { cardDetails, addCardDetail, updateCardDetail, deleteCardDetail } = useAdmin()
  const [modal, setModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editItem, setEditItem] = useState<AdminCardDetail | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Card Details</h1>
          <p className="text-sm text-gray-500 mt-1">Payment methods and account details</p>
        </div>
        <button onClick={() => { setEditItem(null); setModal('add') }} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Add Payment Method
        </button>
      </div>

      <div className="space-y-4">
        {cardDetails.map((cd) => {
          const Icon = typeIcons[cd.type]
          return (
            <div key={cd.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                cd.type === 'mpesa' ? 'bg-green-50' : cd.type === 'bank' ? 'bg-blue-50' : 'bg-gray-50'
              }`}>
                <Icon size={22} className={cd.type === 'mpesa' ? 'text-green-600' : cd.type === 'bank' ? 'text-blue-600' : 'text-gray-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-black">{cd.label}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{typeLabels[cd.type]}</span>
                  <span className={`ml-auto inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                    cd.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{cd.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-sm text-gray-600">{cd.details}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setEditItem(cd); setModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => setDeleteConfirm(cd.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          )
        })}
        {cardDetails.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <CreditCard size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No payment methods configured</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== 'closed' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal('closed')} />
          <div className="relative bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-black">{modal === 'add' ? 'Add Payment Method' : 'Edit Payment Method'}</h2>
              <button onClick={() => setModal('closed')} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <CardDetailForm
              item={editItem}
              onSave={(data) => {
                if (modal === 'edit' && editItem) updateCardDetail(editItem.id, data)
                else addCardDetail(data as AdminCardDetail)
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
            <h3 className="text-lg font-bold text-black mb-2">Delete Payment Method</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={() => { deleteCardDetail(deleteConfirm); setDeleteConfirm(null) }} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CardDetailForm({ item, onSave, onCancel }: { item: AdminCardDetail | null; onSave: (d: Partial<AdminCardDetail>) => void; onCancel: () => void }) {
  const [type, setType] = useState(item?.type || 'mpesa')
  const [label, setLabel] = useState(item?.label || '')
  const [details, setDetails] = useState(item?.details || '')
  const [isActive, setIsActive] = useState(item?.isActive ?? true)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ type, label, details, isActive }) }} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as AdminCardDetail['type'])} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none">
          <option value="mpesa">M-PESA</option>
          <option value="bank">Bank Account</option>
          <option value="card_gateway">Card Gateway</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Label *</label>
        <input value={label} onChange={(e) => setLabel(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Details *</label>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} required rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-black" />
        <span className="text-sm text-gray-700">Active</span>
      </label>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save</button>
      </div>
    </form>
  )
}
