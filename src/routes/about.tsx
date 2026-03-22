import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Award, Heart, Target, Users } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

const values = [
  {
    icon: Award,
    title: 'Craftsmanship',
    description: 'We believe in the enduring value of meticulous handwork and time-honored tailoring techniques.',
  },
  {
    icon: Target,
    title: 'Precision',
    description: 'Every measurement, every stitch, every detail is considered with intention and care.',
  },
  {
    icon: Heart,
    title: 'Personal Touch',
    description: 'We take time to understand each client individually — their lifestyle, goals, and preferences.',
  },
  {
    icon: Users,
    title: 'Partnership',
    description: 'We see every client relationship as a long-term partnership in building and maintaining their image.',
  },
]

const stats = [
  { value: '500+', label: 'Suits Crafted' },
  { value: '200+', label: 'Happy Clients' },
  { value: '30+', label: 'Measurements Taken' },
  { value: '100%', label: 'Satisfaction Rate' },
]

function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/about-hero.webp"
            alt="About Bremer Suits"
            className="w-full h-full object-cover opacity-40"
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

      {/* Story */}
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
                  src="/images/dressmaker-1.png"
                  alt="Bremer Suits craftsmanship"
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

      {/* Stats */}
      <section className="bg-black py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-3xl lg:text-4xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs tracking-widest uppercase text-white/50 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Values
            </h2>
            <p className="text-sm text-gray-500 mt-3">What drives everything we do</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 text-center border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-5 bg-gray-50 flex items-center justify-center">
                  <value.icon size={24} className="text-black" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="/images/fabrics.png"
                alt="Premium fabrics"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
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
