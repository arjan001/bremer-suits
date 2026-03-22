/* ── Admin API client – calls Netlify Functions backed by Supabase ── */

const BASE = '/.netlify/functions'

/* ── snake_case ↔ camelCase helpers ── */
function toSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase())
}
function toCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function keysToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    const sk = toSnake(k)
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[sk] = v // JSONB fields stay as-is
    } else {
      out[sk] = v
    }
  }
  return out
}

function keysToCamel(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    out[toCamel(k)] = v
  }
  return out
}

function mapFromApi<T>(row: Record<string, unknown>): T {
  return keysToCamel(row) as T
}

function mapToApi(data: Record<string, unknown>): Record<string, unknown> {
  return keysToSnake(data)
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`)
  return json as T
}

/* ── Products ── */
export const productsApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-products`)
    return rows.map((r) => mapFromApi(r))
  },
  async create(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-products`, {
      method: 'POST',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async update(id: string, data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-products?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-products?id=${id}`, { method: 'DELETE' })
  },
}

/* ── Orders ── */
export const ordersApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-orders`)
    return rows.map((r) => {
      const mapped = mapFromApi<Record<string, unknown>>(r)
      // Nest order_items
      const items = (r.order_items as Record<string, unknown>[] | undefined) || []
      mapped.items = items.map((i) => mapFromApi(i))
      // Nest customer / delivery from flat fields
      mapped.customer = {
        fullName: mapped.customerFullName,
        phone: mapped.customerPhone,
        email: mapped.customerEmail,
      }
      mapped.delivery = {
        location: mapped.deliveryLocation,
        address: mapped.deliveryAddress,
      }
      // Preserve payment_details (JSONB) and payment_status as-is
      if (r.payment_details) mapped.paymentDetails = r.payment_details
      if (r.payment_status) mapped.paymentStatus = r.payment_status
      return mapped
    })
  },
  async create(data: Record<string, unknown>) {
    // Flatten nested customer / delivery for DB
    const customer = data.customer as Record<string, string> | undefined
    const delivery = data.delivery as Record<string, string> | undefined
    const items = (data.items as Record<string, unknown>[]) || []
    const flat: Record<string, unknown> = {
      ...data,
      customer_full_name: customer?.fullName || '',
      customer_phone: customer?.phone || '',
      customer_email: customer?.email || '',
      delivery_location: delivery?.location || '',
      delivery_address: delivery?.address || '',
      payment_method: data.paymentMethod,
      payment_details: data.paymentDetails || null,
      payment_status: data.paymentStatus || 'pending_processing',
      order_notes: data.orderNotes,
      delivery_fee: data.deliveryFee,
    }
    delete flat.customer
    delete flat.delivery
    delete flat.items
    delete flat.paymentMethod
    delete flat.paymentDetails
    delete flat.paymentStatus
    delete flat.orderNotes
    delete flat.deliveryFee

    const body = {
      ...flat,
      items: items.map((i) => mapToApi(i)),
    }

    const row = await request<Record<string, unknown>>(`${BASE}/admin-orders`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return mapFromApi(row)
  },
  async update(id: string, data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-orders?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-orders?id=${id}`, { method: 'DELETE' })
  },
}

/* ── Categories ── */
export const categoriesApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-categories`)
    return rows.map((r) => mapFromApi(r))
  },
  async create(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-categories`, {
      method: 'POST',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async update(id: string, data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-categories?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-categories?id=${id}`, { method: 'DELETE' })
  },
}

/* ── Offers (multi-table) ── */
function offersEndpoint(type: string) {
  return `${BASE}/admin-offers?type=${type}`
}

function makeOffersCrud(type: string) {
  return {
    async list() {
      const rows = await request<Record<string, unknown>[]>(offersEndpoint(type))
      return rows.map((r) => mapFromApi(r))
    },
    async create(data: Record<string, unknown>) {
      const row = await request<Record<string, unknown>>(offersEndpoint(type), {
        method: 'POST',
        body: JSON.stringify(mapToApi(data)),
      })
      return mapFromApi(row)
    },
    async update(id: string, data: Record<string, unknown>) {
      const row = await request<Record<string, unknown>>(`${offersEndpoint(type)}&id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(mapToApi(data)),
      })
      return mapFromApi(row)
    },
    async remove(id: string) {
      await request(`${offersEndpoint(type)}&id=${id}`, { method: 'DELETE' })
    },
  }
}

export const heroBannersApi = makeOffersCrud('hero_banners')
export const bannersApi = makeOffersCrud('banners')
export const carouselsApi = makeOffersCrud('carousels')
export const navbarOffersApi = makeOffersCrud('navbar_offers')
export const popupOffersApi = makeOffersCrud('popup_offers')
export const menuItemsApi = makeOffersCrud('menu_items')
export const discountCodesApi = makeOffersCrud('discount_codes')

/* ── Newsletter ── */
export const subscribersApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-newsletter?resource=subscribers`)
    return rows.map((r) => mapFromApi(r))
  },
  async create(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-newsletter?resource=subscribers`, {
      method: 'POST',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async update(id: string, data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-newsletter?resource=subscribers&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-newsletter?resource=subscribers&id=${id}`, { method: 'DELETE' })
  },
}

export const campaignsApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-newsletter?resource=campaigns`)
    return rows.map((r) => mapFromApi(r))
  },
  async create(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-newsletter?resource=campaigns`, {
      method: 'POST',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-newsletter?resource=campaigns&id=${id}`, { method: 'DELETE' })
  },
}

/* ── Delivery Zones ── */
export const deliveryApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-delivery`)
    return rows.map((r) => mapFromApi(r))
  },
  async create(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-delivery`, {
      method: 'POST',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async update(id: string, data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-delivery?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-delivery?id=${id}`, { method: 'DELETE' })
  },
}

/* ── Users ── */
export const usersApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-users`)
    return rows.map((r) => mapFromApi(r))
  },
  async create(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-users`, {
      method: 'POST',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async update(id: string, data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-users?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-users?id=${id}`, { method: 'DELETE' })
  },
}

/* ── Card Details ── */
export const cardDetailsApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-card-details`)
    return rows.map((r) => mapFromApi(r))
  },
  async create(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-card-details`, {
      method: 'POST',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async update(id: string, data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-card-details?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-card-details?id=${id}`, { method: 'DELETE' })
  },
}

/* ── Policies ── */
export const policiesApi = {
  async list() {
    const rows = await request<Record<string, unknown>[]>(`${BASE}/admin-policies`)
    return rows.map((r) => mapFromApi(r))
  },
  async create(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-policies`, {
      method: 'POST',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async update(id: string, data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-policies?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
  async remove(id: string) {
    await request(`${BASE}/admin-policies?id=${id}`, { method: 'DELETE' })
  },
}

/* ── Settings (single-row) ── */
export const settingsApi = {
  async get() {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-settings`)
    return row ? mapFromApi(row) : null
  },
  async save(data: Record<string, unknown>) {
    const row = await request<Record<string, unknown>>(`${BASE}/admin-settings`, {
      method: 'PUT',
      body: JSON.stringify(mapToApi(data)),
    })
    return mapFromApi(row)
  },
}

/* ── Analytics (read-only) ── */
export const analyticsApi = {
  async get() {
    return request<Record<string, unknown>>(`${BASE}/admin-analytics`)
  },
}

/* ── Image Upload ── */
export const imagesApi = {
  async upload(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${BASE}/admin-images`, {
      method: 'POST',
      body: formData,
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Upload failed')
    return json.url as string
  },
}
