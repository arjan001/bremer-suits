import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown, Phone, Mail, MapPin, Scissors, Truck, CreditCard, Shirt, Sparkles, HelpCircle } from 'lucide-react'

export const Route = createFileRoute('/faq')({
  head: () => ({
    meta: [
      { title: 'Frequently Asked Questions | Bremer Suits Nairobi' },
      { name: 'description', content: 'Find answers to common questions about Bremer Suits custom tailoring services, pricing, fittings, delivery, and bespoke suit care in Nairobi, Kenya.' },
      { name: 'keywords', content: 'Bremer Suits, Bremer, BremerSuits, BREMER SUITS, custom suit FAQ, bespoke tailoring questions, suit fitting process, Bremer Suits pricing, tailoring turnaround time Nairobi, bremer suits FAQ, suit care tips, custom order questions, tailoring delivery Kenya, measurement guide, fabric selection help, alteration questions, wedding suit FAQ' },
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
      { property: 'og:title', content: 'Frequently Asked Questions | Bremer Suits Nairobi' },
      { property: 'og:description', content: 'Find answers to common questions about Bremer Suits custom tailoring services, pricing, fittings, and delivery.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://bremersuits.com/faq' },
      { property: 'og:site_name', content: 'Bremer Suits' },
      { property: 'og:locale', content: 'en_KE' },
      { property: 'og:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Frequently Asked Questions - Bremer Suits Nairobi' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@bremersuits' },
      { name: 'twitter:creator', content: '@bremersuits' },
      { name: 'twitter:title', content: 'FAQ | Bremer Suits Nairobi' },
      { name: 'twitter:description', content: 'Answers to common questions about custom tailoring, pricing, fittings, and delivery from Bremer Suits.' },
      { name: 'twitter:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { name: 'twitter:image:alt', content: 'Frequently Asked Questions - Bremer Suits Nairobi' },
      { name: 'geo.region', content: 'KE-110' },
      { name: 'geo.placename', content: 'Nairobi' },
      { name: 'geo.position', content: '-1.2864;36.8172' },
      { name: 'ICBM', content: '-1.2864, 36.8172' },
      { property: 'business:contact_data:street_address', content: 'Kimathi St' },
      { property: 'business:contact_data:locality', content: 'Nairobi' },
      { property: 'business:contact_data:country_name', content: 'Kenya' },
      { property: 'business:contact_data:email', content: 'brendahwanja6722@gmail.com' },
      { property: 'business:contact_data:phone_number', content: '+254 793 880642' },
      { name: 'subject', content: 'Frequently Asked Questions' },
      { name: 'classification', content: 'Business' },
      { name: 'category', content: 'Fashion & Tailoring' },
      { name: 'coverage', content: 'Kenya' },
      { name: 'target', content: 'all' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'MobileOptimized', content: '320' },
    ],
    links: [
      { rel: 'canonical', href: 'https://bremersuits.com/faq' },
    ],
  }),
  component: FAQPage,
})

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  icon: React.ReactNode
  description: string
  items: FAQItem[]
}

const faqCategories: FAQCategory[] = [
  {
    title: 'Orders & Pricing',
    icon: <CreditCard size={20} />,
    description: 'Placing orders, pricing, payments, and modifications.',
    items: [
      {
        question: 'How do I place an order for a custom suit?',
        answer:
          'You can place an order by visiting our store on Kimathi Street, Nairobi for a personal consultation. Alternatively, contact us through our website or WhatsApp. We will guide you through fabric selection, measurements, and design preferences to create your perfect garment. For returning clients, we can also work from your existing measurements on file.',
      },
      {
        question: 'What is the price range for a bespoke suit?',
        answer:
          'Our bespoke suits start from KES 25,000 and vary depending on the fabric, design complexity, lining, and finishing details. Premium imported fabrics and intricate construction details will be at the higher end. We offer transparent pricing during your consultation and provide options for various budgets without compromising on quality or craftsmanship.',
      },
      {
        question: 'Do you offer payment plans?',
        answer:
          'Yes, we offer flexible payment plans for all bespoke orders. Typically, a 50% deposit is required at the time of order to begin production, with the remaining balance due upon collection. For larger orders (wedding parties, corporate groups), we can arrange a three-stage payment plan. Contact us for details.',
      },
      {
        question: 'Can I cancel or modify my order?',
        answer:
          'Custom orders can be modified within 48 hours of placement at no additional charge. After production has begun, modifications may incur extra costs depending on the changes required. Since bespoke garments are made specifically for you, cancellations after the cutting stage may not be possible. We recommend finalising all design decisions during your consultation.',
      },
      {
        question: 'What forms of payment do you accept?',
        answer:
          'We accept M-Pesa, cash, bank transfer, and all major credit and debit cards. For international clients, we can arrange payment via wire transfer. All payments are confirmed with a receipt and order reference number.',
      },
    ],
  },
  {
    title: 'Tailoring & Fit',
    icon: <Scissors size={20} />,
    description: 'The fitting process, timelines, and adjustments.',
    items: [
      {
        question: 'How long does it take to make a custom suit?',
        answer:
          'A bespoke suit typically takes 3 to 4 weeks from the initial consultation to the final fitting. This includes pattern creation, cutting, construction, and one to two fitting sessions. Rush orders can be completed in as little as 10 working days depending on our schedule and fabric availability — please enquire about expedited options.',
      },
      {
        question: 'Do I need to visit in person for measurements?',
        answer:
          'For the best fit, we strongly recommend an in-person consultation at our Nairobi store. Our tailors take over 30 precise measurements and assess your posture and body shape. For clients unable to visit, we can provide a detailed measurement guide for self-measurement, but a follow-up fitting is essential before final delivery to ensure perfection.',
      },
      {
        question: 'What if the suit does not fit perfectly after delivery?',
        answer:
          'Every bespoke suit includes a minimum of one fitting session during production where adjustments are made before final finishing. If minor alterations are needed after delivery, we provide complimentary adjustments within 30 days of collection. Our commitment is that you leave with a suit that fits impeccably.',
      },
      {
        question: 'Can you alter or repair suits purchased elsewhere?',
        answer:
          'Yes, our tailors are experienced in altering and repairing suits from other brands. Bring the garment to our store and we will assess the work needed and provide a quote. Common requests include taking in or letting out, re-lining, shortening sleeves, and trouser adjustments. Turnaround for alterations is typically 3 to 5 working days.',
      },
      {
        question: 'How many fittings are included?',
        answer:
          'A standard bespoke order includes two fittings. The first fitting takes place once the garment has been assembled in its initial form (the baste fitting), allowing us to check the overall structure and fit. The second fitting is for final refinements before finishing. Additional fittings can be arranged if needed at no extra charge.',
      },
      {
        question: 'What should I wear to my fitting?',
        answer:
          'Wear a well-fitted dress shirt and the shoes you plan to wear with the suit. This helps us set the correct trouser length and jacket proportions. Avoid bulky clothing that might affect measurements. If you have a suit that fits well already, bringing it along as a reference can be helpful.',
      },
    ],
  },
  {
    title: 'Fabrics & Materials',
    icon: <Shirt size={20} />,
    description: 'Fabric options, sourcing, and recommendations.',
    items: [
      {
        question: 'What fabrics do you work with?',
        answer:
          'We source premium fabrics from renowned mills around the world, including Italian wool from Loro Piana and Vitale Barberis Canonico, English tweed from Abraham Moon, and a range of linen, cotton, and silk blends. Our fabric library includes over 500 options spanning different weights, weaves, patterns, and colours. During your consultation, you can browse and feel every fabric in person.',
      },
      {
        question: 'Can I bring my own fabric?',
        answer:
          'Absolutely. If you have a specific fabric you would like us to work with, bring it to our store and we will assess its suitability for your desired garment. We will advise on whether the fabric weight, weave, and stretch are appropriate for the style you have in mind. Additional charges may apply for working with customer-supplied materials.',
      },
      {
        question: 'Which fabric is best for Nairobi\'s climate?',
        answer:
          'For Nairobi\'s moderate climate, we recommend tropical-weight wool (around 240-280 grams per metre) for year-round versatility. Wool-linen blends work well for warmer days, while pure wool in Super 110s to 130s provides comfort and durability. For more casual wear, cotton and cotton-linen blends are excellent choices. We will guide you to the best option based on how and where you plan to wear the garment.',
      },
      {
        question: 'How do I care for my suit fabric?',
        answer:
          'Proper care extends the life of your suit significantly. We recommend brushing after each wear with a natural-bristle garment brush, hanging on a wide wooden hanger, rotating between suits (never wearing the same one two days in a row), and limiting dry cleaning to twice per season. For detailed care guidance, visit our blog article on suit care.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    icon: <Truck size={20} />,
    description: 'Collection, delivery, and shipping options.',
    items: [
      {
        question: 'Do you offer delivery within Nairobi?',
        answer:
          'Yes, we offer complimentary delivery within Nairobi CBD for completed garments. For deliveries outside the CBD but within Nairobi, a small delivery fee applies. We recommend in-person collection for bespoke orders so you can try the finished garment and we can make any final touch-ups on the spot.',
      },
      {
        question: 'Can you deliver to other parts of Kenya?',
        answer:
          'Yes, we offer nationwide delivery for completed garments via trusted courier services. Delivery times range from 1 to 3 working days depending on your location. We ensure all garments are professionally packaged in a breathable garment bag to arrive in perfect condition. Delivery costs are calculated based on destination.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'We can arrange international shipping on a case-by-case basis. We have successfully delivered to clients in the UK, USA, UAE, and across East Africa. International orders require full payment before shipping. Please contact us to discuss your specific requirements, shipping costs, and timeline.',
      },
      {
        question: 'How are garments packaged for delivery?',
        answer:
          'Every garment is delivered in a premium breathable garment bag with our Bremer Suits branding. Suits are carefully folded or hung to minimise creasing. For shipped orders, we use reinforced packaging with tissue paper to protect the garment during transit.',
      },
    ],
  },
  {
    title: 'Services & Events',
    icon: <Sparkles size={20} />,
    description: 'Additional services, events, and special occasions.',
    items: [
      {
        question: 'What services do you offer beyond bespoke suits?',
        answer:
          'In addition to bespoke suits, we offer made-to-measure shirts, trousers, and overcoats. We also provide personal styling consultations, image consulting for executives and professionals, wardrobe audits, wedding and event styling, and curated accessories including ties, pocket squares, cufflinks, and leather goods. Visit our services page for the full range.',
      },
      {
        question: 'Do you offer wedding packages?',
        answer:
          'Yes, we offer comprehensive wedding packages for grooms and groomsmen. This includes individual consultations, custom suit design for the groom and wedding party, coordinated fittings, accessories coordination, and day-of styling support. We recommend booking at least 3 months before the wedding date. Group discounts are available for parties of 4 or more.',
      },
      {
        question: 'Can I book a personal styling or image consulting session?',
        answer:
          'Yes, our image consulting sessions are available for individuals and corporate groups. Services include personal branding assessment, executive presence coaching, colour and style analysis, wardrobe strategy, and shopping guidance. Sessions can be held at our store or at your office for corporate bookings. Book through our contact page or by calling us directly.',
      },
      {
        question: 'Do you offer corporate or group tailoring services?',
        answer:
          'Yes, we work with corporate clients to provide bespoke and made-to-measure suiting for teams, executives, and events. We can arrange on-site consultations at your office, coordinate fittings for large groups, and create unified corporate looks while allowing for individual sizing and preferences. Contact us for a corporate tailoring proposal.',
      },
      {
        question: 'Do you make garments for women?',
        answer:
          'While our primary focus is menswear, we do offer bespoke tailoring for women — including structured blazers, tailored trousers, and power suits. Our approach is the same: personal consultation, precise measurements, and meticulous construction. Contact us to discuss your requirements.',
      },
    ],
  },
]

function FAQItemComponent({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left group cursor-pointer bg-transparent border-none"
      >
        <span className="text-sm sm:text-[15px] font-medium text-gray-800 pr-6 group-hover:text-black transition-colors leading-relaxed">
          {item.question}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-black text-white rotate-180' : 'bg-gray-100 text-gray-400'}`}>
          <ChevronDown size={14} />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'}`}
      >
        <p className="text-sm text-gray-500 leading-[1.8] px-1 pr-10">
          {item.answer}
        </p>
      </div>
    </div>
  )
}

function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [activeCategory, setActiveCategory] = useState<string>(faqCategories[0].title)

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const activeCat = faqCategories.find((c) => c.title === activeCategory) || faqCategories[0]

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero Banner */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/tailor-hero-bg.jpg"
            alt="Tailoring patterns"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 font-medium">
            How Can We Help?
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-6xl text-white mb-5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about our bespoke tailoring services, ordering process, and more. Can't find your answer? Get in touch.
          </p>
        </div>
      </section>

      {/* Quick Contact Strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-5">
            <a href="tel:+254793880642" className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors">
              <Phone size={14} />
              <span>+254 793 880642</span>
            </a>
            <a href="mailto:brendahwanja6722@gmail.com" className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors">
              <Mail size={14} />
              <span>brendahwanja6722@gmail.com</span>
            </a>
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={14} />
              <span>Kimathi St, Nairobi</span>
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Content: Sidebar + Accordion */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">

            {/* Category Sidebar */}
            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-gray-400 font-semibold mb-5 px-1">
                Categories
              </h2>
              <nav className="space-y-1">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.title}
                    onClick={() => setActiveCategory(cat.title)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 cursor-pointer border-none
                      ${activeCategory === cat.title
                        ? 'bg-black text-white'
                        : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-black'
                      }
                    `}
                  >
                    <span className={`shrink-0 ${activeCategory === cat.title ? 'text-white/70' : 'text-gray-400'}`}>
                      {cat.icon}
                    </span>
                    <div>
                      <span className="text-sm font-medium block">{cat.title}</span>
                      <span className={`text-[11px] ${activeCategory === cat.title ? 'text-white/50' : 'text-gray-400'}`}>
                        {cat.items.length} questions
                      </span>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Mobile Category Select (visible on small screens only) */}
              <div className="lg:hidden mt-4">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 bg-white text-sm text-gray-700 appearance-none"
                >
                  {faqCategories.map((cat) => (
                    <option key={cat.title} value={cat.title}>
                      {cat.title} ({cat.items.length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FAQ Items */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-400">{activeCat.icon}</span>
                <h2
                  className="text-2xl sm:text-3xl font-semibold text-black"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {activeCat.title}
                </h2>
              </div>
              <p className="text-sm text-gray-400 mb-8 pl-0.5">
                {activeCat.description}
              </p>

              <div className="bg-white border border-gray-100 px-6 sm:px-8">
                {activeCat.items.map((item, idx) => {
                  const key = `${activeCat.title}-${idx}`
                  return (
                    <FAQItemComponent
                      key={key}
                      item={item}
                      isOpen={!!openItems[key]}
                      onToggle={() => toggleItem(key)}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Strip */}
      <section className="bg-white border-t border-gray-100 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl lg:text-3xl text-center text-black mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            Our Process at a Glance
          </h2>
          <p className="text-sm text-gray-400 text-center mb-12 max-w-lg mx-auto">
            From first consultation to final delivery, here is what to expect.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'Discuss your style, needs, and preferences. Browse fabrics and design options together.' },
              { step: '02', title: 'Measurements', desc: 'Over 30 precise body measurements taken by our expert tailors, along with posture assessment.' },
              { step: '03', title: 'Fittings', desc: 'One to two fitting sessions to refine the garment on your body before final construction.' },
              { step: '04', title: 'Delivery', desc: 'Your finished garment, perfectly fitted and beautifully packaged, ready to wear.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="text-3xl font-bold text-gray-200 block mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {item.step}
                </span>
                <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[220px] mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black text-white text-center py-14 px-8 sm:px-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)' }} />
            </div>
            <div className="relative">
              <HelpCircle size={28} className="mx-auto mb-5 text-white/30" />
              <h3
                className="text-2xl sm:text-3xl text-white mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
              >
                Still have questions?
              </h3>
              <p className="text-sm text-white/50 mb-8 max-w-md mx-auto leading-relaxed">
                Our team is here to help. Reach out by phone, email, or visit our store on Kimathi Street, Nairobi. We typically respond within a few hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-white text-black hover:bg-gray-100 transition-colors duration-300 font-semibold"
                >
                  Contact Us
                </a>
                <a
                  href="https://wa.me/254793880642"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase border border-white/30 text-white hover:bg-white/10 transition-colors duration-300 font-semibold"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
