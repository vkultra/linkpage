import type { ThemeConfig, ThemeName } from '../types'
import { lightTheme } from './light'
import { darkTheme } from './dark'
import { gradientTheme } from './gradient'
import { neonTheme } from './neon'
import { glassmorphismTheme } from './glassmorphism'

const themes: Record<ThemeName, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  gradient: gradientTheme,
  neon: neonTheme,
  glassmorphism: glassmorphismTheme,
}

export const themeNames = Object.keys(themes) as ThemeName[]

export function getTheme(name: string): ThemeConfig {
  return themes[name as ThemeName] ?? themes.light
}
