import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Megaphone, Image, Percent } from 'lucide-react'
import { useAdmin, type AdminHeroBanner, type AdminBanner, type AdminCarousel, type AdminNavbarOffer, type AdminPopupOffer, type AdminOffer } from '@/lib/admin-store'

export const Route = createFileRoute('/admin/offers')({
  component: AdminOffers,
})

type Tab = 'hero' | 'banners' | 'carousels' | 'navbar' | 'popup' | 'discounts'

function AdminOffers() {
  const {
    heroBanners, addHeroBanner, updateHeroBanner, deleteHeroBanner,
    banners, addBanner, updateBanner, deleteBanner,
    carousels, addCarousel, updateCarousel, deleteCarousel,
    navbarOffers, addNavbarOffer, updateNavbarOffer, deleteNavbarOffer,
    popupOffers, addPopupOffer, updatePopupOffer, deletePopupOffer,
    offers, addOffer, updateOffer, deleteOffer,
    categories,
  } = useAdmin()

  const [activeTab, setActiveTab] = useState<Tab>('hero')
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: Tab } | null>(null)

  // Hero Banner state
  const [heroModal, setHeroModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editHero, setEditHero] = useState<AdminHeroBanner | null>(null)

  // Banner state
  const [bannerModal, setBannerModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editBanner, setEditBanner] = useState<AdminBanner | null>(null)

  // Carousel state
  const [carouselModal, setCarouselModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editCarousel, setEditCarousel] = useState<AdminCarousel | null>(null)

  // Navbar offer state
  const [navbarModal, setNavbarModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editNavbar, setEditNavbar] = useState<AdminNavbarOffer | null>(null)

  // Popup offer state
  const [popupModal, setPopupModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editPopup, setEditPopup] = useState<AdminPopupOffer | null>(null)

  // Discount offer state
  const [discountModal, setDiscountModal] = useState<'closed' | 'add' | 'edit'>('closed')
  const [editDiscount, setEditDiscount] = useState<AdminOffer | null>(null)

  const handleDelete = () => {
    if (!deleteConfirm) return
    const { id, type } = deleteConfirm
    if (type === 'hero') deleteHeroBanner(id)
    else if (type === 'banners') deleteBanner(id)
    else if (type === 'carousels') deleteCarousel(id)
    else if (type === 'navbar') deleteNavbarOffer(id)
    else if (type === 'popup') deletePopupOffer(id)
    else if (type === 'discounts') deleteOffer(id)
    setDeleteConfirm(null)
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'hero', label: 'Hero Banners', count: heroBanners.length },
    { key: 'banners', label: 'Banners', count: banners.length },
    { key: 'carousels', label: 'Carousels', count: carousels.length },
    { key: 'navbar', label: 'Navbar Offers', count: navbarOffers.length },
    { key: 'popup', label: 'Popup Offers', count: popupOffers.length },
    { key: 'discounts', label: 'Discount Codes', count: offers.length },
  ]

  const addButtonLabels: Record<Tab, string> = {
    hero: 'Add Hero Banner',
    banners: 'Add Banner',
    carousels: 'Add Carousel',
    navbar: 'Add Offer Text',
    popup: 'Add Popup Offer',
    discounts: 'Add Discount Code',
  }

  const handleAddClick = () => {
    if (activeTab === 'hero') { setEditHero(null); setHeroModal('add') }
    else if (activeTab === 'banners') { setEditBanner(null); setBannerModal('add') }
    else if (activeTab === 'carousels') { setEditCarousel(null); setCarouselModal('add') }
    else if (activeTab === 'navbar') { setEditNavbar(null); setNavbarModal('add') }
    else if (activeTab === 'popup') { setEditPopup(null); setPopupModal('add') }
    else if (activeTab === 'discounts') { setEditDiscount(null); setDiscountModal('add') }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Offers & Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage homepage banners, navbar running offers, and popup offers.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === t.key
                ? 'text-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label} ({t.count})
            {activeTab === t.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-4">
        <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={16} /> {addButtonLabels[activeTab]}
        </button>
      </div>

      {/* Hero Banners Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-3">
          {heroBanners.map((b) => (
            <div key={b.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black text-sm">{b.title}</p>
                <p className="text-xs text-gray-500">Collection: <span className="text-blue-600">{b.collection}</span></p>
                <p className="text-xs text-gray-400">Link: {b.link} -- Button: {b.buttonText}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateHeroBanner(b.id, { isActive: !b.isActive })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${b.isActive ? 'bg-gray-800' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${b.isActive ? 'left-5.5 translate-x-0' : 'left-0.5'}`}
                    style={{ left: b.isActive ? '22px' : '2px' }} />
                </button>
                <button onClick={() => { setEditHero(b); setHeroModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => setDeleteConfirm({ id: b.id, type: 'hero' })} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {heroBanners.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
              <Image size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No hero banners yet</p>
            </div>
          )}
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black text-sm">{b.title}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{b.description} --</p>
                <p className="text-xs text-gray-400">Link: {b.link}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateBanner(b.id, { isActive: !b.isActive })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${b.isActive ? 'bg-gray-800' : 'bg-gray-300'}`}
                >
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{ left: b.isActive ? '22px' : '2px' }} />
                </button>
                <button onClick={() => { setEditBanner(b); setBannerModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => setDeleteConfirm({ id: b.id, type: 'banners' })} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
              <Image size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No banners yet</p>
            </div>
          )}
        </div>
      )}

      {/* Carousels Tab */}
      {activeTab === 'carousels' && (
        <div className="space-y-3">
          {carousels.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black text-sm">{c.title}</p>
                <p className="text-xs text-gray-400">Link: {c.link}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateCarousel(c.id, { isActive: !c.isActive })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${c.isActive ? 'bg-gray-800' : 'bg-gray-300'}`}
                >
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{ left: c.isActive ? '22px' : '2px' }} />
                </button>
                <button onClick={() => { setEditCarousel(c); setCarouselModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => setDeleteConfirm({ id: c.id, type: 'carousels' })} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {carousels.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
              <Image size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No carousels yet</p>
            </div>
          )}
        </div>
      )}

      {/* Navbar Offers Tab */}
      {activeTab === 'navbar' && (
        <div className="space-y-3">
          {navbarOffers.map((o) => (
            <div key={o.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center text-gray-400 shrink-0">
                <Megaphone size={18} />
              </div>
              <p className="flex-1 text-sm text-gray-700">{o.text}</p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateNavbarOffer(o.id, { isActive: !o.isActive })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${o.isActive ? 'bg-gray-800' : 'bg-gray-300'}`}
                >
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{ left: o.isActive ? '22px' : '2px' }} />
                </button>
                <button onClick={() => { setEditNavbar(o); setNavbarModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => setDeleteConfirm({ id: o.id, type: 'navbar' })} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {navbarOffers.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
              <Megaphone size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No navbar offers yet</p>
            </div>
          )}
        </div>
      )}

      {/* Popup Offers Tab */}
      {activeTab === 'popup' && (
        <div className="space-y-3">
          {popupOffers.map((o) => (
            <div key={o.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
              <div className="w-16 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {o.image ? <img src={o.image} alt={o.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Image size={18} className="text-gray-300" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black text-sm">{o.title}</p>
                <p className="text-xs text-gray-500">{o.discountPercent}% OFF {o.code && `| Code: ${o.code}`} {o.collectNewsletter && '| Collects newsletter'}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updatePopupOffer(o.id, { isActive: !o.isActive })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${o.isActive ? 'bg-gray-800' : 'bg-gray-300'}`}
                >
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{ left: o.isActive ? '22px' : '2px' }} />
                </button>
                <button onClick={() => { setEditPopup(o); setPopupModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => setDeleteConfirm({ id: o.id, type: 'popup' })} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {popupOffers.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
              <Image size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No popup offers yet</p>
            </div>
          )}
        </div>
      )}

      {/* Discount Codes Tab */}
      {activeTab === 'discounts' && (
        <div className="space-y-3">
          {offers.map((o) => (
            <div key={o.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <Percent size={18} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-black text-sm">{o.title}</p>
                  {o.code && <span className="px-2 py-0.5 bg-gray-100 text-xs font-mono font-semibold text-gray-700 rounded">{o.code}</span>}
                </div>
                <p className="text-xs text-gray-500">{o.discountPercent}% OFF &middot; {new Date(o.startDate).toLocaleDateString()} — {new Date(o.endDate).toLocaleDateString()}</p>
                {o.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{o.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                  o.status === 'active' ? 'bg-green-50 text-green-700' :
                  o.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                  'bg-gray-100 text-gray-500'
                }`}>{o.status}</span>
                <button onClick={() => { setEditDiscount(o); setDiscountModal('edit') }} className="p-1.5 text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => setDeleteConfirm({ id: o.id, type: 'discounts' })} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {offers.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
              <Percent size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No discount codes yet</p>
            </div>
          )}
        </div>
      )}

      {/* ── MODALS ── */}

      {/* Hero Banner Modal */}
      {heroModal !== 'closed' && (
        <ModalShell title={heroModal === 'add' ? 'Add Hero Banner' : 'Edit Hero Banner'} onClose={() => setHeroModal('closed')}>
          <HeroBannerForm item={editHero} categories={categories.map((c) => c.name)} onSave={(data) => {
            if (heroModal === 'edit' && editHero) updateHeroBanner(editHero.id, data)
            else addHeroBanner(data as AdminHeroBanner)
            setHeroModal('closed')
          }} onCancel={() => setHeroModal('closed')} />
        </ModalShell>
      )}

      {/* Banner Modal */}
      {bannerModal !== 'closed' && (
        <ModalShell title={bannerModal === 'add' ? 'Add Banner' : 'Edit Banner'} onClose={() => setBannerModal('closed')}>
          <BannerForm item={editBanner} onSave={(data) => {
            if (bannerModal === 'edit' && editBanner) updateBanner(editBanner.id, data)
            else addBanner(data as AdminBanner)
            setBannerModal('closed')
          }} onCancel={() => setBannerModal('closed')} />
        </ModalShell>
      )}

      {/* Carousel Modal */}
      {carouselModal !== 'closed' && (
        <ModalShell title={carouselModal === 'add' ? 'Add Carousel' : 'Edit Carousel'} onClose={() => setCarouselModal('closed')}>
          <CarouselForm item={editCarousel} onSave={(data) => {
            if (carouselModal === 'edit' && editCarousel) updateCarousel(editCarousel.id, data)
            else addCarousel(data as AdminCarousel)
            setCarouselModal('closed')
          }} onCancel={() => setCarouselModal('closed')} />
        </ModalShell>
      )}

      {/* Navbar Offer Modal */}
      {navbarModal !== 'closed' && (
        <ModalShell title={navbarModal === 'add' ? 'Add Offer Text' : 'Edit Offer Text'} onClose={() => setNavbarModal('closed')}>
          <NavbarOfferForm item={editNavbar} onSave={(data) => {
            if (navbarModal === 'edit' && editNavbar) updateNavbarOffer(editNavbar.id, data)
            else addNavbarOffer(data as AdminNavbarOffer)
            setNavbarModal('closed')
          }} onCancel={() => setNavbarModal('closed')} />
        </ModalShell>
      )}

      {/* Popup Offer Modal */}
      {popupModal !== 'closed' && (
        <ModalShell title={popupModal === 'add' ? 'Add Popup Offer' : 'Edit Popup Offer'} onClose={() => setPopupModal('closed')}>
          <PopupOfferForm item={editPopup} onSave={(data) => {
            if (popupModal === 'edit' && editPopup) updatePopupOffer(editPopup.id, data)
            else addPopupOffer(data as AdminPopupOffer)
            setPopupModal('closed')
          }} onCancel={() => setPopupModal('closed')} />
        </ModalShell>
      )}

      {discountModal !== 'closed' && (
        <ModalShell title={discountModal === 'add' ? 'Add Discount Code' : 'Edit Discount Code'} onClose={() => setDiscountModal('closed')}>
          <DiscountOfferForm item={editDiscount} onSave={(data) => {
            if (discountModal === 'edit' && editDiscount) updateOffer(editDiscount.id, data)
            else addOffer(data as AdminOffer)
            setDiscountModal('closed')
          }} onCancel={() => setDiscountModal('closed')} />
        </ModalShell>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-black mb-2">Delete Item</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Shared Modal Shell ── */
function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"

/* ── Hero Banner Form ── */
function HeroBannerForm({ item, categories, onSave, onCancel }: { item: AdminHeroBanner | null; categories: string[]; onSave: (d: Partial<AdminHeroBanner>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(item?.title || '')
  const [collection, setCollection] = useState(item?.collection || categories[0] || '')
  const [link, setLink] = useState(item?.link || '')
  const [buttonText, setButtonText] = useState(item?.buttonText || '')
  const [image, setImage] = useState(item?.image || '')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, collection, link, buttonText, image, isActive: item?.isActive ?? true }) }} className="p-6 space-y-4">
      <div><label className="block text-sm font-semibold text-black mb-1">Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} /></div>
      <div><label className="block text-sm font-semibold text-black mb-1">Collection</label>
        <select value={collection} onChange={(e) => setCollection(e.target.value)} className={inputCls}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-semibold text-black mb-1">Link</label><input value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} /></div>
        <div><label className="block text-sm font-semibold text-black mb-1">Button Text</label><input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className={inputCls} /></div>
      </div>
      <div><label className="block text-sm font-semibold text-black mb-1">Image URL</label><input value={image} onChange={(e) => setImage(e.target.value)} className={inputCls} /></div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save</button>
      </div>
    </form>
  )
}

/* ── Banner Form ── */
function BannerForm({ item, onSave, onCancel }: { item: AdminBanner | null; onSave: (d: Partial<AdminBanner>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(item?.title || '')
  const [description, setDescription] = useState(item?.description || '')
  const [link, setLink] = useState(item?.link || '')
  const [image, setImage] = useState(item?.image || '')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, description, link, image, isActive: item?.isActive ?? true }) }} className="p-6 space-y-4">
      <div><label className="block text-sm font-semibold text-black mb-1">Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} /></div>
      <div><label className="block text-sm font-semibold text-black mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls + " resize-y"} /></div>
      <div><label className="block text-sm font-semibold text-black mb-1">Link</label><input value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} /></div>
      <div><label className="block text-sm font-semibold text-black mb-1">Image URL</label><input value={image} onChange={(e) => setImage(e.target.value)} className={inputCls} /></div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save</button>
      </div>
    </form>
  )
}

/* ── Carousel Form ── */
function CarouselForm({ item, onSave, onCancel }: { item: AdminCarousel | null; onSave: (d: Partial<AdminCarousel>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(item?.title || '')
  const [link, setLink] = useState(item?.link || '')
  const [image, setImage] = useState(item?.image || '')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, link, image, isActive: item?.isActive ?? true }) }} className="p-6 space-y-4">
      <div><label className="block text-sm font-semibold text-black mb-1">Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} /></div>
      <div><label className="block text-sm font-semibold text-black mb-1">Link</label><input value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} /></div>
      <div><label className="block text-sm font-semibold text-black mb-1">Image URL</label><input value={image} onChange={(e) => setImage(e.target.value)} className={inputCls} /></div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save</button>
      </div>
    </form>
  )
}

/* ── Navbar Offer Form ── */
function NavbarOfferForm({ item, onSave, onCancel }: { item: AdminNavbarOffer | null; onSave: (d: Partial<AdminNavbarOffer>) => void; onCancel: () => void }) {
  const [text, setText] = useState(item?.text || '')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ text, isActive: item?.isActive ?? true }) }} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Offer Text *</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} required rows={3} placeholder="e.g. Free delivery on orders above $500 | Shop Now | Bremer Suits" className={inputCls + " resize-y"} />
        <p className="text-xs text-gray-400 mt-1">Use | to separate sections of text</p>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save</button>
      </div>
    </form>
  )
}

/* ── Popup Offer Form ── */
function PopupOfferForm({ item, onSave, onCancel }: { item: AdminPopupOffer | null; onSave: (d: Partial<AdminPopupOffer>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(item?.title || '')
  const [description, setDescription] = useState(item?.description || '')
  const [discountPercent, setDiscountPercent] = useState(item?.discountPercent || 10)
  const [code, setCode] = useState(item?.code || '')
  const [image, setImage] = useState(item?.image || '')
  const [collectNewsletter, setCollectNewsletter] = useState(item?.collectNewsletter ?? true)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, description, discountPercent, code, image, collectNewsletter, isActive: item?.isActive ?? true }) }} className="p-6 space-y-4">
      <div><label className="block text-sm font-semibold text-black mb-1">Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} /></div>
      <div><label className="block text-sm font-semibold text-black mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls + " resize-y"} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-semibold text-black mb-1">Discount %</label><input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} min={1} max={100} className={inputCls} /></div>
        <div><label className="block text-sm font-semibold text-black mb-1">Promo Code</label><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME10" className={inputCls + " font-mono"} /></div>
      </div>
      <div><label className="block text-sm font-semibold text-black mb-1">Image URL</label><input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/..." className={inputCls} /></div>
      <div className="flex items-center gap-3 pt-1">
        <button type="button" onClick={() => setCollectNewsletter(!collectNewsletter)}
          className={`w-10 h-5 rounded-full transition-colors relative ${collectNewsletter ? 'bg-gray-800' : 'bg-gray-300'}`}>
          <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
            style={{ left: collectNewsletter ? '22px' : '2px' }} />
        </button>
        <label className="text-sm text-gray-700">Collect newsletter email in popup</label>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save</button>
      </div>
    </form>
  )
}

/* ── Discount Offer Form ── */
function DiscountOfferForm({ item, onSave, onCancel }: { item: AdminOffer | null; onSave: (d: Partial<AdminOffer>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(item?.title || '')
  const [description, setDescription] = useState(item?.description || '')
  const [discountPercent, setDiscountPercent] = useState(item?.discountPercent || 10)
  const [code, setCode] = useState(item?.code || '')
  const [startDate, setStartDate] = useState(item?.startDate || new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(item?.endDate || '')
  const [status, setStatus] = useState<AdminOffer['status']>(item?.status || 'active')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, description, discountPercent, code, startDate, endDate, status }) }} className="p-6 space-y-4">
      <div><label className="block text-sm font-semibold text-black mb-1">Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} /></div>
      <div><label className="block text-sm font-semibold text-black mb-1">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls + " resize-y"} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-semibold text-black mb-1">Discount %</label><input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} min={1} max={100} className={inputCls} /></div>
        <div><label className="block text-sm font-semibold text-black mb-1">Promo Code *</label><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="SUMMER25" className={inputCls + " font-mono"} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-semibold text-black mb-1">Start Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} /></div>
        <div><label className="block text-sm font-semibold text-black mb-1">End Date</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} /></div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-black mb-1">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as AdminOffer['status'])} className={inputCls}>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save</button>
      </div>
    </form>
  )
}
