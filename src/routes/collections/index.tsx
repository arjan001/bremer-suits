import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Heart, ChevronLeft, ChevronRight, SlidersHorizontal, X, Grid3X3, LayoutGrid, Search } from 'lucide-react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useWishlist } from '@/lib/wishlist-context'
import { getProducts, type Product } from '@/lib/products'
import { z } from 'zod'

const BASE = '/.netlify/functions'

interface CategoryData {
  name: string
  slug: string
  image: string
  status: string
}

const collectionsSearchSchema = z.object({
  q: z.string().default('').catch(''),
})

export const Route = createFileRoute('/collections/')({
  head: () => ({
    meta: [
      {
        title: 'Collections | Premium Suits & Menswear | Bremer Suits Nairobi',
      },
      {
        name: 'description',
        content: 'Browse our collection of premium custom suits, ready-to-wear menswear, and luxury accessories. Handcrafted quality from Bremer Suits, Nairobi\'s finest tailors.',
      },
      {
        name: 'keywords',
        content: 'Bremer Suits, Bremer, BremerSuits, BREMER SUITS, premium suits Nairobi, custom suits collection, men\'s wear Kenya, luxury suits online, Bremer Suits collection, ready-to-wear suits Nairobi, bremer suits shop',
      },
      {
        property: 'og:title',
        content: 'Collections | Premium Suits & Menswear | Bremer Suits Nairobi',
      },
      {
        property: 'og:description',
        content: 'Browse our collection of premium custom suits, ready-to-wear menswear, and luxury accessories from Bremer Suits.',
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
        content: 'https://bremersuits.com/images/og-gold-striped-suit.jpg',
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
        content: 'Bremer Suits Collections - Premium Suits & Menswear',
      },
      {
        name: 'twitter:image',
        content: 'https://bremersuits.com/images/og-gold-striped-suit.jpg',
      },
      {
        property: 'og:url',
        content: 'https://bremersuits.com/collections',
      },
    ],
  }),
  component: Collections,
  validateSearch: collectionsSearchSchema,
})

const PRODUCTS_PER_PAGE = 12

function Collections() {
  const { q: searchQuery } = Route.useSearch()
  const navigate = useNavigate({ from: '/collections' })
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { toggleItem, isInWishlist } = useWishlist()
  const [dynamicCategories, setDynamicCategories] = useState<CategoryData[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sortBy, setSortBy] = useState('featured')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [gridCols, setGridCols] = useState<3 | 4>(3)
  const [currentPage, setCurrentPage] = useState(1)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Keep local search input in sync with URL
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

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

  // Extract all unique fabrics/brands
  const allFabrics = useMemo(() => {
    const fabrics = new Set<string>()
    products.forEach((p) => {
      if (p.fabric) fabrics.add(p.fabric)
    })
    return Array.from(fabrics)
  }, [products])

  // Category names for sidebar
  const categoryNames = useMemo(() => {
    if (dynamicCategories.length > 0) return dynamicCategories.map((c) => c.name)
    return [...new Set(products.map((p) => p.category))].filter(Boolean)
  }, [dynamicCategories, products])

  // Filter products
  const filteredItems = useMemo(() => {
    let items = products

    // Text search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q))
        )
      })
    }

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

    if (selectedFabrics.length > 0) {
      items = items.filter((p) => p.fabric && selectedFabrics.includes(p.fabric))
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
  }, [products, searchQuery, selectedCategories, priceRange, selectedColors, selectedTags, selectedFabrics, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / PRODUCTS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategories, priceRange, selectedColors, selectedTags, selectedFabrics, sortBy, searchQuery])

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

  const toggleFabric = (name: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
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

  const activeFilterCount = selectedCategories.length + selectedColors.length + selectedTags.length + selectedFabrics.length + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) + (searchQuery ? 1 : 0)

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedTags([])
    setSelectedFabrics([])
    setPriceRange([0, maxPrice])
    navigate({ search: { q: '' } })
  }

  const clearSearch = () => {
    navigate({ search: (prev) => ({ ...prev, q: '' }) })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ search: (prev) => ({ ...prev, q: localSearch.trim() }) })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={selectedCategories.length === 1 && dynamicCategories.find(c => c.name === selectedCategories[0])?.image
              ? dynamicCategories.find(c => c.name === selectedCategories[0])!.image
              : '/images/collections-banner.jpg'}
            alt={selectedCategories.length === 1 ? selectedCategories[0] : 'Collections'}
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">
          <h1
            className="text-4xl lg:text-6xl text-white mb-2 italic"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedCategories.length === 1
                ? selectedCategories[0]
                : selectedCategories.length > 1
                  ? 'Filtered Collections'
                  : 'Our Collections'}
          </h1>
        </div>
      </section>

      {/* Category Carousel — always show if categories exist */}
      {(dynamicCategories.length > 0 || categoryNames.length > 0) && (
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
                className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide px-6 snap-x snap-mandatory justify-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* "All" button */}
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`flex flex-col items-center gap-2 shrink-0 snap-start transition-all duration-200 ${
                    selectedCategories.length === 0 ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gray-100 ring-2 transition-all duration-200 flex items-center justify-center ${
                    selectedCategories.length === 0 ? 'ring-black' : 'ring-transparent'
                  }`}>
                    <LayoutGrid size={20} className="text-gray-500" />
                  </div>
                  <span className="text-[10px] lg:text-xs text-center font-medium text-gray-700">
                    All
                  </span>
                </button>

                {dynamicCategories.length > 0 ? (
                  dynamicCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        if (selectedCategories.length === 1 && selectedCategories[0] === cat.name) {
                          setSelectedCategories([])
                        } else {
                          setSelectedCategories([cat.name])
                        }
                      }}
                      className={`flex flex-col items-center gap-2 shrink-0 snap-start transition-all duration-200 ${
                        selectedCategories.includes(cat.name) ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gray-100 ring-2 transition-all duration-200 ${
                        selectedCategories.includes(cat.name) ? 'ring-black' : 'ring-transparent'
                      }`}>
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                            {cat.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] lg:text-xs text-center font-medium text-gray-700 max-w-[80px] truncate">
                        {cat.name}
                      </span>
                    </button>
                  ))
                ) : (
                  categoryNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        if (selectedCategories.length === 1 && selectedCategories[0] === name) {
                          setSelectedCategories([])
                        } else {
                          setSelectedCategories([name])
                        }
                      }}
                      className={`flex flex-col items-center gap-2 shrink-0 snap-start transition-all duration-200 ${
                        selectedCategories.includes(name) ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gray-100 ring-2 transition-all duration-200 flex items-center justify-center ${
                        selectedCategories.includes(name) ? 'ring-black' : 'ring-transparent'
                      }`}>
                        <span className="text-gray-400 text-sm font-bold">{name.charAt(0)}</span>
                      </div>
                      <span className="text-[10px] lg:text-xs text-center font-medium text-gray-700 max-w-[80px] truncate">
                        {name}
                      </span>
                    </button>
                  ))
                )}
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
                    allFabrics={allFabrics}
                    selectedFabrics={selectedFabrics}
                    toggleFabric={toggleFabric}
                    activeFilterCount={activeFilterCount}
                    clearAllFilters={clearAllFilters}
                  />
                </div>
              </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-60 shrink-0">
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
                allFabrics={allFabrics}
                selectedFabrics={selectedFabrics}
                toggleFabric={toggleFabric}
                activeFilterCount={activeFilterCount}
                clearAllFilters={clearAllFilters}
              />
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1 min-w-0">
              {/* Search bar */}
              <form onSubmit={handleSearchSubmit} className="mb-5">
                <div className="relative">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                  />
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  {localSearch && (
                    <button
                      type="button"
                      onClick={() => { setLocalSearch(''); navigate({ search: (prev) => ({ ...prev, q: '' }) }) }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </form>

              {/* Top bar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                    {selectedCategories.length === 1 ? selectedCategories[0] : 'All Collections'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Grid toggle - desktop only */}
                  <div className="hidden lg:flex items-center border border-gray-200 rounded">
                    <button
                      onClick={() => setGridCols(3)}
                      className={`p-1.5 ${gridCols === 3 ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}
                      aria-label="3 columns"
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setGridCols(4)}
                      className={`p-1.5 ${gridCols === 4 ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black'}`}
                      aria-label="4 columns"
                    >
                      <LayoutGrid size={16} />
                    </button>
                  </div>
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
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-xs rounded-full">
                      Search: "{searchQuery}"
                      <button onClick={clearSearch} className="text-white/60 hover:text-white"><X size={12} /></button>
                    </span>
                  )}
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
                  {selectedFabrics.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                      {f}
                      <button onClick={() => toggleFabric(f)} className="text-gray-400 hover:text-black"><X size={12} /></button>
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
              {paginatedItems.length > 0 ? (
                <>
                  <div className={`grid grid-cols-2 gap-4 lg:gap-5 ${
                    gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                  }`}>
                    {paginatedItems.map((item) => {
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`w-9 h-9 flex items-center justify-center text-xs font-semibold transition-colors ${
                            page === currentPage
                              ? 'bg-black text-white'
                              : 'border border-gray-200 text-gray-500 hover:border-black hover:text-black'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
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
  allFabrics,
  selectedFabrics,
  toggleFabric,
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
  allFabrics: string[]
  selectedFabrics: string[]
  toggleFabric: (name: string) => void
  activeFilterCount: number
  clearAllFilters: () => void
}) {
  return (
    <div className="space-y-6 p-5 lg:p-0">
      {/* Categories */}
      {categoryNames.length > 0 && (
        <div className="pb-5 border-b border-gray-100">
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
      <div className="pb-5 border-b border-gray-100">
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
            <span>From ${priceRange[0]} USD</span>
            <span>${priceRange[1]} USD</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="pb-5 border-b border-gray-100">
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

      {/* Brand / Fabric */}
      {allFabrics.length > 0 && (
        <div className="pb-5 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Brand</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {allFabrics.map((fabric) => (
              <label key={fabric} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFabrics.includes(fabric)}
                  onChange={() => toggleFabric(fabric)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                />
                <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{fabric}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {allColors.length > 0 && (
        <div className="pb-5 border-b border-gray-100">
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
