import { Link, useRouter, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Menu, X, Search, Heart, ShoppingBag, Phone, Mail } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'

const BASE = '/.netlify/functions'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/collections', label: 'Products' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
] as const

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [navbarOfferTexts, setNavbarOfferTexts] = useState<string[]>([])
  const router = useRouter()
  const navigate = useNavigate()
  const pathname = router.state.location.pathname
  const { totalItems, setCartOpen } = useCart()
  const { totalItems: wishlistCount } = useWishlist()

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
            <Link to="/" className="flex items-center gap-2 group">
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
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-[13px] tracking-wide uppercase font-medium transition-colors duration-200 hover:text-black pb-1 ${
                    pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to))
                      ? 'text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black'
                      : 'text-gray-500'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-black hover:text-gray-600 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="flex relative p-2 text-black hover:text-gray-600 transition-colors" aria-label="Wishlist">
                <Heart size={20} className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-black hover:text-gray-600 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link
                to="/contact"
                className="hidden md:inline-flex items-center px-5 py-2 text-xs tracking-widest uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-medium"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white py-4 px-4 sm:px-6 lg:px-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const trimmed = searchValue.trim()
                if (trimmed) {
                  navigate({ to: '/collections', search: { q: trimmed } })
                  setSearchOpen(false)
                  setSearchValue('')
                }
              }}
              className="max-w-2xl mx-auto relative"
            >
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search collections, services, styles..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                autoFocus
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm tracking-wide uppercase font-medium transition-colors duration-200 py-3 border-b border-gray-50 ${
                    pathname === link.to
                      ? 'text-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center justify-center px-5 py-3.5 text-xs tracking-widest uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-medium"
              >
                Book a Consultation
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
