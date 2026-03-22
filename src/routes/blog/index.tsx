import { createFileRoute, Link } from '@tanstack/react-router'
import { allBlogs } from 'content-collections'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/blog/')({
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
