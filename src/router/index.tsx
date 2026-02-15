import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DashboardThemeProvider } from '../contexts/DashboardThemeContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { getSubdomainUsername } from '../lib/subdomain'

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })))
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const PageEditorPage = lazy(() => import('../pages/PageEditorPage').then((m) => ({ default: m.PageEditorPage })))
const ProfileSettingsPage = lazy(() => import('../pages/ProfileSettingsPage').then((m) => ({ default: m.ProfileSettingsPage })))
const StatsPage = lazy(() => import('../pages/StatsPage').then((m) => ({ default: m.StatsPage })))
const PublicLandingPage = lazy(() => import('../pages/PublicLandingPage').then((m) => ({ default: m.PublicLandingPage })))
const NotFound = lazy(() => import('../components/public/NotFound').then((m) => ({ default: m.NotFound })))

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
