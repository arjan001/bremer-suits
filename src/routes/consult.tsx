import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { MessageCircle, Send, CheckCircle2, ChevronRight, Phone, Clock, MapPin, Sparkles, Users, Ruler } from 'lucide-react'

export const Route = createFileRoute('/consult')({
  head: () => ({
    meta: [
      { title: 'Book a Consultation | Bremer Suits Nairobi' },
      { name: 'description', content: 'Book a private consultation with Bremer Suits via WhatsApp or our quick form. Get expert measurements, fabric selection, and personalized styling in Nairobi.' },
      { name: 'keywords', content: 'Bremer Suits consultation, book fitting Nairobi, WhatsApp suit consultation, bespoke tailor appointment, custom suit fitting Kenya' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Book a Consultation | Bremer Suits Nairobi' },
      { property: 'og:description', content: 'Book a private consultation with Bremer Suits via WhatsApp. Expert measurements, fabric selection, and personalized styling.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://bremersuits.com/consult' },
      { property: 'og:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
    ],
    links: [
      { rel: 'canonical', href: 'https://bremersuits.com/consult' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bremersuits.com/' },
            { '@type': 'ListItem', position: 2, name: 'Book a Consultation', item: 'https://bremersuits.com/consult' },
          ],
        }),
      },
    ],
  }),
  component: Consult,
})

const WHATSAPP_NUMBER = '254793880642'

const services = [
  { value: 'custom-suiting', label: 'Custom Suiting' },
  { value: 'wedding-suits', label: 'Wedding & Events' },
  { value: 'senator-suit', label: 'Senator Suit' },
  { value: 'kaunda-suit', label: 'Kaunda Suit' },
  { value: 'couples-outfit', label: 'Couples Outfit' },
  { value: 'alterations', label: 'Alterations & Fitting' },
  { value: 'corporate', label: 'Corporate Programs' },
  { value: 'other', label: 'Other' },
]

function buildWhatsAppUrl(data: { name: string; phone: string; service: string; date: string; message: string }) {
  const lines = [
    `Hi Bremer Suits! I'd like to book a consultation.`,
    ``,
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
    data.service ? `*Service:* ${data.service}` : '',
    data.date ? `*Preferred Date:* ${data.date}` : '',
    data.message ? `*Details:* ${data.message}` : '',
    ``,
    `Looking forward to hearing from you!`,
  ].filter(Boolean).join('\n')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`
}

function Consult() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    try {
      // Send to the backend (email notification)
      const response = await fetch('/.netlify/functions/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service || 'Consultation Booking',
          message: `[Consultation Booking]\nPreferred Date: ${formData.date || 'Not specified'}\n\n${formData.message}`,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Could not send your request.')
      }

      // Also open WhatsApp with the details
      const waUrl = buildWhatsAppUrl(formData)
      window.open(waUrl, '_blank')

      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit. Please try WhatsApp directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWhatsAppOnly = () => {
    const waUrl = buildWhatsAppUrl(formData)
    window.open(waUrl, '_blank')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#25D366]/10 flex items-center justify-center mx-auto mb-6 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
          </div>
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Booking Sent!
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-gray-400 mb-4 leading-relaxed">
            Your consultation request has been submitted and a WhatsApp message has been prepared.
            We'll confirm your appointment within a few hours.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Didn't see WhatsApp open? Tap below to message us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I just submitted a consultation booking on your website!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs tracking-[0.2em] uppercase bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors duration-300 font-semibold"
            >
              <MessageCircle size={16} />
              Open WhatsApp
            </a>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({ name: '', email: '', phone: '', service: '', date: '', message: '' })
              }}
              className="px-6 py-3.5 text-xs tracking-[0.2em] uppercase border border-white/20 text-white hover:bg-white/5 transition-colors duration-300 font-semibold"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb + Hero */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/about-patterns.jpg"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pb-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs tracking-wide mb-10" aria-label="Breadcrumb">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} className="text-gray-600" />
            <span className="text-gold font-medium">Book a Consultation</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#25D366]/10 border border-[#25D366]/20 mb-6">
              <MessageCircle size={14} className="text-[#25D366]" />
              <span className="text-xs tracking-wide text-[#25D366] font-medium uppercase">Book via WhatsApp</span>
            </div>
            <h1
              className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Book Your Private<br />
              <span className="text-gold">Consultation</span>
            </h1>
            <p className="text-white/50 max-w-lg font-light leading-relaxed">
              Fill in the form below and we'll reach out on WhatsApp to confirm your
              appointment — or message us directly for instant booking.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Form Column */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="c-name" className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="c-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="c-phone" className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="c-phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="+254 700 000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="c-email" className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="c-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="c-service" className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium">
                    Service of Interest
                  </label>
                  <select
                    id="c-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm text-gray-600"
                  >
                    <option value="">Select a service</option>
                    {services.map(s => (
                      <option key={s.value} value={s.label}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="c-date" className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium">
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="c-date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label htmlFor="c-message" className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium">
                  Additional Details
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none text-sm"
                  placeholder="Tell us about the occasion, style preference, or any questions..."
                />
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle size={15} />
                  {submitting ? 'Sending...' : 'Book via WhatsApp'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppOnly}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-semibold"
                >
                  <Send size={14} />
                  WhatsApp Only
                </button>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                "Book via WhatsApp" saves your request and opens WhatsApp.
                "WhatsApp Only" sends directly without saving — perfect for a quick chat.
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Direct Card */}
            <div className="bg-[#25D366]/5 border border-[#25D366]/15 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#25D366] flex items-center justify-center rounded-full">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Chat Directly</p>
                  <p className="text-xs text-gray-500">Instant response on WhatsApp</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Bremer Suits! I'd like to book a consultation.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] text-white text-xs tracking-[0.15em] uppercase font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle size={14} />
                Open WhatsApp
              </a>
              <div className="flex items-center gap-2 mt-3">
                <Phone size={13} className="text-gray-400" />
                <a href="tel:+254793880642" className="text-sm text-gray-500 hover:text-black transition-colors">
                  +254 793 880642
                </a>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-gray-50 p-6">
              <h3
                className="text-base font-bold text-black mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                What to Expect
              </h3>
              <div className="w-8 h-0.5 bg-gold mb-5" />
              <div className="space-y-4">
                {[
                  { icon: Sparkles, text: 'Complimentary 45–60 min private session' },
                  { icon: Users, text: 'Discuss style goals & event requirements' },
                  { icon: Ruler, text: 'Expert measurements & fabric selection' },
                  { icon: Clock, text: 'Personalized wardrobe plan & timeline' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} className="text-gold" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Studio Info */}
            <div className="bg-black text-white p-6">
              <h3
                className="text-base font-bold mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Visit Our Studio
              </h3>
              <div className="w-8 h-0.5 bg-gold mb-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
                  <span className="text-gray-300">Kimathi St, Nairobi</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={15} className="text-gold shrink-0 mt-0.5" />
                  <div className="text-gray-300">
                    <p>Mon – Fri: 9am – 6pm</p>
                    <p>Sat: By appointment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={15} className="text-gold shrink-0 mt-0.5" />
                  <a href="tel:+254793880642" className="text-gray-300 hover:text-white transition-colors">+254 793 880642</a>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <Link
                  to="/contact"
                  className="text-xs tracking-wide text-gold hover:text-gold-light transition-colors uppercase font-medium inline-flex items-center gap-1"
                >
                  Full Contact Details
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>

            {/* Small Image Accent */}
            <div className="relative h-40 overflow-hidden">
              <img
                src="/images/fabrics.png"
                alt="Premium suit fabrics available at Bremer Suits"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Premium Fabrics</p>
                <p className="text-[11px] text-white/60 mt-1">Hand-selected materials for every occasion</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
