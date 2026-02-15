import type { ThemeConfig, PageCustomization, ResolvedStyles, ButtonStyle } from '../types'

function getButtonRadius(style?: ButtonStyle): string {
  switch (style) {
    case 'pill': return 'rounded-full'
    case 'square': return 'rounded-none'
    case 'outline': return 'rounded-xl'
    case 'rounded':
    default: return 'rounded-xl'
  }
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
