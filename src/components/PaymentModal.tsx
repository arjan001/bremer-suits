import { useState, useEffect, useCallback } from 'react'
import { X, CreditCard, Phone, Lock, CheckCircle, Loader2, Shield, AlertCircle, ShieldCheck } from 'lucide-react'
import type { CardPaymentDetails, MpesaPaymentDetails } from '@/lib/order-store'
import { VisaLogo, MastercardLogo, MpesaLogo, VisaBadge, MastercardBadge, MpesaBadge, CardBrandIndicator } from '@/components/PaymentLogos'

type PaymentMethod = 'card' | 'mpesa'
type PaymentStep = 'form' | 'processing' | 'success'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (paymentDetails: CardPaymentDetails | MpesaPaymentDetails) => void
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

  // Card form state
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')

  // M-Pesa form state
  const [mpesaPhone, setMpesaPhone] = useState('+254')
  const [mpesaConfirmName, setMpesaConfirmName] = useState('')

  const [error, setError] = useState('')
  const [mpesaStep, setMpesaStep] = useState(0)
  const [cardProcessingStep, setCardProcessingStep] = useState(0)

  // Generated transaction ID for M-Pesa
  const [transactionId, setTransactionId] = useState('')

  const resetForm = useCallback(() => {
    setCardNumber('')
    setCardExpiry('')
    setCardCvc('')
    setCardName('')
    setMpesaPhone('+254')
    setMpesaConfirmName('')
    setError('')
    setStep('form')
    setMpesaStep(0)
    setCardProcessingStep(0)
    setTransactionId('')
  }, [])

  // Sync method when modal opens with a different defaultMethod
  useEffect(() => {
    if (open) {
      setMethod(defaultMethod)
      resetForm()
    }
  }, [open, defaultMethod, resetForm])

  // Escape key handler
  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'processing') {
        resetForm()
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, step, onClose, resetForm])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

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
    // Always keep +254 prefix
    const cleaned = value.replace(/[^\d+]/g, '')
    if (!cleaned.startsWith('+254')) {
      const digits = cleaned.replace(/\D/g, '')
      if (digits.startsWith('254')) {
        return `+${digits.slice(0, 12)}`
      }
      if (digits.startsWith('0')) {
        return `+254${digits.slice(1, 10)}`
      }
      return `+254${digits.slice(0, 9)}`
    }
    return cleaned.slice(0, 13)
  }

  const detectCardBrand = (number: string): 'visa' | 'mastercard' | '' => {
    const digits = number.replace(/\s/g, '')
    if (digits.startsWith('4')) return 'visa'
    if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard'
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
    // Must be +254 followed by 9 digits
    if (!/^\+254\d{9}$/.test(phone)) {
      setError('Enter a valid Safaricom number (e.g. +254 7XX XXX XXX)')
      return false
    }
    if (mpesaConfirmName.trim().length < 2) {
      setError('Please enter the name registered on this M-PESA account')
      return false
    }
    setError('')
    return true
  }

  const generateTransactionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = 'S'
    for (let i = 0; i < 9; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (method === 'card' && !validateCardForm()) return
    if (method === 'mpesa' && !validateMpesaForm()) return

    setStep('processing')

    if (method === 'mpesa') {
      // Simulate M-Pesa STK push steps
      setMpesaStep(1) // Sending STK push
      setTimeout(() => setMpesaStep(2), 1500) // Waiting for confirmation
      setTimeout(() => {
        setMpesaStep(3) // Payment received
        const txnId = generateTransactionId()
        setTransactionId(txnId)
        setTimeout(() => setStep('success'), 1000)
      }, 4000)
    } else {
      // Simulate card processing with steps
      setCardProcessingStep(1) // Verifying card
      setTimeout(() => setCardProcessingStep(2), 1200) // Processing payment
      setTimeout(() => setCardProcessingStep(3), 2800) // Payment approved
      setTimeout(() => setStep('success'), 3600)
    }
  }

  const handleDone = () => {
    const digits = cardNumber.replace(/\s/g, '')
    const brand = detectCardBrand(cardNumber)

    const paymentDetails: CardPaymentDetails | MpesaPaymentDetails = method === 'card'
      ? {
        cardholderName: cardName,
        cardNumber: digits,
        lastFourDigits: digits.slice(-4),
        cardBrand: brand === 'visa' ? 'Visa' : brand === 'mastercard' ? 'Mastercard' : 'Card',
        expiryDate: cardExpiry,
        cardCvc: cardCvc,
      }
      : {
        phoneNumber: mpesaPhone,
        transactionId: transactionId || undefined,
      }

    resetForm()
    onSuccess(paymentDetails)
  }

  const cardBrand = detectCardBrand(cardNumber)

  const cardStepLabels = [
    { label: 'Verifying card details', shortLabel: 'Card verified' },
    { label: 'Processing payment', shortLabel: 'Payment processed' },
    { label: 'Payment approved', shortLabel: 'Approved' },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto"
        style={{ animation: 'modalSlideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {step === 'form' && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border border-gray-200">
                <Lock size={14} className="text-gray-600" />
              </div>
            )}
            <div>
              <h2
                className="text-lg font-bold text-black leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {step === 'success' ? 'Payment Approved' : step === 'processing' ? 'Processing...' : 'Secure Checkout'}
              </h2>
              {step === 'form' && (
                <p className="text-xs text-gray-400 mt-0.5">Complete your payment securely</p>
              )}
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
              aria-label="Close payment modal"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Amount Display */}
        {step === 'form' && (
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold">Amount Due</p>
                <p className="text-2xl font-bold text-black mt-0.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  ${amount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                <ShieldCheck size={13} className="text-green-600" />
                <span className="text-[10px] text-green-700 font-semibold">Secured</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Tabs */}
        {step === 'form' && (
          <div className="px-6 pt-2 pb-4">
            <div className="flex gap-3">
              <button
                onClick={() => handleMethodSwitch('card')}
                className={`flex-1 flex flex-col items-center gap-2 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                  method === 'card'
                    ? 'border-black bg-black text-white shadow-lg'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <CreditCard size={20} />
                <span className="text-xs font-semibold">Card</span>
                <span className="flex items-center gap-1.5">
                  <VisaBadge />
                  <MastercardBadge />
                </span>
              </button>
              <button
                onClick={() => handleMethodSwitch('mpesa')}
                className={`flex-1 flex flex-col items-center gap-2 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                  method === 'mpesa'
                    ? 'border-[#4CAF50] bg-[#4CAF50] text-white shadow-lg'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <Phone size={20} />
                <span className="text-xs font-semibold">M-PESA</span>
                <MpesaBadge />
              </button>
            </div>
          </div>
        )}

        {/* Form Content */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="px-6 pb-6" autoComplete="on">
            {method === 'card' ? (
              <div className="space-y-5">
                {/* Card Number */}
                <div>
                  <label htmlFor="cc-number" className="block text-sm font-semibold text-black mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      id="cc-number"
                      name="cardnumber"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242  4242  4242  4242"
                      required
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all pr-20 tracking-[0.18em] font-mono tabular-nums"
                      style={{ letterSpacing: '0.18em' }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <CardBrandIndicator brand={cardBrand} />
                      {!cardBrand && cardNumber.length > 0 && (
                        <CreditCard size={18} className="text-gray-300" />
                      )}
                      {!cardBrand && cardNumber.length === 0 && (
                        <span className="flex items-center gap-1.5">
                          <VisaBadge />
                          <MastercardBadge />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cc-exp" className="block text-sm font-semibold text-black mb-2">
                      Expiry Date
                    </label>
                    <input
                      id="cc-exp"
                      name="cc-exp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY"
                      required
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all font-mono tracking-wider text-center"
                    />
                  </div>
                  <div>
                    <label htmlFor="cc-csc" className="block text-sm font-semibold text-black mb-2">
                      CVC
                    </label>
                    <input
                      id="cc-csc"
                      name="cc-csc"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      required
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all font-mono tracking-wider text-center"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label htmlFor="cc-name" className="block text-sm font-semibold text-black mb-2">
                    Cardholder Name
                  </label>
                  <input
                    id="cc-name"
                    name="ccname"
                    type="text"
                    autoComplete="cc-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name as shown on card"
                    required
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* M-Pesa Branding */}
                <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MpesaLogo size={56} className="shrink-0 rounded" />
                    <div>
                      <p className="text-sm font-semibold text-[#2E7D32]">Lipa Na M-PESA</p>
                      <p className="text-xs text-[#388E3C] leading-relaxed mt-1">
                        An STK push will be sent to your Safaricom number. Enter your M-PESA PIN on your phone to complete the payment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* M-Pesa Steps Preview */}
                <div className="border border-gray-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">How it works</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#4CAF50] text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                      <span className="text-xs text-gray-600">Enter your Safaricom phone number</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#4CAF50] text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                      <span className="text-xs text-gray-600">Receive STK push on your phone</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#4CAF50] text-white text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                      <span className="text-xs text-gray-600">Enter your M-PESA PIN to confirm</span>
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="mpesa-phone" className="block text-sm font-semibold text-black mb-1.5">
                    Safaricom Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="mpesa-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(formatMpesaPhone(e.target.value))}
                      placeholder="+254 7XX XXX XXX"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/10 outline-none transition-all pl-11"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                      <Phone size={15} className="text-[#4CAF50]" />
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Must be a registered Safaricom M-PESA number
                  </p>
                </div>

                {/* Name confirmation */}
                <div>
                  <label htmlFor="mpesa-name" className="block text-sm font-semibold text-black mb-1.5">
                    M-PESA Account Name
                  </label>
                  <input
                    id="mpesa-name"
                    name="mpesa-name"
                    type="text"
                    autoComplete="name"
                    value={mpesaConfirmName}
                    onChange={(e) => setMpesaConfirmName(e.target.value)}
                    placeholder="Name registered on M-PESA"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/10 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full mt-6 py-4 text-white text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
                method === 'card'
                  ? 'bg-[#1a1a1a] hover:bg-black shadow-lg hover:shadow-xl'
                  : 'bg-[#4CAF50] hover:bg-[#43A047] shadow-lg hover:shadow-xl'
              }`}
            >
              <Lock size={14} />
              {method === 'card'
                ? `Pay $${amount.toLocaleString()} with Card`
                : `Pay $${amount.toLocaleString()} via M-PESA`
              }
            </button>

            {/* Security Notice */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <Lock size={10} className="text-gray-300" />
                  <span className="text-[10px] text-gray-400">SSL Encrypted</span>
                </div>
                <span className="text-gray-200">|</span>
                <div className="flex items-center gap-1">
                  <Shield size={10} className="text-gray-300" />
                  <span className="text-[10px] text-gray-400">Secure Payment</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2.5 mt-3">
                <VisaLogo size={32} className="rounded" />
                <MastercardLogo size={32} className="rounded" />
                <MpesaLogo size={32} className="rounded" />
              </div>
            </div>
          </form>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            {method === 'card' ? (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-6 border-2 border-gray-200">
                  {cardProcessingStep < 3 ? (
                    <Loader2 size={32} className="text-black animate-spin" />
                  ) : (
                    <CheckCircle size={32} className="text-green-600" />
                  )}
                </div>
                <h3
                  className="text-lg font-bold text-black mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {cardProcessingStep <= 1
                    ? 'Verifying Card...'
                    : cardProcessingStep === 2
                      ? 'Processing Payment...'
                      : 'Payment Approved!'
                  }
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  {cardProcessingStep <= 1
                    ? 'Verifying your card details. Please wait...'
                    : cardProcessingStep === 2
                      ? `Processing your payment of $${amount.toLocaleString()}...`
                      : 'Your payment has been approved successfully!'
                  }
                </p>

                {/* Card Processing Steps */}
                <div className="mt-6 w-full max-w-xs space-y-3">
                  {cardStepLabels.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-300 ${
                        cardProcessingStep > idx + 1
                          ? 'bg-green-600 text-white'
                          : cardProcessingStep === idx + 1
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-400'
                      }`}>
                        {cardProcessingStep > idx + 1 ? '✓' : idx + 1}
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        cardProcessingStep > idx + 1
                          ? 'text-green-700 font-medium'
                          : cardProcessingStep === idx + 1
                            ? 'text-black font-medium'
                            : 'text-gray-400'
                      }`}>
                        {cardProcessingStep > idx + 1 ? s.shortLabel : s.label}
                      </span>
                      {cardProcessingStep === idx + 1 && (
                        <Loader2 size={12} className="text-black animate-spin ml-auto" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Card info being processed */}
                {cardBrand && (
                  <div className="mt-5 bg-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-gray-100">
                    <CardBrandIndicator brand={cardBrand} />
                    <span className="text-xs text-gray-500 font-mono tracking-wider">
                      •••• •••• •••• {cardNumber.replace(/\s/g, '').slice(-4)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-6 border-2 border-[#C8E6C9]">
                  {mpesaStep < 3 ? (
                    <Loader2 size={32} className="text-[#4CAF50] animate-spin" />
                  ) : (
                    <CheckCircle size={32} className="text-[#4CAF50]" />
                  )}
                </div>
                <h3
                  className="text-lg font-bold text-black mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {mpesaStep <= 1 ? 'Sending STK Push...' : mpesaStep === 2 ? 'Check Your Phone' : 'Payment Received!'}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  {mpesaStep <= 1
                    ? `Sending payment request of $${amount.toLocaleString()} to ${mpesaPhone}...`
                    : mpesaStep === 2
                      ? `Enter your M-PESA PIN on your phone to confirm payment of $${amount.toLocaleString()}.`
                      : 'M-PESA payment confirmed successfully!'
                  }
                </p>

                {/* M-Pesa Progress Steps */}
                <div className="mt-6 w-full max-w-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-300 ${
                      mpesaStep >= 1 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {mpesaStep >= 2 ? '✓' : '1'}
                    </div>
                    <span className={`text-xs transition-colors duration-300 ${mpesaStep >= 1 ? 'text-[#2E7D32] font-medium' : 'text-gray-400'}`}>
                      STK push sent to {mpesaPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-300 ${
                      mpesaStep >= 2 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {mpesaStep >= 3 ? '✓' : '2'}
                    </div>
                    <span className={`text-xs transition-colors duration-300 ${mpesaStep >= 2 ? 'text-[#2E7D32] font-medium' : 'text-gray-400'}`}>
                      Waiting for PIN confirmation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-300 ${
                      mpesaStep >= 3 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {mpesaStep >= 3 ? '✓' : '3'}
                    </div>
                    <span className={`text-xs transition-colors duration-300 ${mpesaStep >= 3 ? 'text-[#2E7D32] font-medium' : 'text-gray-400'}`}>
                      Payment confirmed
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              method === 'card' ? 'bg-green-600' : 'bg-[#4CAF50]'
            }`} style={{ animation: 'successPop 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)' }}>
              <CheckCircle size={32} className="text-white" />
            </div>
            <h3
              className="text-xl font-bold text-black mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {method === 'card' ? 'Payment Approved' : 'Payment Confirmed'}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-1">
              {method === 'card' ? (
                <>
                  Your payment of{' '}
                  <span className="font-semibold text-black">${amount.toLocaleString()}</span>
                  {' '}has been approved successfully.
                </>
              ) : (
                <>
                  Your M-PESA payment of{' '}
                  <span className="font-semibold text-black">${amount.toLocaleString()}</span>
                  {' '}has been confirmed.
                </>
              )}
            </p>

            {/* Transaction details */}
            {method === 'mpesa' && transactionId && (
              <div className="mt-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl px-4 py-2.5 flex items-center justify-center gap-2">
                <MpesaLogo size={32} className="rounded" />
                <p className="text-xs text-[#2E7D32]">
                  Transaction ID: <span className="font-bold">{transactionId}</span>
                </p>
              </div>
            )}

            {method === 'card' && (
              <div className="mt-3 bg-green-50 border border-green-100 rounded-xl px-5 py-3 flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2">
                  <CardBrandIndicator brand={detectCardBrand(cardNumber)} />
                  <span className="text-sm font-semibold text-black">
                    {detectCardBrand(cardNumber) === 'visa' ? 'Visa' : 'Mastercard'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono tracking-wider">
                  {cardNumber || `•••• •••• •••• ${cardNumber.replace(/\s/g, '').slice(-4)}`}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={12} className="text-green-600" />
                  <span className="text-[10px] text-green-700 font-semibold">Approved</span>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4 mb-6">
              {method === 'card'
                ? 'Your order is being processed. Thank you!'
                : 'A confirmation SMS has been sent to your phone.'
              }
            </p>
            <button
              onClick={handleDone}
              className="px-12 py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 tracking-wide shadow-lg active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        )}
      </div>

      {/* Inline animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes successPop {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
