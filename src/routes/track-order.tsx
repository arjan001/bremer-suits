import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Phone, ChevronRight, Copy, XCircle } from 'lucide-react'
import { getOrderByNumber, type StoredOrder } from '@/lib/order-store'

export const Route = createFileRoute('/track-order')({
  validateSearch: (search: Record<string, unknown>) => ({
    orderNumber: (search.orderNumber as string) || '',
  }),
  component: TrackOrder,
})

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin },
] as const

const statusIndex: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
}

function TrackOrder() {
  const { orderNumber: initialOrderNumber } = Route.useSearch()
  const [searchInput, setSearchInput] = useState(initialOrderNumber)
  const [order, setOrder] = useState<StoredOrder | null>(null)
  const [searched, setSearched] = useState(false)
  const [copiedOrderNum, setCopiedOrderNum] = useState(false)

  useEffect(() => {
    if (initialOrderNumber) {
      const found = getOrderByNumber(initialOrderNumber)
      if (found) setOrder(found)
      setSearched(true)
    }
  }, [initialOrderNumber])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    const found = getOrderByNumber(searchInput.trim())
    setOrder(found || null)
    setSearched(true)
  }

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber).then(() => {
        setCopiedOrderNum(true)
        setTimeout(() => setCopiedOrderNum(false), 2000)
      })
    }
  }

  const currentStepIndex = order ? (statusIndex[order.status] ?? -1) : -1
  const isCancelled = order?.status === 'cancelled'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-black font-medium">Track Order</span>
          </nav>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="text-center mb-10">
          <h1
            className="text-3xl lg:text-4xl font-bold text-black mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Track Your Order
          </h1>
          <p className="text-gray-500 text-sm">Enter your order number to check the status of your order.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter order number (e.g. BRM-XXXXXX)"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-black text-white text-xs tracking-[0.15em] uppercase font-semibold hover:bg-gray-800 transition-colors"
          >
            Track
          </button>
        </form>

        {/* Order Found */}
        {order && (
          <div className="bg-white border border-gray-100 p-6 lg:p-8">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-black font-mono">{order.orderNumber}</h2>
                  <button onClick={copyOrderNumber} className="p-1 text-gray-300 hover:text-black transition-colors" title="Copy">
                    <Copy size={14} />
                  </button>
                  {copiedOrderNum && <span className="text-xs text-green-600">Copied!</span>}
                </div>
                <p className="text-xs text-gray-400 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                isCancelled ? 'bg-red-50 text-red-700' :
                order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {/* Progress Tracker */}
            {!isCancelled ? (
              <div className="mb-8">
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200" />
                  <div
                    className="absolute top-5 left-5 h-0.5 bg-black transition-all duration-500"
                    style={{ width: currentStepIndex >= 0 ? `${(currentStepIndex / (statusSteps.length - 1)) * (100 - (10 / statusSteps.length))}%` : '0%' }}
                  />

                  {statusSteps.map((step, idx) => {
                    const isCompleted = currentStepIndex >= idx
                    const isCurrent = currentStepIndex === idx
                    const StepIcon = step.icon
                    return (
                      <div key={step.key} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-black text-white'
                            : 'bg-white border-2 border-gray-200 text-gray-300'
                        } ${isCurrent ? 'ring-4 ring-black/10' : ''}`}>
                          <StepIcon size={16} />
                        </div>
                        <span className={`text-[10px] mt-2 font-semibold uppercase tracking-wider ${
                          isCompleted ? 'text-black' : 'text-gray-300'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 flex items-center gap-3">
                <XCircle size={20} className="text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
                  <p className="text-xs text-red-500 mt-0.5">This order has been cancelled. Contact support for assistance.</p>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="space-y-5">
              {/* Items */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50">
                      <div className="w-12 h-14 bg-gray-200 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')} {item.quantity > 1 ? `x${item.quantity}` : ''}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-black">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                  <div className="flex items-center gap-2 mb-1">
                    {order.paymentMethod === 'card' ? <CreditCard size={14} className="text-gray-400" /> : <Phone size={14} className="text-gray-400" />}
                    <span className="text-sm font-medium text-black capitalize">{order.paymentMethod === 'mpesa' ? 'M-PESA' : order.paymentMethod}</span>
                  </div>
                  {order.paymentMethod === 'card' && order.paymentDetails && 'cardBrand' in order.paymentDetails && (
                    <p className="text-xs text-gray-500 font-mono">{order.paymentDetails.cardBrand} •••• {order.paymentDetails.lastFourDigits}</p>
                  )}
                  {order.paymentMethod === 'mpesa' && order.paymentDetails && 'transactionId' in order.paymentDetails && order.paymentDetails.transactionId && (
                    <p className="text-xs text-gray-500 font-mono">Txn: {order.paymentDetails.transactionId}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery</p>
                  <p className="text-sm text-black">{order.delivery.location}</p>
                  <p className="text-xs text-gray-500">{order.delivery.address}</p>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-sm font-bold text-black">Order Total</span>
                <span className="text-lg font-bold text-black">${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Not Found */}
        {searched && !order && (
          <div className="bg-white border border-gray-100 p-10 text-center">
            <Package size={40} className="mx-auto mb-4 text-gray-200" />
            <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Order Not Found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't find an order with that number. Please check the order number and try again.
            </p>
            <Link
              to="/contact"
              className="text-xs text-black font-semibold underline hover:no-underline uppercase tracking-wider"
            >
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
