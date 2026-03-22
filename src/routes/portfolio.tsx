import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ArrowRight, Eye, Filter, Sparkles } from 'lucide-react'

const BASE = '/.netlify/functions'

interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  tag: string
  category: string
  client_name: string
  is_featured: boolean
  sort_order: number
  status: string
  created_at: string
}

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  const categories = ['All', 'Recent Work', 'Partnerships', 'Gallery']

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch(`${BASE}/admin-portfolio?status=active`)
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  const filtered = activeFilter === 'All' ? items : items.filter((i) => i.category === activeFilter)
  const featured = items.filter((i) => i.is_featured).slice(0, 3)

  const getTagStyles = (tag: string) => {
    switch (tag) {
      case 'new': return 'bg-emerald-500 text-white'
      case 'partnership': return 'bg-blue-600 text-white'
      case 'featured': return 'bg-amber-500 text-white'
      case 'gallery': return 'bg-purple-600 text-white'
      default: return 'bg-gray-700 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          {featured[0]?.image && (
            <img
              src={featured[0].image}
              alt="Portfolio hero"
              className="w-full h-full object-cover opacity-30"
            />
          )}
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
            Explore our collection of bespoke work, exclusive partnerships, and the moments
            that define the Bremer legacy.
          </p>
        </div>
      </section>

      {/* Featured Highlights */}
      {featured.length > 0 && (
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-[#5b7b9a] mb-2 font-semibold">
                Highlights
              </p>
              <h2
                className="text-3xl lg:text-4xl font-semibold text-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Featured Work
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative overflow-hidden bg-black aspect-[3/4] block text-left"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {item.tag && (
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm mb-3 ${getTagStyles(item.tag)}`}>
                        {item.tag}
                      </span>
                    )}
                    <h3
                      className="text-lg font-bold text-white mb-1"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.title}
                    </h3>
                    {item.client_name && (
                      <p className="text-xs text-white/60">{item.client_name}</p>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Eye size={18} className="text-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <h2
                className="text-3xl lg:text-4xl font-semibold text-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                All Projects
              </h2>
              <p className="text-sm text-gray-500 mt-2">Browse our complete portfolio of work</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <Filter size={14} className="text-gray-400 ml-2 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-md transition-all duration-200 ${
                    activeFilter === cat
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filtered.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group cursor-pointer text-left ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <div className={`relative overflow-hidden bg-gray-100 rounded-lg ${idx === 0 ? 'aspect-[4/3]' : 'aspect-[4/3]'}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Tag */}
                    {item.tag && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${getTagStyles(item.tag)}`}>
                        {item.tag}
                      </span>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm text-white/80 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      {item.category && (
                        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">{item.category}</span>
                      )}
                    </div>
                    <h3
                      className="text-base font-semibold text-black group-hover:text-gray-600 transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.title}
                    </h3>
                    {item.client_name && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.client_name}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No portfolio items yet</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Our portfolio is being updated with our latest work. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-black" />
        {featured[1]?.image && (
          <div className="absolute inset-0">
            <img src={featured[1].image} alt="" className="w-full h-full object-cover opacity-20" />
          </div>
        )}
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

      {/* Lightbox / Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="md:w-1/2 aspect-square md:aspect-auto bg-gray-100 shrink-0">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-8 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                {selectedItem.tag && (
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm ${getTagStyles(selectedItem.tag)}`}>
                    {selectedItem.tag}
                  </span>
                )}
                {selectedItem.category && (
                  <span className="text-[10px] tracking-wider uppercase text-gray-400 font-medium">{selectedItem.category}</span>
                )}
              </div>

              <h2
                className="text-2xl font-bold text-black mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {selectedItem.title}
              </h2>

              {selectedItem.description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{selectedItem.description}</p>
              )}

              {selectedItem.client_name && (
                <div className="mb-6">
                  <p className="text-xs tracking-wider uppercase text-gray-400 font-medium mb-1">Client</p>
                  <p className="text-sm font-medium text-black">{selectedItem.client_name}</p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-6 mt-auto">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.15em] uppercase bg-black text-white hover:bg-gray-800 transition-colors font-semibold"
                >
                  Start a Similar Project <ArrowRight size={14} />
                </Link>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 md:static mt-4 text-sm text-gray-500 hover:text-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
