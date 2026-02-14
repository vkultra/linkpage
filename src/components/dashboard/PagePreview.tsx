import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { getTheme } from '../../themes'
import type { Link, ThemeName } from '../../types'
import { getFaviconUrl } from '../../lib/utils'
import { ExternalLink } from 'lucide-react'

interface PagePreviewProps {
  title: string
  bio: string
  theme: ThemeName
  avatarUrl?: string | null
  links: Link[]
}

export function PagePreview({ title, bio, theme: themeName, avatarUrl, links }: PagePreviewProps) {
  const theme = getTheme(themeName)
  const activeLinks = links.filter((l) => l.is_active)

  return (
    <div className="flex justify-center">
      <div className="w-[280px] overflow-hidden rounded-[2rem] border-4 border-gray-800 bg-gray-800 shadow-xl">
        {/* Phone notch */}
        <div className="flex justify-center bg-gray-800 py-2">
          <div className="h-4 w-20 rounded-full bg-gray-700" />
        </div>

        {/* Screen */}
        <div className={cn('h-[500px] overflow-y-auto px-4 py-6', theme.background)}>
          <div className="flex flex-col items-center text-center">
            <Avatar
              src={avatarUrl}
              size="lg"
              className={cn('mb-3 ring-2', theme.avatarBorder)}
            />
            <h2 className={cn('text-sm font-bold', theme.text)}>
              {title || 'Título da página'}
            </h2>
            {bio && (
              <p className={cn('mt-1 text-xs', theme.textSecondary)}>
                {bio.slice(0, 100)}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {activeLinks.length === 0 ? (
              <div className={cn('rounded-lg px-3 py-3 text-center text-xs', theme.card, theme.textSecondary)}>
                Adicione links para visualizar
              </div>
            ) : (
              activeLinks.map((link) => (
                <div
                  key={link.id}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all',
                    theme.card
                  )}
                >
                  <img
                    src={getFaviconUrl(link.url)}
                    alt=""
                    className="h-3.5 w-3.5 flex-shrink-0"
                  />
                  <span className={cn('flex-1 text-center text-xs font-medium', theme.text)}>
                    {link.title}
                  </span>
                  <ExternalLink className={cn('h-3 w-3 flex-shrink-0', theme.textSecondary)} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
