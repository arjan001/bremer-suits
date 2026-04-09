import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
})

const portfolioImages = [
  '/images/portfolio/portfolio-1.webp',
  '/images/portfolio/portfolio-2.webp',
  '/images/portfolio/portfolio-3.webp',
  '/images/portfolio/portfolio-4.webp',
  '/images/portfolio/portfolio-5.webp',
  '/images/portfolio/portfolio-6.webp',
  '/images/portfolio/portfolio-7.webp',
  '/images/portfolio/portfolio-8.webp',
  '/images/portfolio/portfolio-9.webp',
  '/images/portfolio/portfolio-10.webp',
  '/images/portfolio/portfolio-11.webp',
  '/images/portfolio/portfolio-12.webp',
]

function PortfolioPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/portfolio/portfolio-7.webp"
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

      {/* Portfolio Grid - Clean images, no text descriptions */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c8502a] mb-2 font-semibold">
              Our Work
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Gallery
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {portfolioImages.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(src)}
                className="group relative overflow-hidden bg-gray-100 aspect-[3/4] block cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Portfolio piece ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0">
          <img src="/images/portfolio/portfolio-5.webp" alt="" className="w-full h-full object-cover opacity-20" />
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
              className="absolute -top-3 -right-3 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-200 transition-colors shadow-lg"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
