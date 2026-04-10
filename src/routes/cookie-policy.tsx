import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/cookie-policy')({
  head: () => ({
    meta: [
      { title: 'Cookie Policy | Bremer Suits — How We Use Cookies & Tracking' },
      { name: 'description', content: 'Learn how Bremer Suits uses cookies and similar tracking technologies on our website to enhance your browsing experience, analyse traffic, and personalise content in Nairobi, Kenya.' },
      { name: 'keywords', content: 'Bremer Suits cookie policy, website cookies, tracking technologies, cookie consent Kenya, browser cookies tailoring, third-party cookies, analytics cookies, essential cookies, cookie preferences, GDPR cookies Kenya, website tracking policy, Bremer Suits data, online privacy cookies, cookie management, Bremer Suits website policy' },
      { name: 'robots', content: 'noindex, follow' },
      { name: 'author', content: 'Bremer Suits' },
      { name: 'publisher', content: 'Bremer Suits' },
      { name: 'language', content: 'en' },
      { name: 'revisit-after', content: '30 days' },
      { name: 'rating', content: 'general' },
      { name: 'distribution', content: 'global' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', content: '#1a1a1a' },
      { name: 'apple-mobile-web-app-title', content: 'Bremer Suits' },
      { name: 'application-name', content: 'Bremer Suits' },
      { name: 'msapplication-TileColor', content: '#1a1a1a' },
      { property: 'og:title', content: 'Cookie Policy | Bremer Suits' },
      { property: 'og:description', content: 'Understand how Bremer Suits uses cookies and tracking technologies to improve your website experience.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://bremersuits.com/cookie-policy' },
      { property: 'og:site_name', content: 'Bremer Suits' },
      { property: 'og:locale', content: 'en_KE' },
      { property: 'og:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Bremer Suits - Cookie Policy' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@bremersuits' },
      { name: 'twitter:creator', content: '@bremersuits' },
      { name: 'twitter:title', content: 'Cookie Policy | Bremer Suits' },
      { name: 'twitter:description', content: 'Understand how Bremer Suits uses cookies and tracking technologies to improve your website experience.' },
      { name: 'twitter:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { name: 'twitter:image:alt', content: 'Bremer Suits - Cookie Policy' },
      { name: 'geo.region', content: 'KE-110' },
      { name: 'geo.placename', content: 'Nairobi' },
      { name: 'geo.position', content: '-1.2864;36.8172' },
      { name: 'ICBM', content: '-1.2864, 36.8172' },
      { property: 'business:contact_data:street_address', content: 'Kimathi St' },
      { property: 'business:contact_data:locality', content: 'Nairobi' },
      { property: 'business:contact_data:country_name', content: 'Kenya' },
      { property: 'business:contact_data:email', content: 'brendahwanja6722@gmail.com' },
      { property: 'business:contact_data:phone_number', content: '+254 793 880642' },
    ],
    links: [
      { rel: 'canonical', href: 'https://bremersuits.com/cookie-policy' },
    ],
  }),
  component: CookiePolicy,
})

function CookiePolicy() {
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
            Cookie Policy
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Learn how we use cookies and similar technologies to improve your experience.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work efficiently, provide a better browsing experience, and give site owners useful information about how their site is being used.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">How We Use Cookies</h2>
              <p className="mb-3">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential cookies:</strong> Required for the website to function properly, including session management, shopping cart functionality, and security features</li>
                <li><strong>Functional cookies:</strong> Remember your preferences such as language, currency, and display settings to provide a personalized experience</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website by collecting information about pages visited, time spent, and navigation patterns</li>
                <li><strong>Marketing cookies:</strong> Used to track visitors across websites to display relevant advertisements and measure the effectiveness of our campaigns</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Types of Cookies We Use</h2>
              <div className="overflow-hidden border border-gray-200 rounded">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-black">Cookie Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-black">Purpose</th>
                      <th className="text-left px-4 py-3 font-semibold text-black">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3">Session</td>
                      <td className="px-4 py-3">Maintain your session while browsing</td>
                      <td className="px-4 py-3">Until browser closes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Preferences</td>
                      <td className="px-4 py-3">Remember your settings and choices</td>
                      <td className="px-4 py-3">Up to 1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Analytics</td>
                      <td className="px-4 py-3">Understand site usage patterns</td>
                      <td className="px-4 py-3">Up to 2 years</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Marketing</td>
                      <td className="px-4 py-3">Personalized advertising</td>
                      <td className="px-4 py-3">Up to 1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Third-Party Cookies</h2>
              <p>
                Some cookies are placed by third-party services that appear on our pages. We use services such as analytics providers and social media platforms that may set their own cookies. We do not control these cookies — please refer to the respective third-party privacy policies for more information.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Managing Your Cookie Preferences</h2>
              <p className="mb-3">
                You can manage your cookie preferences in several ways:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the cookie preferences option in our website footer to customize which non-essential cookies you accept</li>
                <li>Adjust your browser settings to block or delete cookies</li>
                <li>Use private/incognito browsing mode to prevent cookies from being stored</li>
              </ul>
              <p className="mt-3 text-sm text-gray-400">
                Please note that disabling certain cookies may affect the functionality of our website and your ability to use some features.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Updates to This Policy</h2>
              <p>
                We may update this cookie policy from time to time to reflect changes in our practices or applicable regulations. Any updates will be posted on this page with an updated effective date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black mb-4">Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please{' '}
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
