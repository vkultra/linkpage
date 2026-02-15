import type { CustomColors, ThemeConfig } from '../../types'
import { ColorPicker } from './ColorPicker'

interface CustomColorEditorProps {
  colors: CustomColors
  theme: ThemeConfig
  onChange: (colors: CustomColors) => void
}

// Maps Tailwind class to approximate hex for color picker default
const twColorMap: Record<string, string> = {
  'bg-gray-50': '#f9fafb',
  'bg-gray-900': '#111827',
  'bg-gray-950': '#030712',
  'bg-white': '#ffffff',
  'bg-white/10': '#ffffff1a',
  'bg-white/5': '#ffffff0d',
  'text-gray-900': '#111827',
  'text-gray-500': '#6b7280',
  'text-white': '#ffffff',
  'text-white/90': '#ffffffe6',
  'text-white/60': '#ffffff99',
  'text-emerald-400': '#34d399',
  'text-gray-100': '#f3f4f6',
  'text-gray-400': '#9ca3af',
}

function extractColor(classes: string, fallback: string): string {
  const parts = classes.split(' ')
  for (const part of parts) {
    if (twColorMap[part]) return twColorMap[part]
  }
  return fallback
}

export function CustomColorEditor({ colors, theme, onChange }: CustomColorEditorProps) {
  function set(key: keyof CustomColors, value: string | undefined) {
    const updated = { ...colors }
    if (value === undefined) {
      delete updated[key]
    } else {
      updated[key] = value
    }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Cores personalizadas</h3>
      <div className="space-y-2.5 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
        <ColorPicker
          label="Fundo"
          value={colors.background}
          defaultValue={extractColor(theme.background, '#f9fafb')}
          onChange={(v) => set('background', v)}
        />
        <ColorPicker
          label="Texto"
          value={colors.text}
          defaultValue={extractColor(theme.text, '#111827')}
          onChange={(v) => set('text', v)}
        />
        <ColorPicker
          label="Card (fundo)"
          value={colors.cardBackground}
          defaultValue={extractColor(theme.card, '#ffffff')}
          onChange={(v) => set('cardBackground', v)}
        />
        <ColorPicker
          label="Card (texto)"
          value={colors.cardText}
          defaultValue={extractColor(theme.text, '#111827')}
          onChange={(v) => set('cardText', v)}
        />
      </div>
    </div>
  )
}
