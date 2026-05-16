import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { CreditCard, Phone, Shield, CheckCircle, XCircle, Loader2, Lock, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/pay')({
  head: () => ({
    meta: [
      { title: 'Pay for Your Order | Bremer Suits' },
      { name: 'description', content: 'Secure payment for your Bremer Suits order. Pay with card or M-PESA.' },
    ],
  }),
  component: PaymentPage,
})

const BASE = '/.netlify/functions'

type PaymentMethod = 'card' | 'mpesa'
type PaymentStep = 'form' | 'processing' | 'success' | 'error'

interface OrderInfo {
  id: string
  order_number: string
  customer_full_name: string
  customer_phone: string
  customer_email: string
  total: number
  payment_method: string
  payment_status: string
  status: string
}

function PaymentPage() {
  const [orderRef, setOrderRef] = useState('')
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('card')
  const [step, setStep] = useState<PaymentStep>('form')
  const [resultMessage, setResultMessage] = useState('')

  // Card form
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  // M-PESA form
  const [mpesaPhone, setMpesaPhone] = useState('')

  const lookupOrder = async (ref?: string) => {
    const num = ref || orderRef.trim()
    if (!num) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`${BASE}/customer-payments?action=order&order_number=${encodeURIComponent(num)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order not found')
      setOrder(data)
      if (data.customer_phone) setMpesaPhone(data.customer_phone)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const o = params.get('order')
      if (o) {
        setOrderRef(o)
        lookupOrder(o)
      }
    }
  }, [])

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  const detectBrand = (num: string): string => {
    const d = num.replace(/\s/g, '')
    if (/^4/.test(d)) return 'Visa'
    if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'Mastercard'
    if (/^3[47]/.test(d)) return 'Amex'
    return ''
  }

  const handleCardPay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return
    setStep('processing')
    try {
      const res = await fetch(`${BASE}/customer-payments?action=pay-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: order.order_number,
          cardholder_name: cardName,
          card_number: cardNumber.replace(/\s/g, ''),
          expiry_date: expiry,
          card_cvc: cvc,
          card_brand: detectBrand(cardNumber),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')
      setResultMessage(data.message || 'Card details submitted successfully!')
      setStep('success')
    } catch (err) {
      setResultMessage(err instanceof Error ? err.message : 'Payment failed')
      setStep('error')
    }
  }

  const handleMpesaPay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return
    setStep('processing')
    try {
      const res = await fetch(`${BASE}/customer-payments?action=pay-mpesa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: order.order_number,
          phone_number: mpesaPhone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')
      setResultMessage(data.message || 'Check your phone for the M-PESA payment prompt.')
      setStep('success')
    } catch (err) {
      setResultMessage(err instanceof Error ? err.message : 'Failed to initiate payment')
      setStep('error')
    }
  }

  if (order?.payment_status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Already Paid</h1>
          <p className="text-gray-600">This order has already been paid. Thank you!</p>
          <p className="text-sm text-gray-400 mt-2">Order: {order.order_number}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-4 px-6">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </a>
          <h1 className="text-lg font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            BREMER SUITS
          </h1>
          <Lock size={16} className="text-green-400" />
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 pt-8">
        {/* Order Lookup */}
        {!order && step === 'form' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-white text-center">
              <Shield size={32} className="mx-auto mb-3 text-green-400" />
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Secure Payment</h2>
              <p className="text-sm text-gray-300 mt-1">Enter your order number to proceed</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5">Order Number</label>
                  <input
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value.toUpperCase())}
                    placeholder="e.g. BRM-ABC123"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-mono focus:border-black focus:ring-0 outline-none transition-colors"
                  />
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <button
                  onClick={() => lookupOrder()}
                  disabled={loading || !orderRef.trim()}
                  className="w-full py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Looking up...' : 'Find My Order'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {order && step === 'form' && (
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Order</span>
                <span className="text-sm font-bold text-black font-mono">{order.order_number}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Customer</span>
                <span className="text-sm font-medium text-black">{order.customer_full_name}</span>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-black">Total</span>
                <span className="text-xl font-bold text-black">KES {Number(order.total).toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors border-b-2 ${
                    method === 'card' ? 'text-black border-black' : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  <CreditCard size={16} /> Card Payment
                </button>
                <button
                  onClick={() => setMethod('mpesa')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors border-b-2 ${
                    method === 'mpesa' ? 'text-green-700 border-green-600' : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  <Phone size={16} /> M-PESA
                </button>
              </div>

              <div className="p-6">
                {method === 'card' && (
                  <form onSubmit={handleCardPay} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1.5">Cardholder Name</label>
                      <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1.5">Card Number</label>
                      <div className="relative">
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          required
                          maxLength={19}
                          inputMode="numeric"
                          className="w-full px-4 py-3 pr-16 border-2 border-gray-200 rounded-xl text-sm font-mono focus:border-black focus:ring-0 outline-none transition-colors"
                        />
                        {detectBrand(cardNumber) && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                            {detectBrand(cardNumber)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-1.5">Expiry Date</label>
                        <input
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          required
                          maxLength={5}
                          inputMode="numeric"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-mono focus:border-black focus:ring-0 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-1.5">CVC</label>
                        <input
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          required
                          maxLength={4}
                          inputMode="numeric"
                          type="password"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-mono focus:border-black focus:ring-0 outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock size={14} />
                      Pay KES {Number(order.total).toLocaleString()}
                    </button>
                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                      <Shield size={12} /> Your card details are transmitted securely
                    </p>
                  </form>
                )}

                {method === 'mpesa' && (
                  <form onSubmit={handleMpesaPay} className="space-y-4">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                      <Phone size={24} className="mx-auto text-green-600 mb-2" />
                      <p className="text-sm text-green-800 font-medium">Pay via M-PESA Lipa na M-PESA</p>
                      <p className="text-xs text-green-600 mt-1">You will receive an STK push prompt on your phone</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1.5">M-PESA Phone Number</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          placeholder="e.g. 0712345678"
                          required
                          type="tel"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-600 focus:ring-0 outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone size={14} />
                      Pay KES {Number(order.total).toLocaleString()} with M-PESA
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Loader2 size={48} className="mx-auto text-black animate-spin mb-4" />
            <h2 className="text-xl font-bold text-black mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Processing Payment
            </h2>
            <p className="text-gray-500 text-sm">
              {method === 'mpesa' ? 'Sending M-PESA prompt to your phone...' : 'Submitting your card details securely...'}
            </p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-black mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {method === 'mpesa' ? 'STK Push Sent!' : 'Card Details Submitted!'}
            </h2>
            <p className="text-gray-600 text-sm mb-6">{resultMessage}</p>
            {method === 'mpesa' && (
              <p className="text-xs text-gray-400 mb-4">Check your phone and enter your M-PESA PIN to complete the payment.</p>
            )}
            <div className="space-y-2">
              <button
                onClick={() => { setStep('form'); setOrder(null); setOrderRef(''); setCardName(''); setCardNumber(''); setExpiry(''); setCvc('') }}
                className="w-full py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Pay Another Order
              </button>
              <a href="/" className="block w-full py-3 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Return to Home
              </a>
            </div>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-black mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Payment Failed</h2>
            <p className="text-gray-600 text-sm mb-6">{resultMessage}</p>
            <button
              onClick={() => setStep('form')}
              className="w-full py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-6 text-center pb-8">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Lock size={10} /> Secure checkout powered by Bremer Suits
          </p>
        </div>
      </div>
    </div>
  )
}
