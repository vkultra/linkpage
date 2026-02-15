import type { ThemeConfig } from '../types'

export const gradientTheme: ThemeConfig = {
  name: 'gradient',
  label: 'Gradiente',
  background: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
  card: 'bg-white/20 backdrop-blur-sm border border-white/30',
  cardHover: 'hover:bg-white/30 hover:shadow-lg',
  text: 'text-white',
  textSecondary: 'text-white/80',
  border: 'border-white/30',
  accent: 'bg-white text-purple-700',
  avatarBorder: 'ring-white/50',
  themeColor: '#9333ea',
}
