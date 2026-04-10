import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/terms-of-service')({
  head: () => ({
    meta: [
      { title: 'Terms of Service | Bremer Suits' },
      { name: 'description', content: 'Review the Bremer Suits terms of service for custom tailoring orders, consultations, and online purchases.' },
      { name: 'robots', content: 'noindex, follow' },
    ],
  }),
  component: TermsOfService,
})

function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/fabric-pattern.png"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3 font-medium">
            Legal
          </p>
          <h1
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Please read these terms carefully before using our services or placing an order.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Agreement to Terms</h2>
              <p>
                By accessing or using the Bremer Suits website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Products & Services</h2>
              <p className="mb-3">
                Bremer Suits offers custom tailoring, ready-to-wear suits, image consulting, and related services. Please note:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product images are for illustration purposes and may vary slightly from the actual product due to screen settings and fabric batch variations</li>
                <li>Custom-made garments are produced to your specific measurements and specifications</li>
                <li>Prices are subject to change without prior notice</li>
                <li>We reserve the right to limit quantities or discontinue products at any time</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Orders & Payment</h2>
              <p className="mb-3">When placing an order:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All orders are subject to availability and confirmation</li>
                <li>Custom orders require a deposit at the time of order placement</li>
                <li>Full payment is due before delivery or collection of finished garments</li>
                <li>We accept payments via M-PESA, Visa, and Mastercard</li>
                <li>Prices are displayed in USD and include applicable taxes unless stated otherwise</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Custom Tailoring</h2>
              <p className="mb-3">For bespoke and made-to-measure orders:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accurate measurements are essential — we recommend an in-person fitting at our studio</li>
                <li>Production timelines vary depending on the complexity of the garment and current workload</li>
                <li>Fittings and alterations may be required and are included in the service</li>
                <li>Custom orders cannot be cancelled once production has begun</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Intellectual Property</h2>
              <p>
                All content on this website — including text, images, logos, designs, and branding — is the property of Bremer Suits and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Limitation of Liability</h2>
              <p>
                Bremer Suits shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services. Our total liability for any claim shall not exceed the amount paid by you for the relevant product or service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with applicable local laws. Any disputes arising from these terms shall be resolved through negotiation or, if necessary, through the appropriate legal channels.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to update these terms at any time. Changes take effect immediately upon posting. Continued use of our services after changes constitutes acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Contact Us</h2>
              <p>
                If you have questions about these terms, please{' '}
                <Link to="/contact" className="text-black underline hover:text-gray-600 transition-colors">
                  contact us
                </Link>.
              </p>
            </div>

            <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
