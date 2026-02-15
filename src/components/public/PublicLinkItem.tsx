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
        'flex min-h-[52px] items-center gap-3 px-5 py-4 shadow-sm transition-all duration-200 active:scale-[0.98]',
        resolved.buttonRadius,
        resolved.card.className,
        resolved.cardHover
      )}
      style={resolved.card.style}
    >
      <img
        src={getFaviconUrl(url)}
        alt=""
        className="h-6 w-6 flex-shrink-0 rounded-sm"
        loading="lazy"
      />
      <span
        className={cn('flex-1 text-center text-[15px] font-medium', resolved.text.className)}
        style={resolved.card.style?.borderColor ? resolved.text.style : (resolved.card.style?.backgroundColor ? { color: resolved.text.style?.color } : undefined)}
      >
        {title}
      </span>
      <ExternalLink
        className="h-4 w-4 flex-shrink-0 opacity-50"
        style={resolved.textSecondary.style}
      />
    </a>
  )
}
