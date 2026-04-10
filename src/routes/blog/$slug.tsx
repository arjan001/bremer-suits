import { createFileRoute, Link } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { marked } from 'marked'
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPost,
})

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function BlogPost() {
  const { slug } = Route.useParams()
  const post = allBlogs.find((p) => p._meta.path === slug)

  const relatedPosts = post
    ? allBlogs
        .filter(
          (p) =>
            p._meta.path !== slug &&
            ((p.category && p.category === post.category) ||
              p.tags.some((t) => post.tags.includes(t))),
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
    : []

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1
            className="text-2xl font-bold text-black mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Article not found
          </h1>
          <Link to="/blog" className="text-black hover:text-gray-600 transition-colors text-sm underline">
            Back to Journal
          </Link>
        </div>
      </div>
    )
  }

  const html = marked(post.content)

  useEffect(() => {
    document.title = `${post.title} | Bremer Suits Journal`
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.content = content
    }
    const setProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
      el.content = content
    }
    const setCanonical = (href: string) => {
      let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
      el.href = href
    }
    if (post.summary) setMeta('description', post.summary)
    if (post.tags) setMeta('keywords', `Bremer Suits, ${post.tags.join(', ')}, men's fashion blog Nairobi, bespoke tailoring insights, suit styling Kenya`)
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('author', post.author || 'Bremer Suits')
    setMeta('publisher', 'Bremer Suits')
    setMeta('language', 'en')
    setMeta('revisit-after', '7 days')
    setMeta('rating', 'general')
    setMeta('distribution', 'global')
    setMeta('format-detection', 'telephone=no')
    setMeta('theme-color', '#1a1a1a')
    setMeta('apple-mobile-web-app-title', 'Bremer Suits')
    setMeta('application-name', 'Bremer Suits')
    setMeta('msapplication-TileColor', '#1a1a1a')
    setMeta('mobile-web-app-capable', 'yes')
    setMeta('apple-mobile-web-app-capable', 'yes')
    setProperty('og:title', `${post.title} | Bremer Suits Journal`)
    if (post.summary) setProperty('og:description', post.summary)
    setProperty('og:type', 'article')
    setProperty('og:url', `https://bremersuits.com/blog/${slug}`)
    setProperty('og:site_name', 'Bremer Suits')
    setProperty('og:locale', 'en_KE')
    setProperty('og:image', 'https://bremersuits.com/images/og-logo-gold-black.jpg')
    setProperty('og:image:width', '1200')
    setProperty('og:image:height', '630')
    setProperty('og:image:alt', `${post.title} - Bremer Suits Journal`)
    setProperty('og:image:type', 'image/jpeg')
    setProperty('article:published_time', post.date)
    setProperty('article:author', post.author || 'Bremer Suits')
    setProperty('article:section', post.category || 'Fashion & Tailoring')
    if (post.tags) post.tags.forEach(tag => setProperty('article:tag', tag))
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:site', '@bremersuits')
    setMeta('twitter:creator', '@bremersuits')
    setMeta('twitter:title', `${post.title} | Bremer Suits Journal`)
    if (post.summary) setMeta('twitter:description', post.summary)
    setMeta('twitter:image', 'https://bremersuits.com/images/og-logo-gold-black.jpg')
    setMeta('twitter:image:alt', `${post.title} - Bremer Suits Journal`)
    setMeta('geo.region', 'KE-110')
    setMeta('geo.placename', 'Nairobi')
    setMeta('geo.position', '-1.2864;36.8172')
    setMeta('ICBM', '-1.2864, 36.8172')
    setProperty('business:contact_data:street_address', 'Kimathi St')
    setProperty('business:contact_data:locality', 'Nairobi')
    setProperty('business:contact_data:country_name', 'Kenya')
    setProperty('business:contact_data:email', 'brendahwanja6722@gmail.com')
    setProperty('business:contact_data:phone_number', '+254 793 880642')
    setMeta('subject', post.title)
    setMeta('classification', 'Blog')
    setMeta('category', post.category || 'Fashion & Tailoring')
    setMeta('coverage', 'Kenya')
    setMeta('HandheldFriendly', 'True')
    setMeta('MobileOptimized', '320')
    setCanonical(`https://bremersuits.com/blog/${slug}`)
  }, [post, slug])

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Article Header */}
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white mb-10 transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={14} />
            Back to Journal
          </Link>

          {/* Category Badge */}
          <div className="mb-5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/60 border border-white/20 px-3 py-1.5 font-medium">
              {post.category || 'General'}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}
          >
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-5 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {estimateReadTime(post.content)} min read
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase text-white/40 font-medium"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-14 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary Callout */}
          <div className="border-l-2 border-gray-900 pl-6 mb-12">
            <p className="text-base text-gray-500 leading-relaxed italic">
              {post.summary}
            </p>
          </div>

          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-black prose-p:text-gray-500 prose-p:leading-relaxed prose-a:text-black prose-a:underline hover:prose-a:no-underline prose-strong:text-black prose-li:text-gray-500"
            style={{ fontFamily: "'Inter', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-14 lg:py-20 border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl lg:text-3xl text-black mb-10 text-center"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontStyle: 'italic' }}
            >
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related._meta.path}
                  to="/blog/$slug"
                  params={{ slug: related._meta.path }}
                  className="group block bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="h-1.5 bg-gradient-to-r from-gray-900 to-gray-700 group-hover:from-black group-hover:to-gray-800 transition-all duration-300" />
                  <div className="p-6">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-semibold mb-3 block">
                      {related.category || 'General'}
                    </span>
                    <h3
                      className="text-base font-bold text-black mb-2 leading-snug group-hover:text-gray-700 transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {related.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {related.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
