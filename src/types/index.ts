import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type LandingPage = Database['public']['Tables']['landing_pages']['Row']
export type Link = Database['public']['Tables']['links']['Row']

export type ThemeName = 'light' | 'dark' | 'gradient' | 'neon' | 'glassmorphism'

export interface ThemeConfig {
  name: ThemeName
  label: string
  background: string
  card: string
  cardHover: string
  text: string
  textSecondary: string
  border: string
  accent: string
  avatarBorder: string
}
