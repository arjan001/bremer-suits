import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import {
  Scissors,
  Crown,
  Eye,
  Heart,
  Users,
  CheckCircle,
  ArrowRight,
  Ruler,
  Sparkles,
  Gem,
  Watch,
  MessageCircle,
  Palette,
  Hammer,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export const Route = createFileRoute('/services')({
  head: () => ({
    meta: [
      { title: 'Custom Tailoring Services | Ruracio Styling, Corporate & Alterations | Bremer Suits' },
      { name: 'description', content: 'From culturally respectful Ruracio styling to executive corporate image programs, Bremer Suits offers comprehensive tailoring services including expert alterations, fabric sourcing, and bespoke consultations in Nairobi.' },
      { name: 'keywords', content: 'Bremer Suits, Bremer, BremerSuits, BREMER SUITS, Ruracio outfits for men, traditional ceremony styling Kenya, corporate styling workshops Nairobi, suit alterations Nairobi, executive image consulting, Ruracio suits for groom, modern African wedding suits, bremer suits services, bespoke tailoring service, fabric sourcing Kenya, personal styling Nairobi, wedding styling service, corporate wardrobe consulting, suit fitting service' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'author', content: 'Bremer Suits' },
      { name: 'publisher', content: 'Bremer Suits' },
      { name: 'language', content: 'en' },
      { name: 'revisit-after', content: '14 days' },
      { name: 'rating', content: 'general' },
      { name: 'distribution', content: 'global' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', content: '#1a1a1a' },
      { name: 'apple-mobile-web-app-title', content: 'Bremer Suits' },
      { name: 'application-name', content: 'Bremer Suits' },
      { name: 'msapplication-TileColor', content: '#1a1a1a' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { property: 'og:title', content: 'Custom Tailoring Services | Ruracio Styling, Corporate & Alterations | Bremer Suits' },
      { property: 'og:description', content: 'From culturally respectful Ruracio styling to executive corporate image programs, Bremer Suits offers comprehensive tailoring services including expert alterations and fabric sourcing.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://bremersuits.com/services' },
      { property: 'og:site_name', content: 'Bremer Suits' },
      { property: 'og:locale', content: 'en_KE' },
      { property: 'og:image', content: 'https://bremersuits.com/images/og-gold-striped-suit.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Bremer Suits Custom Tailoring Services - Bespoke Gold Striped Suit' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@bremersuits' },
      { name: 'twitter:creator', content: '@bremersuits' },
      { name: 'twitter:title', content: 'Custom Tailoring Services | Bremer Suits Nairobi' },
      { name: 'twitter:description', content: 'Ruracio styling, corporate image consulting, expert alterations, and bespoke tailoring services from Nairobi\'s premier suit house.' },
      { name: 'twitter:image', content: 'https://bremersuits.com/images/og-gold-striped-suit.jpg' },
      { name: 'twitter:image:alt', content: 'Bremer Suits Custom Tailoring Services' },
      { name: 'geo.region', content: 'KE-110' },
      { name: 'geo.placename', content: 'Nairobi' },
      { name: 'geo.position', content: '-1.2864;36.8172' },
      { name: 'ICBM', content: '-1.2864, 36.8172' },
      { property: 'business:contact_data:street_address', content: 'Kimathi St' },
      { property: 'business:contact_data:locality', content: 'Nairobi' },
      { property: 'business:contact_data:country_name', content: 'Kenya' },
      { property: 'business:contact_data:email', content: 'brendahwanja6722@gmail.com' },
      { property: 'business:contact_data:phone_number', content: '+254 793 880642' },
      { name: 'subject', content: 'Custom Tailoring & Styling Services' },
      { name: 'classification', content: 'Business' },
      { name: 'category', content: 'Fashion & Tailoring Services' },
      { name: 'coverage', content: 'Kenya' },
      { name: 'target', content: 'all' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'MobileOptimized', content: '320' },
    ],
    links: [
      { rel: 'canonical', href: 'https://bremersuits.com/services' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bremersuits.com/' },
            { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://bremersuits.com/services' },
          ],
        }),
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'High-End Tailoring Services',
            provider: { '@type': 'LocalBusiness', name: 'Bremer Suits' },
            description: 'Custom suits, sport coats, trousers & overcoats with premium fabric library from Italian & British mills.',
            areaServed: { '@type': 'City', name: 'Nairobi' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Wedding Styling',
            provider: { '@type': 'LocalBusiness', name: 'Bremer Suits' },
            description: 'Custom groom & groomsmen suit packages, Ruracio (traditional ceremony) styling, and pre-wedding consultations.',
            areaServed: { '@type': 'City', name: 'Nairobi' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Corporate Image Consulting',
            provider: { '@type': 'LocalBusiness', name: 'Bremer Suits' },
            description: 'Executive wardrobe audits, corporate dress code workshops, and professional styling sessions.',
            areaServed: { '@type': 'City', name: 'Nairobi' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Expert Alterations',
            provider: { '@type': 'LocalBusiness', name: 'Bremer Suits' },
            description: 'Precision suit alterations, resizing, and garment restoration by master tailors in Nairobi.',
            areaServed: { '@type': 'City', name: 'Nairobi' },
          },
        ]),
      },
    ],
  }),
  component: Services,
})

const heroCarouselImages = [
  '/images/couple-roses.jpg',
  '/images/couple-elegant-pink.jpg',
  '/images/couple-burgundy-black.jpg',
]

const glimpseImages = [
  '/images/kaunda-white-vstrike.jpg',
  '/images/kaunda-grey-cap.jpg',
  '/images/kaunda-burgundy.jpg',
  '/images/kaunda-burgundy-hat.jpg',
  '/images/kaunda-mint-green.jpg',
  '/images/gallery-20.jpg',
  '/images/about-wedding-group.jpg',
  '/images/gallery-40.jpg',
  '/images/gallery-50.jpg',
  '/images/about-style-portrait.jpg',
  '/images/gallery-2.jpg',
]

const mainServices = [
  {
    icon: Scissors,
    title: 'High-End Tailoring Services',
    subtitle: 'Custom Suits & Bespoke Tailoring',
    description:
      'Every Bremer suit begins with understanding you. From fabric selection to final fitting, we craft garments that fit your body, your lifestyle, and your ambitions. Our master tailors bring decades of expertise to every stitch.',
    features: [
      'Custom suits, sport coats, trousers & overcoats',
      'Premium fabric library — Italian & British mills',
      'Multiple fittings for perfect drape',
      'Hand-finished details and monogramming',
      'Ready-made premium suit collection',
    ],
    image: '/images/about-burgundy-suit.jpg',
    iconImage: '/images/sewing-machine-alt.png',
  },
  {
    icon: Heart,
    title: 'Wedding Styling',
    subtitle: 'Your Perfect Day, Perfectly Dressed',
    description:
      'Make your special day unforgettable with bespoke wedding attire. From groom suits to groomsmen coordination, we ensure every detail reflects the significance of your milestone.',
    features: [
      'Custom groom & groomsmen suit packages',
      'Fabric and color coordination for wedding parties',
      'Ruracio (traditional ceremony) styling',
      'Pre-wedding consultations and fittings',
      'Accessories coordination — ties, cufflinks, pocket squares',
    ],
    image: '/images/gallery-3.jpg',
    iconImage: null,
  },
  {
    icon: Crown,
    title: 'Personal Styling & Fashion Design',
    subtitle: 'Wardrobe Strategy & Curation',
    description:
      'We build wardrobes that work as hard as you do. Our styling service creates a cohesive, versatile collection that transitions seamlessly across every context of your professional and personal life.',
    features: [
      'Comprehensive wardrobe audit and planning',
      'Personal color and style analysis',
      'Seasonal wardrobe curation',
      'Custom fashion design for unique pieces',
      'Outfit coordination for key events',
    ],
    image: '/images/crafted-model.jpg',
    iconImage: '/images/fabric-pattern.png',
  },
  {
    icon: Eye,
    title: 'Image Consulting & Coaching',
    subtitle: 'Personal Brand Alignment',
    description:
      'Your image is a strategic tool. Our consulting sessions help you understand and leverage the psychology of appearance to communicate authority, approachability, and competence in every setting.',
    features: [
      'Personal brand assessment',
      'Executive presence coaching',
      'Industry-specific image strategy',
      'Non-verbal communication alignment',
      'Ongoing image maintenance plan',
    ],
    image: '/images/about-bespoke-man.jpg',
    iconImage: '/images/icon-measure.png',
  },
]

const additionalServices = [
  {
    icon: Watch,
    title: 'Male Accessories',
    description:
      'Complete your look with our curated collection of premium accessories — ties, cufflinks, pocket squares, belts, and watches sourced from the finest brands.',
    image: '/images/gallery-30.jpg',
  },
  {
    icon: Heart,
    title: 'Ruracio Styling',
    description:
      'Look your best for traditional ceremonies. We specialize in culturally respectful yet fashion-forward styling for Ruracio and other traditional events.',
    image: '/images/gallery-6.jpg',
  },
  {
    icon: Users,
    title: 'Corporate Programs',
    description:
      'Group styling workshops and executive image programs tailored for leadership teams and client-facing professionals.',
    image: '/images/gallery-7.jpg',
  },
  {
    icon: Ruler,
    title: 'Alterations & Fitting',
    description:
      'Expert alterations service to ensure every garment fits perfectly. From minor adjustments to complete restructuring.',
    image: '/images/about-cutting.jpg',
  },
  {
    icon: Sparkles,
    title: 'Special Occasions',
    description:
      'Gala outfits, anniversary styling, and milestone event preparation. We ensure you look impeccable for life\'s most important moments.',
    image: '/images/gallery-1.jpg',
  },
  {
    icon: Gem,
    title: 'Fabric Sourcing',
    description:
      'Access to the world\'s finest fabric mills. We help you select the perfect material for your vision and lifestyle.',
    image: '/images/collections-banner.jpg',
  },
]

const SITE_URL = 'https://bremersuits.com'
function getFullImageUrl(imagePath: string) {
  if (imagePath.startsWith('http')) return imagePath
  return `${SITE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

function Services() {
  const [heroSlide, setHeroSlide] = useState(0)
  const [glimpseOffset, setGlimpseOffset] = useState(0)

  const nextHeroSlide = useCallback(() => {
    setHeroSlide((prev) => (prev + 1) % heroCarouselImages.length)
  }, [])

  const prevHeroSlide = useCallback(() => {
    setHeroSlide((prev) => (prev - 1 + heroCarouselImages.length) % heroCarouselImages.length)
  }, [])

  // Auto-rotate hero carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextHeroSlide, 5000)
    return () => clearInterval(timer)
  }, [nextHeroSlide])

  // Auto-scroll glimpse carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setGlimpseOffset((prev) => {
        const maxOffset = glimpseImages.length - 1
        return prev >= maxOffset ? 0 : prev + 1
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Full width with carousel overlay */}
      <section className="relative bg-black overflow-hidden min-h-[45vh] lg:min-h-[50vh] max-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          {heroCarouselImages.map((src, idx) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: idx === heroSlide ? 1 : 0 }}
            >
              <img
                src={src}
                alt={`Bremer Suits Services - Slide ${idx + 1}`}
                className="w-full h-full object-cover opacity-30"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        </div>

        <button
          onClick={prevHeroSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          onClick={nextHeroSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroCarouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === heroSlide ? 'bg-white w-6' : 'bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center w-full">
          <p className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4 font-medium">
            Nairobi's Premier Suit House
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl text-white mb-6 italic"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Our Services
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-base lg:text-lg font-light leading-relaxed">
            From bespoke tailoring to complete styling, we offer a full range of services
            crafted to elevate every aspect of your wardrobe.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/50">
              <img src="/images/sewing-machine-alt.png" alt="" className="w-6 h-6 invert opacity-60" />
              <span className="text-xs tracking-wider uppercase">Bespoke Tailoring</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <img src="/images/icon-measure.png" alt="" className="w-6 h-6 invert opacity-60" />
              <span className="text-xs tracking-wider uppercase">Perfect Fit</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <img src="/images/icon-fabrics.png" alt="" className="w-6 h-6 invert opacity-60" />
              <span className="text-xs tracking-wider uppercase">Premium Fabrics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Banner */}
      <section className="bg-[#1a1a1a] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap">
            {[
              { label: 'Tailoring', icon: Scissors },
              { label: 'Weddings', icon: Heart },
              { label: 'Styling', icon: Crown },
              { label: 'Consulting', icon: Eye },
              { label: 'Accessories', icon: Watch },
              { label: 'Alterations', icon: Ruler },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
                <item.icon size={14} strokeWidth={1.5} />
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services - Alternating full-bleed sections */}
      <section className="py-0">
        {mainServices.map((service, index) => {
          const isReversed = index % 2 === 1
          return (
            <div
              key={service.title}
              className={`grid grid-cols-1 lg:grid-cols-2 min-h-[600px] ${isReversed ? 'bg-[#fafaf8]' : 'bg-white'}`}
            >
              {/* Image - Full bleed */}
              <div className={`relative overflow-hidden min-h-[400px] lg:min-h-0 group ${isReversed ? 'lg:order-2' : ''}`}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay gradient toward content */}
                <div className={`absolute inset-0 ${isReversed ? 'lg:bg-gradient-to-l' : 'lg:bg-gradient-to-r'} from-transparent to-transparent bg-gradient-to-b from-transparent via-transparent to-black/20 lg:to-transparent`} />
                {/* Icon overlay */}
                {service.iconImage && (
                  <div className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <img src={service.iconImage} alt="" className="w-8 h-8" />
                  </div>
                )}
                {/* Order Similar Design Tooltip */}
                <a
                  href={`https://wa.me/254793880642?text=${encodeURIComponent(`Hello Bremer Suits, I am interested in ordering a similar design from your collection. Could you share more details?\n\n${getFullImageUrl(service.image)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 bg-black/80 text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-black z-10 whitespace-nowrap backdrop-blur-sm"
                >
                  Order Similar Design
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </a>
              </div>

              {/* Content */}
              <div className={`flex items-center ${isReversed ? 'lg:order-1' : ''}`}>
                <div className="px-6 sm:px-10 lg:px-16 xl:px-20 py-12 lg:py-16 max-w-xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <service.icon size={18} className="text-white" strokeWidth={1.5} />
                    </div>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 font-semibold">
                      {service.subtitle}
                    </p>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-5 leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {service.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed mb-8 text-[15px]">
                    {service.description}
                  </p>

                  {/* Features with refined styling */}
                  <div className="border-l-2 border-black pl-6 mb-8">
                    <h4 className="text-[10px] tracking-[0.25em] uppercase text-black mb-4 font-bold">
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle
                            size={14}
                            className="text-black mt-0.5 shrink-0"
                            strokeWidth={2}
                          />
                          <span className="text-sm text-gray-600 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-3 px-7 py-3.5 text-[10px] tracking-[0.25em] uppercase bg-black text-white hover:bg-gray-800 transition-all duration-300 font-bold"
                  >
                    Inquire About This Service
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* Additional Services Grid - With images */}
      <section className="py-16 lg:py-24 bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3 font-semibold">
              Complete Your Style Journey
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Additional Services
            </h2>
            <p className="text-sm text-white/40 mt-4 max-w-md mx-auto font-light">
              A full range of services to complement your wardrobe and personal brand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {additionalServices.map((service) => (
              <div
                key={service.title}
                className="group relative overflow-hidden bg-[#1a1a1a] hover:bg-[#222] transition-all duration-500"
              >
                {/* Card Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                      <service.icon size={18} className="text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  {/* Order Similar Design Tooltip */}
                  <a
                    href={`https://wa.me/254793880642?text=${encodeURIComponent(`Hello Bremer Suits, I am interested in ordering a similar design from your collection. Could you share more details?\n\n${getFullImageUrl(service.image)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/80 text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-black z-10 whitespace-nowrap backdrop-blur-sm"
                  >
                    Order Similar Design
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                  </a>
                </div>
                {/* Card Content */}
                <div className="p-6 pt-4">
                  <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    to="/contact"
                    className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors font-semibold"
                  >
                    Learn More
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process - Timeline style */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-3 font-semibold">
              The Bremer Experience
            </p>
            <h2
              className="text-3xl lg:text-4xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              How It Works
            </h2>
            <p className="text-sm text-gray-500 mt-3">Your journey to impeccable style in four steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              { step: '01', title: 'Consult', desc: 'We meet to understand your goals, lifestyle, and vision.', icon: MessageCircle },
              { step: '02', title: 'Design', desc: 'We develop a personalized plan — fabrics, styles, and strategy.', icon: Palette },
              { step: '03', title: 'Craft', desc: 'Your pieces are made with meticulous care and precision.', icon: Hammer },
              { step: '04', title: 'Refine', desc: 'Final fittings and adjustments to ensure perfection.', icon: Star },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center px-6 py-8">
                {/* Connecting line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-[52px] left-[calc(50%+32px)] right-0 h-px bg-gray-200" />
                )}
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-5 bg-black text-white rounded-full flex items-center justify-center relative z-10">
                    <item.icon size={22} strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 font-bold mb-1">Step {item.step}</p>
                  <h3 className="text-base font-bold text-black mb-2 uppercase tracking-wide">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery showcase carousel */}
      <section className="bg-[#fafaf8] py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-semibold">
            A Glimpse of Our Work
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div
            className="flex gap-3 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(calc(-${glimpseOffset} * (16rem + 0.75rem)))`,
            }}
          >
            {glimpseImages.map((src, i) => (
              <div key={i} className="flex-shrink-0 w-48 sm:w-56 lg:w-64 h-72 sm:h-80 overflow-hidden relative group">
                <img
                  src={src}
                  alt="Bremer Suits portfolio"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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
          {/* Navigation dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {glimpseImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setGlimpseOffset(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === glimpseOffset ? 'bg-black w-5' : 'bg-gray-300'}`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-black py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/about-bespoke-man.jpg"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4 font-semibold">
            Ready to Get Started?
          </p>
          <h2
            className="text-3xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Let's Build Your Look
          </h2>
          <p className="text-white/50 leading-relaxed mb-10 max-w-lg mx-auto font-light text-base">
            Every great wardrobe starts with a conversation. Tell us about your goals
            and we'll craft a plan tailored to you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-10 py-4 text-[10px] tracking-[0.25em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-bold"
            >
              Start Your Consultation
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-10 py-4 text-[10px] tracking-[0.25em] uppercase border border-white/20 text-white hover:bg-white/10 transition-colors duration-300 font-bold"
            >
              View Portfolio
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
