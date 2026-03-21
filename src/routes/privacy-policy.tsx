import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicy,
})

function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Information We Collect</h2>
              <p className="mb-3">
                When you visit our site, place an order, or interact with our services, we may collect the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal details such as your name, email address, phone number, and shipping address</li>
                <li>Payment information processed securely through our payment providers</li>
                <li>Body measurements and style preferences provided during consultations</li>
                <li>Browsing data including pages visited, time spent, and device information</li>
                <li>Communications you send to us via email, contact forms, or social media</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders, including custom tailoring requests</li>
                <li>Communicate with you about orders, appointments, and consultations</li>
                <li>Send promotional materials and newsletters (with your consent)</li>
                <li>Improve our website, products, and customer experience</li>
                <li>Comply with legal obligations and protect against fraud</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Data Protection</h2>
              <p>
                We implement industry-standard security measures to protect your personal data. Payment information is encrypted and processed through secure third-party payment processors. We never store your full credit card details on our servers.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Cookies</h2>
              <p>
                Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can manage cookie preferences through your browser settings. Disabling cookies may affect certain features of the site.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Third-Party Services</h2>
              <p>
                We may share your information with trusted third-party service providers who assist us in operating our business, such as payment processors, shipping carriers, and email marketing platforms. These providers are contractually obligated to keep your information secure and confidential.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Withdraw consent for data processing where applicable</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or your personal data, please{' '}
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
