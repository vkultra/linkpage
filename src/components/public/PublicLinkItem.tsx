import { cn } from '../../lib/utils'
import { getFaviconUrl } from '../../lib/utils'
import type { ThemeConfig } from '../../types'
import { ExternalLink } from 'lucide-react'

interface PublicLinkItemProps {
  title: string
  url: string
  theme: ThemeConfig
}

export function PublicLinkItem({ title, url, theme }: PublicLinkItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-200',
        theme.card,
        theme.cardHover
      )}
    >
      <img
        src={getFaviconUrl(url)}
        alt=""
        className="h-5 w-5 flex-shrink-0"
        loading="lazy"
      />
      <span className={cn('flex-1 text-center font-medium', theme.text)}>
        {title}
      </span>
      <ExternalLink className={cn('h-4 w-4 flex-shrink-0', theme.textSecondary)} />
    </a>
  )
}
