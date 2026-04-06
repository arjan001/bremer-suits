import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Search, Mail, Download, Send, X, Users, UserCheck, UserX, Trash2, Eye, Phone, CalendarClock } from 'lucide-react'
import { useAdmin } from '@/lib/admin-store'
import { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showDeleteConfirm, showError, showSuccess } from '@/lib/sweet-alert'

export const Route = createFileRoute('/admin/newsletter')({
  component: AdminNewsletter,
})

type LeadStatus = 'new' | 'in_progress' | 'closed'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: LeadStatus
  createdAt: string
  updatedAt: string
}

function AdminNewsletter() {
  const { subscribers, addSubscriber, updateSubscriber, removeSubscriber, emailCampaigns, addEmailCampaign, deleteEmailCampaign } = useAdmin()
  const [search, setSearch] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [viewCampaign, setViewCampaign] = useState<{ subject: string; body: string; sentAt: string; recipientCount: number } | null>(null)
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [submissionsError, setSubmissionsError] = useState('')
  const [leadSearch, setLeadSearch] = useState('')

  const loadContactSubmissions = async () => {
    setLoadingSubmissions(true)
    setSubmissionsError('')
    try {
      const response = await fetch('/.netlify/functions/contact-submissions')
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Could not load contact submissions.')
      }
      const data = (await response.json()) as ContactSubmission[]
      setContactSubmissions(data)
    } catch (error) {
      setSubmissionsError(error instanceof Error ? error.message : 'Could not load contact submissions.')
    } finally {
      setLoadingSubmissions(false)
    }
  }

  useEffect(() => {
    loadContactSubmissions()
  }, [])

  const active = subscribers.filter((s) => s.status === 'active')
  const unsubscribed = subscribers.filter((s) => s.status === 'unsubscribed')

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.subscribedAt.localeCompare(a.subscribedAt))
  const filteredLeads = contactSubmissions
    .filter((lead) => {
      const searchValue = leadSearch.toLowerCase()
      return (
        lead.name.toLowerCase().includes(searchValue) ||
        lead.email.toLowerCase().includes(searchValue) ||
        lead.phone.toLowerCase().includes(searchValue) ||
        lead.service.toLowerCase().includes(searchValue)
      )
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newEmail.trim()) {
      const ok = await addSubscriber(newEmail.trim())
      if (ok) {
        showCreateSuccess('Subscriber')
        setNewEmail('')
      } else {
        showError('Add Failed', 'Could not add subscriber. Please try again.')
      }
    }
  }

  const handleExport = () => {
    const csv = 'Email,Status,Subscribed At\n' + subscribers.map((s) => `${s.email},${s.status},${s.subscribedAt}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailSubject.trim() || !emailBody.trim()) return
    const ok = await addEmailCampaign({
      subject: emailSubject,
      body: emailBody,
      sentAt: new Date().toISOString(),
      recipientCount: active.length,
    })
    if (ok) {
      showSuccess('Campaign Sent!', 'Email campaign has been sent successfully.')
      setShowCompose(false)
      setEmailSubject('')
      setEmailBody('')
    } else {
      showError('Send Failed', 'Could not send campaign. Please try again.')
    }
  }

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const response = await fetch(`/.netlify/functions/contact-submissions?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Failed to update lead')
      }
      const updated = (await response.json()) as ContactSubmission
      setContactSubmissions((previous) => previous.map((lead) => (lead.id === id ? updated : lead)))
      showUpdateSuccess('Lead status')
    } catch (error) {
      showError('Update Failed', error instanceof Error ? error.message : 'Could not update lead status.')
    }
  }

  const deleteLead = async (id: string) => {
    const confirmed = await showDeleteConfirm('Contact submission')
    if (!confirmed) return
    try {
      const response = await fetch(`/.netlify/functions/contact-submissions?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Failed to delete lead')
      }
      setContactSubmissions((previous) => previous.filter((lead) => lead.id !== id))
      showDeleteSuccess('Contact submission')
    } catch (error) {
      showError('Delete Failed', error instanceof Error ? error.message : 'Could not delete contact submission.')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Newsletter & Contact Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage newsletter subscribers and consultation inquiries from the contact page.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
            <Send size={16} /> Send Email
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Subscribers</p>
            <Users size={16} className="text-gray-300" />
          </div>
          <p className="text-3xl font-bold text-black">{subscribers.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Active</p>
            <UserCheck size={16} className="text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-700">{active.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Inactive</p>
            <UserX size={16} className="text-red-300" />
          </div>
          <p className="text-3xl font-bold text-red-600">{unsubscribed.length}</p>
        </div>
      </div>

      {/* Add subscriber + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleAdd} className="flex gap-2 flex-1">
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Add subscriber email..." required className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
          <button type="submit" className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">Add</button>
        </form>
        <div className="relative sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden sm:table-cell">Subscribed</th>
              <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-black">{s.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                    s.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{s.status === 'active' ? 'Active' : 'Unsubscribed'}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={async () => {
                        const ok = await updateSubscriber(s.id, { status: s.status === 'active' ? 'unsubscribed' : 'active' })
                        if (ok) showUpdateSuccess('Subscriber status')
                        else showError('Update Failed', 'Could not update subscriber status.')
                      }}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                        s.status === 'active' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                      title={s.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    >
                      {s.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    </button>
                    <button onClick={async () => {
                      const confirmed = await showDeleteConfirm('Subscriber')
                      if (confirmed) {
                        const ok = await removeSubscriber(s.id)
                        if (ok) showDeleteSuccess('Subscriber')
                        else showError('Delete Failed', 'Could not delete subscriber.')
                      }
                    }} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-14 text-center text-gray-400"><Mail size={36} className="mx-auto mb-3 text-gray-300" /><p className="text-sm">No subscribers yet</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contact Form Submissions */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Contact Form Submissions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Leads submitted from the contact page and stored in admin.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={leadSearch}
                onChange={(event) => setLeadSearch(event.target.value)}
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <button
              onClick={loadContactSubmissions}
              className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loadingSubmissions}
            >
              {loadingSubmissions ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {submissionsError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submissionsError}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">Service</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Submitted</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 align-top">
                    <p className="font-semibold text-black">{lead.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 inline-flex items-center gap-1.5">
                      <Mail size={12} /> {lead.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 inline-flex items-center gap-1.5">
                      <Phone size={12} /> {lead.phone}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-md">{lead.message.slice(0, 140)}{lead.message.length > 140 ? '…' : ''}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{lead.service}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                      lead.status === 'new'
                        ? 'bg-blue-50 text-blue-700'
                        : lead.status === 'in_progress'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-green-50 text-green-700'
                    }`}
                    >
                      {lead.status === 'new' ? 'New' : lead.status === 'in_progress' ? 'In Progress' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock size={12} />
                      {new Date(lead.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'in_progress')}
                        className="px-2 py-1 text-xs rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                        disabled={lead.status === 'in_progress'}
                      >
                        Progress
                      </button>
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'closed')}
                        className="px-2 py-1 text-xs rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        disabled={lead.status === 'closed'}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete lead"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loadingSubmissions && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    <Mail size={28} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No contact submissions yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Campaigns History */}
      {emailCampaigns.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-black mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Email History</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Subject</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden sm:table-cell">Recipients</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Sent</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...emailCampaigns].reverse().map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-black">{c.subject}</td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{c.recipientCount} subscribers</td>
                    <td className="px-5 py-3 text-gray-500">{new Date(c.sentAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewCampaign(c)} className="p-1.5 text-gray-400 hover:text-black transition-colors" title="View"><Eye size={15} /></button>
                        <button onClick={async () => {
                          const confirmed = await showDeleteConfirm('Campaign')
                          if (confirmed) {
                            const ok = await deleteEmailCampaign(c.id)
                            if (ok) showDeleteSuccess('Campaign')
                            else showError('Delete Failed', 'Could not delete campaign.')
                          }
                        }} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCompose(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-black">Send Mass Email</h2>
                <p className="text-xs text-gray-400 mt-0.5">Send to {active.length} active subscriber{active.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setShowCompose(false)} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Subject *</label>
                <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} required placeholder="e.g. New arrivals this week!" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Message *</label>
                <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} required rows={6} placeholder="Write your email content here..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none resize-y" />
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                <p>This will send an email to all <span className="font-semibold text-black">{active.length}</span> active subscribers.</p>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowCompose(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black transition-colors">Cancel</button>
                <button type="submit" disabled={active.length === 0} className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                  <Send size={14} /> Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Campaign Modal */}
      {viewCampaign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewCampaign(null)} />
          <div className="relative bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-black">Campaign Details</h2>
              <button onClick={() => setViewCampaign(null)} className="p-1 text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Subject</p>
                <p className="text-sm font-medium text-black">{viewCampaign.subject}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Message</p>
                <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{viewCampaign.body}</div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Sent: {new Date(viewCampaign.sentAt).toLocaleString()}</span>
                <span>Recipients: {viewCampaign.recipientCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
