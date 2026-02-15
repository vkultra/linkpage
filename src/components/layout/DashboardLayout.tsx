import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDashboardTheme } from '../../hooks/useDashboardTheme'
import { signOut } from '../../services/auth.service'
import { LinkIcon, LayoutDashboard, BarChart3, Settings, LogOut, Sun, Moon } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import toast from 'react-hot-toast'

export function DashboardLayout() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useDashboardTheme()
  const navigate = useNavigate()

  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch {
      setSigningOut(false)
      toast.error('Erro ao sair')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-slate-700/50 dark:bg-slate-800">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 dark:bg-slate-50">
              <LinkIcon className="h-4 w-4 text-white dark:text-slate-900" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-slate-50">rapli.io</span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-slate-50'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Páginas</span>
            </NavLink>
            <NavLink
              to="/dashboard/stats"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-slate-50'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`
              }
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Estatísticas</span>
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-slate-50'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`
              }
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </NavLink>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{signingOut ? 'Saindo...' : 'Sair'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Avatar
              src={user?.user_metadata?.avatar_url}
              size="sm"
              className="ml-2"
            />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
