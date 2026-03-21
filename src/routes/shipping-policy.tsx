import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/shipping-policy')({
  component: ShippingPolicy,
})

function ShippingPolicy() {
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
            Shipping Policy
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about how we deliver your garments.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Dispatch Schedule</h2>
              <p>
                Orders are dispatched on Tuesdays and Fridays. Orders placed after 12:00 PM on a dispatch day will be included in the next scheduled dispatch. Custom and made-to-measure orders follow their own production timelines and will be dispatched upon completion.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Delivery Times</h2>
              <p className="mb-3">Estimated delivery times from the date of dispatch:</p>
              <div className="overflow-hidden border border-gray-200 rounded">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-black">Delivery Area</th>
                      <th className="text-left px-4 py-3 font-semibold text-black">Estimated Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3">Local (Same City)</td>
                      <td className="px-4 py-3">1-2 business days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Nationwide</td>
                      <td className="px-4 py-3">3-5 business days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">International</td>
                      <td className="px-4 py-3">7-14 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Delivery times are estimates and may vary depending on location, customs processing, and carrier schedules.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Shipping Costs</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Local delivery is complimentary for orders over $100 USD</li>
                <li>Standard nationwide shipping rates apply and are calculated at checkout</li>
                <li>International shipping costs vary by destination and package weight</li>
                <li>Express shipping options are available at an additional cost</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Order Tracking</h2>
              <p>
                Once your order has been dispatched, you will receive a confirmation email with a tracking number. You can use this number to track your package through the carrier's website. If you do not receive tracking information within 48 hours of dispatch, please contact us.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">In-Store Collection</h2>
              <p>
                You are welcome to collect your order from our studio at no additional charge. We will notify you when your order is ready for collection. Items will be held for 30 days from the notification date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Custom Orders</h2>
              <p>
                Bespoke and made-to-measure garments follow a separate timeline. Production typically takes 3-6 weeks depending on the garment complexity. We will keep you updated throughout the process and arrange delivery or fitting once complete.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Issues with Delivery</h2>
              <p>
                If your package is lost, damaged in transit, or significantly delayed, please{' '}
                <Link to="/contact" className="text-black underline hover:text-gray-600 transition-colors">
                  contact us
                </Link>{' '}
                as soon as possible. We will work with the shipping carrier to resolve the issue and ensure you receive your order.
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
