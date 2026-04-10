import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/refund-policy')({
  head: () => ({
    meta: [
      { title: 'Refund Policy | Bremer Suits' },
      { name: 'description', content: 'Understand the Bremer Suits refund and return policy for custom orders and ready-to-wear purchases.' },
      { name: 'robots', content: 'noindex, follow' },
    ],
  }),
  component: RefundPolicy,
})

function RefundPolicy() {
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
            Refund Policy
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            We want you to be completely satisfied with your purchase. Here's how our refund process works.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Ready-to-Wear Items</h2>
              <p className="mb-3">
                For ready-to-wear suits, shirts, and accessories purchased from our collection:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items may be returned within 14 days of delivery for a full refund</li>
                <li>Items must be unworn, unwashed, and in their original packaging with all tags attached</li>
                <li>Proof of purchase (receipt or order confirmation) is required</li>
                <li>Refunds will be processed to the original payment method within 7-10 business days</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Custom & Made-to-Measure Orders</h2>
              <p className="mb-3">
                Due to the personalized nature of bespoke tailoring:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Custom orders cannot be refunded once fabric has been cut and production has begun</li>
                <li>If you are unsatisfied with the fit, we offer complimentary alterations to ensure a perfect result</li>
                <li>If we are unable to achieve a satisfactory fit after reasonable alterations, we will work with you to find a fair resolution</li>
                <li>Cancellations before production begins may be subject to a restocking fee of up to 30% of the order value</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Exchanges</h2>
              <p>
                We are happy to exchange ready-to-wear items for a different size or style, subject to availability. Exchange requests must be made within 14 days of delivery. If the replacement item is of higher value, the price difference will be charged. If lower, the difference will be refunded.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Damaged or Defective Items</h2>
              <p className="mb-3">
                If you receive a damaged or defective item:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact us within 48 hours of delivery with photos of the issue</li>
                <li>We will arrange a replacement or full refund at no additional cost</li>
                <li>Do not attempt to alter or repair the item, as this may void the return</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Non-Returnable Items</h2>
              <p className="mb-3">The following items cannot be returned or refunded:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Altered or tailored garments (unless defective)</li>
                <li>Items marked as final sale or clearance</li>
                <li>Gift cards and vouchers</li>
                <li>Consultation and styling service fees</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">How to Request a Refund</h2>
              <p>
                To initiate a return or refund, please{' '}
                <Link to="/contact" className="text-black underline hover:text-gray-600 transition-colors">
                  contact us
                </Link>{' '}
                with your order number and reason for the return. Our team will guide you through the process and provide return instructions if applicable.
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
