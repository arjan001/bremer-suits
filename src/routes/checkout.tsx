import { createFileRoute, Link } from '@tanstack/react-router'
import { X, Minus, Plus, CreditCard, Phone, MessageCircle, Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { PaymentModal } from '@/components/PaymentModal'
import { saveOrder, type CardPaymentDetails, type MpesaPaymentDetails } from '@/lib/order-store'
import { VisaLogo, MastercardLogo, MpesaLogo, VisaBadge, MastercardBadge, MpesaBadge } from '@/components/PaymentLogos'

export const Route = createFileRoute('/checkout')({
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

function Checkout() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deliveryLocation: '',
    deliveryAddress: '',
    orderNotes: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card')
  const [formError, setFormError] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validateForm = (): boolean => {
    if (!formData.fullName || !formData.phone || !formData.deliveryLocation || !formData.deliveryAddress) {
      setFormError('Please fill in all required fields before proceeding to payment.')
      return false
    }
    setFormError('')
    return true
  }

  const openPaymentModal = (method: 'card' | 'mpesa') => {
    if (!validateForm()) return
    setPaymentMethod(method)
    setPaymentModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent, method: string) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.deliveryLocation || !formData.deliveryAddress) {
      setFormError('Please fill in all required fields before proceeding to payment.')
      return
    }
    setFormError('')

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
    saveOrder({
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
      paymentStatus: method === 'card' ? 'pending_collection' : method === 'mpesa' ? 'completed' : 'pending_processing',
      status: 'pending',
      orderNotes: formData.orderNotes || undefined,
    })
  }

  const handlePaymentSuccess = (paymentDetails: CardPaymentDetails | MpesaPaymentDetails) => {
    placeOrder(paymentMethod, paymentDetails)
    setPaymentModalOpen(false)
    setOrderPlaced(true)
    clearCart()
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold text-black mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Order Placed
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Thank you for your order! We will confirm your order and arrange delivery shortly. You'll receive a confirmation via phone or email.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
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
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-black font-medium">Checkout</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h1
          className="text-3xl lg:text-4xl font-bold text-black mb-10"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left Column - Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={(e) => handleSubmit(e, 'card')}
              id="checkout-form"
            >
              {/* Customer Information */}
              <div className="mb-10">
                <h2 className="text-lg font-bold text-black mb-5">Customer Information</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 000-0000"
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Email <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="mb-10">
                <h2 className="text-lg font-bold text-black mb-5">Delivery</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Delivery Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="deliveryLocation"
                      value={formData.deliveryLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors appearance-none"
                    >
                      {deliveryLocations.map((loc) => (
                        <option key={loc} value={loc === 'Select delivery location' ? '' : loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1.5">Please select a delivery location to proceed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="Building name, street, area..."
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Order Notes <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-y"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 border border-gray-100 p-6 lg:p-8 sticky top-24">
              <h2 className="text-lg font-bold text-black mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-5 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-black leading-tight">
                            {item.title}
                          </h3>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-0.5">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-black whitespace-nowrap">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-black transition-colors shrink-0"
                            aria-label={`Remove ${item.title}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-0 mt-2 border border-gray-200 w-fit bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-medium text-black border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-black">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-gray-400">&mdash;</span>
                </div>
                <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock size={13} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Secure Payment</span>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg mb-4">
                    <p className="text-sm text-red-600">{formError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Card Payment */}
                  <button
                    type="button"
                    onClick={() => openPaymentModal('card')}
                    className="group flex items-center w-full py-3.5 px-4 bg-[#1a1a1a] text-white text-sm font-semibold rounded-lg hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <CreditCard size={18} className="shrink-0" />
                    <span className="ml-2.5">Pay with Card</span>
                    <span className="ml-auto flex items-center gap-1.5">
                      <VisaBadge />
                      <MastercardBadge />
                    </span>
                  </button>

                  {/* M-PESA Payment */}
                  <button
                    type="button"
                    onClick={() => openPaymentModal('mpesa')}
                    className="group flex items-center w-full py-3.5 px-4 bg-[#4CAF50] text-white text-sm font-semibold rounded-lg hover:bg-[#43A047] transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Phone size={18} className="shrink-0" />
                    <span className="ml-2.5">Pay with M-PESA</span>
                    <span className="ml-auto">
                      <MpesaBadge />
                    </span>
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>

                  {/* WhatsApp Order */}
                  <button
                    onClick={(e) => handleSubmit(e, 'whatsapp')}
                    className="group flex items-center w-full py-3.5 px-4 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300"
                  >
                    <MessageCircle size={18} className="shrink-0" />
                    <span className="ml-2.5">Complete via WhatsApp</span>
                    <svg viewBox="0 0 36 12" width="36" height="12" className="ml-auto" aria-label="WhatsApp">
                      <rect width="36" height="12" rx="3" fill="#25D366" />
                      <g transform="translate(3, 1) scale(0.4)">
                        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 2.4.7 4.6 1.8 6.5L0 25l6.2-1.8c1.8 1 3.9 1.6 6.1 1.6 6.9 0 12.5-5.6 12.5-12.5S19.4 0 12.5 0zm0 22.9c-2 0-3.9-.5-5.6-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4C2 16.1 1.3 14.3 1.3 12.5 1.3 6.3 6.3 1.3 12.5 1.3S23.7 6.3 23.7 12.5 18.7 22.9 12.5 22.9z" fill="#fff"/>
                      </g>
                    </svg>
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Lock size={11} className="text-gray-300" />
                      <span className="text-[10px] text-gray-400">SSL Encrypted</span>
                    </div>
                    <div className="w-px h-3 bg-gray-200" />
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={11} className="text-gray-300" />
                      <span className="text-[10px] text-gray-400">Secure Checkout</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <VisaLogo size={40} />
                    <MastercardLogo size={40} />
                    <MpesaLogo size={40} />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-3">
                    We will confirm your order and arrange delivery
                  </p>
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
