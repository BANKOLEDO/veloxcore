import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate(searchParams.get('redirect') || '/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-neutral-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-700">get started</span>
          <h1 className="mt-2 text-xl font-medium text-white">Create account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Name</label>
            <input
              className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
              value={name} onChange={(e) => setName(e.target.value)} required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Email</label>
            <input
              className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-neutral-600">Password</label>
            <input
              className="w-full border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none transition-colors hover:border-neutral-600 focus:border-white"
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full border border-white bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-700">
          Already have an account?{' '}
          <Link to="/login" className="text-neutral-500 underline underline-offset-2 hover:text-white">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
