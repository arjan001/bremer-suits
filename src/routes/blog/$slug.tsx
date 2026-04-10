import { createFileRoute, Link } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { marked } from 'marked'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPost,
})

function BlogPost() {
  const { slug } = Route.useParams()
  const post = allBlogs.find((p) => p._meta.path === slug)

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
    if (post.summary) setMeta('description', post.summary)
    if (post.tags) setMeta('keywords', post.tags.join(', '))
    setProperty('og:title', `${post.title} | Bremer Suits Journal`)
    if (post.summary) setProperty('og:description', post.summary)
    setProperty('og:type', 'article')
    setProperty('og:image', 'https://bremersuits.com/images/og-logo-gold-black.jpg')
    setProperty('og:image:alt', `${post.title} - Bremer Suits Journal`)
    setProperty('og:url', `https://bremersuits.com/blog/${slug}`)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', `${post.title} | Bremer Suits Journal`)
    if (post.summary) setMeta('twitter:description', post.summary)
    setMeta('twitter:image', 'https://bremersuits.com/images/og-logo-gold-black.jpg')
  }, [post, slug])

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <section className="bg-black text-white py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8 transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Back to Journal
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-widest uppercase text-white/60 border border-white/20 px-2.5 py-0.5 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="text-3xl lg:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-white/50">
            <time>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="text-white/30">&middot;</span>
            <span>{post.author}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-black prose-p:text-gray-500 prose-p:leading-relaxed prose-a:text-black prose-a:underline hover:prose-a:no-underline prose-strong:text-black"
            style={{ fontFamily: "'Inter', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </div>
  )
}
