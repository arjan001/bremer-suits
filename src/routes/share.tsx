import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

const SITE_URL = 'https://bremersuits.com'

function getFullImageUrl(imagePath: string) {
  if (!imagePath) return `${SITE_URL}/images/og-logo-gold-black.jpg`
  if (imagePath.startsWith('http')) return imagePath
  return `${SITE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

export const Route = createFileRoute('/share')({
  validateSearch: (search: Record<string, unknown>) => ({
    title: (search.title as string) || '',
    image: (search.image as string) || '',
  }),
  head: ({ match }) => {
    const { title, image } = match.search
    const displayTitle = title
      ? `${title} | Bremer Suits`
      : 'Bremer Suits | Premier Bespoke Tailoring in Nairobi'
    const imageUrl = getFullImageUrl(image)
    const description = title
      ? `View "${title}" from Bremer Suits — Nairobi's leading bespoke tailoring house. Custom-made suits for weddings, corporate, and special occasions.`
      : 'Experience the art of perfection with Bremer Suits. Nairobi\'s leading specialists in high-end, custom-made suits.'

    return {
      meta: [
        { title: displayTitle },
        { name: 'description', content: description },
        { name: 'robots', content: 'noindex, nofollow' },
        { property: 'og:title', content: displayTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Bremer Suits' },
        { property: 'og:url', content: `${SITE_URL}/share?title=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}` },
        { property: 'og:locale', content: 'en_KE' },
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: title || 'Bremer Suits Collection' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: displayTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl },
        { name: 'twitter:image:alt', content: title || 'Bremer Suits Collection' },
      ],
    }
  },
  component: SharePage,
})

function SharePage() {
  const { title, image } = Route.useSearch()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect human visitors to the homepage after a short delay
    const timer = setTimeout(() => {
      navigate({ to: '/' })
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  const imageUrl = getFullImageUrl(image)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        {image && (
          <img
            src={imageUrl}
            alt={title || 'Bremer Suits'}
            className="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-6"
          />
        )}
        <h1 className="text-2xl font-bold text-white mb-2">
          {title || 'Bremer Suits'}
        </h1>
        <p className="text-neutral-400 text-sm">
          Redirecting to Bremer Suits...
        </p>
      </div>
    </div>
  )
}
