import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useWishlist } from '@/lib/wishlist-context'
import { allProducts } from '@/lib/products'

export const Route = createFileRoute('/collections/')({
  component: Collections,
})

function Collections() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const { toggleItem, isInWishlist } = useWishlist()
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([])

  // Load categories from admin store in localStorage to match collections
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bremer-admin-categories')
      if (stored) {
        const cats = JSON.parse(stored) as Array<{ name: string; status: string }>
        const activeNames = cats.filter((c) => c.status === 'active').map((c) => c.name)
        if (activeNames.length > 0) {
          setDynamicCategories(activeNames)
        }
      }
    } catch { /* ignore */ }
  }, [])

  const categories = dynamicCategories.length > 0
    ? ['All', ...dynamicCategories]
    : ['All', 'Business', 'Black Tie', 'Casual', 'Seasonal', 'Vests']

  const filteredItems = activeCategory === 'All'
    ? allProducts
    : allProducts.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/suit-formal.webp"
            alt="Collections"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3 font-medium">
            Our Collections
          </p>
          <h1
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Collection
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            A curated selection of bespoke pieces from our atelier. Each design
            reflects a unique story and the highest standards of craftsmanship.
          </p>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs tracking-widest uppercase font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid - 4 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredItems.map((item) => {
              const inWishlist = isInWishlist(item.id)
              return (
                <div
                  key={item.id}
                  className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <Link
                    to="/collections/$slug"
                    params={{ slug: item.id }}
                    className="block"
                  >
                    <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover product-img-zoom"
                      />
                      {item.tag && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-[10px] tracking-wider uppercase font-semibold">
                          {item.tag}
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

                  <div className="p-4 lg:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to="/collections/$slug"
                        params={{ slug: item.id }}
                        className="block flex-1 min-w-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] tracking-wide uppercase text-gray-400">{item.category}</p>
                          <p className="text-[11px] tracking-wide text-gray-400 hidden sm:block">{item.fabric}</p>
                        </div>
                        <h3 className="text-sm lg:text-base font-semibold text-black mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-black font-medium">{item.price}</p>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleItem(item.id)
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
                      {item.colors.slice(0, 4).map((c) => (
                        <span
                          key={c.name}
                          className="w-3.5 h-3.5 rounded-full ring-1 ring-gray-200"
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                      {item.colors.length > 4 && (
                        <span className="text-[10px] text-gray-400 ml-0.5 self-center">+{item.colors.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Commission Your Own Piece
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-lg mx-auto font-light">
            Every suit in our collection began as a conversation. Let's start yours.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
          >
            Start Your Project
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
