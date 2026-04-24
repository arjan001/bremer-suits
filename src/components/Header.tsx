import { Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'

const BASE = '/.netlify/functions'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Admin' },
] as const

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navbarOfferTexts, setNavbarOfferTexts] = useState<string[]>([])
  const router = useRouter()
  const pathname = router.state.location.pathname
  const mobileCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const closeMobileMenu = useCallback(() => setMobileOpen(false), [])

  // Auto-close sidebar after 3 seconds of inactivity
  useEffect(() => {
    if (mobileOpen) {
      mobileCloseTimer.current = setTimeout(closeMobileMenu, 3000)
      return () => {
        if (mobileCloseTimer.current) clearTimeout(mobileCloseTimer.current)
      }
    }
  }, [mobileOpen, closeMobileMenu])

  // Close sidebar on scroll
  useEffect(() => {
    if (!mobileOpen) return
    const onScroll = () => closeMobileMenu()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileOpen, closeMobileMenu])

  // Close sidebar on route change
  useEffect(() => {
    closeMobileMenu()
  }, [pathname, closeMobileMenu])

  useEffect(() => {
    async function loadNavbarOffers() {
      try {
        const res = await fetch(`${BASE}/admin-offers?type=navbar_offers`)
        if (res.ok) {
          const offers = (await res.json()) as Array<{ text: string; is_active: boolean }>
          const activeTexts = offers
            .filter((o) => o.is_active)
            .flatMap((o) => o.text.split('|').map((t: string) => t.trim()).filter(Boolean))
          if (activeTexts.length > 0) setNavbarOfferTexts(activeTexts)
        }
      } catch { /* ignore */ }
    }
    loadNavbarOffers()
  }, [])

  const hasMarquee = navbarOfferTexts.length > 0

  return (
    <>
      {/* Top Promotional Banner - Dynamic Marquee */}
      <div className="bg-black text-white py-2 px-4 relative overflow-hidden">
        {hasMarquee ? (
          <div className="overflow-hidden whitespace-nowrap">
            <div className="inline-flex animate-marquee">
              {/* Duplicate the items for seamless loop */}
              {[...navbarOfferTexts, ...navbarOfferTexts].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-2 mx-8 text-xs tracking-wide font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6 text-xs tracking-wide">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Phone size={12} />
              +254 793 880642
            </span>
            <span className="font-medium">FREE CONSULTATION on your first visit</span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Mail size={12} />
              brendahwanja6722@gmail.com
            </span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2 text-black hover:text-gray-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/bremer-logo.jpeg"
                alt="Bremer Suits Logo"
                className="h-10 lg:h-12 w-auto object-contain"
              />
              <div className="flex flex-col items-center leading-none">
                <span className="text-2xl lg:text-3xl font-bold tracking-wider text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  BREMER
                </span>
                <span className="text-[9px] lg:text-[10px] tracking-[0.45em] uppercase text-gray-500 font-medium mt-0.5">
                  SUITS &amp; STYLE
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to))
                const isPortfolio = link.to === '/portfolio'
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative text-[13px] tracking-wide uppercase font-medium transition-colors duration-200 hover:text-black pb-1 ${
                      isActive
                        ? 'text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gold'
                        : 'text-gray-500'
                    } ${isPortfolio && !isActive ? 'nav-shimmer' : ''}`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="hidden md:inline-flex items-center px-5 py-2 text-xs tracking-widest uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-medium"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Nav Overlay + Drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden animate-in"
              onClick={closeMobileMenu}
            />
            <div className="fixed top-0 left-0 z-50 h-full w-72 max-w-[80vw] bg-white shadow-2xl lg:hidden slide-in-from-left">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <span className="text-lg font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Menu
                </span>
                <button
                  onClick={closeMobileMenu}
                  className="p-1.5 text-gray-500 hover:text-black transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col px-6 py-6 gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.to
                  const isPortfolio = link.to === '/portfolio'
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMobileMenu}
                      className={`relative text-sm tracking-wide uppercase font-medium transition-colors duration-200 py-3 border-b border-gray-50 ${
                        isActive
                          ? 'text-black'
                          : 'text-gray-500 hover:text-black'
                      } ${isPortfolio && !isActive ? 'nav-shimmer' : ''}`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="mt-4 inline-flex items-center justify-center px-5 py-3.5 text-xs tracking-widest uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-medium"
                >
                  Book an Appointment
                </Link>
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  )
}
