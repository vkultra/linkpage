import { createContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface DashboardThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

export const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(null)

const STORAGE_KEY = 'rapli-dashboard-theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, theme)

    return () => {
      root.classList.remove('dark')
    }
  }, [theme])

  function setTheme(t: Theme) {
    setThemeState(t)
  }

  function toggleTheme() {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <DashboardThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  )
}
