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

/**
 * Load active products from admin store in localStorage.
 * Returns empty array on the server or when no products are configured.
 */
export function getProducts(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('bremer-admin-products')
    if (stored) {
      const adminProducts = JSON.parse(stored) as Array<Product & { status?: string }>
      return adminProducts
        .filter((p) => !p.status || p.status === 'active')
        .map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          fabric: p.fabric,
          price: p.price,
          numericPrice: p.numericPrice,
          image: p.image,
          tag: p.tag,
          description: p.description,
          salePrice: p.salePrice,
          originalPrice: p.originalPrice,
          colors: p.colors || [],
          sizes: p.sizes || [],
          sku: p.sku,
        }))
    }
  } catch { /* ignore */ }
  return []
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id)
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  const products = getProducts()
  const current = getProductById(currentId)
  if (!current) return products.slice(0, limit)

  const sameCategory = products.filter(
    (p) => p.id !== currentId && p.category === current.category
  )
  const others = products.filter(
    (p) => p.id !== currentId && p.category !== current.category
  )
  return [...sameCategory, ...others].slice(0, limit)
}
