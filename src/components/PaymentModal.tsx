import { useState, useEffect } from 'react'
import { X, CreditCard, Phone, Lock, CheckCircle, Loader2 } from 'lucide-react'

type PaymentMethod = 'card' | 'mpesa'
type PaymentStep = 'form' | 'processing' | 'success'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  amount: number
  defaultMethod?: PaymentMethod
}

export function PaymentModal({
  open,
  onClose,
  onSuccess,
  amount,
  defaultMethod = 'card',
}: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>(defaultMethod)
  const [step, setStep] = useState<PaymentStep>('form')

  // Sync method when modal opens with a different defaultMethod
  useEffect(() => {
    if (open) {
      setMethod(defaultMethod)
      setStep('form')
      setError('')
    }
  }, [open, defaultMethod])

  // Card form state
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')

  // M-Pesa form state
  const [mpesaPhone, setMpesaPhone] = useState('')

  const [error, setError] = useState('')

  if (!open) return null

  const resetForm = () => {
    setCardNumber('')
    setCardExpiry('')
    setCardCvc('')
    setCardName('')
    setMpesaPhone('')
    setError('')
    setStep('form')
  }

  const handleClose = () => {
    if (step === 'processing') return
    resetForm()
    onClose()
  }

  const handleMethodSwitch = (m: PaymentMethod) => {
    setMethod(m)
    setError('')
  }

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
  }

  const formatMpesaPhone = (value: string) => {
    return value.replace(/[^\d+]/g, '').slice(0, 13)
  }

  const detectCardBrand = (number: string): string => {
    const digits = number.replace(/\s/g, '')
    if (digits.startsWith('4')) return 'VISA'
    if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'MC'
    return ''
  }

  const validateCardForm = (): boolean => {
    const digits = cardNumber.replace(/\s/g, '')
    if (digits.length < 16) {
      setError('Please enter a valid 16-digit card number')
      return false
    }
    if (cardExpiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY)')
      return false
    }
    const [monthStr, yearStr] = cardExpiry.split('/')
    const month = parseInt(monthStr, 10)
    if (month < 1 || month > 12) {
      setError('Invalid expiry month')
      return false
    }
    const year = parseInt(yearStr, 10) + 2000
    const now = new Date()
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
      setError('Card has expired')
      return false
    }
    if (cardCvc.length < 3) {
      setError('Please enter a valid CVC')
      return false
    }
    if (cardName.trim().length < 2) {
      setError('Please enter the cardholder name')
      return false
    }
    setError('')
    return true
  }

  const validateMpesaForm = (): boolean => {
    const phone = mpesaPhone.replace(/\s/g, '')
    if (!/^(\+?254|0)\d{9}$/.test(phone)) {
      setError('Enter a valid Safaricom number (e.g. 0712345678)')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (method === 'card' && !validateCardForm()) return
    if (method === 'mpesa' && !validateMpesaForm()) return

    setStep('processing')

    // Simulate payment processing
    setTimeout(() => {
      setStep('success')
    }, 3000)
  }

  const handleDone = () => {
    resetForm()
    onSuccess()
  }

  const cardBrand = detectCardBrand(cardNumber)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 rounded-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step === 'form' && (
              <Lock size={14} className="text-gray-400" />
            )}
            <h2
              className="text-lg font-bold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {step === 'success' ? 'Payment Successful' : 'Secure Payment'}
            </h2>
          </div>
          {step !== 'processing' && (
            <button
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-black transition-colors"
              aria-label="Close payment modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Amount Display */}
        {step === 'form' && (
          <div className="px-6 pt-5 pb-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Amount Due</p>
            <p className="text-2xl font-bold text-black mt-1">
              KSh {amount.toLocaleString()}
            </p>
          </div>
        )}

        {/* Payment Method Tabs */}
        {step === 'form' && (
          <div className="px-6 pt-2 pb-4">
            <div className="flex border border-gray-200 rounded-sm overflow-hidden">
              <button
                onClick={() => handleMethodSwitch('card')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors duration-200 ${
                  method === 'card'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <CreditCard size={16} />
                Card
                <span className="flex items-center gap-0.5 ml-1">
                  <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${
                    method === 'card' ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    VISA
                  </span>
                  <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${
                    method === 'card' ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    MC
                  </span>
                </span>
              </button>
              <button
                onClick={() => handleMethodSwitch('mpesa')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors duration-200 ${
                  method === 'mpesa'
                    ? 'bg-[#4CAF50] text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Phone size={16} />
                M-PESA
              </button>
            </div>
          </div>
        )}

        {/* Form Content */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="px-6 pb-6">
            {method === 'card' ? (
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors pr-16"
                    />
                    {cardBrand && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {cardBrand}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">
                      CVC
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* M-Pesa Info */}
                <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-sm p-4">
                  <p className="text-sm text-[#2E7D32] leading-relaxed">
                    An STK push will be sent to your Safaricom number. Enter your M-PESA PIN on your phone to complete the payment.
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5">
                    Safaricom Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(formatMpesaPhone(e.target.value))}
                      placeholder="0712 345 678"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors pl-12"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      <Phone size={16} />
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Ensure the number is registered for M-PESA
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-sm">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full mt-5 py-3.5 text-white text-sm font-semibold rounded-sm transition-colors duration-300 flex items-center justify-center gap-2 ${
                method === 'card'
                  ? 'bg-[#1a1a1a] hover:bg-black'
                  : 'bg-[#4CAF50] hover:bg-[#43A047]'
              }`}
            >
              <Lock size={14} />
              {method === 'card'
                ? `Pay KSh ${amount.toLocaleString()} with Card`
                : `Pay KSh ${amount.toLocaleString()} via M-PESA`
              }
            </button>

            {/* Security Notice */}
            <p className="text-[11px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <Lock size={10} />
              Secured with 256-bit SSL encryption
            </p>
          </form>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div className="px-6 py-12 flex flex-col items-center text-center">
            {method === 'card' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                  <Loader2 size={28} className="text-black animate-spin" />
                </div>
                <h3
                  className="text-lg font-bold text-black mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Processing Payment
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  Please wait while we securely process your card payment of{' '}
                  <span className="font-semibold text-black">KSh {amount.toLocaleString()}</span>.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-5">
                  <Loader2 size={28} className="text-[#4CAF50] animate-spin" />
                </div>
                <h3
                  className="text-lg font-bold text-black mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Check Your Phone
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  An M-PESA STK push has been sent to{' '}
                  <span className="font-semibold text-black">{mpesaPhone}</span>.
                  Enter your M-PESA PIN to complete the payment.
                </p>
                <div className="mt-5 px-4 py-2.5 bg-[#E8F5E9] border border-[#C8E6C9] rounded-sm">
                  <p className="text-xs text-[#2E7D32] font-medium">
                    Amount: KSh {amount.toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="px-6 py-12 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
              method === 'card' ? 'bg-black' : 'bg-[#4CAF50]'
            }`}>
              <CheckCircle size={28} className="text-white" />
            </div>
            <h3
              className="text-xl font-bold text-black mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Payment Confirmed
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-2">
              Your payment of{' '}
              <span className="font-semibold text-black">KSh {amount.toLocaleString()}</span>
              {' '}has been successfully processed{method === 'mpesa' ? ' via M-PESA' : ''}.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              A confirmation will be sent to you shortly.
            </p>
            <button
              onClick={handleDone}
              className="px-10 py-3.5 bg-black text-white text-sm font-semibold rounded-sm hover:bg-gray-800 transition-colors duration-300 tracking-wide"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
