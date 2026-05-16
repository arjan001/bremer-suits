import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit2, Trash2, X, CreditCard, Phone, Building2, Eye, Clock, Send, RefreshCw, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAdmin, type AdminCardDetail, type AdminOrder } from '@/lib/admin-store'
import { payheroApi } from '@/lib/admin-api'
import { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showDeleteConfirm, showError, showSuccess } from '@/lib/sweet-alert'

export const Route = createFileRoute('/admin/card-details')({
  component: AdminCardDetails,
})

const typeIcons = { mpesa: Phone, bank: Building2, card_gateway: CreditCard }
const typeLabels = { mpesa: 'M-PESA', bank: 'Bank Account', card_gateway: 'Card Gateway' }

function AdminCardDetails() {
  const { cardDetails, addCardDetail, updateCardDetail, deleteCardDetail, orders, settings } = useAdmin()
  const [modal, setModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editItem, setEditItem] = useState<AdminCardDetail | null>(null)
  const [viewTransaction, setViewTransaction] = useState<AdminOrder | null>(null)
  const [stkModal, setStkModal] = useState<{ open: boolean; order?: AdminOrder }>({ open: false })
  const [stkPhone, setStkPhone] = useState('')
  const [stkLoading, setStkLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState<string | null>(null)

  const cardTransactions = orders
    .filter((o) => o.paymentMethod === 'card' && o.paymentDetails && ('cardNumber' in o.paymentDetails || 'lastFourDigits' in o.paymentDetails))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const mpesaTransactions = orders
    .filter((o) => o.paymentMethod === 'mpesa' && o.paymentDetails && 'phoneNumber' in o.paymentDetails)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const pendingOrders = orders
    .filter((o) => !o.paymentStatus || o.paymentStatus === 'pending_processing' || o.paymentStatus === 'pending_collection')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const handleStkPush = async () => {
    if (!stkModal.order || !stkPhone) return
    setStkLoading(true)
    try {
      await payheroApi.stkPush({
        amount: stkModal.order.total,
        phone_number: stkPhone,
        customer_name: stkModal.order.customer.fullName,
        order_id: stkModal.order.id,
        external_reference: stkModal.order.orderNumber,
      })
      showSuccess('STK Push Sent!', `Payment prompt sent to ${stkPhone}. Customer will receive an M-PESA prompt.`)
      setStkModal({ open: false })
      setStkPhone('')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to send STK Push')
    } finally {
      setStkLoading(false)
    }
  }

  const handleCheckStatus = async (order: AdminOrder) => {
    const ref = order.paymentDetails?.payheroReference || order.orderNumber
    if (!ref) return
    setStatusLoading(order.id)
    try {
      const data = await payheroApi.checkStatus(ref as string)
      const status = (data as Record<string, unknown>)?.status || (data as Record<string, unknown>)?.Status
      if (status === 'SUCCESS' || status === 'success' || status === 'completed') {
        showSuccess('Payment Completed', 'This transaction has been paid successfully.')
      } else if (status === 'FAILED' || status === 'failed') {
        showError('Payment Failed')
      } else {
        showSuccess('Payment Status', `Current status: ${status || 'Pending'}`)
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to check status')
    } finally {
      setStatusLoading(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Card Details & Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Payment methods, card transactions, M-PESA & PayHero STK Push</p>
        </div>
        <button onClick={() => { setEditItem(null); setModal('add') }} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Add Payment Method
        </button>
      </div>

      {/* PayHero STK Push Section */}
      {settings.payheroEnabled && pendingOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Send size={16} className="text-green-600" />
            PayHero — Send M-PESA STK Push ({pendingOrders.length} pending)
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Payment</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-black text-xs">{o.orderNumber}</p>
                        <p className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs text-gray-700">{o.customer.fullName}</p>
                        <p className="text-[10px] text-gray-400">{o.customer.phone}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs font-semibold text-black">{settings.currency} {o.total.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs capitalize text-gray-600">{o.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          o.paymentStatus === 'completed' ? 'bg-green-50 text-green-700' :
                          o.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                          o.paymentDetails?.stkPushSent ? 'bg-blue-50 text-blue-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {o.paymentStatus === 'completed' ? 'Paid' :
                           o.paymentStatus === 'failed' ? 'Failed' :
                           o.paymentDetails?.stkPushSent ? 'STK Sent' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setStkModal({ open: true, order: o }); setStkPhone(o.customer.phone || '') }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 transition-colors"
                          title="Send M-PESA STK Push"
                        >
                          <Send size={12} /> STK Push
                        </button>
                        {o.paymentDetails?.payheroReference && (
                          <button
                            onClick={() => handleCheckStatus(o)}
                            disabled={statusLoading === o.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            title="Check payment status"
                          >
                            {statusLoading === o.id ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                            Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Card Transactions from Orders */}
      {cardTransactions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <CreditCard size={16} className="text-blue-600" />
            Card Transactions ({cardTransactions.length})
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Card</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Cardholder</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">Expiry</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cardTransactions.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-black text-xs">{o.orderNumber}</p>
                        <p className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs text-gray-700">{o.customer.fullName}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-black">{o.paymentDetails?.cardBrand}</span>
                          <span className="text-xs text-gray-500 font-mono">
                            {o.paymentDetails?.cardNumber
                              ? o.paymentDetails.cardNumber.replace(/(.{4})/g, '$1 ').trim()
                              : `•••• ${o.paymentDetails?.lastFourDigits}`
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell">
                        <p className="text-xs text-gray-600">{o.paymentDetails?.cardholderName || '-'}</p>
                      </td>
                      <td className="px-4 py-2.5 hidden lg:table-cell">
                        <p className="text-xs text-gray-600 font-mono">{o.paymentDetails?.expiryDate || '-'}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs font-semibold text-black">{settings.currency} {o.total.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          o.paymentStatus === 'completed' ? 'bg-green-50 text-green-700' :
                          o.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                          o.paymentStatus === 'pending_collection' ? 'bg-blue-50 text-blue-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {o.paymentStatus === 'pending_collection' ? 'Collected' :
                           o.paymentStatus === 'pending_processing' ? 'Pending' :
                           o.paymentStatus === 'completed' ? 'Paid' : o.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button onClick={() => setViewTransaction(o)} className="p-1 text-gray-400 hover:text-black transition-colors" title="View full details">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* M-PESA Transactions from Orders */}
      {mpesaTransactions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Phone size={16} className="text-green-600" />
            M-PESA Transactions ({mpesaTransactions.length})
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Phone</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Transaction ID</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mpesaTransactions.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-black text-xs">{o.orderNumber}</p>
                        <p className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs text-gray-700">{o.customer.fullName}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs text-gray-600 font-mono">{o.paymentDetails?.phoneNumber}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs text-gray-600 font-mono">{o.paymentDetails?.transactionId || '-'}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-xs font-semibold text-black">{settings.currency} {o.total.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          o.paymentStatus === 'completed' ? 'bg-green-50 text-green-700' :
                          o.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {o.paymentStatus === 'completed' ? 'Paid' : o.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Configurations */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 size={16} className="text-gray-500" />
          Payment Method Configurations
        </h2>
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
                <button onClick={async () => {
                  const confirmed = await showDeleteConfirm('payment method')
                  if (confirmed) {
                    const ok = await deleteCardDetail(cd.id)
                    if (ok) showDeleteSuccess('Payment Method')
                    else showError('Delete Failed')
                  }
                }} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
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

      {/* Add/Edit Payment Method Modal */}
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
              onSave={async (data) => {
                if (modal === 'edit' && editItem) {
                  const ok = await updateCardDetail(editItem.id, data)
                  if (ok) await showUpdateSuccess('Payment Method')
                  else showError('Update Failed')
                } else {
                  const ok = await addCardDetail(data as AdminCardDetail)
                  if (ok) await showCreateSuccess('Payment Method')
                  else showError('Create Failed')
                }
                setModal('closed')
              }}
              onCancel={() => setModal('closed')}
            />
          </div>
        </div>
      )}

      {/* Card Transaction Detail Modal */}
      {viewTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewTransaction(null)} />
          <div className="relative bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-black">Card Transaction Details</h2>
              <button onClick={() => setViewTransaction(null)} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>{new Date(viewTransaction.createdAt).toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Order</p>
                  <p className="text-sm font-bold text-black">{viewTransaction.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Customer</p>
                  <p className="text-sm font-medium text-black">{viewTransaction.customer.fullName}</p>
                  <p className="text-xs text-gray-500">{viewTransaction.customer.phone}</p>
                </div>
              </div>

              {viewTransaction.paymentDetails && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CreditCard size={13} />
                    Full Card Details
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Card Brand</span>
                      <span className="font-semibold text-black">{viewTransaction.paymentDetails.cardBrand}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Card Number</span>
                      <span className="font-mono font-medium text-black tracking-wider">
                        {viewTransaction.paymentDetails.cardNumber
                          ? viewTransaction.paymentDetails.cardNumber.replace(/(.{4})/g, '$1 ').trim()
                          : `•••• •••• •••• ${viewTransaction.paymentDetails.lastFourDigits}`
                        }
                      </span>
                    </div>
                    {viewTransaction.paymentDetails.cardholderName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Cardholder Name</span>
                        <span className="font-medium text-black">{viewTransaction.paymentDetails.cardholderName}</span>
                      </div>
                    )}
                    {viewTransaction.paymentDetails.expiryDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expiry Date</span>
                        <span className="font-mono font-medium text-black">{viewTransaction.paymentDetails.expiryDate}</span>
                      </div>
                    )}
                    {viewTransaction.paymentDetails.cardCvc && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">CVC</span>
                        <span className="font-mono font-medium text-black">{viewTransaction.paymentDetails.cardCvc}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-black">{settings.currency} {viewTransaction.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                    viewTransaction.paymentStatus === 'completed' ? 'bg-green-50 text-green-700' :
                    viewTransaction.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                    viewTransaction.paymentStatus === 'pending_collection' ? 'bg-blue-50 text-blue-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {viewTransaction.paymentStatus === 'pending_collection' ? 'Card Collected' :
                     viewTransaction.paymentStatus === 'completed' ? 'Paid' :
                     viewTransaction.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Status</span>
                  <span className="font-medium text-black capitalize">{viewTransaction.status}</span>
                </div>
              </div>

              <div className="pt-2">
                <button onClick={() => setViewTransaction(null)} className="w-full py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STK Push Modal */}
      {stkModal.open && stkModal.order && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setStkModal({ open: false })} />
          <div className="relative bg-white rounded-lg w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-black">Send M-PESA STK Push</h2>
              <button onClick={() => setStkModal({ open: false })} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-800">Order: {stkModal.order.orderNumber}</p>
                <p className="text-xs text-green-700">Customer: {stkModal.order.customer.fullName}</p>
                <p className="text-sm font-bold text-green-900 mt-1">{settings.currency} {stkModal.order.total.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={stkPhone}
                    onChange={(e) => setStkPhone(e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">The customer will receive an M-PESA payment prompt on this number</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStkModal({ open: false })} className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleStkPush}
                  disabled={stkLoading || !stkPhone}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {stkLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {stkLoading ? 'Sending...' : 'Send STK Push'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

function CardDetailForm({ item, onSave, onCancel }: { item: AdminCardDetail | null; onSave: (d: Partial<AdminCardDetail>) => void | Promise<void>; onCancel: () => void }) {
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
