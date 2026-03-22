import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { corsHeaders, jsonResponse, errorResponse } from './utils/supabase.ts'

export default async function handler(req: Request, _context: Context) {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: corsHeaders() })
  }

  try {
    const store = getStore('images')
    const url = new URL(req.url)

    /* ── GET: serve an image by key ── */
    if (req.method === 'GET') {
      const key = url.searchParams.get('key')
      if (!key) return errorResponse('Missing key parameter')

      const result = await store.getWithMetadata(key, { type: 'arrayBuffer' })
      if (!result) return errorResponse('Not found', 404)

      return new Response(result.data as ArrayBuffer, {
        status: 200,
        headers: {
          ...corsHeaders(),
          'Content-Type': String(result.metadata?.contentType || 'application/octet-stream'),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    /* ── POST: upload an image ── */
    if (req.method === 'POST') {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      if (!file) return errorResponse('No file provided')

      const ext = file.name.split('.').pop() || 'bin'
      const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const buffer = await file.arrayBuffer()

      await store.set(key, buffer, {
        metadata: { contentType: file.type, originalName: file.name },
      })

      const imageUrl = `/.netlify/functions/admin-images?key=${encodeURIComponent(key)}`
      return jsonResponse({ url: imageUrl, key })
    }

    /* ── DELETE: remove an image by key ── */
    if (req.method === 'DELETE') {
      const key = url.searchParams.get('key')
      if (!key) return errorResponse('Missing key parameter')
      await store.delete(key)
      return jsonResponse({ success: true })
    }

    return errorResponse('Method not allowed', 405)
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
