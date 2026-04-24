import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useEffect, useState } from 'react'
import { ShieldCheck, LogIn, UserPlus, AlertCircle } from 'lucide-react'
import {
  getAdminSession,
  getAdminStatus,
  loginAdmin,
  registerFirstAdmin,
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
  const [hasAdmin, setHasAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    async function bootstrap() {
      try {
        const [status, session] = await Promise.all([getAdminStatus(), getAdminSession()])

        setHasAdmin(status.hasAdmin)
        setAdminEmail(status.adminEmail)
        setLoginForm((prev) => ({ ...prev, email: status.adminEmail || prev.email }))

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

  async function onRegisterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const result = await registerFirstAdmin({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      })

      setHasAdmin(true)
      setAdminEmail(result.email)
      setLoginForm({ email: result.email, password: '' })
      setMessage(
        result.requiresEmailConfirmation
          ? 'Admin registered. Confirm the email first, then login.'
          : 'Admin registered successfully. You can now login.',
      )
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' })
    } catch (err) {
      setError(toAdminAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function onLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)
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
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-black">Admin Access</h1>
            <p className="text-sm text-gray-500">
              {hasAdmin ? 'Login to continue to the admin panel.' : 'Register the first admin account before login.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 text-sm rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
            {message}
          </div>
        )}

        {!hasAdmin ? (
          <form onSubmit={onRegisterSubmit} className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Full Name</label>
              <input
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Admin Email</label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Password</label>
              <input
                type="password"
                minLength={8}
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Confirm Password</label>
              <input
                type="password"
                minLength={8}
                required
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              <UserPlus size={16} />
              {submitting ? 'Creating Admin...' : 'Register Admin'}
            </button>
          </form>
        ) : (
          <form onSubmit={onLoginSubmit} className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Admin Email</label>
              <input
                type="email"
                required
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
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            {adminEmail && (
              <p className="text-xs text-gray-500">
                Admin account: <span className="font-medium text-gray-700">{adminEmail}</span>
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              <LogIn size={16} />
              {submitting ? 'Signing In...' : 'Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
