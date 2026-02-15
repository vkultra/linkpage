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
      <h3 className="text-sm font-medium text-gray-700">Estilo dos botões</h3>
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
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div
                className={cn(
                  'h-8 w-full',
                  style.preview,
                  isOutline
                    ? 'border-2 border-gray-400 bg-transparent'
                    : 'bg-gray-300'
                )}
              />
              <span className="text-xs font-medium text-gray-600">{style.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
