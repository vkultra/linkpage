import { useState } from 'react'
import { Globe } from 'lucide-react'
import { cn, getFaviconUrl } from '../../lib/utils'
import { getPlatform } from '../../lib/social-platforms'

function getPlatformFromTitle(title?: string) {
  if (!title) return undefined
  const lower = title.toLowerCase()
  const keywords = ['whatsapp', 'instagram', 'youtube', 'tiktok', 'twitter', 'spotify', 'linkedin', 'github', 'telegram', 'discord', 'twitch']
  for (const keyword of keywords) {
    if (lower.includes(keyword)) return getPlatform(keyword)
  }
  return undefined
}

interface LinkFaviconProps {
  url?: string
  domain?: string
  title?: string
  className?: string
}

export function LinkFavicon({ url, domain, title, className = 'h-5 w-5' }: LinkFaviconProps) {
  const [failed, setFailed] = useState(false)
  const platform = getPlatformFromTitle(title)

  // Known platform matched by title → render branded SVG icon with colored background
  if (platform) {
    return (
      <div
        className={cn('flex flex-shrink-0 items-center justify-center rounded', className)}
        style={{ backgroundColor: platform.color }}
      >
        <svg className="h-[60%] w-[60%]" viewBox="0 0 24 24" fill="white">
          <path d={platform.icon} />
        </svg>
      </div>
    )
  }

  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : url
      ? getFaviconUrl(url)
      : ''

  if (failed || !faviconUrl) {
    return <Globe className={cn('flex-shrink-0 opacity-40', className)} />
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      width={20}
      height={20}
      className={cn('flex-shrink-0 rounded-sm object-contain', className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
