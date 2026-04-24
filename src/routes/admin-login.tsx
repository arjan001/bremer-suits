import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useEffect, useState } from 'react'
import { ShieldCheck, LogIn, AlertCircle, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react'
import {
  getAdminSession,
  loginAdmin,
  requestAdminPasswordReset,
  toAdminAuthError,
} from '@/lib/admin-auth'

export const Route = createFileRoute('/admin-login')({
  head: () => ({
    meta: [
      { title: 'Admin Login | Bremer Suits' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    async function bootstrap() {
      try {
        const session = await getAdminSession()
        if (session.isAdmin) {
          navigate({ to: '/admin' })
          return
        }
      } catch (err) {
        setError(toAdminAuthError(err))
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [navigate])

  async function onLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await loginAdmin(loginForm.email, loginForm.password)
      await navigate({ to: '/admin' })
    } catch (err) {
      setError(toAdminAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function onResetSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await requestAdminPasswordReset(resetEmail)
      setResetSent(true)
    } catch (err) {
      setError(toAdminAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Preparing admin access...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            {mode === 'login' ? <ShieldCheck size={18} /> : <KeyRound size={18} />}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-black">
              {mode === 'login' ? 'Admin Access' : 'Reset Password'}
            </h1>
            <p className="text-sm text-gray-500">
              {mode === 'login'
                ? 'Login to continue to the admin panel.'
                : 'Enter your admin email to receive a reset link.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={onLoginSubmit} className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Admin Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              <LogIn size={16} />
              {submitting ? 'Signing In...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('reset')
                setError(null)
                setResetSent(false)
                setResetEmail(loginForm.email)
              }}
              className="w-full text-center text-sm text-gray-500 hover:text-black pt-2"
            >
              Forgot password?
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={onResetSubmit} className="space-y-3">
            {resetSent ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-700 flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 shrink-0" />
                <span>If an admin account matches this email, a password reset link has been sent.</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs uppercase tracking-wide text-gray-500">Admin Email</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  <KeyRound size={16} />
                  {submitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError(null)
              }}
              className="w-full text-center text-sm text-gray-500 hover:text-black pt-2 inline-flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} /> Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
