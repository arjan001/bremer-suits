import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Heart, ChevronLeft, ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid, X } from 'lucide-react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useWishlist } from '@/lib/wishlist-context'
import { getProducts, type Product } from '@/lib/products'

const BASE = '/.netlify/functions'

interface CategoryData {
  name: string
  slug: string
  image: string
  status: string
}

export const Route = createFileRoute('/collections/')({
  component: Collections,
})

function Collections() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { toggleItem, isInWishlist } = useWishlist()
  const [dynamicCategories, setDynamicCategories] = useState<CategoryData[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sortBy, setSortBy] = useState('featured')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      const prods = await getProducts()
      setProducts(prods)

      // Compute max price
      if (prods.length > 0) {
        const max = Math.max(...prods.map((p) => p.numericPrice || 0))
        const roundedMax = Math.ceil(max / 10) * 10 || 1000
        setMaxPrice(roundedMax)
        setPriceRange([0, roundedMax])
      }

      // Load categories from API
      try {
        const res = await fetch(`${BASE}/admin-categories`)
        if (res.ok) {
          const cats = (await res.json()) as CategoryData[]
          const active = cats.filter((c) => c.status === 'active')
          if (active.length > 0) {
            setDynamicCategories(active)
          }
        }
      } catch { /* ignore */ }
    }
    loadData()
  }, [])

  // Extract all unique colors from products
  const allColors = useMemo(() => {
    const colorMap = new Map<string, string>()
    products.forEach((p) => {
      p.colors.forEach((c) => {
        if (!colorMap.has(c.name)) colorMap.set(c.name, c.value)
      })
    })
    return Array.from(colorMap.entries()).map(([name, value]) => ({ name, value }))
  }, [products])

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    products.forEach((p) => {
      if (p.tag) tags.add(p.tag)
    })
    return Array.from(tags)
  }, [products])

  // Category names for sidebar
  const categoryNames = useMemo(() => {
    if (dynamicCategories.length > 0) return dynamicCategories.map((c) => c.name)
    return [...new Set(products.map((p) => p.category))].filter(Boolean)
  }, [dynamicCategories, products])

  // Filter products
  const filteredItems = useMemo(() => {
    let items = products

    if (selectedCategories.length > 0) {
      items = items.filter((p) => selectedCategories.includes(p.category))
    }

    items = items.filter((p) => {
      const price = p.numericPrice || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    if (selectedColors.length > 0) {
      items = items.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      )
    }

    if (selectedTags.length > 0) {
      items = items.filter((p) => p.tag && selectedTags.includes(p.tag))
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        items = [...items].sort((a, b) => (a.numericPrice || 0) - (b.numericPrice || 0))
        break
      case 'price-high':
        items = [...items].sort((a, b) => (b.numericPrice || 0) - (a.numericPrice || 0))
        break
      case 'name-az':
        items = [...items].sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-za':
        items = [...items].sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }

    return items
  }, [products, selectedCategories, priceRange, selectedColors, selectedTags, sortBy])

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
  }

  const toggleColor = (name: string) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
  }

  const toggleTag = (name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    )
  }

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 200
      carouselRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const activeFilterCount = selectedCategories.length + selectedColors.length + selectedTags.length + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedTags([])
    setPriceRange([0, maxPrice])
  }

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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <h1
            className="text-4xl lg:text-6xl text-white mb-2 italic"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Clean Cut
          </h1>
        </div>
      </section>

      {/* Category Carousel */}
      {dynamicCategories.length > 0 && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="relative">
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide px-6 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {dynamicCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => toggleCategory(cat.name)}
                    className={`flex flex-col items-center gap-2 shrink-0 snap-start transition-all duration-200 ${
                      selectedCategories.includes(cat.name) ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gray-100 ring-2 transition-all duration-200 ${
                      selectedCategories.includes(cat.name) ? 'ring-black' : 'ring-transparent'
                    }`}>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          {cat.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] lg:text-xs text-center font-medium text-gray-700 max-w-[90px] truncate">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => scrollCarousel('right')}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content: Sidebar + Grid */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-black text-white rounded-full shadow-lg text-sm font-medium"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-white text-black rounded-full text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto shadow-xl">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-bold uppercase tracking-wider">Filters</h2>
                    <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-black">
                      <X size={20} />
                    </button>
                  </div>
                  <SidebarContent
                    categoryNames={categoryNames}
                    selectedCategories={selectedCategories}
                    toggleCategory={toggleCategory}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    maxPrice={maxPrice}
                    allTags={allTags}
                    selectedTags={selectedTags}
                    toggleTag={toggleTag}
                    allColors={allColors}
                    selectedColors={selectedColors}
                    toggleColor={toggleColor}
                    activeFilterCount={activeFilterCount}
                    clearAllFilters={clearAllFilters}
                  />
                </div>
              </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <SidebarContent
                categoryNames={categoryNames}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
                allTags={allTags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                allColors={allColors}
                selectedColors={selectedColors}
                toggleColor={toggleColor}
                activeFilterCount={activeFilterCount}
                clearAllFilters={clearAllFilters}
              />
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-black">Collections</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{filteredItems.length} products</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs border border-gray-200 rounded px-3 py-2 bg-white text-gray-600 focus:border-black focus:ring-1 focus:ring-black outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-az">Name: A to Z</option>
                    <option value="name-za">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Active filter pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedCategories.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                      {c}
                      <button onClick={() => toggleCategory(c)} className="text-gray-400 hover:text-black"><X size={12} /></button>
                    </span>
                  ))}
                  {selectedTags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                      {t}
                      <button onClick={() => toggleTag(t)} className="text-gray-400 hover:text-black"><X size={12} /></button>
                    </span>
                  ))}
                  {selectedColors.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                      {c}
                      <button onClick={() => toggleColor(c)} className="text-gray-400 hover:text-black"><X size={12} /></button>
                    </span>
                  ))}
                  <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-700 font-medium px-2">
                    Clear all
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
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
                            {/* Wishlist button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleItem(item.id)
                              }}
                              className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200 z-10 ${
                                inWishlist
                                  ? 'text-red-500'
                                  : 'text-gray-400 hover:text-red-400'
                              }`}
                              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                              <Heart size={16} className={inWishlist ? 'fill-red-500' : ''} />
                            </button>
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
                          <Link
                            to="/collections/$slug"
                            params={{ slug: item.id }}
                            className="block"
                          >
                            <h3 className="text-sm font-semibold text-black mb-1.5 line-clamp-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {item.salePrice ? (
                                <>
                                  <span className="text-sm font-bold text-black">{item.salePrice}</span>
                                  {item.originalPrice && (
                                    <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className="text-sm font-bold text-black">{item.price}</span>
                                  {item.originalPrice && item.originalPrice !== item.price && (
                                    <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                                  )}
                                </>
                              )}
                            </div>
                          </Link>
                          {/* Color swatches */}
                          {item.colors.length > 0 && (
                            <div className="flex gap-1.5 mt-2.5">
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
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <Heart size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {activeFilterCount > 0 ? 'No products match your filters' : 'No products available yet'}
                  </h3>
                  <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
                    {activeFilterCount > 0
                      ? 'Try adjusting your filters or clearing them to see more products.'
                      : 'Our collection is being curated. Check back soon for new arrivals.'}
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm font-medium text-black underline hover:no-underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
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

/* ── Sidebar Filter Content ── */
function SidebarContent({
  categoryNames,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  maxPrice,
  allTags,
  selectedTags,
  toggleTag,
  allColors,
  selectedColors,
  toggleColor,
  activeFilterCount,
  clearAllFilters,
}: {
  categoryNames: string[]
  selectedCategories: string[]
  toggleCategory: (name: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  maxPrice: number
  allTags: string[]
  selectedTags: string[]
  toggleTag: (name: string) => void
  allColors: { name: string; value: string }[]
  selectedColors: string[]
  toggleColor: (name: string) => void
  activeFilterCount: number
  clearAllFilters: () => void
}) {
  return (
    <div className="space-y-6 p-5 lg:p-0">
      {/* Categories */}
      {categoryNames.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Categories</h3>
          <div className="space-y-2">
            {categoryNames.map((name) => (
              <label key={name} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(name)}
                  onChange={() => toggleCategory(name)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                />
                <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Price</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>${priceRange[0]} USD</span>
            <span>${priceRange[1]} USD</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Tag</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {allColors.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {allColors.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={`w-7 h-7 rounded-full transition-all duration-200 ${
                  selectedColors.includes(color.name)
                    ? 'ring-2 ring-black ring-offset-2'
                    : 'ring-1 ring-gray-200 hover:ring-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 text-xs font-semibold text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors uppercase tracking-wider"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}
