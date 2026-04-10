import type { Context } from '@netlify/functions'
import { getSupabase, corsHeaders } from './utils/supabase.ts'

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const supabase = getSupabase()
    const baseUrl = 'https://bremersuits.com'
    const today = new Date().toISOString().split('T')[0]

    // Fetch settings to check if sitemap is enabled and get SEO pages
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .single()

    const seoGlobal = settings?.seo_global || {}
    if (seoGlobal.sitemapEnabled === false) {
      return new Response('Sitemap is disabled', { status: 404 })
    }

    // Get noIndex pages from SEO config
    const seoPages: Array<{ path: string; noIndex?: boolean }> = settings?.seo_pages || []
    const noIndexPaths = new Set(
      seoPages.filter((p) => p.noIndex).map((p) => p.path)
    )

    // Static pages with priorities
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
      { path: '/collections', priority: '0.9', changefreq: 'daily' },
      { path: '/services', priority: '0.8', changefreq: 'weekly' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' },
      { path: '/blog', priority: '0.8', changefreq: 'daily' },
      { path: '/faq', priority: '0.6', changefreq: 'monthly' },
      { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
      { path: '/refund-policy', priority: '0.3', changefreq: 'yearly' },
      { path: '/shipping-policy', priority: '0.3', changefreq: 'yearly' },
      { path: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
    ].filter((p) => !noIndexPaths.has(p.path))

    // Fetch products for dynamic product pages
    let productUrls: Array<{ path: string; lastmod: string; priority: string; changefreq: string }> = []
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('status', 'active')
      if (products) {
        productUrls = products.map((p: { id: string; updated_at?: string }) => ({
          path: `/collections/${p.id}`,
          lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : today,
          priority: '0.7',
          changefreq: 'weekly',
        }))
      }
    } catch { /* products table might not exist */ }

    // Fetch categories for category pages
    let categoryUrls: Array<{ path: string; priority: string; changefreq: string }> = []
    try {
      const { data: categories } = await supabase
        .from('categories')
        .select('slug')
        .eq('status', 'active')
      if (categories) {
        categoryUrls = categories.map((c: { slug: string }) => ({
          path: `/collections?category=${c.slug}`,
          priority: '0.6',
          changefreq: 'weekly',
        }))
      }
    } catch { /* categories table might not exist */ }

    // Build XML
    const urls = [
      ...staticPages.map((p) => `
    <url>
      <loc>${baseUrl}${p.path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`),
      ...productUrls
        .filter((p) => !noIndexPaths.has(p.path))
        .map((p) => `
    <url>
      <loc>${baseUrl}${p.path}</loc>
      <lastmod>${p.lastmod}</lastmod>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`),
      ...categoryUrls
        .filter((p) => !noIndexPaths.has(p.path))
        .map((p) => `
    <url>
      <loc>${baseUrl}${p.path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`),
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        ...corsHeaders(),
      },
    })
  } catch (err) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      {
        status: 200,
        headers: { 'Content-Type': 'application/xml', ...corsHeaders() },
      }
    )
  }
}
