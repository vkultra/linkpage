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

// --- Customization types ---

export interface CustomColors {
  background?: string
  text?: string
  cardBackground?: string
  cardText?: string
}

export type ButtonStyle = 'rounded' | 'pill' | 'square' | 'outline'

export type FontFamily = 'inter' | 'poppins' | 'roboto' | 'playfair' | 'space-grotesk' | 'dm-sans' | 'outfit' | 'sora'

export interface SocialLink {
  platform: string
  url: string
}

export interface PageCustomization {
  customColors?: CustomColors
  buttonStyle?: ButtonStyle
  fontFamily?: FontFamily
  socialLinks?: SocialLink[]
}

export type LinkType = 'link' | 'header'

// --- Resolved styles (runtime) ---

export interface StyleProp {
  className?: string
  style?: React.CSSProperties
}

export interface ResolvedStyles {
  background: StyleProp
  text: StyleProp
  textSecondary: StyleProp
  card: StyleProp
  cardHover: string
  avatarBorder: string
  buttonRadius: string
  fontFamily?: string
}
