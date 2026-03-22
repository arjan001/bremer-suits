/* ── SEO Helper – Fetches per-page and global SEO settings from admin ── */

export interface SeoConfig {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterCard: 'summary' | 'summary_large_image'
  canonicalUrl: string
  noIndex: boolean
  noFollow: boolean
  structuredData: string
  siteTitle: string
  titleSeparator: string
  googleVerification: string
  bingVerification: string
}

type SeoSettingsCache = {
  seoPages: Array<{
    path: string; title: string; description: string; keywords: string;
    ogTitle: string; ogDescription: string; ogImage: string;
    twitterCard: 'summary' | 'summary_large_image'; canonicalUrl: string;
    noIndex: boolean; noFollow: boolean; structuredData: string;
  }>
  seoGlobal: {
    siteTitle: string; titleSeparator: string; defaultDescription: string;
    defaultKeywords: string; defaultOgImage: string;
    googleVerification: string; bingVerification: string;
  }
} | null

let cachedSettings: SeoSettingsCache = null

let fetchPromise: Promise<SeoSettingsCache> | null = null

async function loadSeoSettings(): Promise<SeoSettingsCache> {
  if (cachedSettings) return cachedSettings
  if (fetchPromise) return fetchPromise

  fetchPromise = fetch('/.netlify/functions/admin-settings')
    .then(async (res): Promise<SeoSettingsCache> => {
      if (!res.ok) return null
      const raw = await res.json()
      cachedSettings = {
        seoPages: raw.seo_pages || [],
        seoGlobal: raw.seo_global || {},
      }
      return cachedSettings
    })
    .catch((): null => null)

  return fetchPromise
}

export function getSeoForPath(pathname: string): SeoConfig | null {
  if (!cachedSettings) return null

  const global = cachedSettings.seoGlobal
  const page = cachedSettings.seoPages.find((p) => p.path === pathname)

  if (!page && !global.siteTitle) return null

  return {
    title: page?.title || '',
    description: page?.description || global.defaultDescription || '',
    keywords: page?.keywords || global.defaultKeywords || '',
    ogTitle: page?.ogTitle || page?.title || '',
    ogDescription: page?.ogDescription || page?.description || global.defaultDescription || '',
    ogImage: page?.ogImage || global.defaultOgImage || '',
    twitterCard: page?.twitterCard || 'summary_large_image',
    canonicalUrl: page?.canonicalUrl || '',
    noIndex: page?.noIndex || false,
    noFollow: page?.noFollow || false,
    structuredData: page?.structuredData || '',
    siteTitle: global.siteTitle || '',
    titleSeparator: global.titleSeparator || '—',
    googleVerification: global.googleVerification || '',
    bingVerification: global.bingVerification || '',
  }
}

export function buildSeoTitle(pageTitle: string, siteTitle: string, separator: string): string {
  if (!pageTitle && !siteTitle) return ''
  if (!pageTitle) return siteTitle
  if (!siteTitle) return pageTitle
  return `${pageTitle} ${separator} ${siteTitle}`
}

export { loadSeoSettings }
