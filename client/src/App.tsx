import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './lib/auth-context'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'))
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={
          <div className="flex h-[calc(100vh-57px)] items-center justify-center bg-neutral-950">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-neutral-700" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  )
}
