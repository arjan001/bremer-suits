import type { Context, Config } from '@netlify/edge-functions'

const SITE_URL = 'https://bremersuits.com'

function getFullImageUrl(imagePath: string): string {
  if (!imagePath) return `${SITE_URL}/images/og-logo-gold-black.jpg`
  if (imagePath.startsWith('http')) return imagePath
  return `${SITE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url)
  const title = url.searchParams.get('title') || ''
  const image = url.searchParams.get('image') || ''

  const imageUrl = getFullImageUrl(image)
  const displayTitle = title
    ? `${title} | Bremer Suits`
    : 'Bremer Suits | Premier Bespoke Tailoring in Nairobi'
  const description = title
    ? `View "${title}" from Bremer Suits — Nairobi's leading bespoke tailoring house. Custom-made suits for weddings, corporate, and special occasions.`
    : "Experience the art of perfection with Bremer Suits. Nairobi's leading specialists in high-end, custom-made suits."

  const safeTitle = escapeHtml(displayTitle)
  const safeDescription = escapeHtml(description)
  const safeImageUrl = escapeHtml(imageUrl)
  const safeAlt = escapeHtml(title || 'Bremer Suits Collection')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <meta name="robots" content="noindex, nofollow" />

  <!-- Open Graph -->
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Bremer Suits" />
  <meta property="og:url" content="${escapeHtml(url.toString())}" />
  <meta property="og:locale" content="en_KE" />
  <meta property="og:image" content="${safeImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${safeAlt}" />
  <meta property="og:image:type" content="image/jpeg" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${safeImageUrl}" />
  <meta name="twitter:image:alt" content="${safeAlt}" />

  <style>
    body { margin: 0; background: #0a0a0a; color: #fff; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .wrap { text-align: center; max-width: 480px; padding: 24px; }
    img { width: 100%; border-radius: 12px; box-shadow: 0 25px 50px rgba(0,0,0,.5); margin-bottom: 24px; }
    h1 { font-size: 1.5rem; margin: 0 0 8px; }
    p { color: #999; font-size: .875rem; margin: 0; }
  </style>
  <script>setTimeout(function(){ window.location.href = "${SITE_URL}"; }, 2000);</script>
</head>
<body>
  <div class="wrap">
    ${image ? `<img src="${safeImageUrl}" alt="${safeAlt}" />` : ''}
    <h1>${safeTitle}</h1>
    <p>Redirecting to Bremer Suits&hellip;</p>
  </div>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

export const config: Config = {
  path: '/share',
}
