import type { ThemeConfig, PageCustomization, ResolvedStyles, ButtonStyle, ThemeName } from '../types'

function getButtonRadius(style?: ButtonStyle): string {
  switch (style) {
    case 'pill': return 'rounded-full'
    case 'square': return 'rounded-none'
    case 'outline': return 'rounded-xl'
    case 'rounded':
    default: return 'rounded-xl'
  }
}

const profileCardClasses: Record<ThemeName, string> = {
  light: 'bg-white/70 backdrop-blur-sm shadow-lg border border-gray-200/50 rounded-2xl',
  dark: 'bg-gray-900/50 backdrop-blur-sm shadow-lg border border-gray-700/30 rounded-2xl',
  gradient: 'bg-white/10 backdrop-blur-md shadow-lg border border-white/20 rounded-2xl',
  neon: 'bg-gray-900/40 backdrop-blur-sm shadow-lg border border-cyan-500/20 rounded-2xl',
  glassmorphism: 'bg-white/[0.08] backdrop-blur-lg shadow-lg border border-white/15 rounded-2xl',
}

function getProfileCardClass(name: ThemeName): string {
  return profileCardClasses[name] ?? profileCardClasses.light
}

export function resolveStyles(
  theme: ThemeConfig,
  customization?: PageCustomization
): ResolvedStyles {
  const colors = customization?.customColors
  const isOutline = customization?.buttonStyle === 'outline'

  return {
    background: colors?.background
      ? { style: { backgroundColor: colors.background } }
      : { className: theme.background },

    text: colors?.text
      ? { style: { color: colors.text } }
      : { className: theme.text },

    textSecondary: colors?.text
      ? { style: { color: colors.text, opacity: 0.6 } }
      : { className: theme.textSecondary },

    card: (() => {
      if (isOutline) {
        return colors?.cardBackground
          ? { style: { backgroundColor: 'transparent', borderWidth: '2px', borderColor: colors.cardBackground } }
          : { className: `bg-transparent border-2 ${theme.border}` }
      }
      return colors?.cardBackground
        ? { style: { backgroundColor: colors.cardBackground } }
        : { className: theme.card }
    })(),

    cardHover: isOutline ? 'hover:opacity-80' : theme.cardHover,

    profileCard: colors?.cardBackground
      ? { style: { backgroundColor: colors.cardBackground + '1A', backdropFilter: 'blur(12px)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.12)' } }
      : { className: getProfileCardClass(theme.name as ThemeName) },

    avatarBorder: theme.avatarBorder,

    buttonRadius: getButtonRadius(customization?.buttonStyle),

    fontFamily: customization?.fontFamily
      ? getFontStack(customization.fontFamily)
      : undefined,
  }
}

function getFontStack(font: string): string {
  const stacks: Record<string, string> = {
    inter: '"Inter", sans-serif',
    poppins: '"Poppins", sans-serif',
    roboto: '"Roboto", sans-serif',
    playfair: '"Playfair Display", serif',
    'space-grotesk': '"Space Grotesk", sans-serif',
    'dm-sans': '"DM Sans", sans-serif',
    outfit: '"Outfit", sans-serif',
    sora: '"Sora", sans-serif',
  }
  return stacks[font] ?? stacks.inter
}
