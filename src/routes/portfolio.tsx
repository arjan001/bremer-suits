import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useMemo, useRef } from 'react'
import { ArrowRight, Sparkles, X, ChevronLeft, ChevronRight, Star } from 'lucide-react'

const ITEMS_PER_PAGE = 12

export const Route = createFileRoute('/portfolio')({
  head: () => ({
    meta: [
      {
        title: 'Bremer Suits | Bespoke Gallery | Wedding Tuxedos & High-End Suit Portfolio',
      },
      {
        name: 'description',
        content: 'Browse the Bremer Suits gallery. View our custom-made wedding tuxedos, ruracio attire, and sharp corporate wear designed for Nairobi\'s most influential men.',
      },
      {
        name: 'keywords',
        content: 'Bremer Suits, Bremer, BremerSuits, BREMER SUITS, wedding suit ideas Kenya, bespoke suit gallery, men\'s fashion portfolio Nairobi, custom tuxedo designs, Bremer Suits lookbook, bespoke tuxedos Nairobi, bremer suits portfolio',
      },
      {
        property: 'og:title',
        content: 'Bespoke Gallery | Wedding Tuxedos & High-End Suit Portfolio',
      },
      {
        property: 'og:description',
        content: 'Browse the Bremer Suits gallery. View our custom-made wedding tuxedos, ruracio attire, and sharp corporate wear designed for Nairobi\'s most influential men.',
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
        content: 'https://bremersuits.com/images/og-groomsmen-black-tux.jpg',
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
        content: 'Bremer Suits Portfolio - Black Tuxedo Groomsmen Collection',
      },
      {
        name: 'twitter:image',
        content: 'https://bremersuits.com/images/og-groomsmen-black-tux.jpg',
      },
      {
        property: 'og:url',
        content: 'https://bremersuits.com/portfolio',
      },
    ],
  }),
  component: PortfolioPage,
})

const categories = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Wedding & Events' },
  { id: 'bespoke', label: 'Bespoke Suits' },
  { id: 'made-to-measure', label: 'Made-to-Measure' },
  { id: 'senator-suit', label: 'Senator Suit' },
  { id: 'kaunda-suit', label: 'Kaunda Suit' },
]

interface PortfolioItem {
  src: string
  category: string
  title?: string
}

const staticPortfolioItems: PortfolioItem[] = [
  { src: '/images/portfolio/wedding-pink-green-stairs.jpg', category: 'wedding', title: 'Pink and Green Wedding Suits on Grand Staircase by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-brown-beige-group.jpg', category: 'wedding', title: 'Brown and Beige Wedding Groomsmen Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-white-suit-bride.jpg', category: 'wedding', title: 'Custom White Wedding Suit with Bride by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-teal-groomsmen.jpg', category: 'wedding', title: 'Teal Bespoke Groomsmen Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-camo-black-group.jpg', category: 'wedding', title: 'Camouflage Accent Black Wedding Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-beige-reception.jpg', category: 'wedding', title: 'Beige Wedding Reception Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-black-suits-outdoor.jpg', category: 'wedding', title: 'Classic Black Outdoor Wedding Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-green-white-groom.jpg', category: 'wedding', title: 'Green and White Bespoke Groom Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-red-suits-group.jpg', category: 'wedding', title: 'Red Custom Wedding Suits for Groomsmen by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-pink-blazers-wall.jpg', category: 'wedding', title: 'Pink Wedding Blazers for Groomsmen by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-party-green-dresses.jpg', category: 'wedding', title: 'Wedding Party Styling with Green Accents by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-cream-bridal-lineup.jpg', category: 'wedding', title: 'Cream Bridal Party Lineup Styling by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-beach-beige.jpg', category: 'wedding', title: 'Beach Wedding Beige Linen Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-grey-suits.jpg', category: 'wedding', title: 'Grey Bespoke Wedding Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-navy-pinstripe-man.jpg', category: 'bespoke', title: 'Navy Blue Pinstripe Bespoke Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-grey-tweed.jpg', category: 'bespoke', title: 'Grey Tweed Bespoke Sport Coat by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-white-black-blazer.jpg', category: 'bespoke', title: 'White and Black Bespoke Blazer by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-burgundy-mannequin.jpg', category: 'bespoke', title: 'Burgundy Bespoke 3-Piece Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-maroon-mannequin.jpg', category: 'bespoke', title: 'Maroon Custom Tailored Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-brown-pinstripe.jpg', category: 'bespoke', title: 'Brown Pinstripe Bespoke Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-cream-double-breasted.jpg', category: 'made-to-measure', title: 'Cream Double-Breasted Made-to-Measure Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-orange-mannequin.jpg', category: 'made-to-measure', title: 'Orange Made-to-Measure Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-brown-duo-mannequin.jpg', category: 'made-to-measure', title: 'Brown Duo Made-to-Measure Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-green-pinstripe.jpg', category: 'made-to-measure', title: 'Green Pinstripe Made-to-Measure Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-beige-groomsmen.jpg', category: 'wedding', title: 'Beige Groomsmen Wedding Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-black-suits.jpg', category: 'wedding', title: 'Classic Black Wedding Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-pink-blazers.jpg', category: 'wedding', title: 'Pink Wedding Blazers by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-pinstripe.jpg', category: 'bespoke', title: 'Classic Pinstripe Bespoke Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-cream-double.jpg', category: 'made-to-measure', title: 'Cream Double-Breasted Made-to-Measure Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-orange-suit.jpg', category: 'made-to-measure', title: 'Orange Custom Made-to-Measure Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-brown-duo.jpg', category: 'bespoke', title: 'Brown Duo Bespoke Suits by Bremer Suits Nairobi' },
  // New additions
  { src: '/images/portfolio/wedding-grey-groomsmen-tux.jpg', category: 'wedding', title: 'Grey Groomsmen with Black Tuxedo Groom by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-camo-white-groomsmen.jpg', category: 'wedding', title: 'Camo Accent White Jacket Groomsmen by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-beige-celebration.jpg', category: 'wedding', title: 'Beige Groomsmen Celebration Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-black-tuxedo-walk.jpg', category: 'wedding', title: 'Black Tuxedo Groomsmen Walk by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-green-white-formation.jpg', category: 'wedding', title: 'Green and White Groomsmen Formation by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-mint-green-duo.jpg', category: 'bespoke', title: 'Mint Green Double-Breasted Blazers by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-cream-brown-mannequin.jpg', category: 'made-to-measure', title: 'Cream and Brown Made-to-Measure Ensemble by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-grey-blazer-portrait.jpg', category: 'bespoke', title: 'Grey Blazer Fashion Portrait by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-navy-gold-buttons.jpg', category: 'bespoke', title: 'Navy Double-Breasted Blazer with Gold Buttons by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-orange-store-display.jpg', category: 'made-to-measure', title: 'Orange Double-Breasted Suit Store Display by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-white-textured-3piece.jpg', category: 'bespoke', title: 'White Textured Three-Piece Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-striped-double-breasted.jpg', category: 'made-to-measure', title: 'Striped Double-Breasted Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-houndstooth-vest.jpg', category: 'bespoke', title: 'Houndstooth Suit with Brown Vest by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-houndstooth-blazer.jpg', category: 'made-to-measure', title: 'Houndstooth Double-Breasted Blazer by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-cream-red-casual.jpg', category: 'bespoke', title: 'Cream Blazer with Red Trousers Casual Style by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-navy-store-mannequin.jpg', category: 'bespoke', title: 'Navy Blazer Store Mannequin Display by Bremer Suits Nairobi' },
  // New wedding & event photos
  { src: '/images/portfolio/wedding-green-tux-groom-bride.jpg', category: 'wedding', title: 'Green Double-Breasted Tuxedo Groom with Bride by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-pink-green-groomsmen-stairs.jpg', category: 'wedding', title: 'Pink Suit Groom with Green Groomsmen on Staircase by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-brown-beige-groomsmen-indoor.jpg', category: 'wedding', title: 'Brown and Beige Wedding Groomsmen Indoor by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-white-blazer-groom-bride-arch.jpg', category: 'wedding', title: 'White Blazer Groom with Bride at Archway Venue by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-white-teal-groomsmen-hallway.jpg', category: 'wedding', title: 'White Tuxedo Groom with Teal Groomsmen in Hallway by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-grey-groomsmen-lifting-groom.jpg', category: 'wedding', title: 'Grey Suited Groomsmen Lifting Groom at Reception by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-white-camo-black-groomsmen-formal.jpg', category: 'wedding', title: 'Camo Accent White Blazer Groom with Black Tux Party by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-beige-3piece-groomsmen-dancing.jpg', category: 'wedding', title: 'Beige Three-Piece Groomsmen Dancing at Reception by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-mint-green-double-breasted-duo.jpg', category: 'wedding', title: 'Mint Green Double-Breasted Wedding Suits by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-black-tux-chains-outdoor.jpg', category: 'wedding', title: 'Black Tuxedo Groomsmen with Chain Details Outdoor by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-black-tux-groomsmen-walking.jpg', category: 'wedding', title: 'Black Tuxedo Groomsmen Walking Together by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-green-tux-white-groom-outdoor.jpg', category: 'wedding', title: 'Green Tuxedo Groomsmen with White Groom Formation by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-red-burgundy-groomsmen-cream-groom.jpg', category: 'wedding', title: 'Red Burgundy Groomsmen with Cream Groom Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-pink-blazer-groomsmen-flowerwall.jpg', category: 'wedding', title: 'Pink Blazer Groomsmen at Flower Wall by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-white-tux-olive-bridesmaids.jpg', category: 'wedding', title: 'White Tuxedo Groom with Olive Bridesmaids by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-cream-sage-green-bridal-party.jpg', category: 'wedding', title: 'Cream Groomsmen with Sage Green Bridal Party by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-beige-groomsmen-beach.jpg', category: 'wedding', title: 'Beige Groomsmen with Rust Vests Beach Wedding by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-emerald-green-groomsmen-studio.jpg', category: 'wedding', title: 'Emerald Green Groomsmen Studio Portrait by Bremer Suits Nairobi' },
  { src: '/images/portfolio/wedding-green-groomsmen-white-groom-deck.jpg', category: 'wedding', title: 'Green Groomsmen with White Groom on Garden Deck by Bremer Suits Nairobi' },
  // New bespoke/event formal wear
  { src: '/images/portfolio/bespoke-orange-rust-couple-event.jpg', category: 'bespoke', title: 'Orange Rust Bespoke Suit at Formal Event by Bremer Suits Nairobi' },
  // New official images batch
  { src: '/images/portfolio/bespoke-navy-pinstripe-3piece.jpg', category: 'bespoke', title: 'Navy Pinstripe Three-Piece Bespoke Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-lightblue-blazer-mannequin.jpg', category: 'made-to-measure', title: 'Light Blue Blazer Made-to-Measure by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-rust-red-blazer-mannequin.jpg', category: 'made-to-measure', title: 'Rust Red Blazer Made-to-Measure by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-navy-double-breasted-gold.jpg', category: 'bespoke', title: 'Navy Double-Breasted Suit with Gold Buttons by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-camel-double-breasted-bowtie.jpg', category: 'wedding', title: 'Camel Double-Breasted Wedding Suit with Bow Tie by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-burnt-orange-double-breasted.jpg', category: 'bespoke', title: 'Burnt Orange Double-Breasted Blazer by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-cream-double-seated.jpg', category: 'bespoke', title: 'Cream Double-Breasted Blazer Formal Style by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-brown-double-breasted-studio.jpg', category: 'bespoke', title: 'Brown Double-Breasted Bespoke Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-tan-double-breasted-studio.jpg', category: 'bespoke', title: 'Tan Double-Breasted Bespoke Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-grey-blazer-street-style.jpg', category: 'bespoke', title: 'Grey Blazer Street Style by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-green-houndstooth-mannequin.jpg', category: 'made-to-measure', title: 'Green Houndstooth Double-Breasted Blazer by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-cream-double-mannequin.jpg', category: 'made-to-measure', title: 'Cream Double-Breasted Blazer on Mannequin by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-navy-blazer-white-trousers.jpg', category: 'bespoke', title: 'Navy Blazer with White Trousers by Bremer Suits Nairobi' },
  { src: '/images/portfolio/senator-white-textured-3piece.jpg', category: 'senator-suit', title: 'White Textured Senator Three-Piece Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-orange-blazer-store.jpg', category: 'made-to-measure', title: 'Orange Double-Breasted Blazer Store Display by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-navy-blazer-store-display.jpg', category: 'made-to-measure', title: 'Navy Blazer with Cream Trousers Store Display by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-olive-gold-striped.jpg', category: 'bespoke', title: 'Olive Gold Striped Double-Breasted Suit by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-houndstooth-brown-vest-3piece.jpg', category: 'bespoke', title: 'Houndstooth Blazer with Brown Vest Three-Piece by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-white-houndstooth-double.jpg', category: 'made-to-measure', title: 'White Houndstooth Double-Breasted Blazer by Bremer Suits Nairobi' },
  { src: '/images/portfolio/bespoke-cream-blazer-red-trousers.jpg', category: 'bespoke', title: 'Cream Blazer with Red Trousers Street Style by Bremer Suits Nairobi' },
]

function mapCategoryFromTag(tag: string, title: string): string {
  const t = (tag || '').toLowerCase()
  const tl = (title || '').toLowerCase()
  if (tl.includes('wedding') || t === 'wedding') return 'wedding'
  if (tl.includes('made-to-measure') || t === 'made-to-measure') return 'made-to-measure'
  if (tl.includes('senator') || t === 'senator-suit') return 'senator-suit'
  if (tl.includes('kaunda') || t === 'kaunda-suit') return 'kaunda-suit'
  return 'bespoke'
}

function GoldStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.offsetWidth * dpr
      canvas.height = parent.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = parent.offsetWidth + 'px'
      canvas.style.height = parent.offsetHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 35 }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      size: Math.random() * 2.5 + 1,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }))

    const glitters = Array.from({ length: 20 }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      size: Math.random() * 1.5 + 0.5,
      life: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.02,
    }))

    const drawStar = (cx: number, cy: number, r: number, alpha: number) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#c9a96e'
      ctx.shadowColor = '#c9a96e'
      ctx.shadowBlur = r * 3
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const method = i === 0 ? 'moveTo' : 'lineTo'
        ctx[method](cx + r * Math.cos(angle), cy + r * Math.sin(angle))
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    let t = 0
    const animate = () => {
      t++
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      stars.forEach((s) => {
        s.y -= s.speed
        if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w }
        const alpha = s.opacity * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase))
        drawStar(s.x, s.y, s.size, alpha)
      })

      glitters.forEach((g) => {
        g.life += g.speed
        const alpha = 0.4 * Math.abs(Math.sin(g.life))
        if (alpha < 0.02) {
          g.x = Math.random() * w
          g.y = Math.random() * h
        }
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#e8d5a3'
        ctx.shadowColor = '#e8d5a3'
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  )
}

function PortfolioPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(staticPortfolioItems)

  useEffect(() => {
    fetch('/.netlify/functions/admin-portfolio?status=active')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const items: PortfolioItem[] = data
            .filter((item: Record<string, unknown>) => item.image)
            .map((item: Record<string, unknown>) => ({
              src: item.image as string,
              category: mapCategoryFromTag(item.tag as string, item.title as string),
              title: item.title as string,
            }))
          if (items.length > 0) {
            setPortfolioItems(items)
          }
        }
      })
      .catch(() => {
        // Keep static fallback
      })
  }, [])

  const filteredItems = useMemo(() => {
    return activeCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory)
  }, [activeCategory, portfolioItems])

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Gold & Stars */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/portfolio/wedding-camo-black-group.jpg"
            alt="Bremer Suits Bespoke Gallery - Custom Wedding and Formal Suits Nairobi"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <GoldStars />
        <div className="absolute inset-0 portfolio-gold-shimmer opacity-20 pointer-events-none z-[5]" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="flex items-center gap-2 mb-4">
            <Star size={14} className="text-[#c9a96e] fill-[#c9a96e]" />
            <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] font-medium">
              Our Portfolio
            </p>
            <Star size={14} className="text-[#c9a96e] fill-[#c9a96e]" />
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-2xl portfolio-gold-text"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Bremer Suits — Craftsmanship in Every Stitch
          </h1>
          <p className="text-lg text-white/60 max-w-xl font-light leading-relaxed">
            Explore our collection of bespoke work and the moments
            that define the Bremer legacy.
          </p>
          <div className="flex items-center gap-1.5 mt-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-[#c9a96e] fill-[#c9a96e]" />
            ))}
            <span className="ml-2 text-xs text-[#c9a96e]/70 tracking-widest uppercase">Premium Collection</span>
          </div>
        </div>
      </section>

      {/* Portfolio Grid with Category Filters */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#c9a96e]" />
              <Sparkles size={16} className="text-[#c9a96e]" />
              <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] font-semibold">
                Our Work
              </p>
              <Sparkles size={16} className="text-[#c9a96e]" />
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#c9a96e]" />
            </div>
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
          {paginatedItems.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 lg:gap-4 space-y-3 lg:space-y-4">
            {paginatedItems.map((item, idx) => (
              <div
                key={`${item.src}-${idx}`}
                className="break-inside-avoid overflow-hidden group cursor-pointer"
                onClick={() => setSelectedImage(item.src)}
              >
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={item.src}
                    alt={item.title || `Portfolio piece ${idx + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                </div>
              </div>
            ))}
          </div>
          ) : (
          <div className="text-center py-20 border border-dashed border-gray-300 bg-gray-50">
            <Sparkles size={40} className="mx-auto mb-4 text-[#c8502a]/40" />
            <h3
              className="text-2xl font-bold text-black mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Coming Soon
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {activeCategory === 'senator-suit'
                ? 'Our Senator Suit collection is being curated. Elegant, collarless designs that command presence and respect — stay tuned.'
                : activeCategory === 'kaunda-suit'
                ? 'Our Kaunda Suit collection is on the way. Timeless African heritage meets modern tailoring — coming soon.'
                : 'New pieces are being added to this collection. Check back soon.'}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
            >
              Inquire About This Style
              <ArrowRight size={14} />
            </Link>
          </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-14">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center text-xs font-semibold tracking-wider border transition-all duration-300 ${
                    page === currentPage
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Item count */}
          {totalPages > 1 && (
            <p className="text-center text-xs text-gray-400 mt-4 tracking-wide">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
            </p>
          )}
        </div>
      </section>

      {/* CTA Section - Gold Accents */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0">
          <img src="/images/portfolio/bespoke-burgundy-mannequin.jpg" alt="Burgundy Bespoke Suit by Bremer Suits Nairobi" className="w-full h-full object-cover opacity-20" />
        </div>
        <GoldStars />
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-[#c9a96e] fill-[#c9a96e]" />
            ))}
          </div>
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
            className="inline-flex items-center gap-2 px-10 py-4 text-xs tracking-[0.2em] uppercase bg-gradient-to-r from-[#c9a96e] to-[#e8d5a3] text-black hover:from-[#b8985d] hover:to-[#d4c192] transition-all duration-300 font-semibold shadow-lg shadow-[#c9a96e]/20"
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
              alt={selectedImage ? `Bremer Suits Portfolio - Bespoke Suit Detail View` : 'Bremer Suits Portfolio Detail'}
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
