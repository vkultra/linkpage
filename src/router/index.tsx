import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DashboardThemeProvider } from '../contexts/DashboardThemeContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { getSubdomainUsername } from '../lib/subdomain'

// Retry dynamic import with page reload on chunk load failure (stale deploy)
function lazyRetry<T extends Record<string, unknown>>(
  factory: () => Promise<T>,
): Promise<T> {
  return factory()
    .then((module) => {
      sessionStorage.removeItem('chunk_retry')
      return module
    })
    .catch((err: unknown) => {
      const alreadyRetried = sessionStorage.getItem('chunk_retry')
      if (!alreadyRetried) {
        sessionStorage.setItem('chunk_retry', '1')
        window.location.reload()
      }
      throw err
    })
}

const HomePage = lazy(() => lazyRetry(() => import('../pages/HomePage')).then((m) => ({ default: m.HomePage })))
const LoginPage = lazy(() => lazyRetry(() => import('../pages/LoginPage')).then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => lazyRetry(() => import('../pages/RegisterPage')).then((m) => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => lazyRetry(() => import('../pages/DashboardPage')).then((m) => ({ default: m.DashboardPage })))
const PageEditorPage = lazy(() => lazyRetry(() => import('../pages/PageEditorPage')).then((m) => ({ default: m.PageEditorPage })))
const ProfileSettingsPage = lazy(() => lazyRetry(() => import('../pages/ProfileSettingsPage')).then((m) => ({ default: m.ProfileSettingsPage })))
const StatsPage = lazy(() => lazyRetry(() => import('../pages/StatsPage')).then((m) => ({ default: m.StatsPage })))
const PublicLandingPage = lazy(() => lazyRetry(() => import('../pages/PublicLandingPage')).then((m) => ({ default: m.PublicLandingPage })))
const NotFound = lazy(() => lazyRetry(() => import('../components/public/NotFound')).then((m) => ({ default: m.NotFound })))

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}

export function AppRouter() {
  const subdomainUser = getSubdomainUsername()

  // Subdomínio (ex: vkultra.rapli.io) → apenas rotas públicas
  if (subdomainUser) {
    return (
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<PublicLandingPage username={subdomainUser} />} />
            <Route path="/:slug" element={<PublicLandingPage username={subdomainUser} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    )
  }

  // Domínio principal (rapli.io) ou localhost → app completo
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardThemeProvider><DashboardLayout /></DashboardThemeProvider>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/pages/:pageId" element={<PageEditorPage />} />
              <Route path="/dashboard/stats" element={<StatsPage />} />
              <Route path="/dashboard/settings" element={<ProfileSettingsPage />} />
            </Route>
          </Route>

          {/* Fallback: landing pages por path (dev local + compatibilidade) */}
          <Route path="/:username" element={<PublicLandingPage />} />
          <Route path="/:username/:slug" element={<PublicLandingPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
