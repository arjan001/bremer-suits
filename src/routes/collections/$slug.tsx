import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Heart,
  Star,
  Ruler,
  HelpCircle,
  Share2,
  Copy,
  Check,
  ArrowLeftRight,
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { getProductById, getRelatedProducts, type Product } from '@/lib/products'
import { EnquireModal } from '@/components/EnquireModal'

export const Route = createFileRoute('/collections/$slug')({
  component: ProductDetail,
})

const sizeGuideData = [
  { size: 'XS', chest: '34-36"', waist: '28-30"', hips: '34-36"' },
  { size: 'S', chest: '36-38"', waist: '30-32"', hips: '36-38"' },
  { size: 'M', chest: '38-40"', waist: '32-34"', hips: '38-40"' },
  { size: 'L', chest: '40-42"', waist: '34-36"', hips: '40-42"' },
  { size: 'XL', chest: '42-44"', waist: '36-38"', hips: '42-44"' },
  { size: 'XXL', chest: '44-46"', waist: '38-40"', hips: '44-46"' },
]

function ProductDetail() {
  const { slug } = Route.useParams()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'sizing'>('description')
  const [enquireProduct, setEnquireProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedThumb, setSelectedThumb] = useState(0)
  const [wishlistTooltip, setWishlistTooltip] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [skuCopied, setSkuCopied] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const p = await getProductById(slug)
      if (cancelled) return
      setProduct(p || null)
      if (p) {
        setSelectedColor(p.colors[0]?.name ?? 'Black')
        const related = await getRelatedProducts(p.id, 4)
        if (!cancelled) setRelatedProducts(related)
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [slug])

  // Dynamic SEO meta tags for product detail
  useEffect(() => {
    if (!product) return
    document.title = `${product.title} | Bremer Suits Collections`
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.content = content
    }
    const setProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
      el.content = content
    }
    const setCanonical = (href: string) => {
      let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
      el.href = href
    }
    const desc = product.description || `Shop ${product.title} from Bremer Suits. Premium quality menswear handcrafted in Nairobi, Kenya.`
    const displayPrice = product.salePrice || product.price
    const keywords = [
      'Bremer Suits', product.title, product.category, product.fabric,
      'buy suits online Kenya', 'premium menswear Nairobi', 'custom suits Kenya',
      'men\'s fashion Nairobi', 'bespoke tailoring', 'Bremer Suits collection'
    ].filter(Boolean).join(', ')
    const productImage = product.image || 'https://bremersuits.com/images/og-logo-gold-black.jpg'
    // Core SEO
    setMeta('description', desc)
    setMeta('keywords', keywords)
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('author', 'Bremer Suits')
    setMeta('publisher', 'Bremer Suits')
    setMeta('language', 'en')
    setMeta('revisit-after', '3 days')
    setMeta('rating', 'general')
    setMeta('distribution', 'global')
    setMeta('format-detection', 'telephone=no')
    setMeta('theme-color', '#1a1a1a')
    setMeta('apple-mobile-web-app-title', 'Bremer Suits')
    setMeta('application-name', 'Bremer Suits')
    setMeta('msapplication-TileColor', '#1a1a1a')
    setMeta('mobile-web-app-capable', 'yes')
    setMeta('apple-mobile-web-app-capable', 'yes')
    // Open Graph - Product
    setProperty('og:title', `${product.title} | Bremer Suits`)
    setProperty('og:description', desc)
    setProperty('og:type', 'product')
    setProperty('og:url', `https://bremersuits.com/collections/${slug}`)
    setProperty('og:site_name', 'Bremer Suits')
    setProperty('og:locale', 'en_KE')
    setProperty('og:image', productImage)
    setProperty('og:image:alt', `${product.title} - Bremer Suits`)
    setProperty('og:image:type', 'image/jpeg')
    setProperty('product:price:amount', String(product.numericPrice))
    setProperty('product:price:currency', 'KES')
    setProperty('product:brand', 'Bremer Suits')
    setProperty('product:condition', 'new')
    if (product.category) setProperty('product:category', product.category)
    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:site', '@bremersuits')
    setMeta('twitter:creator', '@bremersuits')
    setMeta('twitter:title', `${product.title} | Bremer Suits`)
    setMeta('twitter:description', desc)
    setMeta('twitter:image', productImage)
    setMeta('twitter:image:alt', `${product.title} - Bremer Suits`)
    setMeta('twitter:label1', 'Price')
    setMeta('twitter:data1', `KES ${displayPrice}`)
    setMeta('twitter:label2', 'Category')
    setMeta('twitter:data2', product.category || 'Menswear')
    // Geo
    setMeta('geo.region', 'KE-110')
    setMeta('geo.placename', 'Nairobi')
    setMeta('geo.position', '-1.2864;36.8172')
    setMeta('ICBM', '-1.2864, 36.8172')
    // Business
    setProperty('business:contact_data:street_address', 'Kimathi St')
    setProperty('business:contact_data:locality', 'Nairobi')
    setProperty('business:contact_data:country_name', 'Kenya')
    setProperty('business:contact_data:email', 'brendahwanja6722@gmail.com')
    setProperty('business:contact_data:phone_number', '+254 793 880642')
    // Additional
    setMeta('subject', product.title)
    setMeta('classification', 'Business')
    setMeta('category', 'Fashion & Tailoring')
    setMeta('coverage', 'Kenya')
    setMeta('HandheldFriendly', 'True')
    setMeta('MobileOptimized', '320')
    // Canonical
    setCanonical(`https://bremersuits.com/collections/${slug}`)
  }, [product, slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1
            className="text-2xl font-bold text-black mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Product not found
          </h1>
          <Link
            to="/collections"
            className="text-black hover:text-gray-600 transition-colors text-sm underline"
          >
            Back to Collections
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${selectedColor}-${selectedSize}`,
        title: product.title,
        price: product.numericPrice,
        image: product.image,
        category: product.category,
        fabric: product.fabric,
        selectedColor,
        selectedSize,
      })
    }
    setQuantity(1)
  }

  const handleCopySKU = () => {
    navigator.clipboard.writeText(product.sku).catch(() => {})
    setSkuCopied(true)
    setTimeout(() => setSkuCopied(false), 2000)
  }

  const savingsPercent =
    product.originalPrice && product.numericPrice
      ? Math.round(
          ((parseFloat(product.originalPrice.replace(/[^0-9.]/g, '')) - product.numericPrice) /
            parseFloat(product.originalPrice.replace(/[^0-9.]/g, ''))) *
            100
        )
      : null

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/collections" className="hover:text-black transition-colors">
            Collections
          </Link>
          <ChevronRight size={14} />
          <span className="text-black font-medium">{product.title}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Left: Product Image */}
          <div>
            <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-[10px] tracking-wider uppercase font-bold rounded-md shadow-sm">
                  {product.tag}
                </span>
              )}
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4">
              {[product.image, product.image, product.image, product.image].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    i === selectedThumb
                      ? 'ring-2 ring-black ring-offset-2 shadow-md'
                      : 'border border-gray-200 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:pt-2">
            {/* Title + Wishlist */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1
                className="text-2xl lg:text-3xl font-bold text-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {product.title}
              </h1>
              <div className="relative shrink-0 mt-1">
                <button
                  onClick={() => {
                    toggleItem(product.id)
                    setWishlistTooltip(true)
                    setTimeout(() => setWishlistTooltip(false), 2000)
                  }}
                  onMouseEnter={() => setWishlistTooltip(true)}
                  onMouseLeave={() => setWishlistTooltip(false)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 ${
                    isInWishlist(product.id)
                      ? 'bg-red-50 border-red-200 text-red-500 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 shadow-sm'
                  }`}
                  aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    size={18}
                    className={isInWishlist(product.id) ? 'fill-red-500' : ''}
                  />
                </button>
                {wishlistTooltip && (
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-10">
                    {isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-gray-300 fill-gray-300"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">No reviews</span>
            </div>

            {/* SKU */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">SKU:</span>
              <span className="text-xs text-gray-600 font-mono">{product.sku}</span>
              <button
                onClick={handleCopySKU}
                className="p-1 text-gray-400 hover:text-black transition-colors"
                aria-label="Copy SKU"
                title="Copy SKU"
              >
                {skuCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-black">{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {product.originalPrice}
                  </span>
                  {savingsPercent && savingsPercent > 0 && (
                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] tracking-wider uppercase font-bold rounded-md">
                      Save {savingsPercent}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-6" />

            {/* Color Options */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-black">
                  Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-9 h-9 rounded-full transition-all duration-200 ${
                      selectedColor === color.name
                        ? 'ring-2 ring-offset-2 ring-black scale-110'
                        : 'hover:scale-105 ring-1 ring-gray-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Options */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-black">
                  Size: <span className="font-normal text-gray-600">{selectedSize || 'Select a size'}</span>
                </span>
                <button
                  onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors underline underline-offset-2"
                >
                  <Ruler size={13} />
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size)
                      setSizeError(false)
                    }}
                    className={`min-w-[44px] h-11 px-3 flex items-center justify-center text-sm font-medium transition-all duration-200 rounded-md ${
                      selectedSize === size
                        ? 'bg-black text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-black hover:text-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-xs text-red-500 mt-2">Please select a size before adding to cart.</p>
              )}
            </div>

            {/* Size Guide Panel */}
            {sizeGuideOpen && (
              <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4
                    className="text-sm font-bold text-black"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Size Guide
                  </h4>
                  <button
                    onClick={() => setSizeGuideOpen(false)}
                    className="text-xs text-gray-400 hover:text-black transition-colors"
                  >
                    Close
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 pr-4 font-semibold text-black">Size</th>
                        <th className="text-left py-2 pr-4 font-semibold text-black">Chest</th>
                        <th className="text-left py-2 pr-4 font-semibold text-black">Waist</th>
                        <th className="text-left py-2 font-semibold text-black">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuideData
                        .filter((row) => product.sizes.includes(row.size))
                        .map((row) => (
                          <tr key={row.size} className="border-b border-gray-100">
                            <td className={`py-2 pr-4 font-medium ${selectedSize === row.size ? 'text-black' : 'text-gray-600'}`}>
                              {row.size}
                            </td>
                            <td className="py-2 pr-4 text-gray-500">{row.chest}</td>
                            <td className="py-2 pr-4 text-gray-500">{row.waist}</td>
                            <td className="py-2 text-gray-500">{row.hips}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Fabric & Tailoring Description */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 leading-relaxed">
                {product.description ||
                  `Fabric & Tailoring: Our suits and vests are crafted using premium fabrics such as wool, linen, and cotton blends, offering the perfect balance between comfort and structure. With attention to detail in every stitch, each piece is tailored to provide a refined, flattering fit.`}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-6" />

            {/* Utility Links */}
            <div className="flex flex-wrap items-center gap-4 mb-7 text-xs text-gray-500">
              <button
                onClick={() => {
                  setSizeGuideOpen(true)
                  setActiveTab('sizing')
                }}
                className="flex items-center gap-1.5 hover:text-black transition-colors"
              >
                <Ruler size={14} />
                Size Guide
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() => setCompareOpen(!compareOpen)}
                className="flex items-center gap-1.5 hover:text-black transition-colors"
              >
                <ArrowLeftRight size={14} />
                Compare
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() => setEnquireProduct(product)}
                className="flex items-center gap-1.5 hover:text-black transition-colors"
              >
                <HelpCircle size={14} />
                Ask a Question
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.title,
                      text: `Check out ${product.title} at Bremer Suits`,
                      url: window.location.href,
                    }).catch(() => {})
                  } else {
                    navigator.clipboard.writeText(window.location.href).catch(() => {})
                  }
                }}
                className="flex items-center gap-1.5 hover:text-black transition-colors"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>

            {/* Quantity + Add to Cart (side by side) */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-sm font-semibold text-black border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-12 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-white border border-black text-black text-xs tracking-[0.2em] uppercase font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
            </div>

            {/* Buy It Now */}
            <button
              onClick={() => {
                if (!selectedSize) {
                  setSizeError(true)
                  return
                }
                handleAddToCart()
                window.location.href = '/checkout'
              }}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-black text-white text-xs tracking-[0.2em] uppercase font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md mb-7"
            >
              Buy It Now
            </button>

            {/* Delivery & Return Info */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Truck size={16} className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 pt-1.5">
                  Estimate delivery times:{' '}
                  <span className="font-semibold text-black">12–26 days</span> (International),{' '}
                  <span className="font-semibold text-black">3–6 days</span> (United States).
                </p>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <RotateCcw size={16} className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 pt-1.5">
                  Return within <span className="font-semibold text-black">45 days</span> of
                  purchase. Duties &amp; taxes are non-refundable.
                </p>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 pt-1.5">
                  <span className="font-semibold text-black">Quality Guaranteed</span> — handcrafted with premium fabrics and our fit guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Panel */}
      {compareOpen && (
        <section className="border-t border-gray-200 bg-white py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-xl lg:text-2xl font-bold text-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <ArrowLeftRight size={20} className="inline mr-2 -mt-0.5" />
                Compare with Similar Suits
              </h2>
              <button
                onClick={() => setCompareOpen(false)}
                className="text-xs text-gray-400 hover:text-black transition-colors uppercase tracking-wider font-medium"
              >
                Close
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 pr-6 font-semibold text-black w-32">Feature</th>
                    <th className="text-left py-3 pr-6 font-semibold text-black">
                      <span className="px-2 py-0.5 bg-black text-white text-xs rounded">{product.title}</span>
                    </th>
                    {relatedProducts.slice(0, 2).map((item) => (
                      <th key={item.id} className="text-left py-3 pr-6 font-semibold text-black">
                        <Link
                          to="/collections/$slug"
                          params={{ slug: item.id }}
                          className="hover:text-gray-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-6 text-gray-500 font-medium">Price</td>
                    <td className="py-3 pr-6 font-semibold text-black">{product.price}</td>
                    {relatedProducts.slice(0, 2).map((item) => (
                      <td key={item.id} className="py-3 pr-6 text-gray-700">{item.price}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-6 text-gray-500 font-medium">Fabric</td>
                    <td className="py-3 pr-6 text-gray-700">{product.fabric}</td>
                    {relatedProducts.slice(0, 2).map((item) => (
                      <td key={item.id} className="py-3 pr-6 text-gray-700">{item.fabric}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-6 text-gray-500 font-medium">Category</td>
                    <td className="py-3 pr-6 text-gray-700">{product.category}</td>
                    {relatedProducts.slice(0, 2).map((item) => (
                      <td key={item.id} className="py-3 pr-6 text-gray-700">{item.category}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-6 text-gray-500 font-medium">Colors</td>
                    <td className="py-3 pr-6">
                      <div className="flex gap-1.5">
                        {product.colors.map((c) => (
                          <span
                            key={c.name}
                            className="w-5 h-5 rounded-full ring-1 ring-gray-200"
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </td>
                    {relatedProducts.slice(0, 2).map((item) => (
                      <td key={item.id} className="py-3 pr-6">
                        <div className="flex gap-1.5">
                          {item.colors.map((c) => (
                            <span
                              key={c.name}
                              className="w-5 h-5 rounded-full ring-1 ring-gray-200"
                              style={{ backgroundColor: c.value }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-6 text-gray-500 font-medium">Sizes</td>
                    <td className="py-3 pr-6 text-gray-700 text-xs">{product.sizes.join(', ')}</td>
                    {relatedProducts.slice(0, 2).map((item) => (
                      <td key={item.id} className="py-3 pr-6 text-gray-700 text-xs">{item.sizes.join(', ')}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 text-gray-500 font-medium">SKU</td>
                    <td className="py-3 pr-6 text-gray-700 font-mono text-xs">{product.sku}</td>
                    {relatedProducts.slice(0, 2).map((item) => (
                      <td key={item.id} className="py-3 pr-6 text-gray-700 font-mono text-xs">{item.sku}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tabs: Description, Shipping & Sizing */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Headers */}
          <div className="flex gap-8 border-b border-gray-100">
            {(['description', 'shipping', 'sizing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium tracking-wide transition-colors relative capitalize ${
                  activeTab === tab
                    ? 'text-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'shipping' ? 'Shipping & Return' : tab === 'sizing' ? 'Size Guide' : tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-10 lg:py-14">
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  {product.description ||
                    `Discover the ${product.title} — a meticulously crafted piece from our collection. Made with ${product.fabric}, this suit offers both comfort and sophistication for the modern gentleman.`}
                </p>

                {/* Outstanding Features */}
                <div className="mb-10">
                  <h3
                    className="text-lg font-bold text-black mb-4"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Outstanding Features
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li className="flex items-start gap-2">
                      <span className="text-black mt-1">•</span>
                      Premium {product.fabric} for exceptional drape and comfort
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black mt-1">•</span>
                      Half-canvas construction for a natural, tailored silhouette
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black mt-1">•</span>
                      Hand-finished buttonholes and pick-stitch detailing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black mt-1">•</span>
                      Fully lined with premium satin for a smooth fit
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black mt-1">•</span>
                      Surgeon cuffs and functional sleeve buttons
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black mt-1">•</span>
                      Available in {product.colors.length} colors: {product.colors.map((c) => c.name).join(', ')}
                    </li>
                  </ul>
                </div>

                {/* Product Details */}
                <div className="mb-10 bg-gray-50 rounded-xl p-6">
                  <h3
                    className="text-lg font-bold text-black mb-4"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Product Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-gray-500">SKU</span>
                    <span className="text-gray-700 font-mono">{product.sku}</span>
                    <span className="text-gray-500">Category</span>
                    <span className="text-gray-700">{product.category}</span>
                    <span className="text-gray-500">Fabric</span>
                    <span className="text-gray-700">{product.fabric}</span>
                    <span className="text-gray-500">Available Sizes</span>
                    <span className="text-gray-700">{product.sizes.join(', ')}</span>
                    <span className="text-gray-500">Colors</span>
                    <span className="text-gray-700">{product.colors.map((c) => c.name).join(', ')}</span>
                  </div>
                </div>

                {/* Product Supreme Quality */}
                <div>
                  <h3
                    className="text-lg font-bold text-black mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Product Supreme Quality
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    Every piece in our collection is handcrafted by skilled artisans using
                    time-honoured tailoring techniques. We source fabrics from the finest
                    mills in Italy and Britain, ensuring each suit meets the highest
                    standards of quality, durability, and style.
                  </p>

                  {/* Related quality images - 4 in a row */}
                  <div className="grid grid-cols-4 gap-4">
                    {relatedProducts.slice(0, 4).map((item) => (
                      <Link
                        key={item.id}
                        to="/collections/$slug"
                        params={{ slug: item.id }}
                        className="group"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-xs font-medium text-black mt-2 group-hover:text-gray-500 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">{item.price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-4xl space-y-4 text-sm text-gray-500 leading-relaxed">
                <p>
                  For all orders exceeding a value of 100USD shipping is offered for free.
                </p>
                <p>
                  Returns will be accepted for up to 10 days of Customer's receipt or
                  tracking number on unworn items. You, as a Customer, are obliged to inform
                  us via email before you return the item.
                </p>
                <p>
                  Otherwise, standard shipping charges apply. Check out our delivery{' '}
                  <Link to="/about" className="text-black underline hover:text-gray-600">
                    Terms &amp; Conditions
                  </Link>{' '}
                  for more details.
                </p>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="max-w-4xl">
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Use this guide to find your perfect fit. Measurements are in inches. If you fall between sizes, we recommend sizing up for a comfortable fit.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-black border-b border-gray-200">Size</th>
                        <th className="text-left py-3 px-4 font-semibold text-black border-b border-gray-200">Chest</th>
                        <th className="text-left py-3 px-4 font-semibold text-black border-b border-gray-200">Waist</th>
                        <th className="text-left py-3 px-4 font-semibold text-black border-b border-gray-200">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuideData.map((row) => (
                        <tr
                          key={row.size}
                          className={`border-b border-gray-100 ${
                            product.sizes.includes(row.size) ? '' : 'opacity-30'
                          } ${selectedSize === row.size ? 'bg-gray-50' : ''}`}
                        >
                          <td className="py-3 px-4 font-medium text-black">{row.size}</td>
                          <td className="py-3 px-4 text-gray-600">{row.chest}</td>
                          <td className="py-3 px-4 text-gray-600">{row.waist}</td>
                          <td className="py-3 px-4 text-gray-600">{row.hips}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Sizes greyed out are not available for this product. Need a custom size?{' '}
                  <button
                    onClick={() => setEnquireProduct(product)}
                    className="text-black underline hover:text-gray-600 transition-colors"
                  >
                    Contact us
                  </button>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* You Might Also Like */}
      <section className="border-t border-gray-200 py-16 lg:py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl lg:text-3xl font-bold text-black text-center mb-10"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            You Might Also Like
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                to="/collections/$slug"
                params={{ slug: item.id }}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.tag && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-[10px] tracking-wider uppercase font-semibold rounded-md">
                      {item.tag}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-black group-hover:text-gray-500 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-black font-medium">{item.price}</p>
                    {item.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">{item.originalPrice}</p>
                    )}
                  </div>
                  <div className="flex gap-1 mt-2">
                    {item.colors.slice(0, 4).map((c) => (
                      <span
                        key={c.name}
                        className="w-3.5 h-3.5 rounded-full ring-1 ring-gray-200"
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enquire Modal */}
      <EnquireModal
        product={
          enquireProduct
            ? {
                id: enquireProduct.id,
                title: enquireProduct.title,
                category: enquireProduct.category,
                fabric: enquireProduct.fabric,
                price: enquireProduct.price,
                numericPrice: enquireProduct.numericPrice,
                image: enquireProduct.image,
                tag: enquireProduct.tag,
              }
            : null
        }
        open={!!enquireProduct}
        onClose={() => setEnquireProduct(null)}
      />
    </div>
  )
}
