import { cn } from '../../lib/utils'
import { fontOptions, loadFont } from '../../lib/fonts'
import type { FontFamily } from '../../types'
import { useEffect } from 'react'

interface FontSelectorProps {
  value: FontFamily
  onChange: (font: FontFamily) => void
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  // Pre-load all fonts for preview
  useEffect(() => {
    fontOptions.forEach((f) => loadFont(f.value))
  }, [])

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300">Fonte</h3>
      <div className="grid grid-cols-2 gap-2">
        {fontOptions.map((font) => (
          <button
            key={font.value}
            type="button"
            onClick={() => onChange(font.value)}
            className={cn(
              'rounded-lg border-2 px-3 py-2.5 text-left transition-all',
              value === font.value
                ? 'border-gray-900 bg-gray-50 dark:border-slate-400 dark:bg-slate-700'
                : 'border-gray-200 hover:border-gray-300 dark:border-slate-600 dark:hover:border-slate-500'
            )}
          >
            <span
              className="block text-sm font-semibold text-gray-900 dark:text-slate-100"
              style={{ fontFamily: `"${font.label}", sans-serif` }}
            >
              {font.label}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">{font.category}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
