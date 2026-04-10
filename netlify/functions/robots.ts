import type { Context } from '@netlify/functions'
import { getSupabase, corsHeaders } from './utils/supabase.ts'

export default async function handler(req: Request, _context: Context) {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const supabase = getSupabase()
    const baseUrl = 'https://bremersuits.com'

    const { data: settings } = await supabase
      .from('settings')
      .select('seo_global')
      .single()

    const seoGlobal = settings?.seo_global || {}
    let robotsContent = seoGlobal.robotsTxt || ''

    if (!robotsContent.trim()) {
      robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /checkout
Disallow: /wishlist
Disallow: /.netlify/

User-agent: Googlebot
Allow: /`
    }

    if (seoGlobal.sitemapEnabled !== false) {
      if (!robotsContent.includes('Sitemap:')) {
        robotsContent += `\n\nSitemap: ${baseUrl}/sitemap.xml`
      }
    }

    return new Response(robotsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders(),
      },
    })
  } catch {
    return new Response(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\nDisallow: /checkout\nDisallow: /wishlist\nDisallow: /.netlify/\n\nUser-agent: Googlebot\nAllow: /\n\nSitemap: https://bremersuits.com/sitemap.xml`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/plain', ...corsHeaders() },
      }
    )
  }
}
