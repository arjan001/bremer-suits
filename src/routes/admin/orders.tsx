import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Eye, X, ShoppingCart, Truck, XCircle, Clock, Package, CreditCard, Phone, Plus, Trash2 } from 'lucide-react'
import { useAdmin, type AdminOrder } from '@/lib/admin-store'

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrders,
})

const statusOptions = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-purple-50 text-purple-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

function AdminOrders() {
  const { orders, addOrder, updateOrder, deleteOrder, products, settings } = useAdmin()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewOrder, setViewOrder] = useState<AdminOrder | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  // Create order form state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'whatsapp'>('mpesa')
  const [orderNotes, setOrderNotes] = useState('')
  const [orderItems, setOrderItems] = useState<{ productId: string; title: string; price: number; quantity: number; image: string; selectedColor?: string; selectedSize?: string }[]>([])

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const handleStatusChange = (id: string, status: AdminOrder['status']) => {
    updateOrder(id, { status })
    if (viewOrder?.id === id) setViewOrder({ ...viewOrder, status })
  }

  const resetCreateForm = () => {
    setCustomerName(''); setCustomerPhone(''); setCustomerEmail('')
    setDeliveryLocation(''); setDeliveryAddress('')
    setPaymentMethod('mpesa'); setOrderNotes(''); setOrderItems([])
  }

  const addProductToOrder = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    const existing = orderItems.find((i) => i.productId === productId)
    if (existing) {
      setOrderItems(orderItems.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setOrderItems([...orderItems, { productId: product.id, title: product.title, price: product.numericPrice, quantity: 1, image: product.image }])
    }
  }

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderItems.length === 0) return
    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const deliveryFee = settings.deliveryFee || 0
    addOrder({
      customer: { fullName: customerName, phone: customerPhone, email: customerEmail || undefined },
      delivery: { location: deliveryLocation, address: deliveryAddress },
      items: orderItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod,
      status: 'pending',
      orderNotes: orderNotes || undefined,
    })
    resetCreateForm()
    setShowCreate(false)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={16} /> Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black outline-none">
          {statusOptions.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-black">{o.orderNumber}</p>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-gray-700">{o.customer.fullName}</p>
                    <p className="text-xs text-gray-400">{o.customer.phone}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs font-semibold uppercase">{o.paymentMethod}</span>
                    {o.paymentMethod === 'card' && o.paymentDetails?.lastFourDigits && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{o.paymentDetails.cardBrand} •••• {o.paymentDetails.lastFourDigits}</p>
                    )}
                    {o.paymentMethod === 'mpesa' && o.paymentDetails?.transactionId && (
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{o.paymentDetails.transactionId}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-black">{settings.currency} {o.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as AdminOrder['status'])}
                      className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer ${statusColors[o.status] || 'bg-gray-100 text-gray-500'}`}
                    >
                      {statusOptions.filter((s) => s !== 'all').map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewOrder(o)} className="p-1.5 text-gray-400 hover:text-black transition-colors" title="View">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => setDeleteConfirm(o.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <XCircle size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 text-gray-300" />
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-black">Create Manual Order</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Customer Name *</label>
                  <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Phone *</label>
                  <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Email</label>
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Delivery Location *</label>
                  <input value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Address *</label>
                  <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'mpesa' | 'whatsapp')} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none">
                  <option value="mpesa">M-PESA</option>
                  <option value="card">Card</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              {/* Add Products */}
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Add Products *</label>
                {products.length > 0 ? (
                  <select onChange={(e) => { if (e.target.value) addProductToOrder(e.target.value); e.target.value = '' }} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none" defaultValue="">
                    <option value="">Select a product to add...</option>
                    {products.filter((p) => p.status === 'active').map((p) => (
                      <option key={p.id} value={p.id}>{p.title} — {p.price}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-400 py-2">No products available. Add products first.</p>
                )}
                {orderItems.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-black truncate">{item.title}</p>
                          <p className="text-xs text-gray-400">{settings.currency} {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setOrderItems(orderItems.map((i) => i.productId === item.productId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs">-</button>
                          <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => setOrderItems(orderItems.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i))} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs">+</button>
                        </div>
                        <button type="button" onClick={() => setOrderItems(orderItems.filter((i) => i.productId !== item.productId))} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
                      <span>Subtotal</span>
                      <span>{settings.currency} {orderItems.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-1">Order Notes</label>
                <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none resize-y" />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => { resetCreateForm(); setShowCreate(false) }} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
                <button type="submit" disabled={orderItems.length === 0} className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewOrder(null)} />
          <div className="relative bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-black">Order {viewOrder.orderNumber}</h2>
              <button onClick={() => setViewOrder(null)} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm text-gray-500">{new Date(viewOrder.createdAt).toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Customer</p>
                  <p className="text-sm font-medium text-black">{viewOrder.customer.fullName}</p>
                  <p className="text-xs text-gray-500">{viewOrder.customer.phone}</p>
                  {viewOrder.customer.email && <p className="text-xs text-gray-500">{viewOrder.customer.email}</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Delivery</p>
                  <div className="flex items-start gap-1.5">
                    <Truck size={14} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-black">{viewOrder.delivery.location}</p>
                      <p className="text-xs text-gray-500">{viewOrder.delivery.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Items</p>
                <div className="space-y-2">
                  {viewOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{item.title}</p>
                        <p className="text-xs text-gray-400">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')} x{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-black">{settings.currency} {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{settings.currency} {viewOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium">{settings.currency} {viewOrder.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{settings.currency} {viewOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-gray-400" />
                  <span className="text-xs font-semibold uppercase">{viewOrder.paymentMethod}</span>
                </div>
                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[viewOrder.status]}`}>
                  {viewOrder.status}
                </span>
                {viewOrder.paymentStatus && (
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                    viewOrder.paymentStatus === 'completed' ? 'bg-green-50 text-green-700' :
                    viewOrder.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {viewOrder.paymentStatus === 'pending_collection' ? 'Card Collected' :
                     viewOrder.paymentStatus === 'pending_processing' ? 'Pending' :
                     viewOrder.paymentStatus === 'completed' ? 'Paid' : 'Failed'}
                  </span>
                )}
              </div>

              {/* Payment Details */}
              {viewOrder.paymentDetails && (
                <div className={`p-4 rounded-lg border ${
                  viewOrder.paymentMethod === 'mpesa' ? 'bg-green-50 border-green-100' :
                  viewOrder.paymentMethod === 'card' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'
                }`}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: viewOrder.paymentMethod === 'mpesa' ? '#2E7D32' : viewOrder.paymentMethod === 'card' ? '#1565C0' : '#666' }}>
                    {viewOrder.paymentMethod === 'card' && <CreditCard size={13} />}
                    {viewOrder.paymentMethod === 'mpesa' && <Phone size={13} />}
                    Payment Details
                  </p>
                  {viewOrder.paymentMethod === 'card' && viewOrder.paymentDetails.lastFourDigits && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Card</span>
                        <span className="font-medium text-black">{viewOrder.paymentDetails.cardBrand} •••• {viewOrder.paymentDetails.lastFourDigits}</span>
                      </div>
                      {viewOrder.paymentDetails.cardholderName && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Cardholder</span>
                          <span className="font-medium text-black">{viewOrder.paymentDetails.cardholderName}</span>
                        </div>
                      )}
                      {viewOrder.paymentDetails.expiryDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expiry</span>
                          <span className="font-medium text-black">{viewOrder.paymentDetails.expiryDate}</span>
                        </div>
                      )}
                      <p className="text-xs text-amber-600 mt-2 font-medium">Card details collected — awaiting manual processing</p>
                    </div>
                  )}
                  {viewOrder.paymentMethod === 'mpesa' && viewOrder.paymentDetails.phoneNumber && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Phone</span>
                        <span className="font-medium text-black">{viewOrder.paymentDetails.phoneNumber}</span>
                      </div>
                      {viewOrder.paymentDetails.transactionId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Transaction ID</span>
                          <span className="font-mono font-medium text-black">{viewOrder.paymentDetails.transactionId}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {viewOrder.orderNotes && (
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <p className="text-xs font-semibold text-yellow-800 mb-1">Order Notes</p>
                  <p className="text-sm text-yellow-700">{viewOrder.orderNotes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <select
                  value={viewOrder.status}
                  onChange={(e) => handleStatusChange(viewOrder.id, e.target.value as AdminOrder['status'])}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black outline-none"
                >
                  {statusOptions.filter((s) => s !== 'all').map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button onClick={() => setViewOrder(null)} className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-black mb-2">Delete Order</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this order?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={() => { deleteOrder(deleteConfirm); setDeleteConfirm(null) }} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
