import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
  productsApi, ordersApi, categoriesApi,
  heroBannersApi, bannersApi, carouselsApi, navbarOffersApi, popupOffersApi,
  menuItemsApi, discountCodesApi,
  subscribersApi, campaignsApi, deliveryApi, usersApi,
  cardDetailsApi, policiesApi, settingsApi,
} from './admin-api'

/* ── Types ── */
export interface AdminProduct {
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
  colors: { name: string; value: string }[]
  sizes: string[]
  sku: string
  status: 'active' | 'draft' | 'archived'
  stock: number
  createdAt: string
  updatedAt: string
}

export interface AdminOrder {
  id: string
  orderNumber: string
  customer: {
    fullName: string
    phone: string
    email?: string
  }
  delivery: {
    location: string
    address: string
  }
  items: {
    productId: string
    title: string
    price: number
    quantity: number
    selectedColor?: string
    selectedSize?: string
    image: string
  }[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: 'card' | 'mpesa' | 'whatsapp'
  paymentDetails?: {
    cardholderName?: string
    lastFourDigits?: string
    cardBrand?: string
    expiryDate?: string
    phoneNumber?: string
    transactionId?: string
  }
  paymentStatus?: 'pending_collection' | 'pending_processing' | 'completed' | 'failed'
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderNotes?: string
  createdAt: string
  updatedAt: string
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  status: 'active' | 'inactive'
}

export interface AdminHeroBanner {
  id: string
  title: string
  collection: string
  link: string
  buttonText: string
  image: string
  isActive: boolean
}

export interface AdminBanner {
  id: string
  title: string
  description: string
  link: string
  image: string
  isActive: boolean
}

export interface AdminCarousel {
  id: string
  title: string
  image: string
  link: string
  isActive: boolean
}

export interface AdminNavbarOffer {
  id: string
  text: string
  isActive: boolean
}

export interface AdminPopupOffer {
  id: string
  title: string
  description: string
  discountPercent: number
  code: string
  image: string
  collectNewsletter: boolean
  isActive: boolean
}

export interface AdminMenuItem {
  id: string
  title: string
  description: string
  price: string
  image: string
  sortOrder: number
  isActive: boolean
}

export interface AdminOffer {
  id: string
  title: string
  description: string
  discountPercent: number
  code: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'scheduled'
}

export interface AdminNewsletterSub {
  id: string
  email: string
  subscribedAt: string
  status: 'active' | 'unsubscribed'
}

export interface AdminEmailCampaign {
  id: string
  subject: string
  body: string
  sentAt: string
  recipientCount: number
}

export interface AdminDeliveryZone {
  id: string
  name: string
  fee: number
  estimatedDays: string
  status: 'active' | 'inactive'
}

export interface AdminPolicy {
  id: string
  title: string
  slug: string
  content: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  lastLogin: string
  createdAt: string
}

export interface AdminSocialLink {
  id: string
  platform: string
  url: string
  label: string
  isActive: boolean
  sortOrder: number
}

export interface AdminFooterLink {
  id: string
  label: string
  url: string
  column: 'shop' | 'company' | 'support'
  sortOrder: number
}

export interface AdminPaymentMethod {
  id: string
  label: string
  isActive: boolean
  sortOrder: number
}

export interface AdminAuthorInfo {
  name: string
  url: string
  tagline: string
}

export interface AdminSeoPage {
  id: string
  name: string
  path: string
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
}

export interface AdminSeoGlobal {
  siteTitle: string
  titleSeparator: string
  defaultDescription: string
  defaultKeywords: string
  defaultOgImage: string
  googleVerification: string
  bingVerification: string
  robotsTxt: string
  sitemapEnabled: boolean
}

export interface AdminSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  currency: string
  deliveryFee: number
  freeDeliveryThreshold: number
  whatsappNumber: string
  address: string
  socialLinks: AdminSocialLink[]
  footerLinks: AdminFooterLink[]
  paymentMethods: AdminPaymentMethod[]
  authorInfo: AdminAuthorInfo
  theme: {
    logoUrl: string
    faviconUrl: string
    primaryColor: string
    secondaryColor: string
    headingFont: string
    bodyFont: string
  }
  footerText: string
  footerStoreHours: string
  footerLocationName: string
  footerLocationDetail: string
  seoPages: AdminSeoPage[]
  seoGlobal: AdminSeoGlobal
}

export interface AdminCardDetail {
  id: string
  type: 'mpesa' | 'bank' | 'card_gateway'
  label: string
  details: string
  isActive: boolean
}

/* ── Default settings ── */
const defaultSettings: AdminSettings = {
  storeName: '',
  storeEmail: '',
  storePhone: '',
  currency: '$',
  deliveryFee: 0,
  freeDeliveryThreshold: 0,
  whatsappNumber: '',
  address: '',
  socialLinks: [],
  footerLinks: [],
  paymentMethods: [],
  authorInfo: { name: '', url: '', tagline: '' },
  theme: {
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
  },
  footerText: '',
  footerStoreHours: '',
  footerLocationName: '',
  footerLocationDetail: '',
  seoPages: [],
  seoGlobal: {
    siteTitle: '',
    titleSeparator: '—',
    defaultDescription: '',
    defaultKeywords: '',
    defaultOgImage: '',
    googleVerification: '',
    bingVerification: '',
    robotsTxt: '',
    sitemapEnabled: true,
  },
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/* ── Context ── */
interface AdminContextType {
  loading: boolean
  // Products
  products: AdminProduct[]
  addProduct: (p: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateProduct: (id: string, p: Partial<AdminProduct>) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
  // Orders
  orders: AdminOrder[]
  addOrder: (o: Omit<AdminOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateOrder: (id: string, o: Partial<AdminOrder>) => Promise<boolean>
  deleteOrder: (id: string) => Promise<boolean>
  // Categories
  categories: AdminCategory[]
  addCategory: (c: Omit<AdminCategory, 'id'>) => Promise<boolean>
  updateCategory: (id: string, c: Partial<AdminCategory>) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
  // Offers (discount codes)
  offers: AdminOffer[]
  addOffer: (o: Omit<AdminOffer, 'id'>) => Promise<boolean>
  updateOffer: (id: string, o: Partial<AdminOffer>) => Promise<boolean>
  deleteOffer: (id: string) => Promise<boolean>
  // Hero Banners
  heroBanners: AdminHeroBanner[]
  addHeroBanner: (b: Omit<AdminHeroBanner, 'id'>) => Promise<boolean>
  updateHeroBanner: (id: string, b: Partial<AdminHeroBanner>) => Promise<boolean>
  deleteHeroBanner: (id: string) => Promise<boolean>
  // Banners
  banners: AdminBanner[]
  addBanner: (b: Omit<AdminBanner, 'id'>) => Promise<boolean>
  updateBanner: (id: string, b: Partial<AdminBanner>) => Promise<boolean>
  deleteBanner: (id: string) => Promise<boolean>
  // Carousels
  carousels: AdminCarousel[]
  addCarousel: (c: Omit<AdminCarousel, 'id'>) => Promise<boolean>
  updateCarousel: (id: string, c: Partial<AdminCarousel>) => Promise<boolean>
  deleteCarousel: (id: string) => Promise<boolean>
  // Navbar Offers
  navbarOffers: AdminNavbarOffer[]
  addNavbarOffer: (o: Omit<AdminNavbarOffer, 'id'>) => Promise<boolean>
  updateNavbarOffer: (id: string, o: Partial<AdminNavbarOffer>) => Promise<boolean>
  deleteNavbarOffer: (id: string) => Promise<boolean>
  // Popup Offers
  popupOffers: AdminPopupOffer[]
  addPopupOffer: (o: Omit<AdminPopupOffer, 'id'>) => void
  updatePopupOffer: (id: string, o: Partial<AdminPopupOffer>) => void
  deletePopupOffer: (id: string) => void
  // Menu Items
  menuItems: AdminMenuItem[]
  addMenuItem: (m: Omit<AdminMenuItem, 'id'>) => void
  updateMenuItem: (id: string, m: Partial<AdminMenuItem>) => void
  deleteMenuItem: (id: string) => void
  // Newsletter
  subscribers: AdminNewsletterSub[]
  addSubscriber: (email: string) => Promise<boolean>
  updateSubscriber: (id: string, s: Partial<AdminNewsletterSub>) => Promise<boolean>
  removeSubscriber: (id: string) => Promise<boolean>
  emailCampaigns: AdminEmailCampaign[]
  addEmailCampaign: (c: Omit<AdminEmailCampaign, 'id'>) => Promise<boolean>
  deleteEmailCampaign: (id: string) => Promise<boolean>
  // Delivery
  deliveryZones: AdminDeliveryZone[]
  addDeliveryZone: (z: Omit<AdminDeliveryZone, 'id'>) => Promise<boolean>
  updateDeliveryZone: (id: string, z: Partial<AdminDeliveryZone>) => Promise<boolean>
  deleteDeliveryZone: (id: string) => Promise<boolean>
  // Policies
  policies: AdminPolicy[]
  addPolicy: (p: Omit<AdminPolicy, 'id' | 'updatedAt'>) => Promise<boolean>
  updatePolicy: (id: string, p: Partial<AdminPolicy>) => Promise<boolean>
  deletePolicy: (id: string) => Promise<boolean>
  // Users
  users: AdminUser[]
  addUser: (u: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => Promise<boolean>
  updateUser: (id: string, u: Partial<AdminUser>) => Promise<boolean>
  deleteUser: (id: string) => Promise<boolean>
  // Card Details
  cardDetails: AdminCardDetail[]
  addCardDetail: (c: Omit<AdminCardDetail, 'id'>) => Promise<boolean>
  updateCardDetail: (id: string, c: Partial<AdminCardDetail>) => Promise<boolean>
  deleteCardDetail: (id: string) => Promise<boolean>
  // Settings
  settings: AdminSettings
  updateSettings: (s: Partial<AdminSettings>) => Promise<boolean>
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [offers, setOffers] = useState<AdminOffer[]>([])
  const [heroBanners, setHeroBanners] = useState<AdminHeroBanner[]>([])
  const [banners, setBanners] = useState<AdminBanner[]>([])
  const [carousels, setCarousels] = useState<AdminCarousel[]>([])
  const [navbarOffers, setNavbarOffers] = useState<AdminNavbarOffer[]>([])
  const [popupOffers, setPopupOffers] = useState<AdminPopupOffer[]>([])
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([])
  const [subscribers, setSubscribers] = useState<AdminNewsletterSub[]>([])
  const [emailCampaigns, setEmailCampaigns] = useState<AdminEmailCampaign[]>([])
  const [deliveryZones, setDeliveryZones] = useState<AdminDeliveryZone[]>([])
  const [policies, setPolicies] = useState<AdminPolicy[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [cardDetails, setCardDetails] = useState<AdminCardDetail[]>([])
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)

  /* ── Fetch all data from Supabase via Netlify Functions on mount ── */
  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      const results = await Promise.allSettled([
        productsApi.list(),      // 0
        ordersApi.list(),        // 1
        categoriesApi.list(),    // 2
        heroBannersApi.list(),   // 3
        bannersApi.list(),       // 4
        carouselsApi.list(),     // 5
        navbarOffersApi.list(),  // 6
        popupOffersApi.list(),   // 7
        subscribersApi.list(),   // 8
        campaignsApi.list(),     // 9
        deliveryApi.list(),      // 10
        policiesApi.list(),      // 11
        usersApi.list(),         // 12
        cardDetailsApi.list(),   // 13
        settingsApi.get(),       // 14
        menuItemsApi.list(),     // 15
        discountCodesApi.list(), // 16
      ])
      if (cancelled) return

      const val = <T,>(i: number): T | null =>
        results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<T>).value : null

      const p = val<AdminProduct[]>(0)
      const o = val<AdminOrder[]>(1)
      const c = val<AdminCategory[]>(2)
      const hb = val<AdminHeroBanner[]>(3)
      const b = val<AdminBanner[]>(4)
      const car = val<AdminCarousel[]>(5)
      const no = val<AdminNavbarOffer[]>(6)
      const po = val<AdminPopupOffer[]>(7)
      const sub = val<AdminNewsletterSub[]>(8)
      const ec = val<AdminEmailCampaign[]>(9)
      const dz = val<AdminDeliveryZone[]>(10)
      const pol = val<AdminPolicy[]>(11)
      const u = val<AdminUser[]>(12)
      const cd = val<AdminCardDetail[]>(13)
      const s = val<Partial<AdminSettings>>(14)
      const mi = val<AdminMenuItem[]>(15)
      const dc = val<AdminOffer[]>(16)

      if (p) setProducts(p)
      if (o) setOrders(o)
      if (c) setCategories(c)
      if (hb) setHeroBanners(hb)
      if (b) setBanners(b)
      if (car) setCarousels(car)
      if (no) setNavbarOffers(no)
      if (po) setPopupOffers(po)
      if (mi) setMenuItems(mi)
      if (dc) setOffers(dc)
      if (sub) setSubscribers(sub)
      if (ec) setEmailCampaigns(ec)
      if (dz) setDeliveryZones(dz)
      if (pol) setPolicies(pol)
      if (u) setUsers(u)
      if (cd) setCardDetails(cd)
      if (s) {
        setSettings((prev) => ({
          ...prev,
          ...s,
          socialLinks: Array.isArray(s.socialLinks) ? s.socialLinks as AdminSocialLink[] : prev.socialLinks,
          footerLinks: Array.isArray(s.footerLinks) ? s.footerLinks as AdminFooterLink[] : prev.footerLinks,
          paymentMethods: Array.isArray(s.paymentMethods) ? s.paymentMethods as AdminPaymentMethod[] : prev.paymentMethods,
          authorInfo: { ...prev.authorInfo, ...(s.authorInfo as unknown as Record<string, string> || {}) },
          theme: { ...prev.theme, ...(s.theme as Record<string, string> || {}) },
          seoGlobal: { ...prev.seoGlobal, ...(s.seoGlobal as unknown as Record<string, unknown> || {}) },
          seoPages: Array.isArray(s.seoPages) ? s.seoPages as AdminSeoPage[] : prev.seoPages,
        }))
      }
      setLoading(false)
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  /* ── Products ── */
  const addProduct = useCallback(async (p: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const created = await productsApi.create(p as unknown as Record<string, unknown>)
      setProducts((prev) => [...prev, created as AdminProduct])
      return true
    } catch (err) { console.error('Failed to add product:', err); return false }
  }, [])
  const updateProduct = useCallback(async (id: string, p: Partial<AdminProduct>): Promise<boolean> => {
    try {
      const updated = await productsApi.update(id, p as unknown as Record<string, unknown>)
      setProducts((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminProduct>) } : x))
      return true
    } catch (err) { console.error('Failed to update product:', err); return false }
  }, [])
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      await productsApi.remove(id)
      setProducts((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete product:', err); return false }
  }, [])

  /* ── Orders ── */
  const addOrder = useCallback(async (o: Omit<AdminOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const created = await ordersApi.create(o as unknown as Record<string, unknown>)
      setOrders((prev) => [...prev, created as AdminOrder])
      return true
    } catch (err) { console.error('Failed to add order:', err); return false }
  }, [])
  const updateOrder = useCallback(async (id: string, o: Partial<AdminOrder>): Promise<boolean> => {
    try {
      const updated = await ordersApi.update(id, o as unknown as Record<string, unknown>)
      setOrders((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminOrder>) } : x))
      return true
    } catch (err) { console.error('Failed to update order:', err); return false }
  }, [])
  const deleteOrder = useCallback(async (id: string): Promise<boolean> => {
    try {
      await ordersApi.remove(id)
      setOrders((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete order:', err); return false }
  }, [])

  /* ── Categories ── */
  const addCategory = useCallback(async (c: Omit<AdminCategory, 'id'>): Promise<boolean> => {
    try {
      const created = await categoriesApi.create(c as unknown as Record<string, unknown>)
      setCategories((prev) => [...prev, created as AdminCategory])
      return true
    } catch (err) { console.error('Failed to add category:', err); return false }
  }, [])
  const updateCategory = useCallback(async (id: string, c: Partial<AdminCategory>): Promise<boolean> => {
    try {
      const updated = await categoriesApi.update(id, c as unknown as Record<string, unknown>)
      setCategories((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminCategory>) } : x))
      return true
    } catch (err) { console.error('Failed to update category:', err); return false }
  }, [])
  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      await categoriesApi.remove(id)
      setCategories((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete category:', err); return false }
  }, [])

  /* ── Offers (discount codes - persisted via API) ── */
  const addOffer = useCallback(async (o: Omit<AdminOffer, 'id'>): Promise<boolean> => {
    try {
      const created = await discountCodesApi.create(o as unknown as Record<string, unknown>)
      setOffers((prev) => [...prev, created as AdminOffer])
      return true
    } catch (err) { console.error('Failed to add discount code:', err); return false }
  }, [])
  const updateOffer = useCallback(async (id: string, o: Partial<AdminOffer>): Promise<boolean> => {
    try {
      const updated = await discountCodesApi.update(id, o as unknown as Record<string, unknown>)
      setOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminOffer>) } : x))
      return true
    } catch (err) { console.error('Failed to update discount code:', err); return false }
  }, [])
  const deleteOffer = useCallback(async (id: string): Promise<boolean> => {
    try {
      await discountCodesApi.remove(id)
      setOffers((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete discount code:', err); return false }
  }, [])

  /* ── Hero Banners ── */
  const addHeroBanner = useCallback(async (b: Omit<AdminHeroBanner, 'id'>): Promise<boolean> => {
    try {
      const created = await heroBannersApi.create(b as unknown as Record<string, unknown>)
      setHeroBanners((prev) => [...prev, created as AdminHeroBanner])
      return true
    } catch (err) { console.error('Failed to add hero banner:', err); return false }
  }, [])
  const updateHeroBanner = useCallback(async (id: string, b: Partial<AdminHeroBanner>): Promise<boolean> => {
    try {
      const updated = await heroBannersApi.update(id, b as unknown as Record<string, unknown>)
      setHeroBanners((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminHeroBanner>) } : x))
      return true
    } catch (err) { console.error('Failed to update hero banner:', err); return false }
  }, [])
  const deleteHeroBanner = useCallback(async (id: string): Promise<boolean> => {
    try {
      await heroBannersApi.remove(id)
      setHeroBanners((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete hero banner:', err); return false }
  }, [])

  /* ── Banners ── */
  const addBanner = useCallback(async (b: Omit<AdminBanner, 'id'>): Promise<boolean> => {
    try {
      const created = await bannersApi.create(b as unknown as Record<string, unknown>)
      setBanners((prev) => [...prev, created as AdminBanner])
      return true
    } catch (err) { console.error('Failed to add banner:', err); return false }
  }, [])
  const updateBanner = useCallback(async (id: string, b: Partial<AdminBanner>): Promise<boolean> => {
    try {
      const updated = await bannersApi.update(id, b as unknown as Record<string, unknown>)
      setBanners((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminBanner>) } : x))
      return true
    } catch (err) { console.error('Failed to update banner:', err); return false }
  }, [])
  const deleteBanner = useCallback(async (id: string): Promise<boolean> => {
    try {
      await bannersApi.remove(id)
      setBanners((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete banner:', err); return false }
  }, [])

  /* ── Carousels ── */
  const addCarousel = useCallback(async (c: Omit<AdminCarousel, 'id'>): Promise<boolean> => {
    try {
      const created = await carouselsApi.create(c as unknown as Record<string, unknown>)
      setCarousels((prev) => [...prev, created as AdminCarousel])
      return true
    } catch (err) { console.error('Failed to add carousel:', err); return false }
  }, [])
  const updateCarousel = useCallback(async (id: string, c: Partial<AdminCarousel>): Promise<boolean> => {
    try {
      const updated = await carouselsApi.update(id, c as unknown as Record<string, unknown>)
      setCarousels((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminCarousel>) } : x))
      return true
    } catch (err) { console.error('Failed to update carousel:', err); return false }
  }, [])
  const deleteCarousel = useCallback(async (id: string): Promise<boolean> => {
    try {
      await carouselsApi.remove(id)
      setCarousels((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete carousel:', err); return false }
  }, [])

  /* ── Navbar Offers ── */
  const addNavbarOffer = useCallback(async (o: Omit<AdminNavbarOffer, 'id'>): Promise<boolean> => {
    try {
      const created = await navbarOffersApi.create(o as unknown as Record<string, unknown>)
      setNavbarOffers((prev) => [...prev, created as AdminNavbarOffer])
      return true
    } catch (err) { console.error('Failed to add navbar offer:', err); return false }
  }, [])
  const updateNavbarOffer = useCallback(async (id: string, o: Partial<AdminNavbarOffer>): Promise<boolean> => {
    try {
      const updated = await navbarOffersApi.update(id, o as unknown as Record<string, unknown>)
      setNavbarOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminNavbarOffer>) } : x))
      return true
    } catch (err) { console.error('Failed to update navbar offer:', err); return false }
  }, [])
  const deleteNavbarOffer = useCallback(async (id: string): Promise<boolean> => {
    try {
      await navbarOffersApi.remove(id)
      setNavbarOffers((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete navbar offer:', err); return false }
  }, [])

  /* ── Popup Offers ── */
  const addPopupOffer = useCallback(async (o: Omit<AdminPopupOffer, 'id'>): Promise<boolean> => {
    try {
      const created = await popupOffersApi.create(o as unknown as Record<string, unknown>)
      setPopupOffers((prev) => [...prev, created as AdminPopupOffer])
      return true
    } catch (err) { console.error('Failed to add popup offer:', err); return false }
  }, [])
  const updatePopupOffer = useCallback(async (id: string, o: Partial<AdminPopupOffer>): Promise<boolean> => {
    try {
      const updated = await popupOffersApi.update(id, o as unknown as Record<string, unknown>)
      setPopupOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminPopupOffer>) } : x))
      return true
    } catch (err) { console.error('Failed to update popup offer:', err); return false }
  }, [])
  const deletePopupOffer = useCallback(async (id: string): Promise<boolean> => {
    try {
      await popupOffersApi.remove(id)
      setPopupOffers((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete popup offer:', err); return false }
  }, [])

  /* ── Menu Items ── */
  const addMenuItem = useCallback(async (m: Omit<AdminMenuItem, 'id'>) => {
    try {
      const created = await menuItemsApi.create(m as unknown as Record<string, unknown>)
      setMenuItems((prev) => [...prev, created as AdminMenuItem])
    } catch (err) { console.error('Failed to add menu item:', err) }
  }, [])
  const updateMenuItem = useCallback(async (id: string, m: Partial<AdminMenuItem>) => {
    try {
      const updated = await menuItemsApi.update(id, m as unknown as Record<string, unknown>)
      setMenuItems((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminMenuItem>) } : x))
    } catch (err) { console.error('Failed to update menu item:', err) }
  }, [])
  const deleteMenuItem = useCallback(async (id: string) => {
    try {
      await menuItemsApi.remove(id)
      setMenuItems((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete menu item:', err) }
  }, [])

  /* ── Newsletter ── */
  const addSubscriber = useCallback(async (email: string): Promise<boolean> => {
    try {
      const created = await subscribersApi.create({ email, status: 'active', subscribedAt: new Date().toISOString() } as unknown as Record<string, unknown>)
      setSubscribers((prev) => [...prev, created as AdminNewsletterSub])
      return true
    } catch (err) { console.error('Failed to add subscriber:', err); return false }
  }, [])
  const updateSubscriber = useCallback(async (id: string, s: Partial<AdminNewsletterSub>): Promise<boolean> => {
    try {
      const updated = await subscribersApi.update(id, s as unknown as Record<string, unknown>)
      setSubscribers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminNewsletterSub>) } : x))
      return true
    } catch (err) { console.error('Failed to update subscriber:', err); return false }
  }, [])
  const removeSubscriber = useCallback(async (id: string): Promise<boolean> => {
    try {
      await subscribersApi.remove(id)
      setSubscribers((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to remove subscriber:', err); return false }
  }, [])
  const addEmailCampaign = useCallback(async (c: Omit<AdminEmailCampaign, 'id'>): Promise<boolean> => {
    try {
      const created = await campaignsApi.create(c as unknown as Record<string, unknown>)
      setEmailCampaigns((prev) => [...prev, created as AdminEmailCampaign])
      return true
    } catch (err) { console.error('Failed to add campaign:', err); return false }
  }, [])
  const deleteEmailCampaign = useCallback(async (id: string): Promise<boolean> => {
    try {
      await campaignsApi.remove(id)
      setEmailCampaigns((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete campaign:', err); return false }
  }, [])

  /* ── Delivery ── */
  const addDeliveryZone = useCallback(async (z: Omit<AdminDeliveryZone, 'id'>): Promise<boolean> => {
    try {
      const created = await deliveryApi.create(z as unknown as Record<string, unknown>)
      setDeliveryZones((prev) => [...prev, created as AdminDeliveryZone])
      return true
    } catch (err) { console.error('Failed to add delivery zone:', err); return false }
  }, [])
  const updateDeliveryZone = useCallback(async (id: string, z: Partial<AdminDeliveryZone>): Promise<boolean> => {
    try {
      const updated = await deliveryApi.update(id, z as unknown as Record<string, unknown>)
      setDeliveryZones((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminDeliveryZone>) } : x))
      return true
    } catch (err) { console.error('Failed to update delivery zone:', err); return false }
  }, [])
  const deleteDeliveryZone = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deliveryApi.remove(id)
      setDeliveryZones((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete delivery zone:', err); return false }
  }, [])

  /* ── Policies ── */
  const addPolicy = useCallback(async (p: Omit<AdminPolicy, 'id' | 'updatedAt'>): Promise<boolean> => {
    try {
      const created = await policiesApi.create(p as unknown as Record<string, unknown>)
      setPolicies((prev) => [...prev, created as AdminPolicy])
      return true
    } catch (err) { console.error('Failed to add policy:', err); return false }
  }, [])
  const updatePolicy = useCallback(async (id: string, p: Partial<AdminPolicy>): Promise<boolean> => {
    try {
      const updated = await policiesApi.update(id, p as unknown as Record<string, unknown>)
      setPolicies((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminPolicy>) } : x))
      return true
    } catch (err) { console.error('Failed to update policy:', err); return false }
  }, [])
  const deletePolicy = useCallback(async (id: string): Promise<boolean> => {
    try {
      await policiesApi.remove(id)
      setPolicies((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete policy:', err); return false }
  }, [])

  /* ── Users ── */
  const addUser = useCallback(async (u: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>): Promise<boolean> => {
    try {
      const created = await usersApi.create(u as unknown as Record<string, unknown>)
      setUsers((prev) => [...prev, created as AdminUser])
      return true
    } catch (err) { console.error('Failed to add user:', err); return false }
  }, [])
  const updateUser = useCallback(async (id: string, u: Partial<AdminUser>): Promise<boolean> => {
    try {
      const updated = await usersApi.update(id, u as unknown as Record<string, unknown>)
      setUsers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminUser>) } : x))
      return true
    } catch (err) { console.error('Failed to update user:', err); return false }
  }, [])
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      await usersApi.remove(id)
      setUsers((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete user:', err); return false }
  }, [])

  /* ── Card Details ── */
  const addCardDetail = useCallback(async (c: Omit<AdminCardDetail, 'id'>): Promise<boolean> => {
    try {
      const created = await cardDetailsApi.create(c as unknown as Record<string, unknown>)
      setCardDetails((prev) => [...prev, created as AdminCardDetail])
      return true
    } catch (err) { console.error('Failed to add card detail:', err); return false }
  }, [])
  const updateCardDetail = useCallback(async (id: string, c: Partial<AdminCardDetail>): Promise<boolean> => {
    try {
      const updated = await cardDetailsApi.update(id, c as unknown as Record<string, unknown>)
      setCardDetails((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminCardDetail>) } : x))
      return true
    } catch (err) { console.error('Failed to update card detail:', err); return false }
  }, [])
  const deleteCardDetail = useCallback(async (id: string): Promise<boolean> => {
    try {
      await cardDetailsApi.remove(id)
      setCardDetails((prev) => prev.filter((x) => x.id !== id))
      return true
    } catch (err) { console.error('Failed to delete card detail:', err); return false }
  }, [])

  /* ── Settings ── */
  const updateSettings = useCallback(async (s: Partial<AdminSettings>): Promise<boolean> => {
    try {
      setSettings((prev) => {
        const merged = { ...prev, ...s }
        settingsApi.save(merged as unknown as Record<string, unknown>).catch((err) => console.error('Failed to save settings:', err))
        return merged
      })
      return true
    } catch (err) { console.error('Failed to save settings:', err); return false }
  }, [])

  return (
    <AdminContext.Provider value={{
      loading,
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrder, deleteOrder,
      categories, addCategory, updateCategory, deleteCategory,
      offers, addOffer, updateOffer, deleteOffer,
      heroBanners, addHeroBanner, updateHeroBanner, deleteHeroBanner,
      banners, addBanner, updateBanner, deleteBanner,
      carousels, addCarousel, updateCarousel, deleteCarousel,
      navbarOffers, addNavbarOffer, updateNavbarOffer, deleteNavbarOffer,
      popupOffers, addPopupOffer, updatePopupOffer, deletePopupOffer,
      menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
      subscribers, addSubscriber, updateSubscriber, removeSubscriber,
      emailCampaigns, addEmailCampaign, deleteEmailCampaign,
      deliveryZones, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone,
      policies, addPolicy, updatePolicy, deletePolicy,
      users, addUser, updateUser, deleteUser,
      cardDetails, addCardDetail, updateCardDetail, deleteCardDetail,
      settings, updateSettings,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
