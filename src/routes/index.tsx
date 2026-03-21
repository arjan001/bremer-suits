import { createFileRoute, Link } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Scissors,
  Ruler,
  Sparkles,
  Crown,
  Heart,
} from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import { getProducts, type Product } from '@/lib/products'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const services = [
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'Complimentary delivery on all bespoke orders. Dispatch within 4-6 weeks of final fitting.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Guaranteed',
    description: 'Every piece is handcrafted with premium fabrics and comes with our fit guarantee.',
  },
  {
    icon: RotateCcw,
    title: 'Perfect Fit Promise',
    description: 'Complimentary alterations within the first year to ensure your perfect fit endures.',
  },
]

function ProductCard({ product, badgeOverride }: { product: Product; badgeOverride?: string }) {
  const { toggleItem, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  return (
    <div className="group block bg-white">
      <Link
        to="/collections/$slug"
        params={{ slug: product.id }}
        className="block"
      >
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover product-img-zoom"
          />
          {(badgeOverride || product.tag) && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-[10px] tracking-wider uppercase font-semibold">
              {badgeOverride || product.tag}
            </span>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          {/* View Product overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <span className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white text-center text-xs tracking-widest uppercase font-semibold">
              View Product
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to="/collections/$slug"
            params={{ slug: product.id }}
            className="block flex-1 min-w-0"
          >
            <p className="text-[11px] tracking-wide uppercase text-gray-400 mb-1">{product.category}</p>
            <h3 className="text-sm font-semibold text-black mb-1 group-hover:text-gray-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">{product.price}</p>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleItem(product.id)
            }}
            className={`shrink-0 mt-0.5 p-1.5 rounded-full transition-all duration-200 ${
              inWishlist
                ? 'text-red-500'
                : 'text-gray-300 hover:text-red-400'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} className={inWishlist ? 'fill-red-500' : ''} />
          </button>
        </div>
        {/* Color swatches */}
        <div className="flex gap-1.5 mt-2">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="w-3.5 h-3.5 rounded-full ring-1 ring-gray-200"
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-gray-400 ml-0.5 self-center">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function HomePage() {
  const latestPosts = [...allBlogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<{ title: string; subtitle: string; image: string; count: string; category: string }[]>([])

  useEffect(() => {
    const allProducts = getProducts()
    setProducts(allProducts)

    // Build collections from admin categories if available
    try {
      const stored = localStorage.getItem('bremer-admin-categories')
      if (stored) {
        const cats = JSON.parse(stored) as Array<{ name: string; slug: string; description: string; image: string; status: string }>
        const activeCats = cats.filter((c) => c.status === 'active')
        if (activeCats.length > 0) {
          setCollections(activeCats.map((c) => ({
            title: c.name,
            subtitle: c.description || c.name,
            image: c.image || '/images/suit-hero.webp',
            count: `${allProducts.filter((p) => p.category === c.name).length} Pieces`,
            category: c.name,
          })))
          return
        }
      }
    } catch { /* ignore */ }

    // Fall back to deriving collections from products
    const categories = [...new Set(allProducts.map((p) => p.category))]
    setCollections(categories.slice(0, 4).map((cat) => ({
      title: cat,
      subtitle: cat,
      image: allProducts.find((p) => p.category === cat)?.image || '/images/suit-hero.webp',
      count: `${allProducts.filter((p) => p.category === cat).length} Pieces`,
      category: cat,
    })))
  }, [])

  const featuredProducts = products.slice(0, 4)
  const newArrivals = products.filter((p) => p.tag === 'New' || p.tag === 'Best Seller').slice(0, 4).length > 0
    ? products.filter((p) => p.tag === 'New' || p.tag === 'Best Seller').slice(0, 4)
    : products.slice(4, 8)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      const diff = endOfMonth.getTime() - now.getTime()
      if (diff > 0) {
        return {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        }
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image Banner */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/suit-hero.webp"
            alt="Bremer Suits Collection"
            className="w-full h-full object-cover object-center opacity-60 hero-pan"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.4em] uppercase text-white/70 mb-4 font-medium">
              New Season Collection
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Seasonal Suitant
              <span className="block">Creations</span>
            </h1>
            <p className="text-base text-white/70 leading-relaxed mb-8 max-w-md font-light">
              Discover our latest collection of bespoke suits crafted for the modern professional. Premium fabrics, impeccable fit, timeless style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/collections"
                className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
              >
                Shop Collection
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase border border-white/40 text-white hover:bg-white/10 transition-colors duration-300 font-medium"
              >
                Our Services
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Collection - Card layout */}
      {collections.length > 0 && (
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-semibold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Shop by Collection
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
              Curated collections for every occasion. Find your perfect suit.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.title}
                to="/collections"
                className="group relative overflow-hidden bg-gray-100 aspect-[3/4] block"
              >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover product-img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs tracking-widest uppercase text-white/70 mb-1">{collection.count}</p>
                  <h3
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {collection.title}
                  </h3>
                  <p className="text-sm text-white/80">{collection.subtitle}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white font-medium group-hover:gap-3 transition-all duration-300">
                    Shop Now <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Our Specials - Dynamic from products */}
      {products.length > 0 && (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2 font-medium">
              Our Menu
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Specials
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Suit Image */}
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={products[0]?.image || '/images/suit-hero.webp'}
                alt="Featured suit"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Menu List */}
            <div className="flex flex-col gap-6 lg:pt-4">
              {products.slice(0, 7).map((item) => (
                <Link key={item.id} to="/collections/$slug" params={{ slug: item.id }}>
                  <div className="flex items-baseline gap-2">
                    <h3
                      className="text-lg font-bold text-black whitespace-nowrap"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.title}
                    </h3>
                    <div className="flex-1 border-b border-dashed border-gray-300 relative -top-1" />
                    <span className="text-lg font-semibold text-black whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 italic leading-relaxed line-clamp-2">
                    {item.description || `Crafted with ${item.fabric} for the modern gentleman.`}
                  </p>
                </Link>
              ))}

              <div className="text-center mt-4">
                <Link
                  to="/collections"
                  className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
                >
                  Show More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Deal of the Day - Countdown with Parallax */}
      {(() => {
        const dealProduct = products.find((p) => p.salePrice || p.originalPrice) || products[0]
        if (!dealProduct) return null
        return (
      <section className="relative overflow-hidden">
        <div
          className="parallax-bg absolute inset-0"
          style={{ backgroundImage: `url('${dealProduct.image || '/images/suit-hero.webp'}')` }}
        />
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-4 font-medium">
                Deal of the Day
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {dealProduct.title}
              </h2>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-3xl font-bold text-white">{dealProduct.salePrice || dealProduct.price}</span>
                {dealProduct.originalPrice && (
                  <span className="text-lg text-white/40 line-through">{dealProduct.originalPrice}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <p className="text-sm text-white/60 font-light leading-snug">
                  The countdown is on,<br />don&apos;t miss out!
                </p>
                <div className="flex gap-3">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Mins' },
                    { value: timeLeft.seconds, label: 'Sec' },
                  ].map((unit) => (
                    <div key={unit.label} className="text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white flex items-center justify-center">
                        <span className="text-xl sm:text-2xl font-bold text-black">
                          {String(unit.value).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[10px] tracking-wider uppercase text-white/50 mt-1.5 block">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/collections/$slug"
                params={{ slug: dealProduct.id }}
                className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
              >
                Shop Now
              </Link>
            </div>

            <div className="hidden lg:flex justify-center">
              <img
                src={dealProduct.image}
                alt={dealProduct.title}
                className="h-[500px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
        )
      })()}

      {/* Featured Products - Grid with product page links */}
      {featuredProducts.length > 0 && (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="text-3xl lg:text-4xl font-semibold text-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Featured Products
              </h2>
              <p className="text-sm text-gray-500 mt-2">Hand-picked pieces from our atelier</p>
            </div>
            <Link
              to="/collections"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Promotional Banner - Two columns like Kallitos */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promo 1 */}
            <div className="relative overflow-hidden bg-gray-900 aspect-[16/9] md:aspect-[3/2] group">
              <img
                src="/images/fabric-pattern.png"
                alt="Premium Fabrics"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="relative h-full flex flex-col justify-center p-8 lg:p-12">
                <p className="text-xs tracking-widest uppercase text-white/60 mb-2">Premium Selection</p>
                <h3
                  className="text-2xl lg:text-3xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  New Season Fabrics
                </h3>
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white font-semibold hover:gap-3 transition-all duration-300 mt-2"
                >
                  Explore <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Promo 2 */}
            <div className="relative overflow-hidden bg-gray-100 aspect-[16/9] md:aspect-[3/2] group">
              <img
                src="/images/dressmaker.png"
                alt="Custom Tailoring"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="relative h-full flex flex-col justify-center p-8 lg:p-12">
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Bespoke Service</p>
                <h3
                  className="text-2xl lg:text-3xl font-bold text-black mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Custom Tailoring
                </h3>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black font-semibold hover:gap-3 transition-all duration-300 mt-2"
                >
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="text-3xl lg:text-4xl font-semibold text-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                New Arrivals
              </h2>
              <p className="text-sm text-gray-500 mt-2">The latest additions to our collection</p>
            </div>
            <Link
              to="/collections"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              Shop All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} badgeOverride="New" />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Services Strip */}
      <section className="border-t border-b border-gray-100 py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {services.map((service) => (
              <div key={service.title} className="flex items-start gap-4 text-center md:text-left md:flex-row flex-col items-center md:items-start">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center shrink-0">
                  <service.icon size={22} className="text-black" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black mb-1 uppercase tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Well Groomed Quality Suits" Banner */}
      <section className="relative overflow-hidden bg-black py-24 lg:py-32">
        <div className="absolute inset-0">
          <img
            src="/images/fabric-pattern-1.png"
            alt="Premium fabric"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-4 font-medium">
            Our Promise
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Well Groomed, Quality Suits
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-lg mx-auto font-light">
            Every stitch tells a story of craftsmanship. We source only the finest fabrics from
            Italian and British mills to create suits that stand the test of time.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center px-10 py-4 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* Other Services Offered */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-semibold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Services We Offer
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto">
              Beyond bespoke suits — we offer a complete range of services to elevate your personal brand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Scissors,
                title: 'Custom Suiting',
                description: 'Bespoke suits crafted to your exact measurements with premium fabrics and meticulous attention to detail.',
                image: '/images/sewing-machine.png',
              },
              {
                icon: Ruler,
                title: 'Alterations & Fitting',
                description: 'Expert alterations to ensure every garment fits perfectly. From minor adjustments to complete restructuring.',
                image: '/images/measure.png',
              },
              {
                icon: Sparkles,
                title: 'Image Consulting',
                description: 'Strategic image coaching to align your appearance with your professional goals and personal identity.',
                image: '/images/dressmaker-1.png',
              },
              {
                icon: Crown,
                title: 'Fashion Styling',
                description: 'Wardrobe curation and personal styling to build a versatile collection for every occasion.',
                image: '/images/dressmaker.png',
              },
            ].map((service) => (
              <Link
                key={service.title}
                to="/services"
                className="group block bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-50">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover product-img-zoom opacity-80"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <service.icon size={18} className="text-black" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-black uppercase tracking-wide">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black font-medium group-hover:gap-3 transition-all duration-300">
                    Learn More <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {latestPosts.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2
                  className="text-3xl lg:text-4xl font-semibold text-black"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  From the Journal
                </h2>
                <p className="text-sm text-gray-500 mt-2">Style insights and tailoring tips</p>
              </div>
              <Link
                to="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                Read All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post._meta.path}
                  to="/blog/$slug"
                  params={{ slug: post._meta.path }}
                  className="group block bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    <p className="text-xs tracking-wide text-gray-400 mb-3 uppercase">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' '}&middot;{' '}{post.author}
                    </p>
                    <h3
                      className="text-xl font-semibold text-black mb-3 group-hover:text-gray-600 transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                      {post.summary}
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black font-medium group-hover:gap-3 transition-all duration-300">
                      Read Article <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
