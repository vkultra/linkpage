import type { FontFamily } from '../types'

interface FontEntry {
  label: string
  family: string
  weights: string
  category: string
}

export const fontRegistry: Record<FontFamily, FontEntry> = {
  inter: {
    label: 'Inter',
    family: 'Inter',
    weights: '400;500;600;700',
    category: 'Sans-serif',
  },
  poppins: {
    label: 'Poppins',
    family: 'Poppins',
    weights: '400;500;600;700',
    category: 'Sans-serif',
  },
  roboto: {
    label: 'Roboto',
    family: 'Roboto',
    weights: '400;500;700',
    category: 'Sans-serif',
  },
  playfair: {
    label: 'Playfair Display',
    family: 'Playfair Display',
    weights: '400;600;700',
    category: 'Serif',
  },
  'space-grotesk': {
    label: 'Space Grotesk',
    family: 'Space Grotesk',
    weights: '400;500;600;700',
    category: 'Sans-serif',
  },
  'dm-sans': {
    label: 'DM Sans',
    family: 'DM Sans',
    weights: '400;500;600;700',
    category: 'Sans-serif',
  },
  outfit: {
    label: 'Outfit',
    family: 'Outfit',
    weights: '400;500;600;700',
    category: 'Sans-serif',
  },
  sora: {
    label: 'Sora',
    family: 'Sora',
    weights: '400;500;600;700',
    category: 'Sans-serif',
  },
}

export const fontOptions = Object.entries(fontRegistry).map(([key, entry]) => ({
  value: key as FontFamily,
  label: entry.label,
  category: entry.category,
}))

const loadedFonts = new Set<string>()

export function loadFont(font: FontFamily): void {
  if (font === 'inter' || loadedFonts.has(font)) return

  const entry = fontRegistry[font]
  if (!entry) return

  loadedFonts.add(font)

  const familyParam = entry.family.replace(/ /g, '+')
  const url = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${entry.weights}&display=swap`

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}
