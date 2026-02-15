import { X } from 'lucide-react'

interface ColorPickerProps {
  label: string
  value?: string
  defaultValue: string
  onChange: (color: string | undefined) => void
}

export function ColorPicker({ label, value, defaultValue, onChange }: ColorPickerProps) {
  const displayColor = value ?? defaultValue
  const hasCustom = value !== undefined

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <label className="relative cursor-pointer">
          <input
            type="color"
            value={displayColor}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-0 w-0 opacity-0"
          />
          <div
            className="h-8 w-8 rounded-lg border border-gray-300 shadow-sm transition-shadow hover:shadow-md"
            style={{ backgroundColor: displayColor }}
          />
        </label>
        {hasCustom && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Resetar para padrão"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
