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

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Bremer Suits | Premier Bespoke Tailoring & Custom Made Suits in Nairobi',
      },
      {
        name: 'description',
        content: 'Experience the art of perfection with Bremer Suits. Nairobi\'s leading specialists in high-end, custom-made suits for weddings, corporate leadership, and special occasions. Expertly fitted, made-to-order elegance.',
      },
      {
        name: 'keywords',
        content: 'Bremer Suits, Bremer, BremerSuits, BREMER SUITS, bremer suits Nairobi, bremer suits Kenya, bespoke suits Nairobi, custom made suits Kenya, premium men\'s tailoring, luxury wedding suits, made-to-order suits Nairobi, best suit tailors in Nairobi, custom made suits price in Kenya, bremer bespoke tailoring',
      },
      {
        property: 'og:title',
        content: 'Bremer Suits | Premier Bespoke Tailoring & Custom Made Suits in Nairobi',
      },
      {
        property: 'og:description',
        content: 'Experience the art of perfection with Bremer Suits. Nairobi\'s leading specialists in high-end, custom-made suits for weddings, corporate leadership, and special occasions.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'og:image',
        content: 'https://bremersuits.com/images/og-logo-gold-black.jpg',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'Bremer Suits - Premier Bespoke Tailoring in Nairobi',
      },
      {
        name: 'twitter:image',
        content: 'https://bremersuits.com/images/og-logo-gold-black.jpg',
      },
      {
        property: 'og:url',
        content: 'https://bremersuits.com',
      },
    ],
  }),
  component: HomePage,
})

const carouselImages = [
  '/images/carousel-new-1.jpg',
  '/images/carousel-new-2.jpg',
  '/images/carousel-new-3.jpg',
  '/images/carousel-new-4.jpg',
  '/images/carousel-new-5.jpg',
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

const portfolioPreviewImages = [
  { src: '/images/portfolio/bespoke-burgundy-mannequin.jpg', span: 'row-span-2' },
  { src: '/images/portfolio/wedding-teal-groomsmen.jpg', span: '' },
  { src: '/images/portfolio/bespoke-navy-gold-buttons.jpg', span: '' },
  { src: '/images/portfolio/wedding-camo-black-group.jpg', span: 'row-span-2' },
  { src: '/images/portfolio/bespoke-houndstooth-vest.jpg', span: '' },
  { src: '/images/portfolio/wedding-black-tuxedo-walk.jpg', span: '' },
  { src: '/images/portfolio/bespoke-cream-double-breasted.jpg', span: '' },
  { src: '/images/portfolio/wedding-green-white-formation.jpg', span: '' },
]

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

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [philosophyOffset, setPhilosophyOffset] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const philosophyRef = useRef<HTMLDivElement>(null)
  const [cubeFace, setCubeFace] = useState(0)
  const cubeContainerRef = useRef<HTMLDivElement>(null)
  const [cubeDepth, setCubeDepth] = useState(0)

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
          <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-8 max-w-md mx-auto font-light" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
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

      {/* ===== A TAILORING EXPERIENCE BUILT AROUND YOU ===== */}
      <section className="py-16 lg:py-28 bg-[#f7f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="flex flex-col justify-center">
              <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
                Our process is designed to make you feel understood and involved.
              </p>
              <h2
                className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                A Tailoring Experience{' '}
                <span className="block">Built Around You</span>
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                From your first consultation to the final fitting, every step is guided by your vision. We listen, measure, craft, and refine &mdash; ensuring a garment that fits you perfectly in every way.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border-l-2 border-[#c8502a] pl-4">
                  <h4 className="text-sm font-bold text-black mb-1">Consultation</h4>
                  <p className="text-xs text-gray-500">Understanding your style and needs.</p>
                </div>
                <div className="border-l-2 border-[#c8502a] pl-4">
                  <h4 className="text-sm font-bold text-black mb-1">Measurements</h4>
                  <p className="text-xs text-gray-500">Precision patterns crafted for you.</p>
                </div>
                <div className="border-l-2 border-[#c8502a] pl-4">
                  <h4 className="text-sm font-bold text-black mb-1">Fittings</h4>
                  <p className="text-xs text-gray-500">Fine-tuning shape, drape, and balance.</p>
                </div>
                <div className="border-l-2 border-[#c8502a] pl-4">
                  <h4 className="text-sm font-bold text-black mb-1">Delivery</h4>
                  <p className="text-xs text-gray-500">Ready to wear, ready to impress.</p>
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
                src="/images/portfolio/bespoke-navy-pinstripe-man.jpg"
                alt="Bespoke custom tailoring consultation experience at Bremer Suits Nairobi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO PREVIEW SECTION - Masonry Style ===== */}
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
              Featured Work
            </h2>
            <p className="text-base text-gray-500 max-w-lg mx-auto">
              A glimpse into our bespoke creations and wedding collections.
            </p>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 lg:gap-4 space-y-3 lg:space-y-4">
            {portfolioPreviewImages.map((item, idx) => (
              <div
                key={idx}
                className="break-inside-avoid overflow-hidden group cursor-pointer"
                onClick={() => setLightboxImage(item.src)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.src}
                    alt={`Custom made suit portfolio by Bremer Suits Nairobi - Piece ${idx + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                </div>
              </div>
            ))}
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

      {/* ===== OUR COMMITMENT SECTION ===== */}
      <section className="py-16 lg:py-28 bg-[#f7f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/gallery-15.jpg"
                alt="Precision craftsmanship by Bremer Suits master tailors in Nairobi"
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
                  <div key={idx} className="min-w-[calc(50%-6px)] h-[300px] lg:h-[500px] overflow-hidden flex-shrink-0">
                    <img
                      src={src}
                      alt={`Bremer Suits tailoring philosophy and craftsmanship - Image ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Left: Image */}
          <div className="relative h-[300px] lg:h-auto lg:max-h-[500px] overflow-hidden">
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
          </div>
        </div>
      )}
    </div>
  )
}
