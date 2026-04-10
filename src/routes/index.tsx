import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import {
  ArrowRight,
  Scissors,
  Ruler,
  RefreshCw,
  Shirt,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export const Route = createFileRoute('/')({
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
  { src: '/images/portfolio/bespoke-green-pinstripe.jpg', span: '' },
  { src: '/images/portfolio/wedding-camo-black-group.jpg', span: 'row-span-2' },
  { src: '/images/portfolio/bespoke-navy-pinstripe-man.jpg', span: '' },
  { src: '/images/portfolio/wedding-pink-green-stairs.jpg', span: '' },
  { src: '/images/portfolio/bespoke-cream-double-breasted.jpg', span: '' },
  { src: '/images/portfolio/wedding-black-suits-outdoor.jpg', span: '' },
]

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

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
              alt={`Bremer Suits collection ${idx + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/55" />

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
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            Expert Tailoring{' '}
            <span className="block">for Every Gentleman</span>
          </h1>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8 max-w-md mx-auto font-light">
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
      <section className="py-16 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              <img
                src="/images/about-model-1.jpg"
                alt="Tailor working on a garment"
                className="w-full h-full object-cover"
              />
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
      {/* Text LEFT, Image RIGHT */}
      <section className="py-16 lg:py-28 bg-[#f7f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
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

            {/* Right: Image */}
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              <img
                src="/images/portfolio/bespoke-navy-pinstripe-man.jpg"
                alt="Bespoke tailoring experience"
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

          {/* Masonry-style grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 lg:gap-4 space-y-3 lg:space-y-4">
            {portfolioPreviewImages.map((item, idx) => (
              <div
                key={idx}
                className="break-inside-avoid overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.src}
                    alt={`Portfolio piece ${idx + 1}`}
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

      {/* ===== TESTIMONIAL / QUOTE BANNER ===== */}
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
            &ldquo;A suit should be a reflection of the man wearing it &mdash; his character, his confidence, his story.&rdquo;
          </blockquote>
          <p className="text-sm text-white/60 tracking-widest uppercase font-medium">
            &mdash; Bremer Suits &amp; Style
          </p>
        </div>
      </section>
    </div>
  )
}
