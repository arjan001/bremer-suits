import { HeadContent, Link, Outlet, Scripts, createRootRoute, useRouter } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { CartDrawer } from '@/components/CartDrawer'
import { SeoHead } from '@/components/SeoHead'
import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { Phone, Mail, Instagram, Clock, Navigation, Globe, X, ChevronUp, Shield, FileText, Cookie, CreditCard, Truck, RotateCcw, ArrowRight, MapPin } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Bremer Suits — Custom Suits & Image Consulting',
      },
      {
        name: 'description',
        content: 'Premium custom suits, professional fashion styling, and image consulting. Elevate your personal brand with Bremer Suits.',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/images/stemtrix-logo.png',
      },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const router = useRouter()
  const pathname = router.state.location.pathname
  const isAdmin = pathname.startsWith('/admin')
  const hideExtras = isAdmin || pathname === '/wishlist' || pathname === '/checkout'

  if (isAdmin) {
    return (
      <WishlistProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </WishlistProvider>
    )
  }

  return (
    <WishlistProvider>
      <CartProvider>
        <SeoHead />
        <Header />
        <CartDrawer />
        <main>
          <Outlet />
        </main>
        {!hideExtras && <FollowUs />}
        <Footer />
        {!hideExtras && <SubscribeModal />}
      </CartProvider>
    </WishlistProvider>
  )
}

/* ── Instagram colored icon ── */
function InstagramColored({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-gradient)" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="url(#ig-gradient)" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-gradient)" />
    </svg>
  )
}

/* ── TikTok icon ── */
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
    </svg>
  )
}

/* ── WhatsApp icon ── */
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ── Follow Us Section ── */
function FollowUs() {
  const images = [
    '/images/suit-hero.webp',
    '/images/suit-business.webp',
    '/images/suit-formal.webp',
    '/images/suit-casual.webp',
    '/images/suit-charcoal.webp',
    '/images/suit-classic.webp',
  ]

  return (
    <section className="relative">
      <div className="grid grid-cols-3 md:grid-cols-6">
        {images.map((img, i) => (
          <a
            key={i}
            href="#"
            className="group relative aspect-square overflow-hidden block"
          >
            <img
              src={img}
              alt="Fashion inspiration"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </a>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white px-6 py-3 flex items-center gap-2.5 shadow-lg pointer-events-auto">
          <InstagramColored size={20} />
          <span className="text-sm font-medium text-black tracking-wide">Follow us on Instagram</span>
        </div>
      </div>
    </section>
  )
}

/* ── Subscribe Modal (Dynamic - powered by admin popup offers) ── */
function SubscribeModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [offer, setOffer] = useState<{
    title: string
    description: string
    discountPercent: number
    code: string
    image: string
    collectNewsletter: boolean
  } | null>(null)

  useEffect(() => {
    // Load active popup offer from API
    async function loadOffer() {
      try {
        const res = await fetch('/.netlify/functions/admin-offers?type=popup_offers')
        if (res.ok) {
          const popupOffers = (await res.json()) as Array<{
            title: string; description: string; discount_percent: number;
            code: string; image: string; collect_newsletter: boolean; is_active: boolean
          }>
          const activeOffer = popupOffers.find((o) => o.is_active)
          if (activeOffer) {
            setOffer({
              title: activeOffer.title,
              description: activeOffer.description,
              discountPercent: activeOffer.discount_percent,
              code: activeOffer.code,
              image: activeOffer.image,
              collectNewsletter: activeOffer.collect_newsletter,
            })
          }
        }
      } catch { /* ignore */ }
    }
    loadOffer()
  }, [])

  useEffect(() => {
    if (dismissed || !offer) return
    // Check if already dismissed this session
    try {
      if (sessionStorage.getItem('bremer-popup-dismissed')) {
        setDismissed(true)
        return
      }
    } catch { /* ignore */ }
    const timer = setTimeout(() => setOpen(true), 4000)
    return () => clearTimeout(timer)
  }, [dismissed, offer])

  const handleDismiss = () => {
    setOpen(false)
    setDismissed(true)
    try { sessionStorage.setItem('bremer-popup-dismissed', '1') } catch { /* ignore */ }
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // Save subscriber via API
    fetch('/.netlify/functions/admin-newsletter?resource=subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), status: 'active', subscribed_at: new Date().toISOString() }),
    }).catch(() => {})
    setSubscribed(true)
  }

  // Only show when an active popup offer exists in admin
  if (!open || !offer) return null

  const title = offer.title
  const description = offer.description
  const discount = offer.discountPercent
  const promoCode = offer.code
  const image = offer.image
  const showNewsletter = offer.collectNewsletter

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative bg-white flex flex-col md:flex-row max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Left - Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={image}
            alt="Special Offer"
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-md">
              <span className="text-2xl font-bold">{discount}%</span>
              <span className="text-xs block -mt-0.5 uppercase tracking-wider">OFF</span>
            </div>
          )}
        </div>

        {/* Right - Form */}
        <div className="md:w-1/2 p-8 md:p-10 relative flex flex-col justify-center">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Mobile discount badge */}
          {discount > 0 && (
            <div className="md:hidden mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-md">
                {discount}% OFF
              </span>
            </div>
          )}

          <p className="text-xs tracking-widest uppercase text-gray-400 mb-2 font-medium">Special Offer</p>
          <h3
            className="text-2xl lg:text-3xl font-bold text-black mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {description}
          </p>

          {promoCode && !subscribed && (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-3 mb-5 text-center">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Use code at checkout</p>
              <p className="text-lg font-bold text-black font-mono tracking-widest">{promoCode}</p>
            </div>
          )}

          {subscribed ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-bold text-black mb-1">Thank you for subscribing!</p>
              {promoCode && <p className="text-sm text-gray-500">Use code <span className="font-bold font-mono text-black">{promoCode}</span> at checkout.</p>}
            </div>
          ) : showNewsletter ? (
            <form onSubmit={handleSubscribe}>
              <label className="text-sm font-semibold text-black mb-2 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mb-4"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                Subscribe & Get {discount}% Off
              </button>
            </form>
          ) : (
            <Link
              to="/collections"
              onClick={handleDismiss}
              className="block w-full py-3.5 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300 text-center"
            >
              Shop Now
            </Link>
          )}

          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              onChange={handleDismiss}
              className="w-4 h-4 border-gray-300 rounded accent-black"
            />
            <span className="text-xs text-gray-500">Don&apos;t show this popup again</span>
          </label>
        </div>
      </div>
    </div>
  )
}

/* ── Cookie Consent Banner ── */
function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('bremer-cookie-consent')) {
        const timer = setTimeout(() => setVisible(true), 1500)
        return () => clearTimeout(timer)
      }
    } catch { /* ignore */ }
  }, [])

  const acceptAll = () => {
    try { localStorage.setItem('bremer-cookie-consent', 'all') } catch { /* ignore */ }
    setVisible(false)
  }

  const acceptEssential = () => {
    try { localStorage.setItem('bremer-cookie-consent', 'essential') } catch { /* ignore */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
              <Cookie size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-black mb-1">We value your privacy</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic, and personalize content. Read our{' '}
                <Link to="/cookie-policy" className="underline text-black hover:text-gray-600 transition-colors">cookie policy</Link> to learn more.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={acceptEssential}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-medium bg-black text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Cookie Preferences Modal ── */
function CookiePreferencesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    if (open) {
      try {
        const consent = localStorage.getItem('bremer-cookie-consent')
        if (consent === 'all') {
          setPreferences({ essential: true, functional: true, analytics: true, marketing: true })
        } else {
          setPreferences({ essential: true, functional: true, analytics: false, marketing: false })
        }
      } catch { /* ignore */ }
    }
  }, [open])

  const savePreferences = () => {
    const value = preferences.analytics && preferences.marketing ? 'all' : 'essential'
    try { localStorage.setItem('bremer-cookie-consent', value) } catch { /* ignore */ }
    onClose()
  }

  if (!open) return null

  const cookieTypes = [
    { key: 'essential' as const, label: 'Essential Cookies', desc: 'Required for the website to function. Cannot be disabled.', locked: true },
    { key: 'functional' as const, label: 'Functional Cookies', desc: 'Remember your preferences like language and display settings.', locked: false },
    { key: 'analytics' as const, label: 'Analytics Cookies', desc: 'Help us understand how visitors interact with our website.', locked: false },
    { key: 'marketing' as const, label: 'Marketing Cookies', desc: 'Used to deliver relevant advertisements and measure campaigns.', locked: false },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white max-w-lg w-full rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Cookie size={20} className="text-gray-700" />
            <h3 className="text-lg font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Cookie Preferences</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Manage your cookie preferences below. Essential cookies are always active as they are necessary for the website to function properly.
          </p>
          <div className="space-y-4">
            {cookieTypes.map((ct) => (
              <div key={ct.key} className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">{ct.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ct.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={preferences[ct.key]}
                    onChange={(e) => !ct.locked && setPreferences((p) => ({ ...p, [ct.key]: e.target.checked }))}
                    disabled={ct.locked}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 rounded-full transition-colors ${ct.locked ? 'bg-black' : 'bg-gray-300 peer-checked:bg-black'} peer-focus:ring-2 peer-focus:ring-black/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4`} />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <Link to="/cookie-policy" onClick={onClose} className="text-xs text-gray-500 underline hover:text-black transition-colors">
            View full cookie policy
          </Link>
          <button
            onClick={savePreferences}
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Floating Back to Top Button ── */
function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 400)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-[80] w-12 h-12 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      aria-label="Back to top"
    >
      <ChevronUp size={22} className="group-hover:-translate-y-0.5 transition-transform" />
    </button>
  )
}

/* ── Footer (Dynamic - powered by admin settings) ── */
function Footer() {
  const [settings, setSettings] = useState<{
    storeName: string
    storeEmail: string
    storePhone: string
    address: string
    footerText: string
    footerStoreHours: string
    footerLocationName: string
    footerLocationDetail: string
    socialLinks: Array<{ id: string; platform: string; url: string; label: string; isActive: boolean; sortOrder: number }>
    footerLinks: Array<{ id: string; label: string; url: string; column: string; sortOrder: number }>
    paymentMethods: Array<{ id: string; label: string; isActive: boolean; sortOrder: number }>
    authorInfo: { name: string; url: string; tagline: string }
  } | null>(null)
  const [cookieModalOpen, setCookieModalOpen] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/.netlify/functions/admin-settings')
        if (res.ok) {
          const raw = await res.json()
          setSettings({
            storeName: raw.store_name || 'Bremer Suits',
            storeEmail: raw.store_email || '',
            storePhone: raw.store_phone || '',
            address: raw.address || '',
            footerText: raw.footer_text || '',
            footerStoreHours: raw.footer_store_hours || '',
            footerLocationName: raw.footer_location_name || '',
            footerLocationDetail: raw.footer_location_detail || '',
            socialLinks: (raw.social_links || []).sort((a: { sortOrder: number }, b: { sortOrder: number }) => (a.sortOrder || 0) - (b.sortOrder || 0)),
            footerLinks: (raw.footer_links || []).sort((a: { sortOrder: number }, b: { sortOrder: number }) => (a.sortOrder || 0) - (b.sortOrder || 0)),
            paymentMethods: (raw.payment_methods || []).filter((pm: { isActive: boolean }) => pm.isActive).sort((a: { sortOrder: number }, b: { sortOrder: number }) => (a.sortOrder || 0) - (b.sortOrder || 0)),
            authorInfo: raw.author_info || { name: '', url: '', tagline: '' },
          })
        }
      } catch { /* use defaults */ }
    }
    loadSettings()
  }, [])

  // Fallback values
  const storeName = settings?.storeName || 'Bremer Suits'
  const footerText = settings?.footerText || 'Premium custom suits, professional fashion styling, and image consulting — your one-stop destination for bespoke tailoring.'

  // Social links - use admin settings if available, otherwise show defaults
  const adminSocials = (settings?.socialLinks || []).filter((s) => s.isActive)
  const defaultSocials = [
    { id: 'def-ig', platform: 'instagram', url: '#', label: 'Instagram', isActive: true, sortOrder: 1 },
    { id: 'def-tt', platform: 'tiktok', url: '#', label: 'TikTok', isActive: true, sortOrder: 2 },
    { id: 'def-wa', platform: 'whatsapp', url: '#', label: 'WhatsApp', isActive: true, sortOrder: 3 },
  ]
  const displaySocials = adminSocials.length > 0 ? adminSocials : defaultSocials

  // Footer links
  const shopLinks = (settings?.footerLinks || []).filter((l) => l.column === 'shop')
  const categoryLinks = (settings?.footerLinks || []).filter((l) => l.column === 'company')

  // Payment & author
  const paymentMethods = settings?.paymentMethods || []
  const authorInfo = settings?.authorInfo || { name: '', url: '', tagline: '' }

  // Store info
  const locationName = settings?.footerLocationName || ''
  const locationDetail = settings?.footerLocationDetail || ''
  const storeHours = settings?.footerStoreHours || ''
  const storePhone = settings?.storePhone || ''
  const storeEmail = settings?.storeEmail || ''

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={18} className="text-white" />
      case 'tiktok': return <TikTokIcon size={18} />
      case 'whatsapp': return <WhatsAppIcon size={18} />
      default: return <Globe size={16} className="text-white" />
    }
  }

  const getSocialBg = (platform: string): React.CSSProperties => {
    switch (platform.toLowerCase()) {
      case 'instagram': return { background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }
      case 'whatsapp': return { backgroundColor: '#25D366' }
      case 'tiktok': return { backgroundColor: '#000000' }
      case 'facebook': return { backgroundColor: '#1877F2' }
      case 'twitter/x': return { backgroundColor: '#000000' }
      case 'youtube': return { backgroundColor: '#FF0000' }
      case 'linkedin': return { backgroundColor: '#0A66C2' }
      case 'pinterest': return { backgroundColor: '#E60023' }
      default: return { backgroundColor: '#555555' }
    }
  }

  return (
    <>
      <footer className="bg-[#1a1a1a] text-white">
        {/* Trust Badges Banner */}
        <div className="border-b border-gray-800 bg-[#151515]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              <div className="flex items-center justify-center gap-3">
                <Truck size={22} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Nationwide Delivery</p>
                  <p className="text-xs text-gray-500">Dispatch every Tue &amp; Fri</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Shield size={22} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Quality Guaranteed</p>
                  <p className="text-xs text-gray-500">Curated denim picks</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <RotateCcw size={22} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Easy Returns</p>
                  <p className="text-xs text-gray-500">Hassle-free refund policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

            {/* Column 1: Brand + Description + Social Icons */}
            <div>
              <div className="mb-5">
                <h3
                  className="text-2xl font-bold tracking-wider"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {storeName}
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
                {footerText}
              </p>
              <div className="flex gap-3">
                {displaySocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={getSocialBg(social.platform)}
                    aria-label={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Shop + Categories */}
            <div>
              <div className="mb-8">
                <h4 className="text-sm font-bold uppercase text-white mb-4 tracking-wide">Shop</h4>
                <ul className="space-y-3">
                  {shopLinks.length > 0 ? (
                    shopLinks.map((link) => (
                      <li key={link.id}>
                        <Link to={link.url} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">{link.label}</Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <li><Link to="/collections" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">All Collections</Link></li>
                      <li><Link to="/collections" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">New Arrivals</Link></li>
                      <li><Link to="/services" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Services</Link></li>
                      <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Contact</Link></li>
                    </>
                  )}
                </ul>
              </div>
              {categoryLinks.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase text-white mb-4 tracking-wide">Categories</h4>
                  <ul className="space-y-3">
                    {categoryLinks.map((link) => (
                      <li key={link.id}>
                        <Link to={link.url} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Column 3: Visit Our Store */}
            <div>
              <h4 className="text-sm font-bold uppercase text-white mb-6 tracking-wide">Visit Our Store</h4>
              <ul className="space-y-4">
                {(locationName || settings?.address) && (
                  <li className="flex items-start gap-3">
                    <Navigation size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      {locationName && <span className="text-sm text-white font-medium">{locationName}</span>}
                      {locationDetail && <><br /><span className="text-sm text-gray-400">{locationDetail}</span></>}
                      {settings?.address && <><br /><span className="text-sm text-gray-400">{settings.address}</span></>}
                    </div>
                  </li>
                )}
                {storePhone && (
                  <li className="flex items-start gap-3">
                    <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <a href={`tel:${storePhone}`} className="text-sm text-gray-400 hover:text-white transition-colors">{storePhone}</a>
                  </li>
                )}
                {storeEmail && (
                  <li className="flex items-start gap-3">
                    <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <a href={`mailto:${storeEmail}`} className="text-sm text-gray-400 hover:text-white transition-colors">{storeEmail}</a>
                  </li>
                )}
                {storeHours && (
                  <li className="flex items-start gap-3">
                    <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      {storeHours.split('\n').map((line, i) => (
                        <span key={i} className="text-sm text-gray-400 block">{line}</span>
                      ))}
                    </div>
                  </li>
                )}
              </ul>
              {locationName && (
                <div className="mt-6">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([locationName, locationDetail, settings?.address].filter(Boolean).join(' '))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-600 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
                  >
                    <MapPin size={15} />
                    Get Directions to {locationName}
                  </a>
                </div>
              )}
            </div>

            {/* Column 4: Follow Us + We Accept */}
            <div>
              <h4 className="text-sm font-bold uppercase text-white mb-6 tracking-wide">Follow Us</h4>
              <ul className="space-y-4">
                {displaySocials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
                    >
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                        style={getSocialBg(social.platform)}
                      >
                        {getSocialIcon(social.platform)}
                      </span>
                      {social.label || social.platform}
                    </a>
                  </li>
                ))}
              </ul>

              {paymentMethods.length > 0 && (
                <div className="mt-8">
                  <h5 className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">We Accept</h5>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((pm) => (
                      <span key={pm.id} className="px-3 py-1.5 border border-gray-600 rounded text-xs text-gray-300 font-medium">
                        {pm.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
              </p>
              {authorInfo.name ? (
                <p className="text-xs text-gray-500">
                  {authorInfo.tagline || 'Designed & developed by'}{' '}
                  {authorInfo.url ? (
                    <a
                      href={authorInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 underline hover:text-white transition-colors"
                    >
                      {authorInfo.name}
                    </a>
                  ) : (
                    <span className="text-gray-400">{authorInfo.name}</span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Designed &amp; developed by{' '}
                  <a
                    href="https://oneplusafrica.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 underline hover:text-white transition-colors"
                  >
                    OnePlusAfrica Tech Solutions
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal open={cookieModalOpen} onClose={() => setCookieModalOpen(false)} />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Floating Back to Top */}
      <BackToTopButton />
    </>
  )
}
