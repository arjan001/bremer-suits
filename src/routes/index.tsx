import { createFileRoute, Link } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Scissors,
  Sparkles,
  Crown,
  Heart,
  Eye,
  Watch,
  Shirt,
} from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import { getProducts, type Product } from '@/lib/products'

const BASE = '/.netlify/functions'

interface CategoryInfo {
  title: string
  subtitle: string
  image: string
  count: string
  category: string
}

interface MenuItem {
  id: string
  title: string
  description: string
  price: string
  image: string
  sortOrder: number
  isActive: boolean
}

interface BannerItem {
  id: string
  title: string
  description: string
  link: string
  image: string
  isActive: boolean
}

export const Route = createFileRoute('/')({
  component: HomePage,
})

const services = [
  {
    icon: Scissors,
    title: 'High-End Tailoring',
    description: 'Custom suits and ready-made premium pieces crafted by master tailors with the finest fabrics.',
  },
  {
    icon: Heart,
    title: 'Wedding Styling',
    description: 'Bespoke wedding attire for grooms and groomsmen — creating unforgettable looks for your special day.',
  },
  {
    icon: Crown,
    title: 'Personal Styling',
    description: 'Complete wardrobe strategy and curation — from audits to seasonal planning and event outfits.',
  },
  {
    icon: Shirt,
    title: 'Ruracio Styling',
    description: 'Traditional Ruracio ceremony attire and styling — blending cultural heritage with modern elegance.',
  },
  {
    icon: Sparkles,
    title: 'Fashion Design',
    description: 'Custom fashion pieces designed from scratch to match your unique vision and personality.',
  },
  {
    icon: Eye,
    title: 'Image Consulting',
    description: 'Personal brand coaching, executive presence, and strategic image alignment for professionals.',
  },
  {
    icon: Watch,
    title: 'Male Accessories',
    description: 'Curated ties, cufflinks, pocket squares, belts, and watches to complete your look.',
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
  const [collections, setCollections] = useState<CategoryInfo[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [banners, setBanners] = useState<BannerItem[]>([])

  useEffect(() => {
    async function loadData() {
      const allProducts = await getProducts()
      setProducts(allProducts)

      // Fetch categories from API
      try {
        const res = await fetch(`${BASE}/admin-categories`)
        if (res.ok) {
          const cats = (await res.json()) as Array<{ name: string; slug: string; description: string; image: string; status: string }>
          const activeCats = cats.filter((c: { status: string }) => c.status === 'active')
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
    }

    async function loadMenuItems() {
      try {
        const res = await fetch(`${BASE}/admin-offers?type=menu_items`)
        if (res.ok) {
          const items = (await res.json()) as Array<{
            id: string; title: string; description: string; price: string;
            image: string; sort_order: number; is_active: boolean
          }>
          const active = items
            .filter((i) => i.is_active)
            .map((i) => ({
              id: i.id,
              title: i.title,
              description: i.description,
              price: i.price,
              image: i.image,
              sortOrder: i.sort_order || 0,
              isActive: i.is_active,
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder)
          setMenuItems(active)
        }
      } catch { /* ignore */ }
    }

    async function loadBanners() {
      try {
        const res = await fetch(`${BASE}/admin-offers?type=banners`)
        if (res.ok) {
          const items = (await res.json()) as Array<{
            id: string; title: string; description: string; link: string;
            image: string; is_active: boolean
          }>
          setBanners(items.filter((b) => b.is_active).map((b) => ({
            id: b.id,
            title: b.title,
            description: b.description,
            link: b.link,
            image: b.image,
            isActive: b.is_active,
          })))
        }
      } catch { /* ignore */ }
    }

    loadData()
    loadMenuItems()
    loadBanners()
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

  // Use menu items for specials, fall back to products
  const hasMenuItems = menuItems.length > 0
  const specialsImage = hasMenuItems
    ? (menuItems[0]?.image || '/images/suit-hero.webp')
    : (products[0]?.image || '/images/suit-hero.webp')

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
              Seasonal Bremer
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

          {collections.length > 0 ? (
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
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No collections available yet</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Our collections are being curated. Please check back later for new arrivals.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Text Content */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <p className="text-xs tracking-[0.3em] uppercase text-[#5b7b9a] mb-3 font-semibold">
                About Us
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold text-black leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Bremer &mdash; Defined by Precision, Worn with Purpose
              </h2>
              <div className="mb-6">
                <img
                  src="/images/flower-accents.webp"
                  alt="Decorative accents"
                  className="h-8 object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                At Bremer, we believe that a well-tailored suit is more than just clothing &mdash; it&apos;s a statement
                of identity, confidence, and intent. Each vest and suit in our collection is crafted with attention
                to detail, from fabric selection to final stitching, ensuring a perfect balance between classic
                elegance and modern form. Whether for a boardroom, a wedding, or a casual yet refined evening out,
                Bremer empowers you to dress not just for the occasion, but to define it.
              </p>
              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
                >
                  Read More
                </Link>
              </div>
            </div>

            {/* Center: Main Image */}
            <div className="lg:col-span-4">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src="/images/about-model-1.webp"
                  alt="Fashion model in suit"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Second Image */}
            <div className="lg:col-span-4">
              <div className="aspect-[3/5] overflow-hidden bg-gray-100">
                <img
                  src="/images/about-model-2.webp"
                  alt="Gentleman in suit"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Some Of Our Flavours */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-semibold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Some Of Our Flavours
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Elegant Tailoring', image: '/images/suit-formal.webp' },
              { name: 'Subtle Patterns', image: '/images/suit-business.webp' },
              { name: 'Classic Texture', image: '/images/suit-charcoal.webp' },
              { name: 'Modern Style', image: '/images/suit-casual.webp' },
              { name: 'Sharp Classics', image: '/images/suit-classic.webp' },
            ].map((flavour) => (
              <Link
                key={flavour.name}
                to="/collections"
                className="group relative overflow-hidden aspect-[3/4] block bg-gray-200"
              >
                <img
                  src={flavour.image}
                  alt={flavour.name}
                  className="w-full h-full object-cover product-img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
                    {flavour.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deals of the Day + Featured Products Split */}
      {products.length > 0 && (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Deals of the Day */}
            <div className="border border-gray-200 p-6 lg:p-8">
              <div className="mb-6">
                <span className="inline-block px-6 py-2 bg-[#2c3e6b] text-white text-xs tracking-[0.2em] uppercase font-bold">
                  Deals of the Day
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {products.filter(p => p.salePrice || p.originalPrice).slice(0, 2).concat(
                  products.filter(p => p.salePrice || p.originalPrice).length < 2
                    ? products.slice(0, 2 - products.filter(p => p.salePrice || p.originalPrice).length)
                    : []
                ).slice(0, 2).map((product) => (
                  <Link key={product.id} to="/collections/$slug" params={{ slug: product.id }} className="group block text-center">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover product-img-zoom"
                      />
                      {(product.salePrice || product.originalPrice) && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] px-2 py-1 font-bold uppercase tracking-wider"
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
                        >
                          Sale
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-black mb-1">{product.title}</h4>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-semibold text-black">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <div className="mt-3 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black">Hungry Up !</p>
                      <p className="text-[10px] text-gray-400">Offer end in :</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Featured Products */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-lg font-bold text-black uppercase tracking-wider"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Featured Products
                </h3>
                <div className="flex gap-2">
                  <span className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors cursor-pointer">
                    <ArrowRight size={14} className="rotate-180" />
                  </span>
                  <span className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors cursor-pointer">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <Link key={product.id} to="/collections/$slug" params={{ slug: product.id }} className="group block text-center">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover product-img-zoom"
                      />
                      {product.tag && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] px-2 py-1 font-bold uppercase tracking-wider"
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
                        >
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-black mb-1">{product.title}</h4>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-semibold text-black">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Our Specials - Dynamic from products */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-[#5b7b9a] mb-2 font-semibold">
              Our Menu
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Specials
            </h2>
          </div>

          {products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Featured Image */}
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={specialsImage}
                alt="Featured suit"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Menu Item List */}
            <div className="flex flex-col gap-6 lg:pt-4">
              {hasMenuItems ? (
                /* Render curated menu items from admin */
                menuItems.map((item) => (
                  <div key={item.id}>
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
                      {item.description}
                    </p>
                  </div>
                ))
              ) : (
                /* Fallback: render from products */
                products.slice(0, 7).map((item) => (
                  <div key={item.id}>
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
                  </div>
                ))
              )}

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
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Scissors size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No specials available right now</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Our team is preparing new specials for you. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

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
                <span className="text-3xl font-bold text-white">$600.00</span>
                <span className="text-lg text-white/40 line-through">$800.00</span>
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
            {featuredProducts.length > 0 && (
            <Link
              to="/collections"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
            )}
          </div>

          {featuredProducts.length > 0 ? (
          <>
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
          </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Heart size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No featured products yet</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                We're working on something special. Check back soon for our featured collection!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner - Two columns */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.length >= 2 ? (
              <>
                {/* Promo 1 - Dynamic */}
                <Link
                  to={banners[0].link || '/collections'}
                  className="group relative overflow-hidden bg-gray-900 aspect-[16/9] md:aspect-[3/2] block"
                >
                  <img
                    src={banners[0].image || '/images/fabrics.png'}
                    alt={banners[0].title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="relative h-full flex flex-col justify-center p-8 lg:p-12">
                    <p className="text-xs tracking-widest uppercase text-white/60 mb-2">Special Offer</p>
                    <h3
                      className="text-2xl lg:text-3xl font-bold text-white mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {banners[0].title}
                    </h3>
                    {banners[0].description && (
                      <p className="text-sm text-white/70 mb-3 max-w-sm line-clamp-2">{banners[0].description}</p>
                    )}
                    <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white font-semibold hover:gap-3 transition-all duration-300 mt-2">
                      Shop Now <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>

                {/* Promo 2 - Dynamic */}
                <Link
                  to={banners[1].link || '/services'}
                  className="group relative overflow-hidden bg-gray-100 aspect-[16/9] md:aspect-[3/2] block"
                >
                  <img
                    src={banners[1].image || '/images/dressmaker.png'}
                    alt={banners[1].title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="relative h-full flex flex-col justify-center p-8 lg:p-12">
                    <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Featured</p>
                    <h3
                      className="text-2xl lg:text-3xl font-bold text-black mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {banners[1].title}
                    </h3>
                    {banners[1].description && (
                      <p className="text-sm text-gray-600 mb-3 max-w-sm line-clamp-2">{banners[1].description}</p>
                    )}
                    <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black font-semibold hover:gap-3 transition-all duration-300 mt-2">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              /* Default static banners */
              <>
                {/* Promo 1 - New Season Fabrics */}
                <div className="relative overflow-hidden bg-gray-900 aspect-[16/9] md:aspect-[3/2] group">
                  <img
                    src="/images/suit-navy.webp"
                    alt="Premium Fabrics"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
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

                {/* Promo 2 - Custom Tailoring */}
                <div className="relative overflow-hidden bg-gray-900 aspect-[16/9] md:aspect-[3/2] group">
                  <img
                    src="/images/suit-business.webp"
                    alt="Custom Tailoring"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="relative h-full flex flex-col justify-center p-8 lg:p-12">
                    <p className="text-xs tracking-widest uppercase text-white/60 mb-2">Bespoke Service</p>
                    <h3
                      className="text-2xl lg:text-3xl font-bold text-white mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Custom Tailoring
                    </h3>
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white font-semibold hover:gap-3 transition-all duration-300 mt-2"
                    >
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
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
            {newArrivals.length > 0 && (
            <Link
              to="/collections"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              Shop All <ArrowRight size={16} />
            </Link>
            )}
          </div>

          {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} badgeOverride="New" />
            ))}
          </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Crown size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No new arrivals yet</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                New pieces are on their way. Check back soon to see the latest from our atelier.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Our Services */}
      <section className="border-t border-b border-gray-100 py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-[#5b7b9a] mb-2 font-semibold">
              What We Do
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Services
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto">
              Beyond bespoke suits — we offer a complete range of services to elevate your personal brand.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
            {services.map((service) => (
              <Link key={service.title} to="/services" className="group flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gray-50 group-hover:bg-black flex items-center justify-center shrink-0 transition-colors duration-300 mb-4">
                  <service.icon size={24} className="text-black group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
            >
              View All Services
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* "The Day Starts With Our Best Suit" Banner */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0">
          <img
            src="/images/banner-store.webp"
            alt="Premium suit store"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] mb-4 font-semibold">
            The Day Starts With
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Our Best Suit
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-lg mx-auto font-light">
            Every stitch tells a story of craftsmanship. We source only the finest fabrics from
            Italian and British mills to create suits that stand the test of time.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center px-10 py-4 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
          >
            Shop Collection
          </Link>
        </div>
      </section>


      {/* Bottom Deals of the Day - Horizontal Scroll */}
      {products.length > 0 && (
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium">&#9670;</span>
              <h3
                className="text-xl lg:text-2xl font-semibold text-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Deals of the Day
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-wider uppercase text-black font-bold">Hungry Up !</span>
              <div className="flex gap-1 ml-2">
                {[
                  { value: timeLeft.hours, label: 'h' },
                  { value: timeLeft.minutes, label: 'm' },
                  { value: timeLeft.seconds, label: 's' },
                ].map((unit) => (
                  <span key={unit.label} className="inline-flex items-center gap-0.5 px-2 py-1 bg-black text-white text-[10px] font-bold">
                    {String(unit.value).padStart(2, '0')}{unit.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={`deal-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Quote / Testimonial Banner */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0">
          <img
            src="/images/banner-quote.webp"
            alt="Fashion editorial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#c9a96e" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <blockquote
            className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-10 italic"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            &ldquo;In An Age Of Online Access And Unending Choice,
            Customer Engagement Is Something That Glossier Has
            Gotten Right.&rdquo;
          </blockquote>

          {/* Brand Logos */}
          <div className="flex items-center justify-center gap-8 lg:gap-16">
            <img
              src="/images/brand-suit-house.webp"
              alt="Suit House"
              className="h-16 lg:h-20 object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="/images/brand-gentlemans-room.webp"
              alt="Gentleman's Room"
              className="h-16 lg:h-20 object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="/images/brand-vestiaire.webp"
              alt="Vestiaire"
              className="h-16 lg:h-20 object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
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
