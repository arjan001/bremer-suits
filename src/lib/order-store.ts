const ORDERS_KEY = 'bremer-admin-orders'

export interface CardPaymentDetails {
  cardholderName: string
  lastFourDigits: string
  cardBrand: string
  expiryDate: string
}

export interface MpesaPaymentDetails {
  phoneNumber: string
  transactionId?: string
}

export interface StoredOrder {
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
  paymentDetails?: CardPaymentDetails | MpesaPaymentDetails
  paymentStatus: 'pending_collection' | 'pending_processing' | 'completed' | 'failed'
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderNotes?: string
  createdAt: string
  updatedAt: string
}

export function saveOrder(order: Omit<StoredOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
  if (typeof window === 'undefined') return
  try {
    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') as StoredOrder[]
    const ts = new Date().toISOString()
    const newOrder: StoredOrder = {
      ...order,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      orderNumber: 'BRM-' + Date.now().toString(36).toUpperCase().slice(-6),
      createdAt: ts,
      updatedAt: ts,
    }
    existing.push(newOrder)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(existing))
    return newOrder
  } catch { /* ignore */ }
}
