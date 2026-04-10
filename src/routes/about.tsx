import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Scissors, Heart, Shield } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

const whyChooseUs = [
  {
    icon: '/images/icon-fabrics.png',
    title: 'Heritage',
    description:
      'Our atelier blends traditional tailoring methods with modern design sensibilities.',
  },
  {
    icon: '/images/icon-measure.png',
    title: 'Fabric Sourcing',
    description:
      'We work with renowned mills and fabric houses, ensuring every garment begins with premium.',
  },
  {
    iconComponent: Heart,
    title: 'Personal Service',
    description:
      'Every stage is personal. We listen, advise, and guide you through a seamless, enjoyable experience.',
  },
  {
    iconComponent: Shield,
    title: 'Aftercare',
    description:
      'We provide ongoing care, alterations, and advice so your bespoke pieces maintain their perfect fit.',
  },
]

const services = [
  {
    title: 'Perfect Fit, Every Time',
    description:
      'We specialize in precision alterations to make sure every garment drapes flawlessly on your body. Whether it\'s a business suit, evening gown, or casual wear, we tailor it to enhance your natural shape and comfort.',
  },
  {
    title: 'Bespoke Craftsmanship',
    description:
      'Our custom tailoring goes beyond simple adjustments. Each piece is carefully designed and crafted to reflect your personal style, giving you a one-of-a-kind wardrobe that speaks to your individuality.',
  },
  {
    title: 'Fast & Reliable Service',
    description:
      'We understand your time is valuable. That\'s why we offer quick turnaround without compromising on precision, so you can enjoy a polished, perfectly tailored look exactly when you need it.',
  },
]

const stats = [
  { value: '500+', label: 'Suits Crafted' },
  { value: '200+', label: 'Happy Clients' },
  { value: '98%', label: 'Satisfaction Rate' },
]

function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/about-wedding-group.jpg"
            alt="About Bremer Suits"
            className="w-full h-full object-cover opacity-35"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3 font-medium">
            Our Story
          </p>
          <h1
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            About Bremer Suits
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Where tradition meets modern ambition. We craft more than suits —
            we craft confidence.
          </p>
        </div>
      </section>

      {/* Story - Image RIGHT (new bespoke man image), Text LEFT */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 font-medium">
                The Beginning
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold text-black mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Born from a Belief in the Power of Presentation
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  Bremer Suits was founded on a simple but powerful idea: that how
                  you present yourself to the world matters. Not out of vanity, but
                  out of respect — for yourself, for the people you serve, and for
                  the goals you're working toward.
                </p>
                <p>
                  What began as a passion for bespoke tailoring evolved into a
                  comprehensive approach to personal image. We realized that a great
                  suit is just the beginning. True transformation comes from
                  understanding the full picture — body, style, context, and
                  intention.
                </p>
                <p>
                  Today, Bremer Suits serves professionals, executives, and
                  entrepreneurs across a range of industries. Whether it's a
                  single bespoke suit for a milestone moment or a complete wardrobe
                  overhaul, we bring the same level of care, expertise, and personal
                  attention to every engagement.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/images/about-bespoke-man.jpg"
                  alt="Bespoke suit craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-black text-white p-6 hidden lg:block">
                <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Since
                </p>
                <p className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Strip */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-1.jpg" alt="Bremer collection" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/portfolio/bespoke-green-pinstripe.jpg" alt="Green pinstripe suit" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-19.jpg" alt="Bremer craftsmanship" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/portfolio/bespoke-orange-mannequin.jpg" alt="Orange suit" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-20.jpg" alt="Bremer style" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/portfolio/wedding-cream-bridal-lineup.jpg" alt="Cream bridal lineup" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Image with overlaid stats */}
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="/images/about-burgundy-suit.jpg"
                  alt="Burgundy bespoke suit"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Stats overlays */}
              <div className="absolute bottom-8 right-0 translate-x-4 lg:translate-x-8 flex flex-col gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-stone-200/90 backdrop-blur-sm px-6 py-4 min-w-[180px]"
                  >
                    <p
                      className="text-2xl lg:text-3xl font-bold text-black"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs tracking-wide uppercase text-gray-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Title + 2x2 icon grid */}
            <div>
              <p
                className="text-sm italic text-amber-700 mb-3 font-medium"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The details that define our craft
              </p>
              <h2
                className="text-3xl lg:text-5xl font-bold text-black mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Why Choose Our Atelier
              </h2>
              <div className="border-t-2 border-dashed border-amber-700/40 w-48 mb-10" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {whyChooseUs.map((item) => (
                  <div key={item.title}>
                    <div className="w-16 h-16 mb-4 flex items-center justify-center">
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="w-14 h-14 object-contain"
                        />
                      ) : item.iconComponent ? (
                        <item.iconComponent
                          size={40}
                          className="text-black"
                          strokeWidth={1.2}
                        />
                      ) : null}
                    </div>
                    <h3 className="text-base font-bold text-black mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stellar Tailor Services — Text LEFT, Image RIGHT (new image) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p
                className="text-sm italic text-amber-700 mb-3 font-medium"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Crafting excellence with masterful tools and unmatched skills
              </p>
              <h2
                className="text-3xl lg:text-5xl font-bold text-black mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Stellar Tailor Services
              </h2>
              <div className="border-t-2 border-dashed border-amber-700/40 w-48 mb-10" />

              <div className="space-y-8">
                {services.map((service) => (
                  <div key={service.title}>
                    <h3
                      className="text-lg font-bold text-black mb-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/images/about-style-portrait.jpg"
                alt="Style portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* More Images Gallery */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-21.jpg" alt="Bremer craftsmanship" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-22.jpg" alt="Bremer style" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-40.jpg" alt="Bremer collection" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-41.jpg" alt="Bremer tailoring" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-23.jpg" alt="Bremer suits" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/gallery-24.jpg" alt="Bremer design" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy - Image RIGHT (new image), Text LEFT */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 font-medium">
                Our Philosophy
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold text-black mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Dress with Intention
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  We believe that every garment in your wardrobe should earn its place.
                  No filler, no trends for trend's sake — just thoughtful, well-made
                  pieces that serve your life and communicate your values.
                </p>
                <p>
                  Our approach blends the time-honored art of bespoke tailoring with
                  contemporary style strategy. We draw on decades of sartorial tradition
                  while keeping a sharp eye on the modern professional landscape.
                </p>
                <p>
                  The result is a wardrobe that doesn't just look good — it works.
                  It moves with you through meetings and milestones, first impressions
                  and lasting legacies.
                </p>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden order-1 lg:order-2">
              <img
                src="/images/portfolio/wedding-brown-beige-group.jpg"
                alt="Wedding group styling"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              How We Work
            </h2>
            <p className="text-sm text-gray-500 mt-3">
              Your journey to impeccable style in four steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Consult',
                desc: 'We meet to understand your goals, lifestyle, and vision.',
                icon: Scissors,
              },
              {
                step: '02',
                title: 'Design',
                desc: 'We develop a personalized plan — fabrics, styles, and strategy.',
                image: '/images/icon-fabrics.png',
              },
              {
                step: '03',
                title: 'Craft',
                desc: 'Your pieces are made with meticulous care and precision.',
                image: '/images/icon-measure.png',
              },
              {
                step: '04',
                title: 'Refine',
                desc: 'Final fittings and adjustments to ensure perfection.',
                icon: Heart,
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-5 bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:border-gray-300 transition-colors duration-300">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-contain"
                    />
                  ) : item.icon ? (
                    <item.icon size={28} className="text-black" strokeWidth={1.2} />
                  ) : null}
                </div>
                <div className="text-xs text-amber-700 font-bold tracking-wider mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
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
            Let's Work Together
          </h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-lg mx-auto font-light">
            Whether you need a single bespoke piece or a complete image
            transformation, we're ready to help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
          >
            Get in Touch
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
