import { useState } from 'react'
import { X, Send } from 'lucide-react'

const SITE_URL = 'https://bremersuits.com'
function getFullImageUrl(imagePath: string) {
  if (imagePath.startsWith('http')) return imagePath
  return `${SITE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

export interface EnquireProduct {
  id: string
  title: string
  category: string
  fabric?: string
  price: string
  numericPrice: number
  image: string
  tag?: string | null
  description?: string
}

interface EnquireModalProps {
  product: EnquireProduct | null
  open: boolean
  onClose: () => void
}

export function EnquireModal({ product, open, onClose }: EnquireModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!open || !product) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setSubmitted(false)
    onClose()
  }

  const whatsAppMessage = encodeURIComponent(
    `Hi, I'm interested in the "${product.title}" (${product.price}). Could you share more details?\n\n${SITE_URL}/share?title=${encodeURIComponent(product.title)}&image=${encodeURIComponent(product.image)}`
  )
  const whatsAppUrl = `https://wa.me/254793880642?text=${whatsAppMessage}`

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2
            className="text-lg font-bold text-black"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {submitted ? 'Enquiry Sent' : 'Enquire About Product'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-black transition-colors"
            aria-label="Close enquiry"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-5">
              <Send size={24} className="text-white" />
            </div>
            <h3
              className="text-xl font-bold text-black mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Thank You!
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto mb-6">
              Your enquiry about <span className="font-semibold text-black">{product.title}</span> has been received. We'll get back to you shortly.
            </p>
            <button
              onClick={handleClose}
              className="px-10 py-3.5 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors duration-300 tracking-wide"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Product Summary */}
            <div className="px-6 pt-5 pb-4 flex items-center gap-4 bg-gray-50 border-b border-gray-100">
              <div className="w-16 h-20 bg-gray-200 shrink-0 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black">{product.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                <p className="text-sm font-medium text-black mt-1">{product.price}</p>
              </div>
            </div>

            {/* Enquiry Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" data-netlify="true" name="product-enquiry">
              <input type="hidden" name="form-name" value="product-enquiry" />
              <input type="hidden" name="product" value={`${product.title} - ${product.price}`} />

              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`I'd like to know more about the ${product.title}...`}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors duration-300 tracking-wide"
              >
                <Send size={14} />
                Send Enquiry
              </button>

              {/* WhatsApp Alternative */}
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">or reach us directly</p>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-xs font-semibold tracking-wide hover:bg-[#20BD5A] transition-colors rounded-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
