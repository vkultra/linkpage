import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DashboardPage } from '../pages/DashboardPage'
import { PageEditorPage } from '../pages/PageEditorPage'
import { ProfileSettingsPage } from '../pages/ProfileSettingsPage'
import { PublicLandingPage } from '../pages/PublicLandingPage'
import { NotFound } from '../components/public/NotFound'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/pages/:pageId" element={<PageEditorPage />} />
            <Route path="/dashboard/settings" element={<ProfileSettingsPage />} />
          </Route>
        </Route>

        {/* Landing pages públicas - DEVE ficar por último */}
        <Route path="/:username" element={<PublicLandingPage />} />
        <Route path="/:username/:slug" element={<PublicLandingPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
