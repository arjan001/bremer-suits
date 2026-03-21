import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Truck } from 'lucide-react'
import { useAdmin, type AdminDeliveryZone } from '@/lib/admin-store'

export const Route = createFileRoute('/admin/delivery')({
  component: AdminDelivery,
})

function AdminDelivery() {
  const { deliveryZones, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone, settings } = useAdmin()
  const [modal, setModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editItem, setEditItem] = useState<AdminDeliveryZone | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Delivery</h1>
          <p className="text-sm text-gray-500 mt-1">Manage delivery zones and fees</p>
        </div>
        <button onClick={() => { setEditItem(null); setModal('add') }} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Add Zone
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Zone</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Fee</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Est. Days</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {deliveryZones.map((z) => (
              <tr key={z.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-gray-400" />
                    <span className="font-medium text-black">{z.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-black">{settings.currency} {z.fee.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{z.estimatedDays} days</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                    z.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{z.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditItem(z); setModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                    <button onClick={() => setDeleteConfirm(z.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {deliveryZones.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400"><Truck size={32} className="mx-auto mb-2 text-gray-300" />No delivery zones</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal !== 'closed' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal('closed')} />
          <div className="relative bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-black">{modal === 'add' ? 'Add Delivery Zone' : 'Edit Delivery Zone'}</h2>
              <button onClick={() => setModal('closed')} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <DeliveryForm
              item={editItem}
              currency={settings.currency}
              onSave={(data) => {
                if (modal === 'edit' && editItem) updateDeliveryZone(editItem.id, data)
                else addDeliveryZone(data as AdminDeliveryZone)
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
            <h3 className="text-lg font-bold text-black mb-2">Delete Zone</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={() => { deleteDeliveryZone(deleteConfirm); setDeleteConfirm(null) }} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DeliveryForm({ item, currency, onSave, onCancel }: { item: AdminDeliveryZone | null; currency: string; onSave: (d: Partial<AdminDeliveryZone>) => void; onCancel: () => void }) {
  const [name, setName] = useState(item?.name || '')
  const [fee, setFee] = useState(item?.fee || 0)
  const [estimatedDays, setEstimatedDays] = useState(item?.estimatedDays || '')
  const [status, setStatus] = useState(item?.status || 'active')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name, fee, estimatedDays, status }) }} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Zone Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Fee ({currency})</label>
          <input type="number" value={fee} onChange={(e) => setFee(Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Est. Days</label>
          <input value={estimatedDays} onChange={(e) => setEstimatedDays(e.target.value)} placeholder="1-2" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
        </div>
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
