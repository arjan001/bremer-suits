import { createFileRoute, Link } from '@tanstack/react-router'
import { X, Minus, Plus, CreditCard, Phone, MessageCircle, Lock, ShieldCheck, ChevronRight, Package, MapPin, Wallet, CheckCircle, Truck, Copy, Clock, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { PaymentModal } from '@/components/PaymentModal'
import { saveOrder, type CardPaymentDetails, type MpesaPaymentDetails, type StoredOrder } from '@/lib/order-store'
import { ordersApi } from '@/lib/admin-api'
import { VisaLogo, MastercardLogo, MpesaLogo, VisaBadge, MastercardBadge, MpesaBadge } from '@/components/PaymentLogos'

export const Route = createFileRoute('/checkout')({
  head: () => ({
    meta: [
      { title: 'Checkout | Bremer Suits' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: Checkout,
})

const deliveryLocations = [
  'Select delivery location',
  'Downtown / City Center',
  'Midtown',
  'Uptown',
  'West Side',
  'East Side',
  'North District',
  'South District',
  'Suburbs',
  'Other (specify in address)',
]

const steps = [
  { id: 1, label: 'Cart Review', icon: Package },
  { id: 2, label: 'Details', icon: MapPin },
  { id: 3, label: 'Payment', icon: Wallet },
]

function Checkout() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryLocation: '',
    deliveryAddress: '',
    orderNotes: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<StoredOrder | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card')
  const [formError, setFormError] = useState('')
  const [copiedOrderNum, setCopiedOrderNum] = useState(false)
  const [showTracking, setShowTracking] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (formError) setFormError('')
  }

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setFormError('Please enter your full name.')
      return false
    }
    if (!formData.phone.trim()) {
      setFormError('Please enter your phone number.')
      return false
    }
    if (!formData.deliveryLocation) {
      setFormError('Please select a delivery location.')
      return false
    }
    if (!formData.deliveryAddress.trim()) {
      setFormError('Please enter your delivery address.')
      return false
    }
    setFormError('')
    return true
  }

  const goToStep = (step: number) => {
    if (step === 2 && items.length === 0) return
    if (step === 3 && !validateForm()) return
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openPaymentModal = (method: 'card' | 'mpesa') => {
    if (!validateForm()) {
      setCurrentStep(2)
      return
    }
    setPaymentMethod(method)
    setPaymentModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent, method: string) => {
    e.preventDefault()
    if (!validateForm()) {
      setCurrentStep(2)
      return
    }

    if (method === 'card' || method === 'mpesa') {
      setPaymentMethod(method as 'card' | 'mpesa')
      setPaymentModalOpen(true)
      return
    }

    if (method === 'whatsapp') {
      const message = encodeURIComponent(
        `Hi, I'd like to place an order:\n\n` +
        items.map((item) => `- ${item.title} x${item.quantity} ($${(item.price * item.quantity).toLocaleString()})`).join('\n') +
        `\n\nTotal: $${subtotal.toLocaleString()}` +
        `\n\nName: ${formData.fullName}` +
        `\nPhone: ${formData.phone}` +
        `\nDelivery: ${formData.deliveryLocation}` +
        `\nAddress: ${formData.deliveryAddress}` +
        (formData.orderNotes ? `\nNotes: ${formData.orderNotes}` : ''),
      )
      window.open(`https://wa.me/?text=${message}`, '_blank')
      placeOrder('whatsapp')
      setOrderPlaced(true)
      clearCart()
    }
  }

  const placeOrder = (method: 'card' | 'mpesa' | 'whatsapp', paymentDetails?: CardPaymentDetails | MpesaPaymentDetails) => {
    // Generate order number upfront so both localStorage and API get the same one
    const orderNumber = 'BRM-' + Date.now().toString(36).toUpperCase().slice(-6)
    const orderData = {
      customer: { fullName: formData.fullName, phone: formData.phone, email: formData.email || undefined },
      delivery: { location: formData.deliveryLocation, address: formData.deliveryAddress },
      items: items.map((item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        image: item.image,
      })),
      subtotal,
      deliveryFee: 0,
      total: subtotal,
      paymentMethod: method,
      paymentDetails,
      paymentStatus: method === 'card' ? 'pending_collection' as const : method === 'mpesa' ? 'completed' as const : 'pending_processing' as const,
      status: 'pending' as const,
      orderNotes: formData.orderNotes || undefined,
    }
    // Save to localStorage and capture the full order
    const savedOrder = saveOrder(orderData, orderNumber)
    if (savedOrder) setConfirmedOrder(savedOrder)
    // Persist to Supabase via API (include order_number)
    ordersApi.create({ ...orderData, orderNumber } as unknown as Record<string, unknown>).catch((err) => {
      console.error('Failed to save order to database:', err)
    })
  }

  const handlePaymentSuccess = (paymentDetails: CardPaymentDetails | MpesaPaymentDetails) => {
    placeOrder(paymentMethod, paymentDetails)
    setPaymentModalOpen(false)
    setOrderPlaced(true)
    clearCart()
  }

  // Order Success State
  if (orderPlaced) {
    const copyOrderNumber = () => {
      if (confirmedOrder?.orderNumber) {
        navigator.clipboard.writeText(confirmedOrder.orderNumber).then(() => {
          setCopiedOrderNum(true)
          setTimeout(() => setCopiedOrderNum(false), 2000)
        })
      }
    }

    const trackingStatusSteps = [
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

    const currentStepIndex = confirmedOrder ? (statusIndex[confirmedOrder.status] ?? -1) : -1
    const isCancelled = confirmedOrder?.status === 'cancelled'

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center bg-white p-10 lg:p-14 border border-gray-100">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={36} className="text-white" />
            </div>
            <h1
              className="text-3xl lg:text-4xl font-bold text-black mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Order Confirmed
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Thank you for choosing Bremer Suits!
            </p>

            {/* Order Number */}
            {confirmedOrder && (
              <div className="bg-gray-50 border border-gray-200 p-5 mb-6 text-left">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Number</p>
                  <button
                    onClick={copyOrderNumber}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors"
                    title="Copy order number"
                  >
                    <Copy size={12} />
                    {copiedOrderNum ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xl font-bold text-black tracking-wider font-mono mb-4">{confirmedOrder.orderNumber}</p>

                <div className="space-y-2 border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700">Pending</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment</span>
                    <span className="font-medium text-black capitalize">{confirmedOrder.paymentMethod === 'mpesa' ? 'M-PESA' : confirmedOrder.paymentMethod}</span>
                  </div>
                  {confirmedOrder.paymentMethod === 'card' && confirmedOrder.paymentDetails && 'cardBrand' in confirmedOrder.paymentDetails && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Card</span>
                      <span className="font-medium text-black font-mono">
                        {confirmedOrder.paymentDetails.cardBrand} •••• {confirmedOrder.paymentDetails.lastFourDigits}
                      </span>
                    </div>
                  )}
                  {confirmedOrder.paymentMethod === 'mpesa' && confirmedOrder.paymentDetails && 'transactionId' in confirmedOrder.paymentDetails && confirmedOrder.paymentDetails.transactionId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Transaction</span>
                      <span className="font-medium text-black font-mono">{confirmedOrder.paymentDetails.transactionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-black">${confirmedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items</span>
                    <span className="font-medium text-black">{confirmedOrder.items.length} {confirmedOrder.items.length === 1 ? 'item' : 'items'}</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              We will confirm your order and arrange delivery shortly. You'll receive a confirmation via phone or email.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowTracking(!showTracking)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
              >
                <Truck size={14} />
                {showTracking ? 'Hide Tracking' : 'Track Order'}
              </button>
              <Link
                to="/collections"
                className="inline-flex items-center justify-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors duration-300 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Embedded Order Tracking */}
          {showTracking && confirmedOrder && (
            <div className="mt-6 bg-white border border-gray-100 p-6 lg:p-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-xl font-bold text-black mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Order Tracking
                  </h2>
                  <p className="text-xs text-gray-400">
                    Order <span className="font-mono font-medium text-gray-600">{confirmedOrder.orderNumber}</span>
                    {confirmedOrder.customer.email && (
                      <> &middot; <span className="text-gray-600">{confirmedOrder.customer.email}</span></>
                    )}
                  </p>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  isCancelled ? 'bg-red-50 text-red-700' :
                  confirmedOrder.status === 'delivered' ? 'bg-green-50 text-green-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {confirmedOrder.status.charAt(0).toUpperCase() + confirmedOrder.status.slice(1)}
                </span>
              </div>

              {/* Progress Tracker */}
              {!isCancelled ? (
                <div className="mb-8">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200" />
                    <div
                      className="absolute top-5 left-5 h-0.5 bg-black transition-all duration-500"
                      style={{ width: currentStepIndex >= 0 ? `${(currentStepIndex / (trackingStatusSteps.length - 1)) * (100 - (10 / trackingStatusSteps.length))}%` : '0%' }}
                    />
                    {trackingStatusSteps.map((step, idx) => {
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
                    {confirmedOrder.items.map((item, i) => (
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
                      {confirmedOrder.paymentMethod === 'card' ? <CreditCard size={14} className="text-gray-400" /> : <Phone size={14} className="text-gray-400" />}
                      <span className="text-sm font-medium text-black capitalize">{confirmedOrder.paymentMethod === 'mpesa' ? 'M-PESA' : confirmedOrder.paymentMethod}</span>
                    </div>
                    {confirmedOrder.paymentMethod === 'card' && confirmedOrder.paymentDetails && 'cardBrand' in confirmedOrder.paymentDetails && (
                      <p className="text-xs text-gray-500 font-mono">{confirmedOrder.paymentDetails.cardBrand} •••• {confirmedOrder.paymentDetails.lastFourDigits}</p>
                    )}
                    {confirmedOrder.paymentMethod === 'mpesa' && confirmedOrder.paymentDetails && 'transactionId' in confirmedOrder.paymentDetails && confirmedOrder.paymentDetails.transactionId && (
                      <p className="text-xs text-gray-500 font-mono">Txn: {confirmedOrder.paymentDetails.transactionId}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery</p>
                    <p className="text-sm text-black">{confirmedOrder.delivery.location}</p>
                    <p className="text-xs text-gray-500">{confirmedOrder.delivery.address}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-sm font-bold text-black">Order Total</span>
                  <span className="text-lg font-bold text-black">${confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-10 border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <Package size={28} className="text-gray-300" />
          </div>
          <h1
            className="text-3xl font-bold text-black mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/collections" className="hover:text-black transition-colors">Shop</Link>
            <ChevronRight size={14} />
            <span className="text-black font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => {
                    if (step.id < currentStep) goToStep(step.id)
                  }}
                  className={`flex items-center gap-2.5 ${
                    step.id < currentStep ? 'cursor-pointer' : step.id === currentStep ? '' : 'cursor-default'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm font-bold ${
                    step.id < currentStep
                      ? 'bg-black text-white'
                      : step.id === currentStep
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckCircle size={18} />
                    ) : (
                      <step.icon size={16} />
                    )}
                  </div>
                  <span className={`hidden sm:block text-xs font-semibold uppercase tracking-wider ${
                    step.id <= currentStep ? 'text-black' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    step.id < currentStep ? 'bg-black' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7">
            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
              <div className="bg-white border border-gray-100 p-6 lg:p-8">
                <h2
                  className="text-2xl font-bold text-black mb-6"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Review Your Order
                </h2>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 lg:gap-6 py-5 first:pt-0 last:pb-0">
                      <Link to="/collections/$slug" params={{ slug: item.id }} className="shrink-0">
                        <div className="w-20 h-24 lg:w-24 lg:h-28 bg-gray-50 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="text-sm font-semibold text-black leading-tight">
                              {item.title}
                            </h3>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="text-xs text-gray-400 mt-1">
                                {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}
                              </p>
                            )}
                            {item.category && (
                              <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">{item.category}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-1"
                            aria-label={`Remove ${item.title}`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          ${item.price.toLocaleString()} each
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-0 border border-gray-200 bg-gray-50">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-10 h-8 flex items-center justify-center text-xs font-semibold text-black border-x border-gray-200 bg-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-black">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to="/collections"
                    className="text-xs text-gray-500 hover:text-black transition-colors font-medium uppercase tracking-wider"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => goToStep(2)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
                  >
                    Proceed to Details
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Customer & Delivery Details */}
            {currentStep === 2 && (
              <div className="bg-white border border-gray-100 p-6 lg:p-8">
                <h2
                  className="text-2xl font-bold text-black mb-8"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Your Details
                </h2>

                {formError && (
                  <div className="p-4 bg-red-50 border border-red-100 mb-6">
                    <p className="text-sm text-red-600">{formError}</p>
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); goToStep(3) }} id="checkout-form">
                  {/* Customer Information */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-6 h-6 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">1</span>
                      Customer Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. John Kamau"
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="0793 880 642"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email <span className="text-gray-400 font-normal text-xs">(optional)</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-6 h-6 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">2</span>
                      Delivery Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Delivery Location <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="deliveryLocation"
                          value={formData.deliveryLocation}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all appearance-none"
                        >
                          {deliveryLocations.map((loc) => (
                            <option key={loc} value={loc === 'Select delivery location' ? '' : loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={handleInputChange}
                          placeholder="Building name, street, area..."
                          required
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Order Notes <span className="text-gray-400 font-normal text-xs">(optional)</span>
                        </label>
                        <textarea
                          name="orderNotes"
                          value={formData.orderNotes}
                          onChange={handleInputChange}
                          placeholder="Any special instructions for your order..."
                          rows={2}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black focus:bg-white outline-none transition-all resize-y"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="text-xs text-gray-500 hover:text-black transition-colors font-medium uppercase tracking-wider"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
                    >
                      Continue to Payment
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-white border border-gray-100 p-6 lg:p-8">
                <h2
                  className="text-2xl font-bold text-black mb-6"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Choose Payment Method
                </h2>

                {/* Order Review Summary */}
                <div className="bg-gray-50 p-5 mb-8 border border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Delivering to</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-semibold text-black">{formData.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formData.phone}</p>
                      {formData.email && <p className="text-xs text-gray-500">{formData.email}</p>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-black">{formData.deliveryLocation}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formData.deliveryAddress}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => goToStep(2)}
                    className="text-xs text-black font-medium underline mt-3 hover:no-underline"
                  >
                    Edit details
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Card Payment */}
                  <button
                    type="button"
                    onClick={() => openPaymentModal('card')}
                    className="group flex items-center w-full py-4 px-5 bg-[#1a1a1a] text-white text-sm font-semibold hover:bg-black transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <CreditCard size={20} className="shrink-0" />
                    <div className="ml-3 text-left">
                      <span className="block">Pay with Card</span>
                      <span className="block text-[10px] text-white/50 font-normal mt-0.5">Visa, Mastercard accepted</span>
                    </div>
                    <span className="ml-auto flex items-center gap-2">
                      <VisaBadge />
                      <MastercardBadge />
                    </span>
                  </button>

                  {/* M-PESA Payment */}
                  <button
                    type="button"
                    onClick={() => openPaymentModal('mpesa')}
                    className="group flex items-center w-full py-4 px-5 bg-[#4CAF50] text-white text-sm font-semibold hover:bg-[#43A047] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Phone size={20} className="shrink-0" />
                    <div className="ml-3 text-left">
                      <span className="block">Pay with M-PESA</span>
                      <span className="block text-[10px] text-white/50 font-normal mt-0.5">Instant mobile payment</span>
                    </div>
                    <span className="ml-auto">
                      <MpesaBadge />
                    </span>
                  </button>

                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>

                  {/* WhatsApp Order */}
                  <button
                    onClick={(e) => handleSubmit(e, 'whatsapp')}
                    className="group flex items-center w-full py-4 px-5 bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300"
                  >
                    <MessageCircle size={20} className="shrink-0" />
                    <div className="ml-3 text-left">
                      <span className="block">Complete via WhatsApp</span>
                      <span className="block text-[10px] text-gray-400 font-normal mt-0.5">We'll confirm your order on WhatsApp</span>
                    </div>
                    <svg viewBox="0 0 36 12" width="36" height="12" className="ml-auto" aria-label="WhatsApp">
                      <rect width="36" height="12" rx="3" fill="#25D366" />
                      <g transform="translate(3, 1) scale(0.4)">
                        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 2.4.7 4.6 1.8 6.5L0 25l6.2-1.8c1.8 1 3.9 1.6 6.1 1.6 6.9 0 12.5-5.6 12.5-12.5S19.4 0 12.5 0zm0 22.9c-2 0-3.9-.5-5.6-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4C2 16.1 1.3 14.3 1.3 12.5 1.3 6.3 6.3 1.3 12.5 1.3S23.7 6.3 23.7 12.5 18.7 22.9 12.5 22.9z" fill="#fff"/>
                      </g>
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => goToStep(2)}
                    className="text-xs text-gray-500 hover:text-black transition-colors font-medium uppercase tracking-wider"
                  >
                    Back to Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary (always visible) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-6 lg:p-8 sticky top-24">
              <h2 className="text-lg font-bold text-black mb-6 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-normal text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              </h2>

              {/* Compact Cart Items */}
              <div className="space-y-4 mb-6 max-h-[320px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-16 bg-gray-50 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-black leading-tight truncate">
                        {item.title}
                      </h3>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-semibold text-black">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-black">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-xs text-gray-400 italic">Calculated at confirmation</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-black pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5">
                    <Lock size={13} className="text-gray-400 shrink-0" />
                    <span className="text-[10px] text-gray-500 font-medium">SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5">
                    <ShieldCheck size={13} className="text-gray-400 shrink-0" />
                    <span className="text-[10px] text-gray-500 font-medium">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5">
                    <Truck size={13} className="text-gray-400 shrink-0" />
                    <span className="text-[10px] text-gray-500 font-medium">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5">
                    <CheckCircle size={13} className="text-gray-400 shrink-0" />
                    <span className="text-[10px] text-gray-500 font-medium">Quality Guarantee</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <VisaLogo size={40} />
                  <MastercardLogo size={40} />
                  <MpesaLogo size={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={subtotal}
        defaultMethod={paymentMethod}
      />
    </div>
  )
}
