import { useContext } from 'react'
import { DashboardThemeContext } from '../contexts/DashboardThemeContext'

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext)
  if (!ctx) throw new Error('useDashboardTheme must be used within DashboardThemeProvider')
  return ctx
}
