import { cn } from '../../lib/utils'
import { getTheme } from '../../themes'
import type { ThemeName } from '../../types'

interface ThemePreviewProps {
  themeName: ThemeName
  selected?: boolean
  onClick?: () => void
}

export function ThemePreview({ themeName, selected = false, onClick }: ThemePreviewProps) {
  const theme = getTheme(themeName)

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all',
        selected
          ? 'ring-2 ring-gray-900 ring-offset-2'
          : 'hover:bg-gray-100'
      )}
    >
      <div
        className={cn(
          'flex h-16 w-24 flex-col items-center justify-center gap-1 rounded-md',
          theme.background
        )}
      >
        <div className={cn('h-4 w-4 rounded-full', theme.accent)} />
        <div className={cn('h-1.5 w-12 rounded-full', theme.card)} />
        <div className={cn('h-1.5 w-10 rounded-full', theme.card)} />
      </div>
      <span className="text-xs font-medium text-gray-700">{theme.label}</span>
    </button>
  )
}
