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
} from 'lucide-react'
import { useAdmin, type AdminSeoPage } from '@/lib/admin-store'
import { showSuccess, showError, showDeleteConfirm } from '@/lib/sweet-alert'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
})

type TabId = 'general' | 'seo' | 'theme' | 'footer-social'

const tabs: { id: TabId; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'seo', label: 'SEO' },
  { id: 'theme', label: 'Theme' },
  { id: 'footer-social', label: 'Footer & Social' },
]

function AdminSettings() {
  const { settings, updateSettings } = useAdmin()
  const [form, setForm] = useState({ ...settings })
  const [activeTab, setActiveTab] = useState<TabId>('general')

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [field]: value } }))
  }

  const handleThemeChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, theme: { ...prev.theme, [field]: value } }))
  }

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const ok = await updateSettings(form)
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
            Manage your store configuration, SEO, theme and footer.
          </p>
        </div>
        <button
          onClick={() => handleSave()}
          className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab.id
                ? 'text-black border-black'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSave}>
        {activeTab === 'general' && (
          <GeneralTab form={form} handleChange={handleChange} />
        )}
        {activeTab === 'seo' && (
          <SeoTab form={form} setForm={setForm} />
        )}
        {activeTab === 'theme' && (
          <ThemeTab form={form} handleThemeChange={handleThemeChange} />
        )}
        {activeTab === 'footer-social' && (
          <FooterSocialTab
            form={form}
            handleChange={handleChange}
            handleSocialChange={handleSocialChange}
          />
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
  handleChange: (field: string, value: string | number) => void
}) {
  return (
    <div className="max-w-3xl space-y-8">
      {/* Store Info */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <Store size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Store Info</h2>
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

      {/* Commerce */}
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

/* ── SEO Tab ── */
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
  const [pageForm, setPageForm] = useState<Omit<AdminSeoPage, 'id'>>({
    name: '',
    path: '',
    title: '',
    description: '',
  })

  const filteredPages = form.seoPages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.path.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAddPage = () => {
    setIsAdding(true)
    setEditingPage(null)
    setPageForm({ name: '', path: '/', title: '', description: '' })
  }

  const handleEditPage = (page: AdminSeoPage) => {
    setEditingPage(page)
    setIsAdding(false)
    setPageForm({ name: page.name, path: page.path, title: page.title, description: page.description })
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
          <Globe size={18} className="text-gray-400" />
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">SEO Manager</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage meta tags, descriptions, Open Graph, and indexing for each page.
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
              {isAdding ? 'Add New Page' : 'Edit Page SEO'}
            </h3>
            <button type="button" onClick={handleCancel} className="p-1 text-gray-400 hover:text-black">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Meta Title</label>
              <input
                value={pageForm.title}
                onChange={(e) => setPageForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Page title for search engines"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
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
            </div>
            <div className="flex gap-3">
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
                <h3 className="text-sm font-bold text-black">{page.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{page.path}</p>
                <p className="text-sm text-blue-600 mt-1 truncate">{page.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{page.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEditPage(page)}
                  className="p-2 text-gray-400 hover:text-black transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePage(page.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete"
                >
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

/* ── Theme Tab ── */
function ThemeTab({
  form,
  handleThemeChange,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  handleThemeChange: (field: string, value: string) => void
}) {
  const fontOptions = [
    'Playfair Display',
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Merriweather',
    'Source Sans Pro',
  ]

  return (
    <div className="max-w-3xl space-y-8">
      {/* Branding */}
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

      {/* Colors & Fonts */}
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
                  <option key={font} value={font}>
                    {font}
                  </option>
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
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Footer & Social Tab ── */
function FooterSocialTab({
  form,
  handleChange,
  handleSocialChange,
}: {
  form: ReturnType<typeof useAdmin>['settings']
  handleChange: (field: string, value: string | number) => void
  handleSocialChange: (field: string, value: string) => void
}) {
  return (
    <div className="max-w-3xl space-y-8">
      {/* Footer Content */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileText size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">Footer Content</h2>
        </div>
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Footer Text / Description
          </label>
          <textarea
            value={form.footerText}
            onChange={(e) => handleChange('footerText', e.target.value)}
            rows={4}
            placeholder="Enter your store description for the footer..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
          />
        </div>
      </section>

      {/* Social Media */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-5">Social Media</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Instagram URL</label>
              <input
                value={form.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://www.instagram.com/..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">TikTok URL</label>
              <input
                value={form.socialLinks.tiktok}
                onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                placeholder="https://www.tiktok.com/..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Twitter/X URL</label>
              <input
                value={form.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                placeholder="https://x.com/..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Facebook URL</label>
              <input
                value={form.socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">WhatsApp</label>
            <input
              value={form.socialLinks.whatsapp}
              onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
              placeholder="+1..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
