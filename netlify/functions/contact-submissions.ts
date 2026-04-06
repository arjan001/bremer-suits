import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

type SubmissionStatus = 'new' | 'in_progress' | 'closed'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: SubmissionStatus
  createdAt: string
  updatedAt: string
}

const STORE = getStore('contact-submissions')
const RESEND_API = 'https://api.resend.com/emails'
const ADMIN_EMAIL = 'brendahwanja6722@gmail.com'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status)
}

function sanitizeText(value: unknown, max = 1000): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\s+/g, ' ').slice(0, max)
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function makeId(): string {
  const random = Math.random().toString(36).slice(2, 8)
  return `lead_${Date.now().toString(36)}_${random}`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function toSubmission(body: Record<string, unknown>): ContactSubmission {
  const now = new Date().toISOString()
  const name = sanitizeText(body.name, 120)
  const email = sanitizeText(body.email, 160).toLowerCase()
  const phone = sanitizeText(body.phone, 40)
  const service = sanitizeText(body.service, 80) || 'General Inquiry'
  const message = sanitizeText(body.message, 4000)

  if (!name) throw new Error('Name is required')
  if (!email || !validateEmail(email)) throw new Error('A valid email is required')
  if (!phone) throw new Error('Phone is required')
  if (!message) throw new Error('Message is required')

  return {
    id: makeId(),
    name,
    email,
    phone,
    service,
    message,
    status: 'new',
    createdAt: now,
    updatedAt: now,
  }
}

function toSubmissionKey(id: string) {
  return `submission:${id}`
}

async function listSubmissions(): Promise<ContactSubmission[]> {
  const { blobs } = await STORE.list({ prefix: 'submission:' })
  const records = await Promise.all(
    blobs.map((blob) => STORE.get(blob.key, { type: 'json' }) as Promise<ContactSubmission | null>),
  )

  return records
    .filter((entry): entry is ContactSubmission => Boolean(entry))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

async function sendResendEmail(payload: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const from = process.env.RESEND_FROM_EMAIL || 'Bremer Suits <onboarding@resend.dev>'
  const response = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      reply_to: payload.replyTo,
    }),
  })

  return response.ok
}

async function sendSubmissionEmails(submission: ContactSubmission) {
  const adminTo = process.env.CONTACT_RECEIVER_EMAIL || ADMIN_EMAIL
  const name = escapeHtml(submission.name)
  const email = escapeHtml(submission.email)
  const phone = escapeHtml(submission.phone)
  const service = escapeHtml(submission.service)
  const message = escapeHtml(submission.message)

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#101828;max-width:680px;margin:0 auto;">
      <h2 style="margin-bottom:8px;">New Consultation Request</h2>
      <p style="margin-top:0;color:#475467;">A new contact form inquiry was submitted on the BREMER SUITS website.</p>
      <table style="border-collapse:collapse;width:100%;margin-top:16px;">
        <tr><td style="padding:8px;border:1px solid #e4e7ec;"><strong>Name</strong></td><td style="padding:8px;border:1px solid #e4e7ec;">${name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e4e7ec;"><strong>Email</strong></td><td style="padding:8px;border:1px solid #e4e7ec;">${email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e4e7ec;"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #e4e7ec;">${phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e4e7ec;"><strong>Service</strong></td><td style="padding:8px;border:1px solid #e4e7ec;">${service}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e4e7ec;"><strong>Submitted</strong></td><td style="padding:8px;border:1px solid #e4e7ec;">${new Date(submission.createdAt).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}</td></tr>
      </table>
      <h3 style="margin:20px 0 8px;">Client Message</h3>
      <p style="padding:12px;background:#f9fafb;border:1px solid #eaecf0;border-radius:8px;white-space:pre-wrap;">${message}</p>
    </div>
  `

  const clientHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#101828;max-width:680px;margin:0 auto;">
      <h2 style="margin-bottom:8px;">Thank you for contacting BREMER SUITS</h2>
      <p style="margin-top:0;color:#475467;">
        Your consultation request has been received. A member of our team will reach out shortly to confirm your appointment.
      </p>
      <p><strong>Request Summary</strong></p>
      <ul style="padding-left:20px;">
        <li>Name: ${name}</li>
        <li>Phone: ${phone}</li>
        <li>Service: ${service}</li>
      </ul>
      <p style="margin-top:20px;">Tailor House Location: Nairobi CBD, Superior Center, First Floor.</p>
      <p>For urgent assistance: +254 793 880642</p>
      <p style="margin-top:24px;">Kind regards,<br />BREMER SUITS Team</p>
    </div>
  `

  await Promise.allSettled([
    sendResendEmail({
      to: adminTo,
      subject: `New BREMER SUITS inquiry from ${submission.name}`,
      html: adminHtml,
      replyTo: submission.email,
    }),
    sendResendEmail({
      to: submission.email,
      subject: 'We received your BREMER SUITS request',
      html: clientHtml,
    }),
  ])
}

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    const url = new URL(req.url)
    const id = sanitizeText(url.searchParams.get('id'))

    if (req.method === 'GET') {
      if (id) {
        const entry = await STORE.get(toSubmissionKey(id), { type: 'json' }) as ContactSubmission | null
        if (!entry) return errorResponse('Submission not found', 404)
        return jsonResponse(entry)
      }
      const submissions = await listSubmissions()
      return jsonResponse(submissions)
    }

    if (req.method === 'POST') {
      const body = await req.json() as Record<string, unknown>
      const submission = toSubmission(body)

      await STORE.setJSON(toSubmissionKey(submission.id), submission)
      await sendSubmissionEmails(submission)

      return jsonResponse(submission, 201)
    }

    if (req.method === 'PUT') {
      if (!id) return errorResponse('Missing id parameter')
      const existing = await STORE.get(toSubmissionKey(id), { type: 'json' }) as ContactSubmission | null
      if (!existing) return errorResponse('Submission not found', 404)

      const body = await req.json() as Record<string, unknown>
      const statusRaw = sanitizeText(body.status, 40)
      const status = statusRaw === 'in_progress' || statusRaw === 'closed' ? statusRaw : 'new'

      const updated: ContactSubmission = {
        ...existing,
        name: sanitizeText(body.name, 120) || existing.name,
        email: sanitizeText(body.email, 160).toLowerCase() || existing.email,
        phone: sanitizeText(body.phone, 40) || existing.phone,
        service: sanitizeText(body.service, 80) || existing.service,
        message: sanitizeText(body.message, 4000) || existing.message,
        status,
        updatedAt: new Date().toISOString(),
      }

      await STORE.setJSON(toSubmissionKey(id), updated)
      return jsonResponse(updated)
    }

    if (req.method === 'DELETE') {
      if (!id) return errorResponse('Missing id parameter')
      await STORE.delete(toSubmissionKey(id))
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
