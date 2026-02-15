import type { ThemeConfig } from '../types'

export const glassmorphismTheme: ThemeConfig = {
  name: 'glassmorphism',
  label: 'Glass',
  background: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600',
  card: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg',
  cardHover: 'hover:bg-white/20 hover:shadow-xl',
  text: 'text-white',
  textSecondary: 'text-white/70',
  border: 'border-white/20',
  accent: 'bg-white/25 backdrop-blur-sm text-white border border-white/30',
  avatarBorder: 'ring-white/30',
  themeColor: '#6366f1',
}
