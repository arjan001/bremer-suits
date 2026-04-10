import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, Sparkles, X } from 'lucide-react'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
})

const categories = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Wedding & Events' },
  { id: 'bespoke', label: 'Bespoke Suits' },
  { id: 'made-to-measure', label: 'Made-to-Measure' },
]

const portfolioItems = [
  // Wedding & Events
  { src: '/images/portfolio/wedding-pink-green-stairs.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-brown-beige-group.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-white-suit-bride.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-teal-groomsmen.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-camo-black-group.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-beige-reception.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-black-suits-outdoor.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-green-white-groom.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-red-suits-group.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-pink-blazers-wall.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-party-green-dresses.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-cream-bridal-lineup.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-beach-beige.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-grey-suits.jpg', category: 'wedding' },
  // Bespoke
  { src: '/images/portfolio/bespoke-navy-pinstripe-man.jpg', category: 'bespoke' },
  { src: '/images/portfolio/bespoke-grey-tweed.jpg', category: 'bespoke' },
  { src: '/images/portfolio/bespoke-white-black-blazer.jpg', category: 'bespoke' },
  { src: '/images/portfolio/bespoke-burgundy-mannequin.jpg', category: 'bespoke' },
  { src: '/images/portfolio/bespoke-maroon-mannequin.jpg', category: 'bespoke' },
  { src: '/images/portfolio/bespoke-brown-pinstripe.jpg', category: 'bespoke' },
  // Made-to-Measure
  { src: '/images/portfolio/bespoke-cream-double-breasted.jpg', category: 'made-to-measure' },
  { src: '/images/portfolio/bespoke-orange-mannequin.jpg', category: 'made-to-measure' },
  { src: '/images/portfolio/bespoke-brown-duo-mannequin.jpg', category: 'made-to-measure' },
  { src: '/images/portfolio/bespoke-green-pinstripe.jpg', category: 'made-to-measure' },
  // Existing portfolio images
  { src: '/images/portfolio/wedding-beige-groomsmen.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-black-suits.jpg', category: 'wedding' },
  { src: '/images/portfolio/wedding-pink-blazers.jpg', category: 'wedding' },
  { src: '/images/portfolio/bespoke-pinstripe.jpg', category: 'bespoke' },
  { src: '/images/portfolio/bespoke-cream-double.jpg', category: 'made-to-measure' },
  { src: '/images/portfolio/bespoke-orange-suit.jpg', category: 'made-to-measure' },
  { src: '/images/portfolio/bespoke-brown-duo.jpg', category: 'bespoke' },
]

function PortfolioPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredItems =
    activeCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/portfolio/wedding-camo-black-group.jpg"
            alt="Portfolio hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-4 font-medium flex items-center gap-2">
            <Sparkles size={14} /> Our Portfolio
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Craftsmanship in Every Stitch
          </h1>
          <p className="text-lg text-white/60 max-w-xl font-light leading-relaxed">
            Explore our collection of bespoke work and the moments
            that define the Bremer legacy.
          </p>
        </div>
      </section>

      {/* Portfolio Grid with Category Filters */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c8502a] mb-2 font-semibold">
              Our Work
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-black mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Gallery
            </h2>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-semibold border transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 lg:gap-4 space-y-3 lg:space-y-4">
            {filteredItems.map((item, idx) => (
              <div
                key={`${item.src}-${idx}`}
                className="break-inside-avoid overflow-hidden group cursor-pointer"
                onClick={() => setSelectedImage(item.src)}
              >
                <div className="relative overflow-hidden bg-gray-100">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0">
          <img src="/images/portfolio/bespoke-burgundy-mannequin.jpg" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] mb-4 font-semibold">
            Let&apos;s Work Together
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Start Your Bespoke Journey
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-lg mx-auto font-light">
            Whether it&apos;s a wedding, corporate event, or personal wardrobe refresh,
            we&apos;re here to craft something extraordinary for you.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
          >
            Book a Consultation <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Portfolio detail"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
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
