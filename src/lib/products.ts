export interface ProductColor {
  name: string
  value: string
}

export interface Product {
  id: string
  title: string
  category: string
  fabric: string
  price: string
  numericPrice: number
  image: string
  tag?: string | null
  description?: string
  salePrice?: string
  originalPrice?: string
  colors: ProductColor[]
  sizes: string[]
  sku: string
}

const BASE = '/.netlify/functions'

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    title: (row.title as string) || '',
    category: (row.category as string) || '',
    fabric: (row.fabric as string) || '',
    price: (row.price as string) || '',
    numericPrice: (row.numeric_price as number) ?? (row.numericPrice as number) ?? 0,
    image: (row.image as string) || '',
    tag: (row.tag as string) || null,
    description: (row.description as string) || '',
    salePrice: (row.sale_price as string) ?? (row.salePrice as string),
    originalPrice: (row.original_price as string) ?? (row.originalPrice as string),
    colors: (row.colors as ProductColor[]) || [],
    sizes: (row.sizes as string[]) || [],
    sku: (row.sku as string) || '',
  }
}

/**
 * Load active products from the API (Supabase via Netlify Functions).
 * Returns empty array on the server or when no products exist.
 */
export async function getProducts(): Promise<Product[]> {
  if (typeof window === 'undefined') return []
  try {
    const res = await fetch(`${BASE}/admin-products`)
    if (!res.ok) return []
    const rows = (await res.json()) as Record<string, unknown>[]
    return rows
      .filter((p) => !p.status || p.status === 'active')
      .map(mapProduct)
  } catch {
    return []
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts()
  return products.find((p) => p.id === id)
}

export async function getRelatedProducts(currentId: string, limit = 4): Promise<Product[]> {
  const products = await getProducts()
  const current = products.find((p) => p.id === currentId)
  if (!current) return products.slice(0, limit)

  const sameCategory = products.filter(
    (p) => p.id !== currentId && p.category === current.category,
  )
  const others = products.filter(
    (p) => p.id !== currentId && p.category !== current.category,
  )
  return [...sameCategory, ...others].slice(0, limit)
}

export interface GalleryCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  status: 'active' | 'inactive'
  productCount?: number
}

/**
 * Load active gallery/storefront categories from the API (Supabase via
 * Netlify Functions). Falls back to an empty array on failure so the
 * caller can gracefully degrade to static content.
 */
export async function getCategories(): Promise<GalleryCategory[]> {
  if (typeof window === 'undefined') return []
  try {
    const res = await fetch(`${BASE}/admin-categories`)
    if (!res.ok) return []
    const rows = (await res.json()) as Record<string, unknown>[]
    return rows
      .filter((c) => !c.status || c.status === 'active')
      .map((c) => ({
        id: c.id as string,
        name: (c.name as string) || '',
        slug: (c.slug as string) || '',
        description: (c.description as string) || '',
        image: (c.image as string) || '',
        status: ((c.status as string) || 'active') as 'active' | 'inactive',
      }))
  } catch {
    return []
  }
}
