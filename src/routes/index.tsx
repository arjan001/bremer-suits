import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Scissors,
  Ruler,
  RefreshCw,
  Shirt,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

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

const process = [
  {
    number: '1',
    title: 'Consultation & Style Exploration',
    paragraphs: [
      'Your journey begins with a personal consultation, either in our atelier or at a location of your choice. We take time to understand your needs, your lifestyle, and your style preferences.',
      'Together, we explore fabrics, linings, and design details, from lapel shape to button style, ensuring that every choice reflects your personality.',
    ],
  },
  {
    number: '2',
    title: 'Precise Measurements & Pattern Drafting',
    paragraphs: [
      'We capture over 20 individual measurements, along with posture and shoulder slope, to create a garment pattern that is uniquely yours.',
      'This is where our technical skill meets artistic intuition, ensuring the blueprint of your garment perfectly matches your frame.',
    ],
  },
  {
    number: '3',
    title: 'First Fitting & Adjustments',
    paragraphs: [
      "You'll try on a basted (loosely assembled) version of your garment. This fitting allows us to fine-tune the shape, drape, and balance before committing to the final stitching.",
      'Our tailors adjust with millimeter-level precision, ensuring exceptional comfort and style.',
    ],
  },
  {
    number: '4',
    title: 'Final Fitting & Delivery',
    paragraphs: [
      'Your completed garment is ready for the final fitting. We inspect every seam, every detail, and ensure it fits exactly as intended.',
      'Once approved, your bespoke piece is pressed, packaged, and presented to you, ready to wear, ready to impress.',
    ],
  },
]

const serviceCards = [
  {
    icon: Scissors,
    title: 'Bespoke Garments',
    description:
      'Custom-made suits, jackets, and trousers, designed from scratch to reflect your style and fit your body. From fabric to stitching is chosen in collaboration with you.',
  },
  {
    icon: RefreshCw,
    title: 'Alterations & Repairs',
    description:
      'Adjustments to improve fit, comfort, and style. From trousers to resizing jackets, we also repair worn seams, replace zippers, and restore.',
  },
  {
    icon: Ruler,
    title: 'Made-to-Measure',
    description:
      'A balance between ready-to-wear and bespoke. Choose from set styles and fabrics, with adjustments made to your measurements for a refined fit.',
  },
  {
    icon: Shirt,
    title: 'Restyling & Upcycling',
    description:
      'We can modernize outdated garments, repurpose fabrics, and transform older pieces into fresh, stylish looks while preserving their quality.',
  },
]

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO SECTION ===== */}
      {/* 3-column: dark text panel | center image | feature cards on muted bg */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[80vh]">
          {/* Left: Dark green text panel */}
          <div className="bg-[#2d3a2e] text-white flex flex-col justify-center px-8 sm:px-12 lg:px-14 py-16 lg:py-24">
            <h1
              className="text-3xl sm:text-4xl lg:text-[2.7rem] leading-[1.18] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
            >
              A Legacy of Craft Passed Through Generations
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8 max-w-md font-light">
              Crafting timeless, made-to-measure suits with precision, passion, and personal style.
            </p>
            <div>
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-[#c8502a] text-white hover:bg-[#a83e1f] transition-colors duration-300 font-semibold"
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* Center: Hero image */}
          <div className="relative overflow-hidden bg-gray-100">
            <img
              src="/images/tailor-hero-bg.jpg"
              alt="Master tailor at work"
              className="w-full h-full object-cover object-center min-h-[50vh] lg:min-h-0"
            />
          </div>

          {/* Right: Feature highlights on muted bg */}
          <div className="bg-[#9b8e82] text-white flex flex-col justify-center px-8 sm:px-12 lg:px-14 py-12 lg:py-24 gap-10">
            {/* Precision Craftsmanship */}
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 flex items-center justify-center mb-1">
                <Scissors size={28} className="text-white/90" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold tracking-wide">Precision Craftsmanship</h3>
              <p className="text-sm text-white/75 leading-relaxed">
                From hand-drafted patterns to hand-finished buttonholes, precision is at the core of every stitch.
              </p>
            </div>

            {/* Personalized Experience */}
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 flex items-center justify-center mb-1">
                <Ruler size={28} className="text-white/90" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold tracking-wide">Personalized Experience</h3>
              <p className="text-sm text-white/75 leading-relaxed">
                From the first consultation to the final fitting, we tailor not just the clothing, but the entire experience, to each individual.
              </p>
            </div>

            {/* Bespoke Tailoring */}
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 flex items-center justify-center mb-1">
                <Shirt size={28} className="text-white/90" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold tracking-wide">Bespoke Tailoring</h3>
              <p className="text-sm text-white/75 leading-relaxed">
                Every garment is individually cut and constructed to your exact measurements, style, and personality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT US SECTION ===== */}
      {/* Image LEFT, text RIGHT — matching design mockup image_2 */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Left: Image */}
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              <img
                src="/images/about-model-1.webp"
                alt="Tailor working on a garment"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Text content */}
            <div className="flex flex-col justify-center">
              <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
                Focus on Heritage &amp; Trust
              </p>
              <h2
                className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-8"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                About Us
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-10">
                At Bremer, tailoring is more than our craft &mdash; it&apos;s our calling.
                Every garment we create or alter is a blend of precision, artistry, and personal attention.
                Whether it&apos;s a bespoke suit, a gown redesign, or a simple hem adjustment, we treat every
                project with the same dedication.
              </p>

              {/* Our Four Pillars */}
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

      {/* ===== CRAFTED FOR YOU SECTION ===== */}
      {/* Text LEFT, image with numbered overlay RIGHT — matching design mockup image_5 */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="flex flex-col justify-center">
              <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
                Bringing integrity and consciousness to your garments.
              </p>
              <h2
                className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Crafted for You.{' '}
                <span className="block">Cut to Perfection.</span>
              </h2>
              <div className="w-24 border-t border-dashed border-gray-300 mb-6" />
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                At Bremer, we believe clothing should do more than fit, it should speak. Whether you&apos;re
                seeking timeless bespoke suits, expert alterations, or thoughtful tailoring that enhances every
                silhouette, our mission is to bring precision, style, and individuality to every stitch.
              </p>
              <p className="text-base text-gray-600 leading-relaxed mb-8 border-l-2 border-[#c8502a] pl-4">
                Step into a space where craftsmanship meets character, and walk out wearing confidence, made just for you.
              </p>
              <div>
                <Link
                  to="/services"
                  className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-[#c8502a] text-white hover:bg-[#a83e1f] transition-colors duration-300 font-semibold"
                >
                  View Services
                </Link>
              </div>
            </div>

            {/* Right: Image with 4-step numbered overlay */}
            <div className="relative overflow-hidden bg-gray-900 aspect-[4/5]">
              <img
                src="/images/about-model-2.webp"
                alt="Tailored garments"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="inline-block px-4 py-2 bg-[#2d3a2e] text-white text-[10px] tracking-widest uppercase font-semibold rounded-full">
                  Tailoring is more than our craft
                </span>
              </div>
              {/* 4-step grid overlay */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="flex flex-col justify-end p-5 sm:p-8 border-r border-b border-white/20">
                  <span className="text-3xl sm:text-4xl font-bold text-white/80 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>1.</span>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1">Consultation &amp; Design</h4>
                  <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                    We discuss your needs, style preferences, and occasion, selecting fabrics and cuts that reflect personality.
                  </p>
                </div>
                <div className="flex flex-col justify-end p-5 sm:p-8 border-b border-white/20">
                  <span className="text-3xl sm:text-4xl font-bold text-white/80 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>2.</span>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1">Measurement &amp; Pattern</h4>
                  <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                    Precise body measurements and posture analysis are taken to create a unique pattern drafted exclusively for you.
                  </p>
                </div>
                <div className="flex flex-col justify-end p-5 sm:p-8 border-r border-white/20">
                  <span className="text-3xl sm:text-4xl font-bold text-white/80 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>3.</span>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1">Fittings &amp; Adjustments</h4>
                  <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                    Your garment is assembled in stages, with one or more fittings to refine the fit, comfort, and proportions.
                  </p>
                </div>
                <div className="flex flex-col justify-end p-5 sm:p-8">
                  <span className="text-3xl sm:text-4xl font-bold text-white/80 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>4.</span>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1">Finishing &amp; Delivery</h4>
                  <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                    The piece is completed with expert hand-finishing and final pressing, then delivered ready to wear with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TAILORING EXPERIENCE / PROCESS SECTION ===== */}
      {/* Detailed 4-step process — matching design mockups image_3 & image_4 */}
      <section className="py-16 lg:py-28 bg-[#f7f5f2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
            Our process is designed to make you feel understood and involved.
          </p>
          <h2
            className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-16"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            A Tailoring Experience{' '}
            <span className="block">Built Around You</span>
          </h2>

          <div className="flex flex-col divide-y divide-dashed divide-gray-300">
            {process.map((step) => (
              <div key={step.number} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 py-12 first:pt-0 last:pb-0">
                {/* Left: Number + Title */}
                <div className="flex items-start gap-5 lg:gap-8">
                  <span
                    className="text-5xl lg:text-7xl font-light text-[#c8502a]/70 leading-none shrink-0 -mt-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {step.number}
                  </span>
                  <h3
                    className="text-xl lg:text-2xl font-bold text-black leading-snug pt-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {step.title}
                  </h3>
                </div>

                {/* Right: Description with left border accent */}
                <div className="border-l-2 border-[#c8502a] pl-6 flex flex-col gap-4">
                  {step.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      {/* 4-card grid — matching design mockup image.png */}
      <section className="py-16 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm tracking-wide text-[#c8502a] mb-3 font-medium">
            Crafting excellence with masterful tools and unmatched skills.
          </p>
          <h2
            className="text-3xl lg:text-5xl font-bold text-black leading-tight mb-14 max-w-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Perfecting our craft with the finest tools and timeless skills.
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
          {/* Stars */}
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
            &ldquo;A suit should be a reflection of the man wearing it &mdash; his character, his confidence, his story. At Bremer, we don&apos;t just tailor garments, we tailor identities.&rdquo;
          </blockquote>
          <p className="text-sm text-white/60 tracking-widest uppercase font-medium">
            &mdash; Bremer Suits &amp; Style
          </p>
        </div>
      </section>
    </div>
  )
}
