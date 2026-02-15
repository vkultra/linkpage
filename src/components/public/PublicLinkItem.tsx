import { cn } from '../../lib/utils'
import { getFaviconUrl } from '../../lib/utils'
import type { ResolvedStyles } from '../../types'
import { ExternalLink } from 'lucide-react'

interface PublicLinkItemProps {
  title: string
  url: string
  resolved: ResolvedStyles
}

export function PublicLinkItem({ title, url, resolved }: PublicLinkItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 px-5 py-4 transition-all duration-200',
        resolved.buttonRadius,
        resolved.card.className,
        resolved.cardHover
      )}
      style={resolved.card.style}
    >
      <img
        src={getFaviconUrl(url)}
        alt=""
        className="h-5 w-5 flex-shrink-0"
        loading="lazy"
      />
      <span
        className={cn('flex-1 text-center font-medium', resolved.text.className)}
        style={resolved.card.style?.borderColor ? resolved.text.style : (resolved.card.style?.backgroundColor ? { color: resolved.text.style?.color } : undefined)}
      >
        {title}
      </span>
      <ExternalLink
        className="h-4 w-4 flex-shrink-0"
        style={resolved.textSecondary.style}
      />
    </a>
  )
}
