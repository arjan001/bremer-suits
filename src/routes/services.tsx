import { createFileRoute, Link } from '@tanstack/react-router'
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
} from 'lucide-react'

export const Route = createFileRoute('/services')({
  component: Services,
})

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
    image: '/images/sewing-machine.png',
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
    image: '/images/suit-formal.webp',
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
    image: '/images/dressmaker.png',
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
    image: '/images/dressmaker-1.png',
  },
]

const additionalServices = [
  {
    icon: Watch,
    title: 'Male Accessories',
    description:
      'Complete your look with our curated collection of premium accessories — ties, cufflinks, pocket squares, belts, and watches sourced from the finest brands.',
  },
  {
    icon: Heart,
    title: 'Ruracio Styling',
    description:
      'Look your best for traditional ceremonies. We specialize in culturally respectful yet fashion-forward styling for Ruracio and other traditional events.',
  },
  {
    icon: Users,
    title: 'Corporate Programs',
    description:
      'Group styling workshops and executive image programs tailored for leadership teams and client-facing professionals.',
  },
  {
    icon: Ruler,
    title: 'Alterations & Fitting',
    description:
      'Expert alterations service to ensure every garment fits perfectly. From minor adjustments to complete restructuring.',
  },
  {
    icon: Sparkles,
    title: 'Special Occasions',
    description:
      'Gala outfits, anniversary styling, and milestone event preparation. We ensure you look impeccable for life\'s most important moments.',
  },
  {
    icon: Gem,
    title: 'Fabric Sourcing',
    description:
      'Access to the world\'s finest fabric mills. We help you select the perfect material for your vision and lifestyle.',
  },
]

function Services() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/measure.png"
            alt="Services"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3 font-medium">
            Our Services
          </p>
          <h1
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What We Do
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            From bespoke suiting to complete image transformation, every service
            is designed to help you present the best version of yourself.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {mainServices.map((service, index) => (
            <div
              key={service.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:[direction:rtl] lg:*:[direction:ltr]' : ''
              }`}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <service.icon size={20} className="text-black" strokeWidth={1.5} />
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-400 font-medium">
                    {service.subtitle}
                  </p>
                </div>
                <h2
                  className="text-3xl lg:text-4xl font-bold text-black mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {service.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                  {service.description}
                </p>
                <div className="bg-gray-50 p-6 mb-6">
                  <h4 className="text-xs tracking-[0.2em] uppercase text-black mb-4 font-semibold">
                    What's Included
                  </h4>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle
                          size={16}
                          className="text-black mt-0.5 shrink-0"
                          strokeWidth={1.5}
                        />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
                >
                  Inquire About This Service
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services Grid */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Additional Services
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
              A full range of services to complement your style journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service) => (
              <div
                key={service.title}
                className="p-8 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <service.icon
                  size={24}
                  className="text-black mb-5"
                  strokeWidth={1.5}
                />
                <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              How It Works
            </h2>
            <p className="text-sm text-gray-500 mt-3">Your journey to impeccable style in four steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consult', desc: 'We meet to understand your goals, lifestyle, and vision.' },
              { step: '02', title: 'Design', desc: 'We develop a personalized plan — fabrics, styles, and strategy.' },
              { step: '03', title: 'Craft', desc: 'Your pieces are made with meticulous care and precision.' },
              { step: '04', title: 'Refine', desc: 'Final fittings and adjustments to ensure perfection.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-black text-white flex items-center justify-center">
                  <span className="text-lg font-bold">{item.step}</span>
                </div>
                <h3 className="text-sm font-semibold text-black mb-2 uppercase tracking-wide">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
            Let's Build Your Look
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-lg mx-auto font-light">
            Every great wardrobe starts with a conversation. Tell us about your goals
            and we'll craft a plan tailored to you.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-10 py-4 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
          >
            Start Your Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}
