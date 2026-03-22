import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { loadSeoSettings, getSeoForPath, buildSeoTitle, type SeoConfig } from '@/lib/seo-helper'

/**
 * SeoHead – Injects dynamic SEO meta tags into <head> based on admin settings.
 * Place this component in the root layout to apply SEO to all pages.
 */
export function SeoHead() {
  const router = useRouter()
  const pathname = router.state.location.pathname
  const [seo, setSeo] = useState<SeoConfig | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadSeoSettings().then(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (!loaded) return
    const config = getSeoForPath(pathname)
    setSeo(config)
  }, [pathname, loaded])

  useEffect(() => {
    if (!seo) return

    const fullTitle = buildSeoTitle(seo.title, seo.siteTitle, seo.titleSeparator)

    // Update document title
    if (fullTitle) {
      document.title = fullTitle
    }

    // Helper to set or remove a meta tag
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
      if (content) {
        if (!el) {
          el = document.createElement('meta')
          el.setAttribute(attr, key)
          document.head.appendChild(el)
        }
        el.content = content
      } else if (el) {
        el.remove()
      }
    }

    // Meta description
    setMeta('name', 'description', seo.description)

    // Keywords
    setMeta('name', 'keywords', seo.keywords)

    // Robots
    const robotsParts: string[] = []
    if (seo.noIndex) robotsParts.push('noindex')
    if (seo.noFollow) robotsParts.push('nofollow')
    setMeta('name', 'robots', robotsParts.length > 0 ? robotsParts.join(', ') : '')

    // Open Graph
    setMeta('property', 'og:title', seo.ogTitle || fullTitle)
    setMeta('property', 'og:description', seo.ogDescription)
    setMeta('property', 'og:image', seo.ogImage)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', seo.canonicalUrl || window.location.href)

    // Twitter Card
    setMeta('name', 'twitter:card', seo.twitterCard)
    setMeta('name', 'twitter:title', seo.ogTitle || fullTitle)
    setMeta('name', 'twitter:description', seo.ogDescription)
    setMeta('name', 'twitter:image', seo.ogImage)

    // Google & Bing verification
    setMeta('name', 'google-site-verification', seo.googleVerification)
    setMeta('name', 'msvalidate.01', seo.bingVerification)

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (seo.canonicalUrl) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.rel = 'canonical'
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.href = seo.canonicalUrl
    } else if (canonicalEl) {
      canonicalEl.remove()
    }

    // Structured Data (JSON-LD)
    const existingJsonLd = document.querySelector('script[data-seo-jsonld]')
    if (existingJsonLd) existingJsonLd.remove()
    if (seo.structuredData) {
      try {
        JSON.parse(seo.structuredData) // validate
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo-jsonld', 'true')
        script.textContent = seo.structuredData
        document.head.appendChild(script)
      } catch { /* invalid JSON, skip */ }
    }
  }, [seo])

  return null
}
