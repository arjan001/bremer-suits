import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export const Route = createFileRoute('/faq')({
  head: () => ({
    meta: [
      {
        title: 'Frequently Asked Questions | Bremer Suits Nairobi',
      },
      {
        name: 'description',
        content: 'Find answers to common questions about Bremer Suits custom tailoring services, pricing, fittings, delivery, and bespoke suit care in Nairobi.',
      },
      {
        name: 'keywords',
        content: 'custom suit FAQ, bespoke tailoring questions, suit fitting process, Bremer Suits pricing, tailoring turnaround time Nairobi',
      },
      {
        property: 'og:title',
        content: 'Frequently Asked Questions | Bremer Suits Nairobi',
      },
      {
        property: 'og:description',
        content: 'Find answers to common questions about Bremer Suits custom tailoring services, pricing, fittings, and delivery.',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
    ],
  }),
  component: FAQPage,
})

interface FAQItem {
  question: string
  answer: string
}

const faqCategories: { title: string; items: FAQItem[] }[] = [
  {
    title: 'Orders & Pricing',
    items: [
      {
        question: 'How do I place an order for a custom suit?',
        answer:
          'You can place an order by visiting our store for a personal fitting, or by contacting us through the website. We will guide you through fabric selection, measurements, and design preferences to create your perfect garment.',
      },
      {
        question: 'What is the price range for a bespoke suit?',
        answer:
          'Our bespoke suits vary in price depending on the fabric, design complexity, and finishing details. Please contact us or visit our collections page for current pricing. We offer options for various budgets without compromising on quality.',
      },
      {
        question: 'Do you offer payment plans?',
        answer:
          'Yes, we offer flexible payment plans for bespoke orders. You can pay a deposit at the time of order and settle the balance upon collection. Contact us for more details on available payment options.',
      },
      {
        question: 'Can I cancel or modify my order?',
        answer:
          'Custom orders can be modified within 48 hours of placement. Since bespoke garments are made specifically for you, cancellations after production has begun may not be possible. Please reach out to us as soon as possible if you need changes.',
      },
    ],
  },
  {
    title: 'Tailoring & Fit',
    items: [
      {
        question: 'How long does it take to make a custom suit?',
        answer:
          'A bespoke suit typically takes 3 to 4 weeks from the initial consultation to the final fitting. Rush orders may be accommodated depending on our schedule — please inquire about expedited options.',
      },
      {
        question: 'Do I need to visit in person for measurements?',
        answer:
          'For the best fit, we recommend an in-person consultation at our store. However, if you are unable to visit, we can provide guidance on taking your own measurements remotely. A follow-up fitting is recommended before final delivery.',
      },
      {
        question: 'What if the suit does not fit perfectly?',
        answer:
          'Every bespoke suit includes a complimentary fitting session where adjustments are made. If minor alterations are needed after delivery, we are happy to make them at no extra charge within 30 days of collection.',
      },
      {
        question: 'Can you alter or repair suits purchased elsewhere?',
        answer:
          'Yes, our tailors can perform alterations and repairs on suits from other brands. Bring the garment to our store and we will assess the work needed and provide a quote.',
      },
    ],
  },
  {
    title: 'Fabrics & Materials',
    items: [
      {
        question: 'What fabrics do you use?',
        answer:
          'We source premium fabrics from renowned mills around the world, including Italian wool, English tweed, linen, cotton, and silk blends. During your consultation, you can browse our full fabric library and feel the materials in person.',
      },
      {
        question: 'Can I bring my own fabric?',
        answer:
          'Absolutely. If you have a specific fabric you would like us to work with, bring it to our store and we will assess its suitability for your desired garment. Additional charges may apply for working with customer-supplied materials.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    items: [
      {
        question: 'Do you offer delivery?',
        answer:
          'Yes, we offer nationwide delivery for completed garments. Delivery times and costs depend on your location. For bespoke orders, we recommend in-person collection to ensure the perfect fit.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'We currently focus on domestic delivery but can arrange international shipping on a case-by-case basis. Please contact us to discuss international orders and shipping options.',
      },
    ],
  },
  {
    title: 'Services',
    items: [
      {
        question: 'What services do you offer beyond tailoring?',
        answer:
          'In addition to bespoke tailoring, we offer personal styling consultations, image consulting, wedding and event styling, wardrobe audits, and curated accessories. Visit our services page for the full range.',
      },
      {
        question: 'Do you offer wedding packages?',
        answer:
          'Yes, we offer comprehensive wedding styling packages for grooms and groomsmen. This includes custom suit design, fittings, accessories coordination, and day-of styling support. Book a consultation early to allow sufficient time for production.',
      },
      {
        question: 'Can I book an image consulting session?',
        answer:
          'Yes, our image consulting sessions cover personal branding, executive presence, colour analysis, and wardrobe strategy. You can book a session through our contact page or by calling the store directly.',
      },
    ],
  },
]

function FAQItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left group cursor-pointer bg-transparent border-none"
      >
        <span className="text-sm sm:text-base font-medium text-gray-900 pr-4 group-hover:text-gray-600 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <p className="text-sm text-gray-500 leading-relaxed px-1">
          {item.answer}
        </p>
      </div>
    </div>
  )
}

function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/tailor-hero-bg.jpg"
            alt="Tailoring patterns"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto font-light">
            Everything you need to know about our tailoring services, orders, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category) => (
            <div key={category.title} className="mb-12 last:mb-0">
              <h2
                className="text-xl sm:text-2xl font-semibold text-black mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {category.title}
              </h2>
              <div>
                {category.items.map((item, idx) => {
                  const key = `${category.title}-${idx}`
                  return (
                    <FAQItem
                      key={key}
                      item={item}
                      isOpen={!!openItems[key]}
                      onToggle={() => toggleItem(key)}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="mt-16 text-center py-12 px-6 bg-gray-50">
            <h3
              className="text-xl sm:text-2xl font-semibold text-black mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Still have questions?
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Our team is here to help. Reach out and we will get back to you as soon as possible.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
