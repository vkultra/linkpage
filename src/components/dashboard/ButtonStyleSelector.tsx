import { cn } from '../../lib/utils'
import type { ButtonStyle } from '../../types'

interface ButtonStyleSelectorProps {
  value: ButtonStyle
  onChange: (style: ButtonStyle) => void
}

const styles: { value: ButtonStyle; label: string; preview: string }[] = [
  { value: 'rounded', label: 'Arredondado', preview: 'rounded-xl' },
  { value: 'pill', label: 'Pílula', preview: 'rounded-full' },
  { value: 'square', label: 'Quadrado', preview: 'rounded-none' },
  { value: 'outline', label: 'Contorno', preview: 'rounded-xl' },
]

export function ButtonStyleSelector({ value, onChange }: ButtonStyleSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300">Estilo dos botões</h3>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => {
          const isOutline = style.value === 'outline'
          return (
            <button
              key={style.value}
              type="button"
              onClick={() => onChange(style.value)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                value === style.value
                  ? 'border-gray-900 bg-gray-50 dark:border-slate-400 dark:bg-slate-700'
                  : 'border-gray-200 hover:border-gray-300 dark:border-slate-600 dark:hover:border-slate-500'
              )}
            >
              <div
                className={cn(
                  'h-8 w-full',
                  style.preview,
                  isOutline
                    ? 'border-2 border-gray-400 bg-transparent dark:border-slate-400'
                    : 'bg-gray-300 dark:bg-slate-500'
                )}
              />
              <span className="text-xs font-medium text-gray-600 dark:text-slate-300">{style.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
