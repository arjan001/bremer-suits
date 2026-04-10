import { createFileRoute, Link } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { ArrowRight, Clock, User } from 'lucide-react'
import { useState, useMemo } from 'react'

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
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bremersuits.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://bremersuits.com/blog' },
          ],
        }),
      },
    ],
  }),
  component: BlogIndex,
})

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const posts = useMemo(
    () =>
      [...allBlogs].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [],
  )

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category || 'General'))
    return ['All', ...Array.from(cats).sort()]
  }, [posts])

  const filteredPosts = useMemo(
    () =>
      activeCategory === 'All'
        ? posts
        : posts.filter((p) => (p.category || 'General') === activeCategory),
    [posts, activeCategory],
  )

  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1)

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/fabric-pattern-1.png"
            alt="Journal"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4 font-medium">
            Bremer Suits
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            The Journal
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-lg mx-auto font-light leading-relaxed">
            Insights on bespoke tailoring, personal style, and the art of dressing with intention.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide -mx-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  shrink-0 px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-200 cursor-pointer border-none
                  ${activeCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100'
                  }
                `}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-[10px] opacity-60">
                    ({posts.filter((p) => (p.category || 'General') === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog/$slug"
              params={{ slug: featuredPost._meta.path }}
              className="group block bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-500 overflow-hidden"
            >
              <div className="grid lg:grid-cols-2">
                <div className="bg-gradient-to-br from-gray-900 to-black p-10 lg:p-14 flex flex-col justify-center min-h-[280px] lg:min-h-[400px]">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-medium mb-4 block">
                    {featuredPost.category || 'General'}
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl lg:text-4xl text-white mb-4 leading-tight group-hover:text-white/90 transition-colors duration-300"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-md">
                    {featuredPost.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <User size={12} />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {estimateReadTime(featuredPost.content)} min read
                    </span>
                    <span>
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="p-10 lg:p-14 flex flex-col justify-center bg-white">
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] tracking-wider uppercase text-gray-400 border border-gray-200 px-3 py-1 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-black font-semibold group-hover:gap-3 transition-all duration-300">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Post Grid */}
      {remainingPosts.length > 0 && (
        <section className="pb-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <Link
                  key={post._meta.path}
                  to="/blog/$slug"
                  params={{ slug: post._meta.path }}
                  className="group flex flex-col bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-400 overflow-hidden"
                >
                  {/* Card Header Strip */}
                  <div className="h-1.5 bg-gradient-to-r from-gray-900 to-gray-700 group-hover:from-black group-hover:to-gray-800 transition-all duration-300" />

                  <div className="flex flex-col flex-1 p-7">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-semibold">
                        {post.category || 'General'}
                      </span>
                      <span className="text-[10px] text-gray-300">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-bold text-black mb-3 leading-snug group-hover:text-gray-700 transition-colors duration-200"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {post.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1 line-clamp-3">
                      {post.summary}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {estimateReadTime(post.content)} min
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-black font-semibold group-hover:gap-2.5 transition-all duration-300">
                        Read <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <section className="py-20 text-center">
          <div className="max-w-md mx-auto px-4">
            <h3
              className="text-xl text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              No articles yet
            </h3>
            <p className="text-sm text-gray-400">
              No articles in this category yet. Check back soon or explore another category.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
