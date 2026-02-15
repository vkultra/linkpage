import { ThemePreview } from '../ui/ThemePreview'
import { themeNames } from '../../themes'
import type { ThemeName } from '../../types'

interface ThemeSelectorProps {
  value: ThemeName
  onChange: (theme: ThemeName) => void
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">Tema</label>
      <div className="flex flex-wrap gap-2">
        {themeNames.map((name) => (
          <ThemePreview
            key={name}
            themeName={name}
            selected={value === name}
            onClick={() => onChange(name)}
          />
        ))}
      </div>
    </div>
  )
}
