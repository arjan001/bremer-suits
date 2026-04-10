import { createFileRoute, Link } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: [
      { title: 'The Journal | Style Tips & Tailoring Insights | Bremer Suits' },
      { name: 'description', content: 'Read expert insights on bespoke tailoring, men\'s fashion trends in Nairobi, wedding suit styling tips, and the art of dressing well from Bremer Suits.' },
      { name: 'keywords', content: 'Bremer Suits, Bremer, BremerSuits, BREMER SUITS, men\'s fashion blog Nairobi, suit styling tips Kenya, bespoke tailoring insights, wedding suit guide, Bremer Suits journal, bremer suits blog, men\'s style advice, groom fashion tips, corporate dressing Kenya, tailoring trends Africa, suit care guide, fashion journal Nairobi, menswear blog East Africa' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'author', content: 'Bremer Suits' },
      { name: 'publisher', content: 'Bremer Suits' },
      { name: 'language', content: 'en' },
      { name: 'revisit-after', content: '7 days' },
      { name: 'rating', content: 'general' },
      { name: 'distribution', content: 'global' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', content: '#1a1a1a' },
      { name: 'apple-mobile-web-app-title', content: 'Bremer Suits' },
      { name: 'application-name', content: 'Bremer Suits' },
      { name: 'msapplication-TileColor', content: '#1a1a1a' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { property: 'og:title', content: 'The Journal | Style Tips & Tailoring Insights | Bremer Suits' },
      { property: 'og:description', content: 'Read expert insights on bespoke tailoring, men\'s fashion trends in Nairobi, wedding suit styling tips, and the art of dressing well from Bremer Suits.' },
      { property: 'og:type', content: 'blog' },
      { property: 'og:url', content: 'https://bremersuits.com/blog' },
      { property: 'og:site_name', content: 'Bremer Suits' },
      { property: 'og:locale', content: 'en_KE' },
      { property: 'og:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'The Journal - Style Tips & Tailoring Insights from Bremer Suits' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@bremersuits' },
      { name: 'twitter:creator', content: '@bremersuits' },
      { name: 'twitter:title', content: 'The Journal | Style Tips & Tailoring Insights | Bremer Suits' },
      { name: 'twitter:description', content: 'Expert insights on bespoke tailoring, fashion trends, and the art of dressing well from Nairobi\'s premier suit house.' },
      { name: 'twitter:image', content: 'https://bremersuits.com/images/og-logo-gold-black.jpg' },
      { name: 'twitter:image:alt', content: 'The Journal - Bremer Suits Style Tips & Tailoring Insights' },
      { name: 'geo.region', content: 'KE-110' },
      { name: 'geo.placename', content: 'Nairobi' },
      { name: 'geo.position', content: '-1.2864;36.8172' },
      { name: 'ICBM', content: '-1.2864, 36.8172' },
      { property: 'business:contact_data:street_address', content: 'Kimathi St' },
      { property: 'business:contact_data:locality', content: 'Nairobi' },
      { property: 'business:contact_data:country_name', content: 'Kenya' },
      { property: 'business:contact_data:email', content: 'brendahwanja6722@gmail.com' },
      { property: 'business:contact_data:phone_number', content: '+254 793 880642' },
      { name: 'subject', content: 'Style Tips & Tailoring Insights Journal' },
      { name: 'classification', content: 'Blog' },
      { name: 'category', content: 'Fashion & Tailoring' },
      { name: 'coverage', content: 'Kenya' },
      { name: 'target', content: 'all' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'MobileOptimized', content: '320' },
    ],
    links: [
      { rel: 'canonical', href: 'https://bremersuits.com/blog' },
    ],
  }),
  component: BlogIndex,
})

function BlogIndex() {
  const posts = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/fabric-pattern-1.png"
            alt="Journal"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">
          <h1
            className="text-4xl lg:text-6xl text-white mb-2 italic"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Journal
          </h1>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post._meta.path}
                to="/blog/$slug"
                params={{ slug: post._meta.path }}
                className="group block bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <p className="text-xs tracking-wide text-gray-400 uppercase">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <span className="text-gray-200">|</span>
                    <p className="text-xs text-gray-400">{post.author}</p>
                  </div>
                  <h2
                    className="text-xl lg:text-2xl font-bold text-black mb-3 group-hover:text-gray-600 transition-colors duration-200"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {post.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] tracking-wider uppercase text-gray-400 border border-gray-200 px-2.5 py-0.5 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black font-medium group-hover:gap-3 transition-all duration-300">
                    Read Article <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
