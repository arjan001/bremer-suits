import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, Send, Phone, MapPin, Clock, Instagram, MessageCircle } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      {
        title: 'Book a Fitting | Private Consultation at Bremer Suits Nairobi',
      },
      {
        name: 'description',
        content: 'Ready for your perfect fit? Schedule a private consultation at our Nairobi studio. Expert measurements, fabric selection, and personalized styling for your next big event.',
      },
      {
        name: 'keywords',
        content: 'Book tailor appointment Nairobi, suit fitting consultation, Bremer Suits location, custom suit price Kenya, bespoke tailor contact, suit alterations near me',
      },
      {
        property: 'og:title',
        content: 'Book a Fitting | Private Consultation at Bremer Suits Nairobi',
      },
      {
        property: 'og:description',
        content: 'Ready for your perfect fit? Schedule a private consultation at our Nairobi studio. Expert measurements, fabric selection, and personalized styling for your next big event.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  }),
  component: Contact,
})

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h2
            className="text-3xl font-bold text-black mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Request Received
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for reaching out. We will review your inquiry and get back
            to you within 24 hours to schedule your consultation.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/contact-banner.webp"
            alt="Book a private suit fitting consultation at Bremer Suits Nairobi studio"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3 font-medium">
            Get in Touch
          </p>
          <h1
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Book a Consultation
          </h1>
          <p className="text-white/60 max-w-lg mx-auto font-light">
            Begin your journey to a refined personal image. Schedule a private
            consultation with our team.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2
                className="text-2xl font-bold text-black mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Visit Us
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-black" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Studio Location</p>
                    <p className="text-sm text-gray-500">BREMER SUITS, Kimathi St, Nairobi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-black" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Email</p>
                    <p className="text-sm text-gray-500">brendahwanja6722@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-black" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Phone</p>
                    <p className="text-sm text-gray-500">+254 793 880642</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-black" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Hours</p>
                    <p className="text-sm text-gray-500">Mon – Fri: 9am – 6pm</p>
                    <p className="text-sm text-gray-500">Sat: By appointment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social / WhatsApp */}
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">Connect with Us</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors" aria-label="WhatsApp">
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-sm font-semibold text-black mb-2 uppercase tracking-wide">What to Expect</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your initial consultation is complimentary and typically lasts 45–60 minutes.
                We'll discuss your style goals, take measurements if appropriate, and
                outline a personalized plan for your wardrobe or image transformation.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 p-8 lg:p-10">
              <h3
                className="text-xl font-bold text-black mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Send Us a Message
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setSubmitError('')
                  setSubmitting(true)
                  const form = e.currentTarget
                  const formData = new FormData(form)
                  const payload = {
                    name: String(formData.get('name') || ''),
                    email: String(formData.get('email') || ''),
                    phone: String(formData.get('phone') || ''),
                    service: String(formData.get('service') || ''),
                    message: String(formData.get('message') || ''),
                  }

                  try {
                    const response = await fetch('/.netlify/functions/contact-submissions', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    })
                    if (!response.ok) {
                      const errorData = await response.json().catch(() => null)
                      throw new Error(errorData?.error || 'Could not send your request.')
                    }
                    setSubmitted(true)
                    form.reset()
                  } catch (error) {
                    setSubmitError(error instanceof Error ? error.message : 'Unable to submit request.')
                  } finally {
                    setSubmitting(false)
                  }
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="+254 700 000000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium"
                  >
                    Service of Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm text-gray-600"
                  >
                    <option value="">Select a service</option>
                    <option value="custom-suiting">Custom Suiting</option>
                    <option value="fashion-styling">Fashion Styling</option>
                    <option value="image-consulting">Image Consulting</option>
                    <option value="wardrobe-audit">Wardrobe Audit</option>
                    <option value="alterations">Alterations & Fitting</option>
                    <option value="corporate">Corporate Programs</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none text-sm"
                    placeholder="Tell us about your style goals or any upcoming events..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold w-full sm:w-auto justify-center"
                >
                  <Send size={14} />
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
