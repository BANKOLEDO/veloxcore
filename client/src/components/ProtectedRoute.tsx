import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, token } = useAuth()
  const location = useLocation()

  // No token at all — definitely need login
  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  // Token exists but user not loaded yet — don't redirect, show loading
  if (!user) {
    return (
      <div className="flex h-[calc(100vh-57px)] items-center justify-center bg-neutral-950">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-neutral-700" />
      </div>
    )
  }

  return <>{children}</>
}
