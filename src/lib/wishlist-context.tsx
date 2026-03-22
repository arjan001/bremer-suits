import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { getProducts } from '@/lib/products'

interface WishlistContextType {
  items: string[]
  addItem: (id: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  totalItems: number
}

const WISHLIST_STORAGE_KEY = 'bremer-wishlist'

function loadWishlistFromStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Ignore parse errors
  }
  return []
}

function saveWishlistToStorage(items: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage errors
  }
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => loadWishlistFromStorage())

  // Validate wishlist items against actual products and remove stale entries
  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return
    getProducts().then((products) => {
      const validIds = new Set(products.map((p) => p.id))
      setItems((prev) => {
        const filtered = prev.filter((id) => validIds.has(id))
        if (filtered.length !== prev.length) {
          saveWishlistToStorage(filtered)
        }
        return filtered
      })
    }).catch(() => {
      // If products can't be loaded, keep existing items
    })
  }, [])

  // Persist wishlist to localStorage whenever items change
  useEffect(() => {
    saveWishlistToStorage(items)
  }, [items])

  const addItem = useCallback((id: string) => {
    setItems((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item !== id))
  }, [])

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }, [])

  const isInWishlist = useCallback(
    (id: string) => items.includes(id),
    [items],
  )

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
