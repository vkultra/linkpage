import type { SocialLink, StyleProp } from '../../types'
import { getPlatform } from '../../lib/social-platforms'

interface SocialIconsBarProps {
  links: SocialLink[]
  textStyle: StyleProp
}

export function SocialIconsBar({ links, textStyle }: SocialIconsBarProps) {
  if (links.length === 0) return null

  return (
    <div className="mb-6 flex flex-wrap justify-center gap-3">
      {links.map((link) => {
        const platform = getPlatform(link.platform)
        if (!platform) return null

        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110 hover:opacity-80"
            style={{
              backgroundColor: textStyle.style?.color
                ? textStyle.style.color + '15'
                : undefined,
            }}
            title={platform.label}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill={textStyle.style?.color ?? 'currentColor'}
            >
              <path d={platform.icon} />
            </svg>
          </a>
        )
      })}
    </div>
  )
}
