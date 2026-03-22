import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Save,
  Store,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  MessageCircle,
  Globe,
  Palette,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  Link as LinkIcon,
  Share2,
  CreditCard,
  User,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Code,
  Map,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import {
  useAdmin,
  type AdminSeoPage,
  type AdminSocialLink,
  type AdminFooterLink,
  type AdminPaymentMethod,
} from '@/lib/admin-store'
import { showSuccess, showError, showDeleteConfirm } from '@/lib/sweet-alert'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
})

type TabId = 'general' | 'seo-global' | 'seo-pages' | 'theme' | 'footer' | 'social' | 'author' | 'sitemap'

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'footer', label: 'Footer', icon: FileText },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'author', label: 'Author & Credits', icon: User },
  { id: 'seo-global', label: 'Global SEO', icon: Globe },
  { id: 'seo-pages', label: 'Page SEO', icon: Search },
  { id: 'sitemap', label: 'Sitemap', icon: Map },
  { id: 'theme', label: 'Theme', icon: Palette },
]

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function AdminSettings() {
  const { settings, updateSettings } = useAdmin()
  const [form, setForm] = useState({ ...settings })
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const [saving, setSaving] = useState(false)

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleThemeChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, theme: { ...prev.theme, [field]: value } }))
  }

  const handleSeoGlobalChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, seoGlobal: { ...prev.seoGlobal, [field]: value } }))
  }

  const handleAuthorChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, authorInfo: { ...prev.authorInfo, [field]: value } }))
  }

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setSaving(true)
    const ok = await updateSettings(form)
    setSaving(false)
    if (ok) showSuccess('Settings Saved!', 'Your settings have been saved successfully.')
    else showError('Save Failed')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-black"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your store configuration, footer, social media, SEO, and sitemap.
          </p>
        </div>
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-black border-black'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSave}>
        {activeTab === 'general' && (
          <GeneralTab form={form} handleChange={handleChange} />
        )}
        {activeTab === 'footer' && (
          <FooterTab form={form} setForm={setForm} handleChange={handleChange} />
        )}
        {activeTab === 'social' && (
          <SocialTab form={form} setForm={setForm} />
        )}
        {activeTab === 'author' && (
          <AuthorTab form={form} handleAuthorChange={handleAuthorChange} />
        )}
        {activeTab === 'seo-global' && (
          <SeoGlobalTab form={form} handleSeoGlobalChange={handleSeoGlobalChange} />
        )}
        {activeTab === 'seo-pages' && (
          <SeoTab form={form} setForm={setForm} />
        )}
        {activeTab === 'sitemap' && (
          <SitemapTab form={form} handleSeoGlobalChange={handleSeoGlobalChange} />
        )}
        {activeTab === 'theme' && (
          <ThemeTab form={form} handleThemeChange={handleThemeChange} />
        )}
      </form>
    </div>
  )
}

/* ── General Tab ── */
function GeneralTab({
  form,
  handleChange,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  handleChange: (field: string, value: string | number | boolean) => void
}) {
  return (
    <div className="max-w-3xl space-y-8">
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Store size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Store Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Store Name</label>
            <input
              value={form.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.storeEmail}
                  onChange={(e) => handleChange('storeEmail', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Phone</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={form.storePhone}
                  onChange={(e) => handleChange('storePhone', e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Address</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <DollarSign size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Commerce</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Currency</label>
              <input
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Delivery Fee</label>
              <input
                type="number"
                value={form.deliveryFee}
                onChange={(e) => handleChange('deliveryFee', Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Free Delivery Above</label>
              <input
                type="number"
                value={form.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">WhatsApp Number</label>
            <div className="relative">
              <MessageCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={form.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Footer Tab ── */
function FooterTab({
  form,
  setForm,
  handleChange,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  setForm: React.Dispatch<React.SetStateAction<ReturnType<typeof useAdmin>['settings']>>
  handleChange: (field: string, value: string | number | boolean) => void
}) {
  const [editingLink, setEditingLink] = useState<AdminFooterLink | null>(null)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [linkForm, setLinkForm] = useState<Omit<AdminFooterLink, 'id'>>({
    label: '', url: '/', column: 'shop', sortOrder: 0,
  })
  const [editingPayment, setEditingPayment] = useState<AdminPaymentMethod | null>(null)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [paymentForm, setPaymentForm] = useState<Omit<AdminPaymentMethod, 'id'>>({
    label: '', isActive: true, sortOrder: 0,
  })

  const handleAddLink = () => {
    setIsAddingLink(true)
    setEditingLink(null)
    setLinkForm({ label: '', url: '/', column: 'shop', sortOrder: form.footerLinks.length })
  }

  const handleEditLink = (link: AdminFooterLink) => {
    setEditingLink(link)
    setIsAddingLink(false)
    setLinkForm({ label: link.label, url: link.url, column: link.column, sortOrder: link.sortOrder })
  }

  const handleSaveLink = () => {
    if (!linkForm.label.trim()) return
    if (isAddingLink) {
      const newLink: AdminFooterLink = { id: genId(), ...linkForm }
      setForm((prev) => ({ ...prev, footerLinks: [...prev.footerLinks, newLink] }))
    } else if (editingLink) {
      setForm((prev) => ({
        ...prev,
        footerLinks: prev.footerLinks.map((l) =>
          l.id === editingLink.id ? { ...l, ...linkForm } : l,
        ),
      }))
    }
    setEditingLink(null)
    setIsAddingLink(false)
  }

  const handleDeleteLink = async (id: string) => {
    const confirmed = await showDeleteConfirm('Footer Link')
    if (!confirmed) return
    setForm((prev) => ({ ...prev, footerLinks: prev.footerLinks.filter((l) => l.id !== id) }))
  }

  const handleAddPayment = () => {
    setIsAddingPayment(true)
    setEditingPayment(null)
    setPaymentForm({ label: '', isActive: true, sortOrder: form.paymentMethods.length })
  }

  const handleEditPayment = (pm: AdminPaymentMethod) => {
    setEditingPayment(pm)
    setIsAddingPayment(false)
    setPaymentForm({ label: pm.label, isActive: pm.isActive, sortOrder: pm.sortOrder })
  }

  const handleSavePayment = () => {
    if (!paymentForm.label.trim()) return
    if (isAddingPayment) {
      const newPm: AdminPaymentMethod = { id: genId(), ...paymentForm }
      setForm((prev) => ({ ...prev, paymentMethods: [...prev.paymentMethods, newPm] }))
    } else if (editingPayment) {
      setForm((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map((pm) =>
          pm.id === editingPayment.id ? { ...pm, ...paymentForm } : pm,
        ),
      }))
    }
    setEditingPayment(null)
    setIsAddingPayment(false)
  }

  const handleDeletePayment = async (id: string) => {
    const confirmed = await showDeleteConfirm('Payment Method')
    if (!confirmed) return
    setForm((prev) => ({ ...prev, paymentMethods: prev.paymentMethods.filter((pm) => pm.id !== id) }))
  }

  const sortedLinks = [...form.footerLinks].sort((a, b) => a.sortOrder - b.sortOrder)
  const sortedPayments = [...form.paymentMethods].sort((a, b) => a.sortOrder - b.sortOrder)

  const columns: { key: AdminFooterLink['column']; label: string }[] = [
    { key: 'shop', label: 'Shop' },
    { key: 'company', label: 'Company' },
    { key: 'support', label: 'Support' },
  ]

  return (
    <div className="max-w-4xl space-y-8">
      {/* Footer Description */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileText size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Footer Content</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Footer Text / Brand Description</label>
            <textarea
              value={form.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              rows={3}
              placeholder="Enter your store description for the footer..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Location Name</label>
              <input
                value={form.footerLocationName}
                onChange={(e) => handleChange('footerLocationName', e.target.value)}
                placeholder="e.g. Bremer Studio"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Location Detail</label>
              <input
                value={form.footerLocationDetail}
                onChange={(e) => handleChange('footerLocationDetail', e.target.value)}
                placeholder="e.g. Downtown District, Business CBD"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Store Hours</label>
            <textarea
              value={form.footerStoreHours}
              onChange={(e) => handleChange('footerStoreHours', e.target.value)}
              rows={2}
              placeholder="Mon - Sat: 9AM - 6PM&#10;Dispatch: Tuesdays & Fridays"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
            />
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <LinkIcon size={18} className="text-gray-400" />
            <div>
              <h2 className="text-sm font-bold text-black uppercase tracking-wider">Footer Navigation Links</h2>
              <p className="text-xs text-gray-500 mt-0.5">Organize links into columns: Shop, Company, Support.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={14} /> Add Link
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAddingLink || editingLink) && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-black">
                {isAddingLink ? 'Add Footer Link' : 'Edit Footer Link'}
              </h3>
              <button type="button" onClick={() => { setEditingLink(null); setIsAddingLink(false) }} className="p-1 text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Label</label>
                <input
                  value={linkForm.label}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="Link text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">URL</label>
                <input
                  value={linkForm.url}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="/collections"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Column</label>
                <select
                  value={linkForm.column}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, column: e.target.value as AdminFooterLink['column'] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                >
                  {columns.map((col) => (
                    <option key={col.key} value={col.key}>{col.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleSaveLink} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                {isAddingLink ? 'Add' : 'Save'}
              </button>
              <button type="button" onClick={() => { setEditingLink(null); setIsAddingLink(false) }} className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Links by Column */}
        {columns.map((col) => {
          const colLinks = sortedLinks.filter((l) => l.column === col.key)
          return (
            <div key={col.key} className="mb-4 last:mb-0">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{col.label} Column ({colLinks.length})</h4>
              {colLinks.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No links in this column.</p>
              ) : (
                <div className="space-y-1">
                  {colLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-black">{link.label}</span>
                        <span className="text-xs text-gray-400 ml-2">{link.url}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button type="button" onClick={() => handleEditLink(link)} className="p-1.5 text-gray-400 hover:text-black transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => handleDeleteLink(link.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* Payment Methods */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-gray-400" />
            <div>
              <h2 className="text-sm font-bold text-black uppercase tracking-wider">Accepted Payment Methods</h2>
              <p className="text-xs text-gray-500 mt-0.5">Shown in the footer as payment badges.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPayment}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={14} /> Add Method
          </button>
        </div>

        {(isAddingPayment || editingPayment) && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-black">
                {isAddingPayment ? 'Add Payment Method' : 'Edit Payment Method'}
              </h3>
              <button type="button" onClick={() => { setEditingPayment(null); setIsAddingPayment(false) }} className="p-1 text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-3 items-end mb-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-black mb-1">Label</label>
                <input
                  value={paymentForm.label}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. VISA, M-PESA, PayPal"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <label className="flex items-center gap-2 pb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentForm.isActive}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-xs font-medium text-gray-600">Active</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleSavePayment} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                {isAddingPayment ? 'Add' : 'Save'}
              </button>
              <button type="button" onClick={() => { setEditingPayment(null); setIsAddingPayment(false) }} className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {sortedPayments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No payment methods configured.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sortedPayments.map((pm) => (
              <div key={pm.id} className={`group flex items-center gap-2 px-3 py-2 border rounded-lg ${pm.isActive ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50 opacity-60'}`}>
                <span className="text-sm font-medium text-black">{pm.label}</span>
                {!pm.isActive && <span className="text-[10px] text-gray-400 uppercase">inactive</span>}
                <button type="button" onClick={() => handleEditPayment(pm)} className="p-0.5 text-gray-300 hover:text-black transition-colors">
                  <Pencil size={12} />
                </button>
                <button type="button" onClick={() => handleDeletePayment(pm.id)} className="p-0.5 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

/* ── Social Media Tab ── */
function SocialTab({
  form,
  setForm,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  setForm: React.Dispatch<React.SetStateAction<ReturnType<typeof useAdmin>['settings']>>
}) {
  const [editingLink, setEditingLink] = useState<AdminSocialLink | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [linkForm, setLinkForm] = useState<Omit<AdminSocialLink, 'id'>>({
    platform: '', url: '', label: '', isActive: true, sortOrder: 0,
  })

  const platformOptions = [
    'Instagram', 'TikTok', 'WhatsApp', 'Twitter/X', 'Facebook',
    'YouTube', 'LinkedIn', 'Pinterest', 'Snapchat', 'Threads', 'Other',
  ]

  const handleAdd = () => {
    setIsAdding(true)
    setEditingLink(null)
    setLinkForm({ platform: 'Instagram', url: '', label: '', isActive: true, sortOrder: form.socialLinks.length })
  }

  const handleEdit = (link: AdminSocialLink) => {
    setEditingLink(link)
    setIsAdding(false)
    setLinkForm({ platform: link.platform, url: link.url, label: link.label, isActive: link.isActive, sortOrder: link.sortOrder })
  }

  const handleSave = () => {
    if (!linkForm.url.trim()) return
    const label = linkForm.label || linkForm.platform
    if (isAdding) {
      const newLink: AdminSocialLink = { id: genId(), ...linkForm, label }
      setForm((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, newLink] }))
    } else if (editingLink) {
      setForm((prev) => ({
        ...prev,
        socialLinks: prev.socialLinks.map((l) =>
          l.id === editingLink.id ? { ...l, ...linkForm, label } : l,
        ),
      }))
    }
    setEditingLink(null)
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showDeleteConfirm('Social Link')
    if (!confirmed) return
    setForm((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((l) => l.id !== id) }))
  }

  const toggleActive = (id: string) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((l) =>
        l.id === id ? { ...l, isActive: !l.isActive } : l,
      ),
    }))
  }

  const moveItem = (id: string, direction: 'up' | 'down') => {
    setForm((prev) => {
      const sorted = [...prev.socialLinks].sort((a, b) => a.sortOrder - b.sortOrder)
      const idx = sorted.findIndex((l) => l.id === id)
      if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sorted.length - 1)) return prev
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      const temp = sorted[idx].sortOrder
      sorted[idx] = { ...sorted[idx], sortOrder: sorted[swapIdx].sortOrder }
      sorted[swapIdx] = { ...sorted[swapIdx], sortOrder: temp }
      return { ...prev, socialLinks: sorted }
    })
  }

  const sortedLinks = [...form.socialLinks].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Share2 size={18} className="text-gray-400" />
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Social Media Links</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Add, edit, reorder, and toggle visibility of social media links displayed in the footer and header.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} /> Add Social Link
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingLink) && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-black">
              {isAdding ? 'Add Social Link' : 'Edit Social Link'}
            </h3>
            <button type="button" onClick={() => { setEditingLink(null); setIsAdding(false) }} className="p-1 text-gray-400 hover:text-black">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Platform</label>
                <select
                  value={linkForm.platform}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                >
                  {platformOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Display Label</label>
                <input
                  value={linkForm.label}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder={`e.g. @bremersuits`}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-black mb-1">URL</label>
              <input
                value={linkForm.url}
                onChange={(e) => setLinkForm((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://www.instagram.com/bremersuits"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={linkForm.isActive}
                onChange={(e) => setLinkForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 accent-black"
              />
              <span className="text-xs font-medium text-gray-600">Visible on site</span>
            </label>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={handleSave} className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                {isAdding ? 'Add Link' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => { setEditingLink(null); setIsAdding(false) }} className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Links List */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {sortedLinks.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No social media links configured. Click "Add Social Link" to get started.
          </div>
        ) : (
          sortedLinks.map((link, idx) => (
            <div key={link.id} className={`flex items-center gap-4 p-4 ${!link.isActive ? 'opacity-50' : ''}`}>
              <div className="flex flex-col gap-0.5">
                <button type="button" onClick={() => moveItem(link.id, 'up')} disabled={idx === 0} className="p-0.5 text-gray-300 hover:text-black disabled:opacity-30 transition-colors">
                  <ArrowUp size={12} />
                </button>
                <button type="button" onClick={() => moveItem(link.id, 'down')} disabled={idx === sortedLinks.length - 1} className="p-0.5 text-gray-300 hover:text-black disabled:opacity-30 transition-colors">
                  <ArrowDown size={12} />
                </button>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Globe size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-black">{link.platform}</span>
                  {!link.isActive && <span className="text-[10px] text-orange-500 font-medium uppercase bg-orange-50 px-1.5 py-0.5 rounded">Hidden</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{link.label} &middot; {link.url}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => toggleActive(link.id)} className="p-1.5 text-gray-400 hover:text-black transition-colors" title={link.isActive ? 'Hide' : 'Show'}>
                  {link.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button type="button" onClick={() => handleEdit(link)} className="p-1.5 text-gray-400 hover:text-black transition-colors">
                  <Pencil size={14} />
                </button>
                <button type="button" onClick={() => handleDelete(link.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ── Author & Credits Tab ── */
function AuthorTab({
  form,
  handleAuthorChange,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  handleAuthorChange: (field: string, value: string) => void
}) {
  return (
    <div className="max-w-3xl space-y-8">
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-gray-400" />
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Author & System Credits</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              This information appears in the footer as a credit line (e.g. "Designed & developed by...").
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Author / Company Name</label>
            <input
              value={form.authorInfo.name}
              onChange={(e) => handleAuthorChange('name', e.target.value)}
              placeholder="e.g. OnePlusAfrica Tech Solutions"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Author Website URL</label>
            <div className="relative">
              <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={form.authorInfo.url}
                onChange={(e) => handleAuthorChange('url', e.target.value)}
                placeholder="https://oneplusafrica.com"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Tagline / Credit Line</label>
            <input
              value={form.authorInfo.tagline}
              onChange={(e) => handleAuthorChange('tagline', e.target.value)}
              placeholder="e.g. Designed & developed by"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Preview: <span className="text-gray-600">{form.authorInfo.tagline || 'Designed & developed by'} <a className="underline">{form.authorInfo.name || 'Author Name'}</a></span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Copyright Settings</h2>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            The copyright notice is automatically generated as:
          </p>
          <p className="text-sm font-medium text-black mt-2">
            &copy; {new Date().getFullYear()} {form.storeName || 'Store Name'}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            The year updates automatically. The store name is pulled from your General settings.
          </p>
        </div>
      </section>
    </div>
  )
}

/* ── Global SEO Tab ── */
function SeoGlobalTab({
  form,
  handleSeoGlobalChange,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  handleSeoGlobalChange: (field: string, value: string | boolean) => void
}) {
  return (
    <div className="max-w-3xl space-y-8">
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={18} className="text-gray-400" />
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Global SEO Defaults</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              These values apply site-wide unless overridden by individual page settings.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Site Title</label>
              <input
                value={form.seoGlobal.siteTitle}
                onChange={(e) => handleSeoGlobalChange('siteTitle', e.target.value)}
                placeholder="Bremer Suits"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Title Separator</label>
              <input
                value={form.seoGlobal.titleSeparator}
                onChange={(e) => handleSeoGlobalChange('titleSeparator', e.target.value)}
                placeholder="—"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">e.g. "Page Title — Site Name"</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Default Meta Description</label>
            <textarea
              value={form.seoGlobal.defaultDescription}
              onChange={(e) => handleSeoGlobalChange('defaultDescription', e.target.value)}
              rows={3}
              placeholder="Default description for pages without one"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">{(form.seoGlobal.defaultDescription || '').length}/160 characters recommended</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Default Keywords</label>
            <input
              value={form.seoGlobal.defaultKeywords}
              onChange={(e) => handleSeoGlobalChange('defaultKeywords', e.target.value)}
              placeholder="custom suits, tailoring, fashion styling, image consulting"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Comma-separated keywords</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Default Open Graph Image URL</label>
            <input
              value={form.seoGlobal.defaultOgImage}
              onChange={(e) => handleSeoGlobalChange('defaultOgImage', e.target.value)}
              placeholder="https://yourdomain.com/og-image.jpg"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630px</p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Search Engine Verification</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Google Verification Code</label>
            <input
              value={form.seoGlobal.googleVerification}
              onChange={(e) => handleSeoGlobalChange('googleVerification', e.target.value)}
              placeholder="Google Search Console verification meta tag content"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Bing Verification Code</label>
            <input
              value={form.seoGlobal.bingVerification}
              onChange={(e) => handleSeoGlobalChange('bingVerification', e.target.value)}
              placeholder="Bing Webmaster Tools verification meta tag content"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Code size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Robots.txt</h2>
        </div>
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Custom Robots.txt Content</label>
          <textarea
            value={form.seoGlobal.robotsTxt}
            onChange={(e) => handleSeoGlobalChange('robotsTxt', e.target.value)}
            rows={6}
            placeholder={`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://yourdomain.com/sitemap.xml`}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
          />
          <p className="text-xs text-gray-400 mt-1">
            Leave empty to use the default. The sitemap URL is automatically included when sitemap is enabled.
          </p>
        </div>
      </section>
    </div>
  )
}

/* ── SEO Pages Tab ── */
function SeoTab({
  form,
  setForm,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  setForm: React.Dispatch<React.SetStateAction<ReturnType<typeof useAdmin>['settings']>>
}) {
  const [search, setSearch] = useState('')
  const [editingPage, setEditingPage] = useState<AdminSeoPage | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const defaultPageForm: Omit<AdminSeoPage, 'id'> = {
    name: '', path: '/', title: '', description: '', keywords: '',
    ogTitle: '', ogDescription: '', ogImage: '',
    twitterCard: 'summary_large_image', canonicalUrl: '',
    noIndex: false, noFollow: false, structuredData: '',
  }
  const [pageForm, setPageForm] = useState<Omit<AdminSeoPage, 'id'>>(defaultPageForm)

  const filteredPages = form.seoPages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.path.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAddPage = () => {
    setIsAdding(true)
    setEditingPage(null)
    setPageForm(defaultPageForm)
  }

  const handleEditPage = (page: AdminSeoPage) => {
    setEditingPage(page)
    setIsAdding(false)
    setPageForm({
      name: page.name, path: page.path, title: page.title,
      description: page.description, keywords: page.keywords || '',
      ogTitle: page.ogTitle || '', ogDescription: page.ogDescription || '',
      ogImage: page.ogImage || '', twitterCard: page.twitterCard || 'summary_large_image',
      canonicalUrl: page.canonicalUrl || '',
      noIndex: page.noIndex || false, noFollow: page.noFollow || false,
      structuredData: page.structuredData || '',
    })
  }

  const handleSavePage = () => {
    if (!pageForm.name.trim() || !pageForm.path.trim()) return
    if (isAdding) {
      const newPage: AdminSeoPage = {
        id: 'seo-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        ...pageForm,
      }
      setForm((prev) => ({ ...prev, seoPages: [...prev.seoPages, newPage] }))
    } else if (editingPage) {
      setForm((prev) => ({
        ...prev,
        seoPages: prev.seoPages.map((p) =>
          p.id === editingPage.id ? { ...p, ...pageForm } : p,
        ),
      }))
    }
    setEditingPage(null)
    setIsAdding(false)
  }

  const handleDeletePage = async (id: string) => {
    const confirmed = await showDeleteConfirm('SEO Page')
    if (!confirmed) return
    setForm((prev) => ({
      ...prev,
      seoPages: prev.seoPages.filter((p) => p.id !== id),
    }))
  }

  const handleCancel = () => {
    setEditingPage(null)
    setIsAdding(false)
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-gray-400" />
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Per-Page SEO Manager</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure meta tags, Open Graph, Twitter cards, and structured data for each page.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddPage}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> Add Page
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pages..."
          className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
        />
      </div>

      {/* Add/Edit Modal */}
      {(isAdding || editingPage) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-black">
              {isAdding ? 'Add New Page SEO' : 'Edit Page SEO'}
            </h3>
            <button type="button" onClick={handleCancel} className="p-1 text-gray-400 hover:text-black">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Page Name</label>
                <input
                  value={pageForm.name}
                  onChange={(e) => setPageForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Home"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Path</label>
                <input
                  value={pageForm.path}
                  onChange={(e) => setPageForm((prev) => ({ ...prev, path: e.target.value }))}
                  placeholder="e.g. /"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            {/* Meta Tags */}
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Meta Title</label>
              <input
                value={pageForm.title}
                onChange={(e) => setPageForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Page title for search engines"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">{(pageForm.title || '').length}/60 characters recommended</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Meta Description</label>
              <textarea
                value={pageForm.description}
                onChange={(e) => setPageForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description for search engine results"
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">{(pageForm.description || '').length}/160 characters recommended</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Keywords</label>
              <input
                value={pageForm.keywords}
                onChange={(e) => setPageForm((prev) => ({ ...prev, keywords: e.target.value }))}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>

            {/* Open Graph */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Open Graph (Facebook, LinkedIn)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">OG Title</label>
                  <input
                    value={pageForm.ogTitle}
                    onChange={(e) => setPageForm((prev) => ({ ...prev, ogTitle: e.target.value }))}
                    placeholder="Leave empty to use meta title"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">OG Description</label>
                  <textarea
                    value={pageForm.ogDescription}
                    onChange={(e) => setPageForm((prev) => ({ ...prev, ogDescription: e.target.value }))}
                    placeholder="Leave empty to use meta description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">OG Image URL</label>
                  <input
                    value={pageForm.ogImage}
                    onChange={(e) => setPageForm((prev) => ({ ...prev, ogImage: e.target.value }))}
                    placeholder="Leave empty to use global default"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Twitter Card */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Twitter Card</h4>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Card Type</label>
                <select
                  value={pageForm.twitterCard}
                  onChange={(e) => setPageForm((prev) => ({ ...prev, twitterCard: e.target.value as 'summary' | 'summary_large_image' }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                >
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="summary">Summary</option>
                </select>
              </div>
            </div>

            {/* Advanced */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Advanced</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">Canonical URL</label>
                  <input
                    value={pageForm.canonicalUrl}
                    onChange={(e) => setPageForm((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                    placeholder="Leave empty for automatic"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pageForm.noIndex}
                      onChange={(e) => setPageForm((prev) => ({ ...prev, noIndex: e.target.checked }))}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm text-gray-700">noindex</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pageForm.noFollow}
                      onChange={(e) => setPageForm((prev) => ({ ...prev, noFollow: e.target.checked }))}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm text-gray-700">nofollow</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black mb-1">Structured Data (JSON-LD)</label>
                  <textarea
                    value={pageForm.structuredData}
                    onChange={(e) => setPageForm((prev) => ({ ...prev, structuredData: e.target.value }))}
                    placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSavePage}
                className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                {isAdding ? 'Add Page' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {filteredPages.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            {search ? 'No pages match your search.' : 'No SEO pages configured yet. Click "Add Page" to get started.'}
          </div>
        ) : (
          filteredPages.map((page) => (
            <div key={page.id} className="flex items-start justify-between p-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-black">{page.name}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{page.path}</span>
                  {page.noIndex && <span className="text-[10px] text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">noindex</span>}
                  {page.noFollow && <span className="text-[10px] text-orange-500 font-medium bg-orange-50 px-1.5 py-0.5 rounded">nofollow</span>}
                </div>
                <p className="text-sm text-blue-600 truncate">{page.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{page.description}</p>
                {page.keywords && <p className="text-xs text-gray-400 mt-1">Keywords: {page.keywords}</p>}
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <button type="button" onClick={() => handleEditPage(page)} className="p-2 text-gray-400 hover:text-black transition-colors" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" onClick={() => handleDeletePage(page.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ── Sitemap Tab ── */
function SitemapTab({
  form,
  handleSeoGlobalChange,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  handleSeoGlobalChange: (field: string, value: string | boolean) => void
}) {
  return (
    <div className="max-w-3xl space-y-8">
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Map size={18} className="text-gray-400" />
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Dynamic Sitemap</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              The sitemap is automatically generated from your pages, products, and blog posts.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.seoGlobal.sitemapEnabled}
              onChange={(e) => handleSeoGlobalChange('sitemapEnabled', e.target.checked)}
              className="w-5 h-5 accent-black"
            />
            <div>
              <span className="text-sm font-semibold text-black">Enable Dynamic Sitemap</span>
              <p className="text-xs text-gray-500">Automatically generates an XML sitemap at <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/sitemap.xml</code></p>
            </div>
          </label>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sitemap Includes</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500" /> All static pages (Home, About, Services, Contact, etc.)
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500" /> Product collection pages
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500" /> Individual product pages
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500" /> Blog index and individual blog posts
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500" /> Policy pages (Privacy, Terms, Refund, Shipping)
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle size={14} className="text-orange-400" /> Pages marked as "noindex" in Page SEO are excluded
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle size={14} className="text-orange-400" /> Admin pages are always excluded
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Access Your Sitemap</h4>
            <p className="text-sm text-gray-600">
              Your sitemap is available at: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-mono">/.netlify/functions/sitemap</code>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Add this URL to your robots.txt and submit it to Google Search Console and Bing Webmaster Tools.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Theme Tab ── */
function ThemeTab({
  form,
  handleThemeChange,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  handleThemeChange: (field: string, value: string) => void
}) {
  const fontOptions = [
    'Playfair Display', 'Inter', 'Roboto', 'Open Sans', 'Lato',
    'Montserrat', 'Poppins', 'Raleway', 'Merriweather', 'Source Sans Pro',
  ]

  return (
    <div className="max-w-3xl space-y-8">
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Branding</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Logo Image URL</label>
            <input
              value={form.theme.logoUrl}
              onChange={(e) => handleThemeChange('logoUrl', e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Favicon URL</label>
            <input
              value={form.theme.faviconUrl}
              onChange={(e) => handleThemeChange('faviconUrl', e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Colors & Fonts</h2>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  value={form.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  value={form.theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Heading Font</label>
              <select
                value={form.theme.headingFont}
                onChange={(e) => handleThemeChange('headingFont', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Body Font</label>
              <select
                value={form.theme.bodyFont}
                onChange={(e) => handleThemeChange('bodyFont', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
