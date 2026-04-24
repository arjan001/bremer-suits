import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ArrowRight,
  Scissors,
  Ruler,
  RefreshCw,
  Shirt,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Handshake,
  Sparkles,
  X,
} from 'lucide-react'
import { getProducts, getCategories, type Product, type GalleryCategory } from '@/lib/products'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Bremer Suits | Premier Bespoke Tailoring & Custom Made Suits in Nairobi' },
      { name: 'description', content: 'Experience the art of perfection with Bremer Suits. Nairobi\'s leading specialists in high-end, custom-made suits for weddings, corporate leadership, and special occasions. Expertly fitted, made-to-order elegance.' },
      { name: 'keywords', content: 'Bremer Suits, Bremer, BremerSuits, BREMER SUITS, bremer suits Nairobi, bremer suits Kenya, bespoke suits Nairobi, custom made suits Kenya, premium men\'s tailoring, luxury wedding suits, made-to-order suits Nairobi, best suit tailors in Nairobi, custom made suits price in Kenya, bremer bespoke tailoring, men\'s fashion Kenya, groom suits Nairobi, corporate suits Kenya, luxury menswear Nairobi' },
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
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { property: 'og:title', content: 'Bremer Suits | Premier Bespoke Tailoring & Custom Made Suits in Nairobi' },
      { property: 'og:description', content: 'Experience the art of perfection with Bremer Suits. Nairobi\'s leading specialists in high-end, custom-made suits for weddings, corporate leadership, and special occasions.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://bremersuits.com' },
      { property: 'og:site_name', content: 'Bremer Suits' },
      { property: 'og:locale', content: 'en_KE' },
      { property: 'og:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Bremer Suits - Premier Bespoke Tailoring in Nairobi' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@bremersuits' },
      { name: 'twitter:creator', content: '@bremersuits' },
      { name: 'twitter:title', content: 'Bremer Suits | Premier Bespoke Tailoring & Custom Made Suits in Nairobi' },
      { name: 'twitter:description', content: 'Nairobi\'s leading specialists in high-end, custom-made suits for weddings, corporate leadership, and special occasions.' },
      { name: 'twitter:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { name: 'twitter:image:alt', content: 'Bremer Suits - Premier Bespoke Tailoring in Nairobi' },
      { name: 'geo.region', content: 'KE-110' },
      { name: 'geo.placename', content: 'Nairobi' },
      { name: 'geo.position', content: '-1.2864;36.8172' },
      { name: 'ICBM', content: '-1.2864, 36.8172' },
      { property: 'business:contact_data:street_address', content: 'Kimathi St' },
      { property: 'business:contact_data:locality', content: 'Nairobi' },
      { property: 'business:contact_data:country_name', content: 'Kenya' },
      { property: 'business:contact_data:email', content: 'brendahwanja6722@gmail.com' },
      { property: 'business:contact_data:phone_number', content: '+254 793 880642' },
      { name: 'subject', content: 'Bespoke Tailoring & Custom Made Suits' },
      { name: 'classification', content: 'Business' },
      { name: 'category', content: 'Fashion & Tailoring' },
      { name: 'coverage', content: 'Kenya' },
      { name: 'target', content: 'all' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'MobileOptimized', content: '320' },
    ],
    links: [
      { rel: 'canonical', href: 'https://bremersuits.com/' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bremersuits.com/' },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
})

const carouselImages = [
  '/images/carousel-new-1.jpg',
  '/images/carousel-new-2.jpg',
  '/images/carousel-new-3.jpg',
  '/images/couple-roses.jpg',
]

const pillars = [
  {
    number: '1',
    title: 'Precision Craftsmanship',
    description: 'Every stitch matters.',
    color: 'text-[#c8502a]',
  },
  {
    number: '2',
    title: 'Personalized Experience',
    description: 'Your style, your fit, your story.',
    color: 'text-[#c8502a]',
  },
  {
    number: '3',
    title: 'Timeless Style',
    description: 'Classic designs with enduring appeal.',
    color: 'text-[#c8502a]',
  },
  {
    number: '4',
    title: 'Integrity & Trust',
    description: 'We deliver on every promise.',
    color: 'text-[#c8502a]',
  },
]

const serviceCards = [
  {
    icon: Scissors,
    title: 'Bespoke Garments',
    description:
      'Custom-made suits designed from scratch to reflect your style and fit your body.',
  },
  {
    icon: RefreshCw,
    title: 'Alterations & Repairs',
    description:
      'Expert adjustments to improve fit, comfort, and style on any garment.',
  },
  {
    icon: Ruler,
    title: 'Made-to-Measure',
    description:
      'Choose from set styles with adjustments made to your measurements for a refined fit.',
  },
  {
    icon: Shirt,
    title: 'Restyling & Upcycling',
    description:
      'Modernize outdated garments and transform older pieces into fresh, stylish looks.',
  },
]

const KES_TO_USD = 130 // approximate conversion rate

const commitmentPoints = [
  {
    icon: Star,
    title: 'Quality Without Compromise',
    description: 'We source only the finest fabrics and employ time-tested techniques to create garments that last.',
  },
  {
    icon: Award,
    title: 'Attention to Detail',
    description: 'From buttonhole placement to lining selection, every element is considered with intention.',
  },
  {
    icon: Handshake,
    title: 'Client-First Approach',
    description: 'Your satisfaction drives everything we do. We don\'t rest until the fit is flawless.',
  },
  {
    icon: Sparkles,
    title: 'Modern Elegance',
    description: 'Traditional craftsmanship meets contemporary style for a look that\'s both classic and current.',
  },
]

const philosophyImages = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-19.jpg',
  '/images/gallery-20.jpg',
  '/images/gallery-21.jpg',
  '/images/gallery-40.jpg',
  '/images/gallery-41.jpg',
  '/images/gallery-6.jpg',
]

const cubeImages = [
  { src: '/images/cube-face-1.jpg', alt: 'Bremer Suits bespoke tailoring showcase - Front' },
  { src: '/images/cube-face-2.jpg', alt: 'Bremer Suits custom suit craftsmanship - Right' },
  { src: '/images/cube-face-3.jpg', alt: 'Bremer Suits luxury suit details - Back' },
  { src: '/images/about-model-1.jpg', alt: 'Master tailor handcrafting a bespoke suit - Left' },
]

const SITE_URL = 'https://bremersuits.com'
function getFullImageUrl(imagePath: string) {
  if (imagePath.startsWith('http')) return imagePath
  return `${SITE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [philosophyOffset, setPhilosophyOffset] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES')
  const [selectedColors, setSelectedColors] = useState<Record<number, number>>({})
  const philosophyRef = useRef<HTMLDivElement>(null)
  const [cubeFace, setCubeFace] = useState(0)
  const cubeContainerRef = useRef<HTMLDivElement>(null)
  const [cubeDepth, setCubeDepth] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>([])
  const [galleryCategoriesLoading, setGalleryCategoriesLoading] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  // Measure cube container width for 3D depth
  useEffect(() => {
    const updateDepth = () => {
      if (cubeContainerRef.current) {
        setCubeDepth(cubeContainerRef.current.offsetWidth / 2)
      }
    }
    updateDepth()
    window.addEventListener('resize', updateDepth)
    return () => window.removeEventListener('resize', updateDepth)
  }, [])

  // 3D cube auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCubeFace((prev) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Fetch products from database
  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .finally(() => setProductsLoading(false))
  }, [])

  // Fetch gallery categories from database
  useEffect(() => {
    getCategories()
      .then((data) => setGalleryCategories(data))
      .finally(() => setGalleryCategoriesLoading(false))
  }, [])

  // Philosophy carousel auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setPhilosophyOffset((prev) => {
        const maxOffset = Math.max(0, philosophyImages.length - 2)
        return prev >= maxOffset ? 0 : prev + 1
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO SECTION - Dynamic Carousel ===== */}
      <section className="relative bg-black overflow-hidden h-[100vh] max-h-[100vh] flex items-center">
        {carouselImages.map((src, idx) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: idx === currentSlide ? 1 : 0 }}
          >
            <img
              src={src}
              alt={`Bremer Suits bespoke tailoring collection Nairobi - Slide ${idx + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/20" />

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="text-white" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl leading-[1.15] mb-6 text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400, textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
          >
            Bremer Suits{' '}
            <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2">Expert Tailoring for Every Gentleman</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed mb-8 max-w-md mx-auto font-semibold">
            Custom-made suits crafted to fit your style, your story, and your budget.
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-10 py-4 text-xs tracking-[0.25em] uppercase bg-[#c8102e] text-white hover:bg-[#a30d25] transition-colors duration-300 font-semibold"
            >
              Book Your Fitting
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT US SECTION ===== */}
      <section className="py-16 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* 3D Cube Rotation */}
            <div className="aspect-[4/5] overflow-hidden bg-gray-100" ref={cubeContainerRef}>
              <div
                className="relative w-full h-full"
                style={{ perspective: '1200px' }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(${-cubeDepth}px) rotateY(${cubeFace * -90}deg)`,
                  }}
                >
                  {/* Front face (0deg) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateY(0deg) translateZ(${cubeDepth}px)`,
                    }}
                  >
                    <img
                      src={cubeImages[0].src}
                      alt={cubeImages[0].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Right face (90deg) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateY(90deg) translateZ(${cubeDepth}px)`,
                    }}
                  >
                    <img
                      src={cubeImages[1].src}
                      alt={cubeImages[1].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Back face (180deg) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateY(180deg) translateZ(${cubeDepth}px)`,
                    }}
                  >
                    <img
                      src={cubeImages[2].src}
                      alt={cubeImages[2].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Left face (270deg) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateY(270deg) translateZ(${cubeDepth}px)`,
                    }}
                  >
                    <img
                      src={cubeImages[3].src}
                      alt={cubeImages[3].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              {/* Cube face indicators */}
              <div className="flex justify-center gap-2 mt-3">
                {cubeImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCubeFace(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === cubeFace % 4 ? 'bg-[#c8502a] w-6' : 'bg-gray-300'}`}
                    aria-label={`Show cube face ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
                Heritage &amp; Trust
              </p>
              <h2
                className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-8"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                About Us
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-10">
                At Bremer, tailoring is more than our craft &mdash; it&apos;s our calling.
                Every garment we create is a blend of precision, artistry, and personal attention.
              </p>

              <h3
                className="text-xl font-bold text-black mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Our Four Pillars
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {pillars.map((pillar) => (
                  <div key={pillar.number}>
                    <h4 className={`text-sm font-semibold ${pillar.color} mb-1`}>
                      {pillar.number}. {pillar.title}
                    </h4>
                    <p className="text-sm text-gray-500">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BREMER'S BEST PICK - Product Gallery ===== */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
              Our Collection
            </p>
            <h2
              className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Bremer&apos;s Best Pick
            </h2>
            <p className="text-base text-gray-500 max-w-lg mx-auto mb-6">
              A glimpse into our bespoke creations and wedding collections.
            </p>
            {/* Currency Toggle */}
            <div className="inline-flex items-center border border-gray-300 rounded-full overflow-hidden text-xs">
              <button
                onClick={() => setCurrency('KES')}
                className={`px-4 py-2 font-semibold transition-colors duration-200 ${currency === 'KES' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                KES
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 font-semibold transition-colors duration-200 ${currency === 'USD' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                USD
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 xl:gap-6">
            {productsLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="border border-gray-100 bg-white animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="p-3 lg:p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gray-200" />
                      <div className="w-5 h-5 rounded-full bg-gray-200" />
                      <div className="w-5 h-5 rounded-full bg-gray-200" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No products available at the moment.</p>
            ) : (
            products.map((product, idx) => {
              const activeColor = selectedColors[idx] ?? 0
              const priceKES = product.numericPrice
              const priceUSD = Math.round(priceKES / KES_TO_USD)
              return (
                <div
                  key={product.id}
                  className="group border border-gray-100 bg-white hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div
                    className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onClick={() => setLightboxImage(product.image)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                    {product.tag && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#c8502a] text-white pointer-events-none">
                        {product.tag}
                      </span>
                    )}
                    {/* Order Similar Design Tooltip */}
                    <a
                      href={`https://wa.me/254793880642?text=${encodeURIComponent(`Hello Bremer Suits, I am interested in ordering a similar design to: ${product.title}. Could you share more details?\n\n${getFullImageUrl(product.image)}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 bg-black/80 text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-black z-10 whitespace-nowrap backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Order Similar Design
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                    </a>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 lg:p-4">
                    <h3 className="text-xs lg:text-sm font-bold text-black mb-1 leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-sm lg:text-base font-semibold text-[#c8502a] mb-3">
                      {currency === 'KES'
                        ? `KES ${priceKES.toLocaleString()}`
                        : `$${priceUSD.toLocaleString()}`}
                    </p>

                    {/* Color Variants */}
                    {product.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      {product.colors.map((color, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => setSelectedColors((prev) => ({ ...prev, [idx]: cIdx }))}
                          className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${activeColor === cIdx ? 'border-[#c8502a] scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                          aria-label={`Color: ${color.name}`}
                        />
                      ))}
                    </div>
                    )}

                    {/* Order Yours → WhatsApp */}
                    <a
                      href={`https://wa.me/254793880642?text=${encodeURIComponent(`Hello Bremer Suits, I am interested in this suit: ${product.title} (${currency === 'KES' ? `KES ${priceKES.toLocaleString()}` : `$${priceUSD.toLocaleString()}`}). Could you share more details?\n\n${getFullImageUrl(product.image)}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 text-[10px] lg:text-xs tracking-[0.15em] uppercase bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors duration-300 font-semibold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Order Yours
                    </a>
                  </div>
                </div>
              )
            })
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-10 py-4 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
            >
              See More of Our Collection
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GALLERY – SHOP BY CATEGORY (DB-driven) ===== */}
      <section className="py-16 lg:py-24 bg-[#f7f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
              Our Gallery
            </p>
            <h2
              className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Shop by Category
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Explore our collections — from wedding tuxedos and couples styling to senator and Kaunda suits,
              bespoke and made-to-measure tailoring.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6">
            {galleryCategoriesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-gray-200 animate-pulse rounded" />
              ))
            ) : galleryCategories.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No categories available yet.</p>
            ) : (
              galleryCategories.map((cat) => {
                const categoryCount = products.filter(
                  (p) => p.category === cat.name || p.category === cat.slug,
                ).length
                const portfolioHref = `/portfolio?category=${cat.slug}`
                return (
                  <a
                    key={cat.id}
                    href={portfolioHref}
                    aria-label={`View ${cat.name} collection`}
                    className="group relative overflow-hidden aspect-[4/3] bg-gray-100 block"
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={`${cat.name} – Bremer Suits collection`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3
                        className="text-lg lg:text-xl font-bold text-white mb-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-white/80 line-clamp-2 mb-2">
                          {cat.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] font-semibold">
                        {categoryCount > 0 && <span>{categoryCount} {categoryCount === 1 ? 'item' : 'items'}</span>}
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </a>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* ===== A TAILORING EXPERIENCE BUILT AROUND YOU ===== */}
      <section className="py-16 lg:py-28 bg-[#f7f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex flex-col justify-center">
              <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
                Crafted for two. Designed to turn heads together.
              </p>
              <h2
                className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Better Together,{' '}
                <span className="block">Styled Together</span>
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                At Bremer Suits, we believe the best moments are shared &mdash; and the best couples deserve wardrobes that speak as one. From coordinated wedding ensembles to date-night looks that complement each other perfectly, we design couples&rsquo; wear that celebrates your bond with elegance, harmony, and intention.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border-l-2 border-[#c8502a] pl-4">
                  <h4 className="text-sm font-bold text-black mb-1">His &amp; Hers</h4>
                  <p className="text-xs text-gray-500">Coordinated outfits that complement each other.</p>
                </div>
                <div className="border-l-2 border-[#c8502a] pl-4">
                  <h4 className="text-sm font-bold text-black mb-1">Wedding Sets</h4>
                  <p className="text-xs text-gray-500">Matching ensembles for your big day.</p>
                </div>
                <div className="border-l-2 border-[#c8502a] pl-4">
                  <h4 className="text-sm font-bold text-black mb-1">Custom Fabrics</h4>
                  <p className="text-xs text-gray-500">Shared palettes, unique silhouettes.</p>
                </div>
                <div className="border-l-2 border-[#c8502a] pl-4">
                  <h4 className="text-sm font-bold text-black mb-1">Styled as One</h4>
                  <p className="text-xs text-gray-500">Two looks, one unforgettable statement.</p>
                </div>
              </div>

              <div>
                <Link
                  to="/services"
                  className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-[#c8502a] text-white hover:bg-[#a83e1f] transition-colors duration-300 font-semibold"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              <img
                src="/images/couples-hero-process.jpg"
                alt="Couples styling and coordinated outfits by Bremer Suits Nairobi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR COMMITMENT SECTION ===== */}
      <section className="py-16 lg:py-28 bg-[#f7f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/commitment-section-new.jpg"
                alt="Bremer Suits style commitment - bespoke tailoring in Nairobi"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
                Dedicated to Excellence in Every Thread
              </p>
              <h2
                className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Our Commitment{' '}
                <span className="block">to Your Style</span>
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-8">
                We believe a well-crafted suit does more than dress a man &mdash; it transforms how he carries himself.
                Every piece we create is an investment in your confidence, your presence, and your story.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {commitmentPoints.map((point) => (
                  <div key={point.title} className="flex gap-3">
                    <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <point.icon size={18} className="text-[#c8502a]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black mb-1">{point.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
            What We Offer
          </p>
          <h2
            className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-14 max-w-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Our Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCards.map((service) => (
              <div
                key={service.title}
                className="border border-gray-200 p-8 flex flex-col gap-5 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <service.icon size={32} className="text-gray-700" strokeWidth={1.2} />
                </div>
                <h3 className="text-lg font-bold text-black">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
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

      {/* ===== OUR PHILOSOPHY - 2-image carousel ===== */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 font-medium">
                Our Philosophy
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold text-black mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Dress with Intention
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  We believe that every garment in your wardrobe should earn its place.
                  No filler, no trends for trend&apos;s sake &mdash; just thoughtful, well-made
                  pieces that serve your life and communicate your values.
                </p>
                <p>
                  Our approach blends the time-honored art of bespoke tailoring with
                  contemporary style strategy. We draw on decades of sartorial tradition
                  while keeping a sharp eye on the modern professional landscape.
                </p>
                <p>
                  The result is a wardrobe that doesn&apos;t just look good &mdash; it works.
                  It moves with you through meetings and milestones, first impressions
                  and lasting legacies.
                </p>
              </div>
            </div>

            {/* 2-image carousel */}
            <div className="overflow-hidden" ref={philosophyRef}>
              <div
                className="flex gap-3 transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${philosophyOffset * (50 + 0.75)}%)` }}
              >
                {philosophyImages.map((src, idx) => (
                  <div key={idx} className="min-w-[calc(50%-6px)] h-[300px] lg:h-[500px] overflow-hidden flex-shrink-0 relative group">
                    <img
                      src={src}
                      alt={`Bremer Suits tailoring philosophy and craftsmanship - Image ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <a
                      href={`https://wa.me/254793880642?text=${encodeURIComponent(`Hello Bremer Suits, I am interested in ordering a similar design from your collection. Could you share more details?\n\n${getFullImageUrl(src)}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-black/80 text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-black z-10 whitespace-nowrap backdrop-blur-sm"
                    >
                      Order Similar Design
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                    </a>
                  </div>
                ))}
              </div>
              {/* Carousel indicators */}
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: Math.max(1, philosophyImages.length - 1) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPhilosophyOffset(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === philosophyOffset ? 'bg-black w-5' : 'bg-gray-300'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MODERN CTA BANNER ===== */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[500px]">
          {/* Left: Image */}
          <div className="relative h-[300px] lg:h-auto overflow-hidden">
            <img
              src="/images/gallery-18.jpg"
              alt="Bremer Suits premium craftsmanship and luxury fabric selection Nairobi"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-black/50" />
          </div>

          {/* Right: Content */}
          <div className="bg-black flex items-center justify-center p-10 lg:p-16">
            <div className="max-w-md">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#c9a96e" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <h2
                className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Your Next Chapter{' '}
                <span className="block text-[#c9a96e]">Starts Here</span>
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                Whether it&apos;s your wedding day, a career milestone, or simply the
                decision to invest in yourself &mdash; we&apos;re here to craft the suit
                that marks the moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
                >
                  Book a Consultation
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase border border-white/30 text-white hover:bg-white/10 transition-colors duration-300 font-semibold"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Featured bespoke suit work by Bremer Suits Nairobi"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg"
            >
              <X size={18} />
            </button>
            {/* WhatsApp Enquire Button in Lightbox */}
            <a
              href={`https://wa.me/254793880642?text=${encodeURIComponent(`Hello Bremer Suits, I am interested in this suit. Could you share more details?\n\n${getFullImageUrl(lightboxImage || '')}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-xl hover:bg-[#20BD5A] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
