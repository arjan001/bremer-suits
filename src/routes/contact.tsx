import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, Send, Phone, MapPin, Clock, Instagram, CheckCircle2, MessageCircle } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Book a Fitting | Suit Appointment at Bremer Suits Nairobi' },
      { name: 'description', content: 'Book an appointment at our Nairobi studio on Kimathi St. Expert suit fittings, fabric selection, and personalized styling advisory for your next look.' },
      { name: 'keywords', content: 'Bremer Suits, Bremer, BremerSuits, BREMER SUITS, book tailor appointment Nairobi, suit fitting consultation, Bremer Suits location, custom suit price Kenya, bespoke tailor contact, suit alterations near me, bremer suits contact, Kimathi Street tailor, Nairobi fitting studio, wedding suit consultation, corporate suit appointment, book suit fitting Kenya, schedule tailoring session' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'author', content: 'Bremer Suits' },
      { name: 'publisher', content: 'Bremer Suits' },
      { name: 'language', content: 'en' },
      { name: 'revisit-after', content: '7 days' },
      { name: 'rating', content: 'general' },
      { name: 'distribution', content: 'global' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', content: '#1a1a1a' },
      { name: 'apple-mobile-web-app-title', content: 'Bremer Suits' },
      { name: 'application-name', content: 'Bremer Suits' },
      { name: 'msapplication-TileColor', content: '#1a1a1a' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { property: 'og:title', content: 'Book a Fitting | Suit Appointment at Bremer Suits Nairobi' },
      { property: 'og:description', content: 'Book an appointment at our Nairobi studio. Expert suit fittings, fabric selection, and personalized styling advisory.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://bremersuits.com/contact' },
      { property: 'og:site_name', content: 'Bremer Suits' },
      { property: 'og:locale', content: 'en_KE' },
      { property: 'og:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Book a Fitting at Bremer Suits Nairobi' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@bremersuits' },
      { name: 'twitter:creator', content: '@bremersuits' },
      { name: 'twitter:title', content: 'Book a Fitting | Bremer Suits Nairobi' },
      { name: 'twitter:description', content: 'Book an appointment at our Nairobi studio. Expert suit fittings, fabric selection, and personalized styling advisory.' },
      { name: 'twitter:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { name: 'twitter:image:alt', content: 'Book a Fitting at Bremer Suits Nairobi' },
      { name: 'geo.region', content: 'KE-110' },
      { name: 'geo.placename', content: 'Nairobi' },
      { name: 'geo.position', content: '-1.2864;36.8172' },
      { name: 'ICBM', content: '-1.2864, 36.8172' },
      { property: 'business:contact_data:street_address', content: 'Kimathi St' },
      { property: 'business:contact_data:locality', content: 'Nairobi' },
      { property: 'business:contact_data:country_name', content: 'Kenya' },
      { property: 'business:contact_data:email', content: 'brendahwanja6722@gmail.com' },
      { property: 'business:contact_data:phone_number', content: '+254 793 880642' },
      { name: 'subject', content: 'Book a Fitting & Appointment' },
      { name: 'classification', content: 'Business' },
      { name: 'category', content: 'Fashion & Tailoring' },
      { name: 'coverage', content: 'Kenya' },
      { name: 'target', content: 'all' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'MobileOptimized', content: '320' },
    ],
    links: [
      { rel: 'canonical', href: 'https://bremersuits.com/contact' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bremersuits.com/' },
            { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://bremersuits.com/contact' },
          ],
        }),
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Book a Fitting at Bremer Suits',
          description: 'Book an appointment at our Nairobi studio for expert suit fittings, fabric selection, and personalized styling advisory.',
          url: 'https://bremersuits.com/contact',
          mainEntity: {
            '@type': 'LocalBusiness',
            name: 'Bremer Suits',
            telephone: '+254793880642',
            email: 'brendahwanja6722@gmail.com',
            address: { '@type': 'PostalAddress', streetAddress: 'Kimathi St', addressLocality: 'Nairobi', addressCountry: 'KE' },
          },
        }),
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gold/10 flex items-center justify-center mx-auto mb-6 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-gold" />
          </div>
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Request Received
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-gray-400 mb-8 leading-relaxed">
            Thank you for reaching out. We will review your inquiry and get back
            to you within 24 hours to schedule your consultation.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-gold text-black hover:bg-gold-light transition-colors duration-300 font-semibold"
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
            src="/images/contact-banner-new.jpg"
            alt="Book a suit fitting appointment at Bremer Suits Nairobi studio"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3 font-medium">
            Get in Touch
          </p>
          <h1
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Book an Appointment
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-white/60 max-w-lg mx-auto font-light">
            Schedule a suit fitting and let our team walk you through our available fabrics, designs, and tailoring options — crafted to match your style.
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
              <div className="w-10 h-0.5 bg-gold mb-6" />
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Studio Location</p>
                    <p className="text-sm text-gray-500">BREMER SUITS, Kimathi St, Nairobi</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Email</p>
                    <a href="mailto:brendahwanja6722@gmail.com" className="text-sm text-gray-500 hover:text-black transition-colors">brendahwanja6722@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Phone</p>
                    <a href="tel:+254793880642" className="text-sm text-gray-500 hover:text-black transition-colors">+254 793 880642</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Hours</p>
                    <p className="text-sm text-gray-500">Mon – Fri: 9am – 6pm</p>
                    <p className="text-sm text-gray-500">Sat: By appointment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">Connect with Us</h3>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/BREMERSUITS/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/bremer_suits/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 text-white flex items-center justify-center hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }} aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="https://www.tiktok.com/@bremersuits" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors" aria-label="TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z"/></svg>
                </a>
                <a href="https://wa.me/254793880642" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="WhatsApp">
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-sm font-semibold text-black mb-2 uppercase tracking-wide">What to Expect</h3>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-gold text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-500">Complimentary 45–60 minute fitting session</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-gold text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-500">Discuss your style goals and event requirements</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-gold text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-500">Expert measurements and fabric selection</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-gold text-xs font-bold">4</span>
                  </div>
                  <p className="text-sm text-gray-500">Personalized plan for your wardrobe transformation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 p-8 lg:p-10">
              <h3
                className="text-xl font-bold text-black mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Send Us a Message
              </h3>
              <div className="w-10 h-0.5 bg-gold mb-6" />
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
                      Full Name <span className="text-red-500">*</span>
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
                      Email <span className="text-red-500">*</span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium"
                    >
                      Phone Number <span className="text-red-500">*</span>
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
                      <option value="wedding-suits">Wedding Suits</option>
                      <option value="fashion-styling">Fashion Styling</option>
                      <option value="image-consulting">Image Consulting</option>
                      <option value="wardrobe-audit">Wardrobe Audit</option>
                      <option value="alterations">Alterations & Fitting</option>
                      <option value="corporate">Corporate Programs</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs tracking-wide uppercase text-gray-500 mb-2 font-medium"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none text-sm"
                    placeholder="Tell us about your style goals, upcoming events, or any specific requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gold hover:text-black transition-colors duration-300 font-semibold w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700">
                    {submitError}
                  </div>
                )}
              </form>
            </div>
        </div>
      </div>
      </div>
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2 font-medium">Find Us</p>
            <h2
              className="text-2xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Studio Location
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact Details - Left */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Address</p>
                  <p className="text-sm text-gray-500">BREMER SUITS, Kimathi St, Nairobi, Kenya</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Phone</p>
                  <a href="tel:+254793880642" className="text-sm text-gray-500 hover:text-black transition-colors">+254 793 880642</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Email</p>
                  <a href="mailto:brendahwanja6722@gmail.com" className="text-sm text-gray-500 hover:text-black transition-colors">brendahwanja6722@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Business Hours</p>
                  <p className="text-sm text-gray-500">Mon – Fri: 9am – 6pm</p>
                  <p className="text-sm text-gray-500">Sat: By appointment</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">WhatsApp</p>
                  <a href="https://wa.me/254793880642" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-black transition-colors">Chat with us on WhatsApp</a>
                </div>
              </div>
            </div>
            {/* Map - Right */}
            <div className="aspect-square lg:aspect-[4/3] min-h-[300px] bg-gray-200 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8193!2d36.82!3d-1.285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKimathi+Street%2C+Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bremer Suits Nairobi Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
