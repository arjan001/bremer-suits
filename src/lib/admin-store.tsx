import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { allProducts, signatureProducts } from './products'

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

/* ── Storage keys ── */
const KEYS = {
  products: 'bremer-admin-products',
  orders: 'bremer-admin-orders',
  categories: 'bremer-admin-categories',
  offers: 'bremer-admin-offers',
  heroBanners: 'bremer-admin-hero-banners',
  banners: 'bremer-admin-banners',
  carousels: 'bremer-admin-carousels',
  navbarOffers: 'bremer-admin-navbar-offers',
  popupOffers: 'bremer-admin-popup-offers',
  newsletter: 'bremer-admin-newsletter',
  emailCampaigns: 'bremer-admin-email-campaigns',
  delivery: 'bremer-admin-delivery',
  policies: 'bremer-admin-policies',
  users: 'bremer-admin-users',
  settings: 'bremer-admin-settings',
  cardDetails: 'bremer-admin-card-details',
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return fallback
}

function save(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/* ── Seed data ── */
const now = new Date().toISOString()

function seedProducts(): AdminProduct[] {
  return [...allProducts, ...signatureProducts].map((p) => ({
    ...p,
    status: 'active' as const,
    stock: Math.floor(Math.random() * 50) + 10,
    createdAt: now,
    updatedAt: now,
  }))
}

const seedCategories: AdminCategory[] = [
  { id: 'cat-1', name: 'Business', slug: 'business', description: 'Professional business suits', image: '/images/suit-navy.webp', status: 'active' },
  { id: 'cat-2', name: 'Black Tie', slug: 'black-tie', description: 'Formal evening wear', image: '/images/suit-formal.webp', status: 'active' },
  { id: 'cat-3', name: 'Casual', slug: 'casual', description: 'Casual tailoring', image: '/images/suit-casual.webp', status: 'active' },
  { id: 'cat-4', name: 'Seasonal', slug: 'seasonal', description: 'Seasonal collections', image: '/images/suit-seasonal.webp', status: 'active' },
  { id: 'cat-5', name: 'Vests', slug: 'vests', description: 'Waistcoats and vest sets', image: '/images/vest-classic.webp', status: 'active' },
  { id: 'cat-6', name: 'Formal', slug: 'formal', description: 'Formal attire', image: '/images/suit-formal.webp', status: 'active' },
  { id: 'cat-7', name: 'Three-Piece', slug: 'three-piece', description: 'Three-piece suit sets', image: '/images/suit-navy.webp', status: 'active' },
]

const seedHeroBanners: AdminHeroBanner[] = [
  { id: 'hb-1', title: 'Business Collection', collection: 'Business', link: '/collections?category=Business', buttonText: 'Shop Business', image: '/images/suit-navy.webp', isActive: true },
  { id: 'hb-2', title: 'Formal Evening Wear', collection: 'Black Tie', link: '/collections?category=Black+Tie', buttonText: 'Shop Black Tie', image: '/images/suit-formal.webp', isActive: true },
]

const seedBanners: AdminBanner[] = [
  { id: 'bn-1', title: 'New Season Arrivals', description: 'Discover our latest collection of bespoke suits.', link: '/collections', image: '/images/suit-navy.webp', isActive: true },
]

const seedNavbarOffers: AdminNavbarOffer[] = [
  { id: 'no-1', text: 'Free delivery on orders above KSh 5,000 | Shop Now | Bremer Suits', isActive: true },
  { id: 'no-2', text: 'New Arrivals: Premium Suit Collection | Browse | Bremer Suits', isActive: true },
]

const seedPopupOffers: AdminPopupOffer[] = [
  { id: 'po-1', title: 'Welcome Offer', description: 'Sign up for our newsletter and get 10% off your first order!', discountPercent: 10, code: 'WELCOME10', image: '/images/suit-navy.webp', collectNewsletter: true, isActive: true },
]

const seedDelivery: AdminDeliveryZone[] = [
  { id: 'dz-1', name: 'Nairobi CBD', fee: 300, estimatedDays: '1-2', status: 'active' },
  { id: 'dz-2', name: 'Westlands', fee: 300, estimatedDays: '1-2', status: 'active' },
  { id: 'dz-3', name: 'Karen', fee: 400, estimatedDays: '1-2', status: 'active' },
  { id: 'dz-4', name: 'Kilimani', fee: 300, estimatedDays: '1-2', status: 'active' },
  { id: 'dz-5', name: 'Mombasa', fee: 800, estimatedDays: '3-5', status: 'active' },
  { id: 'dz-6', name: 'Kisumu', fee: 800, estimatedDays: '3-5', status: 'active' },
  { id: 'dz-7', name: 'Nakuru', fee: 600, estimatedDays: '2-3', status: 'active' },
  { id: 'dz-8', name: 'Eldoret', fee: 800, estimatedDays: '3-5', status: 'active' },
]

const seedCardDetails: AdminCardDetail[] = [
  { id: 'cd-1', type: 'mpesa', label: 'M-PESA Paybill', details: 'Paybill: 123456, Account: BREMER', isActive: true },
  { id: 'cd-2', type: 'mpesa', label: 'M-PESA Till Number', details: 'Till: 789012', isActive: true },
  { id: 'cd-3', type: 'bank', label: 'Bank Transfer', details: 'Equity Bank, Acc: 0123456789, Branch: Westlands', isActive: true },
]

const seedPolicies: AdminPolicy[] = [
  { id: 'pol-1', title: 'Privacy Policy', slug: 'privacy-policy', content: 'Our privacy policy details...', updatedAt: now },
  { id: 'pol-2', title: 'Terms of Service', slug: 'terms-of-service', content: 'Our terms of service...', updatedAt: now },
  { id: 'pol-3', title: 'Refund Policy', slug: 'refund-policy', content: 'Our refund policy details...', updatedAt: now },
  { id: 'pol-4', title: 'Shipping Policy', slug: 'shipping-policy', content: 'Our shipping policy details...', updatedAt: now },
]

const seedUsers: AdminUser[] = [
  { id: 'usr-1', name: 'Admin', email: 'admin@bremersuits.com', role: 'super_admin', status: 'active', lastLogin: now, createdAt: now },
]

const seedSettings: AdminSettings = {
  storeName: 'Bremer Suits',
  storeEmail: 'info@bremersuits.com',
  storePhone: '+254 712 345 678',
  currency: 'KSh',
  deliveryFee: 300,
  freeDeliveryThreshold: 5000,
  whatsappNumber: '+254712345678',
  address: 'Downtown District, Business CBD',
  socialLinks: { instagram: '@bremersuits', tiktok: '@bremersuits', whatsapp: '+254712345678', twitter: '', facebook: '' },
  theme: {
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
  },
  footerText: 'Premium custom suits, professional fashion styling, and image consulting — your one-stop destination for bespoke tailoring.',
  seoPages: [
    { id: 'seo-1', name: 'Home', path: '/', title: 'Bremer Suits | Custom Suits & Image Consulting', description: 'Premium custom suits, professional fashion styling, and image consulting. Elevate your personal brand with Bremer Suits.' },
    { id: 'seo-2', name: 'Collections', path: '/collections', title: 'Collections | Bremer Suits', description: 'Browse our curated collection of premium custom suits, business attire, and formal wear.' },
    { id: 'seo-3', name: 'Contact', path: '/contact', title: 'Contact Us | Bremer Suits', description: 'Get in touch with Bremer Suits for custom tailoring inquiries and appointments.' },
  ],
}

/* ── Context ── */
interface AdminContextType {
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
  // Offers (legacy)
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
  removeSubscriber: (id: string) => void
  emailCampaigns: AdminEmailCampaign[]
  addEmailCampaign: (c: Omit<AdminEmailCampaign, 'id'>) => void
  // Delivery
  deliveryZones: AdminDeliveryZone[]
  addDeliveryZone: (z: Omit<AdminDeliveryZone, 'id'>) => void
  updateDeliveryZone: (id: string, z: Partial<AdminDeliveryZone>) => void
  deleteDeliveryZone: (id: string) => void
  // Policies
  policies: AdminPolicy[]
  updatePolicy: (id: string, p: Partial<AdminPolicy>) => void
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
  const [products, setProducts] = useState<AdminProduct[]>(() => load(KEYS.products, seedProducts()))
  const [orders, setOrders] = useState<AdminOrder[]>(() => load(KEYS.orders, []))
  const [categories, setCategories] = useState<AdminCategory[]>(() => load(KEYS.categories, seedCategories))
  const [offers, setOffers] = useState<AdminOffer[]>(() => load(KEYS.offers, []))
  const [heroBanners, setHeroBanners] = useState<AdminHeroBanner[]>(() => load(KEYS.heroBanners, seedHeroBanners))
  const [banners, setBanners] = useState<AdminBanner[]>(() => load(KEYS.banners, seedBanners))
  const [carousels, setCarousels] = useState<AdminCarousel[]>(() => load(KEYS.carousels, []))
  const [navbarOffers, setNavbarOffers] = useState<AdminNavbarOffer[]>(() => load(KEYS.navbarOffers, seedNavbarOffers))
  const [popupOffers, setPopupOffers] = useState<AdminPopupOffer[]>(() => load(KEYS.popupOffers, seedPopupOffers))
  const [subscribers, setSubscribers] = useState<AdminNewsletterSub[]>(() => load(KEYS.newsletter, []))
  const [emailCampaigns, setEmailCampaigns] = useState<AdminEmailCampaign[]>(() => load(KEYS.emailCampaigns, []))
  const [deliveryZones, setDeliveryZones] = useState<AdminDeliveryZone[]>(() => load(KEYS.delivery, seedDelivery))
  const [policies, setPolicies] = useState<AdminPolicy[]>(() => load(KEYS.policies, seedPolicies))
  const [users, setUsers] = useState<AdminUser[]>(() => load(KEYS.users, seedUsers))
  const [cardDetails, setCardDetails] = useState<AdminCardDetail[]>(() => load(KEYS.cardDetails, seedCardDetails))
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const stored = load<Partial<AdminSettings>>(KEYS.settings, {})
    return {
      ...seedSettings,
      ...stored,
      socialLinks: { ...seedSettings.socialLinks, ...(stored.socialLinks || {}) },
      theme: { ...seedSettings.theme, ...(stored.theme || {}) },
      seoPages: stored.seoPages ?? seedSettings.seoPages,
    }
  })

  useEffect(() => { save(KEYS.products, products) }, [products])
  useEffect(() => { save(KEYS.orders, orders) }, [orders])
  useEffect(() => { save(KEYS.categories, categories) }, [categories])
  useEffect(() => { save(KEYS.offers, offers) }, [offers])
  useEffect(() => { save(KEYS.heroBanners, heroBanners) }, [heroBanners])
  useEffect(() => { save(KEYS.banners, banners) }, [banners])
  useEffect(() => { save(KEYS.carousels, carousels) }, [carousels])
  useEffect(() => { save(KEYS.navbarOffers, navbarOffers) }, [navbarOffers])
  useEffect(() => { save(KEYS.popupOffers, popupOffers) }, [popupOffers])
  useEffect(() => { save(KEYS.newsletter, subscribers) }, [subscribers])
  useEffect(() => { save(KEYS.emailCampaigns, emailCampaigns) }, [emailCampaigns])
  useEffect(() => { save(KEYS.delivery, deliveryZones) }, [deliveryZones])
  useEffect(() => { save(KEYS.policies, policies) }, [policies])
  useEffect(() => { save(KEYS.users, users) }, [users])
  useEffect(() => { save(KEYS.cardDetails, cardDetails) }, [cardDetails])
  useEffect(() => { save(KEYS.settings, settings) }, [settings])

  // Products
  const addProduct = useCallback((p: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    const ts = new Date().toISOString()
    setProducts((prev) => [...prev, { ...p, id: genId(), createdAt: ts, updatedAt: ts }])
  }, [])
  const updateProduct = useCallback((id: string, p: Partial<AdminProduct>) => {
    setProducts((prev) => prev.map((x) => x.id === id ? { ...x, ...p, updatedAt: new Date().toISOString() } : x))
  }, [])
  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Orders
  const addOrder = useCallback((o: Omit<AdminOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const ts = new Date().toISOString()
    const orderNum = 'BRM-' + Date.now().toString(36).toUpperCase().slice(-6)
    setOrders((prev) => [...prev, { ...o, id: genId(), orderNumber: orderNum, createdAt: ts, updatedAt: ts }])
  }, [])
  const updateOrder = useCallback((id: string, o: Partial<AdminOrder>) => {
    setOrders((prev) => prev.map((x) => x.id === id ? { ...x, ...o, updatedAt: new Date().toISOString() } : x))
  }, [])
  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Categories
  const addCategory = useCallback((c: Omit<AdminCategory, 'id'>) => {
    setCategories((prev) => [...prev, { ...c, id: genId() }])
  }, [])
  const updateCategory = useCallback((id: string, c: Partial<AdminCategory>) => {
    setCategories((prev) => prev.map((x) => x.id === id ? { ...x, ...c } : x))
  }, [])
  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Offers
  const addOffer = useCallback((o: Omit<AdminOffer, 'id'>) => {
    setOffers((prev) => [...prev, { ...o, id: genId() }])
  }, [])
  const updateOffer = useCallback((id: string, o: Partial<AdminOffer>) => {
    setOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...o } : x))
  }, [])
  const deleteOffer = useCallback((id: string) => {
    setOffers((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Newsletter
  const addSubscriber = useCallback((email: string) => {
    setSubscribers((prev) => [...prev, { id: genId(), email, subscribedAt: new Date().toISOString(), status: 'active' }])
  }, [])
  const removeSubscriber = useCallback((id: string) => {
    setSubscribers((prev) => prev.map((x) => x.id === id ? { ...x, status: 'unsubscribed' as const } : x))
  }, [])
  const addEmailCampaign = useCallback((c: Omit<AdminEmailCampaign, 'id'>) => {
    setEmailCampaigns((prev) => [...prev, { ...c, id: genId() }])
  }, [])

  // Hero Banners
  const addHeroBanner = useCallback((b: Omit<AdminHeroBanner, 'id'>) => {
    setHeroBanners((prev) => [...prev, { ...b, id: genId() }])
  }, [])
  const updateHeroBanner = useCallback((id: string, b: Partial<AdminHeroBanner>) => {
    setHeroBanners((prev) => prev.map((x) => x.id === id ? { ...x, ...b } : x))
  }, [])
  const deleteHeroBanner = useCallback((id: string) => {
    setHeroBanners((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Banners
  const addBanner = useCallback((b: Omit<AdminBanner, 'id'>) => {
    setBanners((prev) => [...prev, { ...b, id: genId() }])
  }, [])
  const updateBanner = useCallback((id: string, b: Partial<AdminBanner>) => {
    setBanners((prev) => prev.map((x) => x.id === id ? { ...x, ...b } : x))
  }, [])
  const deleteBanner = useCallback((id: string) => {
    setBanners((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Carousels
  const addCarousel = useCallback((c: Omit<AdminCarousel, 'id'>) => {
    setCarousels((prev) => [...prev, { ...c, id: genId() }])
  }, [])
  const updateCarousel = useCallback((id: string, c: Partial<AdminCarousel>) => {
    setCarousels((prev) => prev.map((x) => x.id === id ? { ...x, ...c } : x))
  }, [])
  const deleteCarousel = useCallback((id: string) => {
    setCarousels((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Navbar Offers
  const addNavbarOffer = useCallback((o: Omit<AdminNavbarOffer, 'id'>) => {
    setNavbarOffers((prev) => [...prev, { ...o, id: genId() }])
  }, [])
  const updateNavbarOffer = useCallback((id: string, o: Partial<AdminNavbarOffer>) => {
    setNavbarOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...o } : x))
  }, [])
  const deleteNavbarOffer = useCallback((id: string) => {
    setNavbarOffers((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Popup Offers
  const addPopupOffer = useCallback((o: Omit<AdminPopupOffer, 'id'>) => {
    setPopupOffers((prev) => [...prev, { ...o, id: genId() }])
  }, [])
  const updatePopupOffer = useCallback((id: string, o: Partial<AdminPopupOffer>) => {
    setPopupOffers((prev) => prev.map((x) => x.id === id ? { ...x, ...o } : x))
  }, [])
  const deletePopupOffer = useCallback((id: string) => {
    setPopupOffers((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Delivery
  const addDeliveryZone = useCallback((z: Omit<AdminDeliveryZone, 'id'>) => {
    setDeliveryZones((prev) => [...prev, { ...z, id: genId() }])
  }, [])
  const updateDeliveryZone = useCallback((id: string, z: Partial<AdminDeliveryZone>) => {
    setDeliveryZones((prev) => prev.map((x) => x.id === id ? { ...x, ...z } : x))
  }, [])
  const deleteDeliveryZone = useCallback((id: string) => {
    setDeliveryZones((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Policies
  const updatePolicy = useCallback((id: string, p: Partial<AdminPolicy>) => {
    setPolicies((prev) => prev.map((x) => x.id === id ? { ...x, ...p, updatedAt: new Date().toISOString() } : x))
  }, [])

  // Users
  const addUser = useCallback((u: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const ts = new Date().toISOString()
    setUsers((prev) => [...prev, { ...u, id: genId(), createdAt: ts, lastLogin: ts }])
  }, [])
  const updateUser = useCallback((id: string, u: Partial<AdminUser>) => {
    setUsers((prev) => prev.map((x) => x.id === id ? { ...x, ...u } : x))
  }, [])
  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Card Details
  const addCardDetail = useCallback((c: Omit<AdminCardDetail, 'id'>) => {
    setCardDetails((prev) => [...prev, { ...c, id: genId() }])
  }, [])
  const updateCardDetail = useCallback((id: string, c: Partial<AdminCardDetail>) => {
    setCardDetails((prev) => prev.map((x) => x.id === id ? { ...x, ...c } : x))
  }, [])
  const deleteCardDetail = useCallback((id: string) => {
    setCardDetails((prev) => prev.filter((x) => x.id !== id))
  }, [])

  // Settings
  const updateSettings = useCallback((s: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }))
  }, [])

  return (
    <AdminContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrder, deleteOrder,
      categories, addCategory, updateCategory, deleteCategory,
      offers, addOffer, updateOffer, deleteOffer,
      heroBanners, addHeroBanner, updateHeroBanner, deleteHeroBanner,
      banners, addBanner, updateBanner, deleteBanner,
      carousels, addCarousel, updateCarousel, deleteCarousel,
      navbarOffers, addNavbarOffer, updateNavbarOffer, deleteNavbarOffer,
      popupOffers, addPopupOffer, updatePopupOffer, deletePopupOffer,
      subscribers, addSubscriber, removeSubscriber,
      emailCampaigns, addEmailCampaign,
      deliveryZones, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone,
      policies, updatePolicy,
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
