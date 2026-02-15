import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type LandingPage = Database['public']['Tables']['landing_pages']['Row']
export type Link = Database['public']['Tables']['links']['Row']
export type FacebookPixel = Database['public']['Tables']['facebook_pixels']['Row']
export type FacebookPixelSafe = Omit<FacebookPixel, 'access_token'>

export type FacebookEventName =
  | 'PageView'
  | 'Lead'
  | 'ViewContent'
  | 'Purchase'
  | 'Contact'
  | 'CompleteRegistration'
  | 'AddToCart'
  | 'Search'

export const FACEBOOK_EVENTS: { value: FacebookEventName; label: string }[] = [
  { value: 'PageView', label: 'Visualização de Página' },
  { value: 'Lead', label: 'Lead' },
  { value: 'ViewContent', label: 'Visualização de Conteúdo' },
  { value: 'Purchase', label: 'Compra' },
  { value: 'Contact', label: 'Contato' },
  { value: 'CompleteRegistration', label: 'Registro Completo' },
  { value: 'AddToCart', label: 'Adicionar ao Carrinho' },
  { value: 'Search', label: 'Busca' },
]

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
  themeColor: string
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

// --- Analytics types ---

export interface AnalyticsSummary {
  total_views: number
  unique_visitors: number
  total_clicks: number
  unique_clickers: number
}

export interface ViewByDay {
  day: string
  views: number
  unique_views: number
}

export interface TopLink {
  link_id: string
  title: string
  clicks: number
}

export interface HourlyData {
  hour: number
  views: number
}

export interface GeoData {
  region: string
  views: number
  unique_views: number
}

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
  profileCard: StyleProp
  avatarBorder: string
  buttonRadius: string
  fontFamily?: string
}
