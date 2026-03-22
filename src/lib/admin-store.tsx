import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
  productsApi, ordersApi, categoriesApi,
  heroBannersApi, bannersApi, carouselsApi, navbarOffersApi, popupOffersApi,
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

export interface AdminSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  currency: string
  deliveryFee: number
  freeDeliveryThreshold: number
  whatsappNumber: string
  address: string
  socialLinks: {
    instagram: string
    tiktok: string
    whatsapp: string
    twitter: string
    facebook: string
  }
  theme: {
    logoUrl: string
    faviconUrl: string
    primaryColor: string
    secondaryColor: string
    headingFont: string
    bodyFont: string
  }
  footerText: string
  seoPages: AdminSeoPage[]
}

export interface AdminSeoPage {
  id: string
  name: string
  path: string
  title: string
  description: string
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
  socialLinks: { instagram: '', tiktok: '', whatsapp: '', twitter: '', facebook: '' },
  theme: {
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
  },
  footerText: '',
  seoPages: [],
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/* ── Context ── */
interface AdminContextType {
  loading: boolean
  // Products
  products: AdminProduct[]
  addProduct: (p: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProduct: (id: string, p: Partial<AdminProduct>) => void
  deleteProduct: (id: string) => void
  // Orders
  orders: AdminOrder[]
  addOrder: (o: Omit<AdminOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void
  updateOrder: (id: string, o: Partial<AdminOrder>) => void
  deleteOrder: (id: string) => void
  // Categories
  categories: AdminCategory[]
  addCategory: (c: Omit<AdminCategory, 'id'>) => void
  updateCategory: (id: string, c: Partial<AdminCategory>) => void
  deleteCategory: (id: string) => void
  // Offers (client-only, no DB table)
  offers: AdminOffer[]
  addOffer: (o: Omit<AdminOffer, 'id'>) => void
  updateOffer: (id: string, o: Partial<AdminOffer>) => void
  deleteOffer: (id: string) => void
  // Hero Banners
  heroBanners: AdminHeroBanner[]
  addHeroBanner: (b: Omit<AdminHeroBanner, 'id'>) => void
  updateHeroBanner: (id: string, b: Partial<AdminHeroBanner>) => void
  deleteHeroBanner: (id: string) => void
  // Banners
  banners: AdminBanner[]
  addBanner: (b: Omit<AdminBanner, 'id'>) => void
  updateBanner: (id: string, b: Partial<AdminBanner>) => void
  deleteBanner: (id: string) => void
  // Carousels
  carousels: AdminCarousel[]
  addCarousel: (c: Omit<AdminCarousel, 'id'>) => void
  updateCarousel: (id: string, c: Partial<AdminCarousel>) => void
  deleteCarousel: (id: string) => void
  // Navbar Offers
  navbarOffers: AdminNavbarOffer[]
  addNavbarOffer: (o: Omit<AdminNavbarOffer, 'id'>) => void
  updateNavbarOffer: (id: string, o: Partial<AdminNavbarOffer>) => void
  deleteNavbarOffer: (id: string) => void
  // Popup Offers
  popupOffers: AdminPopupOffer[]
  addPopupOffer: (o: Omit<AdminPopupOffer, 'id'>) => void
  updatePopupOffer: (id: string, o: Partial<AdminPopupOffer>) => void
  deletePopupOffer: (id: string) => void
  // Newsletter
  subscribers: AdminNewsletterSub[]
  addSubscriber: (email: string) => void
  updateSubscriber: (id: string, s: Partial<AdminNewsletterSub>) => void
  removeSubscriber: (id: string) => void
  emailCampaigns: AdminEmailCampaign[]
  addEmailCampaign: (c: Omit<AdminEmailCampaign, 'id'>) => void
  deleteEmailCampaign: (id: string) => void
  // Delivery
  deliveryZones: AdminDeliveryZone[]
  addDeliveryZone: (z: Omit<AdminDeliveryZone, 'id'>) => void
  updateDeliveryZone: (id: string, z: Partial<AdminDeliveryZone>) => void
  deleteDeliveryZone: (id: string) => void
  // Policies
  policies: AdminPolicy[]
  addPolicy: (p: Omit<AdminPolicy, 'id' | 'updatedAt'>) => void
  updatePolicy: (id: string, p: Partial<AdminPolicy>) => void
  deletePolicy: (id: string) => void
  // Users
  users: AdminUser[]
  addUser: (u: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void
  updateUser: (id: string, u: Partial<AdminUser>) => void
  deleteUser: (id: string) => void
  // Card Details
  cardDetails: AdminCardDetail[]
  addCardDetail: (c: Omit<AdminCardDetail, 'id'>) => void
  updateCardDetail: (id: string, c: Partial<AdminCardDetail>) => void
  deleteCardDetail: (id: string) => void
  // Settings
  settings: AdminSettings
  updateSettings: (s: Partial<AdminSettings>) => void
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

      if (p) setProducts(p)
      if (o) setOrders(o)
      if (c) setCategories(c)
      if (hb) setHeroBanners(hb)
      if (b) setBanners(b)
      if (car) setCarousels(car)
      if (no) setNavbarOffers(no)
      if (po) setPopupOffers(po)
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
          socialLinks: { ...prev.socialLinks, ...(s.socialLinks as Record<string, string> || {}) },
          theme: { ...prev.theme, ...(s.theme as Record<string, string> || {}) },
        }))
      }
      setLoading(false)
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  /* ── Products ── */
  const addProduct = useCallback(async (p: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await productsApi.create(p as unknown as Record<string, unknown>)
      setProducts((prev) => [...prev, created as AdminProduct])
    } catch (err) { console.error('Failed to add product:', err) }
  }, [])
  const updateProduct = useCallback(async (id: string, p: Partial<AdminProduct>) => {
    try {
      const updated = await productsApi.update(id, p as unknown as Record<string, unknown>)
      setProducts((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminProduct>) } : x))
    } catch (err) { console.error('Failed to update product:', err) }
  }, [])
  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productsApi.remove(id)
      setProducts((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete product:', err) }
  }, [])

  /* ── Orders ── */
  const addOrder = useCallback(async (o: Omit<AdminOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await ordersApi.create(o as unknown as Record<string, unknown>)
      setOrders((prev) => [...prev, created as AdminOrder])
    } catch (err) { console.error('Failed to add order:', err) }
  }, [])
  const updateOrder = useCallback(async (id: string, o: Partial<AdminOrder>) => {
    try {
      const updated = await ordersApi.update(id, o as unknown as Record<string, unknown>)
      setOrders((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminOrder>) } : x))
    } catch (err) { console.error('Failed to update order:', err) }
  }, [])
  const deleteOrder = useCallback(async (id: string) => {
    try {
      await ordersApi.remove(id)
      setOrders((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete order:', err) }
  }, [])

  /* ── Categories ── */
  const addCategory = useCallback(async (c: Omit<AdminCategory, 'id'>) => {
    try {
      const created = await categoriesApi.create(c as unknown as Record<string, unknown>)
      setCategories((prev) => [...prev, created as AdminCategory])
    } catch (err) { console.error('Failed to add category:', err) }
  }, [])
  const updateCategory = useCallback(async (id: string, c: Partial<AdminCategory>) => {
    try {
      const updated = await categoriesApi.update(id, c as unknown as Record<string, unknown>)
      setCategories((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminCategory>) } : x))
    } catch (err) { console.error('Failed to update category:', err) }
  }, [])
  const deleteCategory = useCallback(async (id: string) => {
    try {
      await categoriesApi.remove(id)
      setCategories((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete category:', err) }
  }, [])

  /* ── Offers (client-only, no DB table) ── */
  const addOffer = useCallback((o: Omit<AdminOffer, 'id'>) => {
    setOffers((prev) => [...prev, { ...o, id: genId() }])
  }, [])
  const updateOffer = useCallback((id: string, o: Partial<AdminOffer>) => {
    setOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...o } : x))
  }, [])
  const deleteOffer = useCallback((id: string) => {
    setOffers((prev) => prev.filter((x) => x.id !== id))
  }, [])

  /* ── Hero Banners ── */
  const addHeroBanner = useCallback(async (b: Omit<AdminHeroBanner, 'id'>) => {
    try {
      const created = await heroBannersApi.create(b as unknown as Record<string, unknown>)
      setHeroBanners((prev) => [...prev, created as AdminHeroBanner])
    } catch (err) { console.error('Failed to add hero banner:', err) }
  }, [])
  const updateHeroBanner = useCallback(async (id: string, b: Partial<AdminHeroBanner>) => {
    try {
      const updated = await heroBannersApi.update(id, b as unknown as Record<string, unknown>)
      setHeroBanners((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminHeroBanner>) } : x))
    } catch (err) { console.error('Failed to update hero banner:', err) }
  }, [])
  const deleteHeroBanner = useCallback(async (id: string) => {
    try {
      await heroBannersApi.remove(id)
      setHeroBanners((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete hero banner:', err) }
  }, [])

  /* ── Banners ── */
  const addBanner = useCallback(async (b: Omit<AdminBanner, 'id'>) => {
    try {
      const created = await bannersApi.create(b as unknown as Record<string, unknown>)
      setBanners((prev) => [...prev, created as AdminBanner])
    } catch (err) { console.error('Failed to add banner:', err) }
  }, [])
  const updateBanner = useCallback(async (id: string, b: Partial<AdminBanner>) => {
    try {
      const updated = await bannersApi.update(id, b as unknown as Record<string, unknown>)
      setBanners((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminBanner>) } : x))
    } catch (err) { console.error('Failed to update banner:', err) }
  }, [])
  const deleteBanner = useCallback(async (id: string) => {
    try {
      await bannersApi.remove(id)
      setBanners((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete banner:', err) }
  }, [])

  /* ── Carousels ── */
  const addCarousel = useCallback(async (c: Omit<AdminCarousel, 'id'>) => {
    try {
      const created = await carouselsApi.create(c as unknown as Record<string, unknown>)
      setCarousels((prev) => [...prev, created as AdminCarousel])
    } catch (err) { console.error('Failed to add carousel:', err) }
  }, [])
  const updateCarousel = useCallback(async (id: string, c: Partial<AdminCarousel>) => {
    try {
      const updated = await carouselsApi.update(id, c as unknown as Record<string, unknown>)
      setCarousels((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminCarousel>) } : x))
    } catch (err) { console.error('Failed to update carousel:', err) }
  }, [])
  const deleteCarousel = useCallback(async (id: string) => {
    try {
      await carouselsApi.remove(id)
      setCarousels((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete carousel:', err) }
  }, [])

  /* ── Navbar Offers ── */
  const addNavbarOffer = useCallback(async (o: Omit<AdminNavbarOffer, 'id'>) => {
    try {
      const created = await navbarOffersApi.create(o as unknown as Record<string, unknown>)
      setNavbarOffers((prev) => [...prev, created as AdminNavbarOffer])
    } catch (err) { console.error('Failed to add navbar offer:', err) }
  }, [])
  const updateNavbarOffer = useCallback(async (id: string, o: Partial<AdminNavbarOffer>) => {
    try {
      const updated = await navbarOffersApi.update(id, o as unknown as Record<string, unknown>)
      setNavbarOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminNavbarOffer>) } : x))
    } catch (err) { console.error('Failed to update navbar offer:', err) }
  }, [])
  const deleteNavbarOffer = useCallback(async (id: string) => {
    try {
      await navbarOffersApi.remove(id)
      setNavbarOffers((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete navbar offer:', err) }
  }, [])

  /* ── Popup Offers ── */
  const addPopupOffer = useCallback(async (o: Omit<AdminPopupOffer, 'id'>) => {
    try {
      const created = await popupOffersApi.create(o as unknown as Record<string, unknown>)
      setPopupOffers((prev) => [...prev, created as AdminPopupOffer])
    } catch (err) { console.error('Failed to add popup offer:', err) }
  }, [])
  const updatePopupOffer = useCallback(async (id: string, o: Partial<AdminPopupOffer>) => {
    try {
      const updated = await popupOffersApi.update(id, o as unknown as Record<string, unknown>)
      setPopupOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminPopupOffer>) } : x))
    } catch (err) { console.error('Failed to update popup offer:', err) }
  }, [])
  const deletePopupOffer = useCallback(async (id: string) => {
    try {
      await popupOffersApi.remove(id)
      setPopupOffers((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete popup offer:', err) }
  }, [])

  /* ── Newsletter ── */
  const addSubscriber = useCallback(async (email: string) => {
    try {
      const created = await subscribersApi.create({ email, status: 'active', subscribedAt: new Date().toISOString() } as unknown as Record<string, unknown>)
      setSubscribers((prev) => [...prev, created as AdminNewsletterSub])
    } catch (err) { console.error('Failed to add subscriber:', err) }
  }, [])
  const updateSubscriber = useCallback(async (id: string, s: Partial<AdminNewsletterSub>) => {
    try {
      const updated = await subscribersApi.update(id, s as unknown as Record<string, unknown>)
      setSubscribers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminNewsletterSub>) } : x))
    } catch (err) { console.error('Failed to update subscriber:', err) }
  }, [])
  const removeSubscriber = useCallback(async (id: string) => {
    try {
      await subscribersApi.remove(id)
      setSubscribers((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to remove subscriber:', err) }
  }, [])
  const addEmailCampaign = useCallback(async (c: Omit<AdminEmailCampaign, 'id'>) => {
    try {
      const created = await campaignsApi.create(c as unknown as Record<string, unknown>)
      setEmailCampaigns((prev) => [...prev, created as AdminEmailCampaign])
    } catch (err) { console.error('Failed to add campaign:', err) }
  }, [])
  const deleteEmailCampaign = useCallback(async (id: string) => {
    try {
      await campaignsApi.remove(id)
      setEmailCampaigns((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete campaign:', err) }
  }, [])

  /* ── Delivery ── */
  const addDeliveryZone = useCallback(async (z: Omit<AdminDeliveryZone, 'id'>) => {
    try {
      const created = await deliveryApi.create(z as unknown as Record<string, unknown>)
      setDeliveryZones((prev) => [...prev, created as AdminDeliveryZone])
    } catch (err) { console.error('Failed to add delivery zone:', err) }
  }, [])
  const updateDeliveryZone = useCallback(async (id: string, z: Partial<AdminDeliveryZone>) => {
    try {
      const updated = await deliveryApi.update(id, z as unknown as Record<string, unknown>)
      setDeliveryZones((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminDeliveryZone>) } : x))
    } catch (err) { console.error('Failed to update delivery zone:', err) }
  }, [])
  const deleteDeliveryZone = useCallback(async (id: string) => {
    try {
      await deliveryApi.remove(id)
      setDeliveryZones((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete delivery zone:', err) }
  }, [])

  /* ── Policies ── */
  const addPolicy = useCallback(async (p: Omit<AdminPolicy, 'id' | 'updatedAt'>) => {
    try {
      const created = await policiesApi.create(p as unknown as Record<string, unknown>)
      setPolicies((prev) => [...prev, created as AdminPolicy])
    } catch (err) { console.error('Failed to add policy:', err) }
  }, [])
  const updatePolicy = useCallback(async (id: string, p: Partial<AdminPolicy>) => {
    try {
      const updated = await policiesApi.update(id, p as unknown as Record<string, unknown>)
      setPolicies((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminPolicy>) } : x))
    } catch (err) { console.error('Failed to update policy:', err) }
  }, [])
  const deletePolicy = useCallback(async (id: string) => {
    try {
      await policiesApi.remove(id)
      setPolicies((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete policy:', err) }
  }, [])

  /* ── Users ── */
  const addUser = useCallback(async (u: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      const created = await usersApi.create(u as unknown as Record<string, unknown>)
      setUsers((prev) => [...prev, created as AdminUser])
    } catch (err) { console.error('Failed to add user:', err) }
  }, [])
  const updateUser = useCallback(async (id: string, u: Partial<AdminUser>) => {
    try {
      const updated = await usersApi.update(id, u as unknown as Record<string, unknown>)
      setUsers((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminUser>) } : x))
    } catch (err) { console.error('Failed to update user:', err) }
  }, [])
  const deleteUser = useCallback(async (id: string) => {
    try {
      await usersApi.remove(id)
      setUsers((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete user:', err) }
  }, [])

  /* ── Card Details ── */
  const addCardDetail = useCallback(async (c: Omit<AdminCardDetail, 'id'>) => {
    try {
      const created = await cardDetailsApi.create(c as unknown as Record<string, unknown>)
      setCardDetails((prev) => [...prev, created as AdminCardDetail])
    } catch (err) { console.error('Failed to add card detail:', err) }
  }, [])
  const updateCardDetail = useCallback(async (id: string, c: Partial<AdminCardDetail>) => {
    try {
      const updated = await cardDetailsApi.update(id, c as unknown as Record<string, unknown>)
      setCardDetails((prev) => prev.map((x) => x.id === id ? { ...x, ...(updated as Partial<AdminCardDetail>) } : x))
    } catch (err) { console.error('Failed to update card detail:', err) }
  }, [])
  const deleteCardDetail = useCallback(async (id: string) => {
    try {
      await cardDetailsApi.remove(id)
      setCardDetails((prev) => prev.filter((x) => x.id !== id))
    } catch (err) { console.error('Failed to delete card detail:', err) }
  }, [])

  /* ── Settings ── */
  const updateSettings = useCallback(async (s: Partial<AdminSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...s }
      settingsApi.save(merged as unknown as Record<string, unknown>).catch((err) => console.error('Failed to save settings:', err))
      return merged
    })
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
