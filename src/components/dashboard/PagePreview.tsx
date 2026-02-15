import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { getTheme } from '../../themes'
import { resolveStyles } from '../../themes/resolve'
import type { Link, ThemeName, PageCustomization, SocialLink } from '../../types'
import { getFaviconUrl } from '../../lib/utils'
import { ExternalLink } from 'lucide-react'
import { getPlatform } from '../../lib/social-platforms'

interface PagePreviewProps {
  title: string
  bio: string
  theme: ThemeName
  avatarUrl?: string | null
  links: Link[]
  customization?: PageCustomization
  socialLinks?: SocialLink[]
}

export function PagePreview({ title, bio, theme: themeName, avatarUrl, links, customization, socialLinks = [] }: PagePreviewProps) {
  const theme = getTheme(themeName)
  const resolved = resolveStyles(theme, customization)
  const activeLinks = links.filter((l) => l.is_active)

  return (
    <div className="flex justify-center">
      <div className="w-[280px] overflow-hidden rounded-[2rem] border-4 border-gray-800 bg-gray-800 shadow-xl">
        {/* Phone notch */}
        <div className="flex justify-center bg-gray-800 py-2">
          <div className="h-4 w-20 rounded-full bg-gray-700" />
        </div>

        {/* Screen */}
        <div
          className={cn('h-[500px] overflow-y-auto px-4 py-6', resolved.background.className)}
          style={{ ...resolved.background.style, fontFamily: resolved.fontFamily }}
        >
          <div className="flex flex-col items-center text-center">
            <Avatar
              src={avatarUrl}
              size="lg"
              className={cn('mb-3 ring-2', resolved.avatarBorder)}
            />
            <h2
              className={cn('text-sm font-bold', resolved.text.className)}
              style={resolved.text.style}
            >
              {title || 'Título da página'}
            </h2>
            {bio && (
              <p
                className={cn('mt-1 text-xs', resolved.textSecondary.className)}
                style={resolved.textSecondary.style}
              >
                {bio.slice(0, 100)}
              </p>
            )}
          </div>

          {/* Social icons mini */}
          {socialLinks.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {socialLinks.map((link) => {
                const platform = getPlatform(link.platform)
                if (!platform) return null
                return (
                  <div
                    key={link.platform}
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: resolved.text.style?.color ? resolved.text.style.color + '15' : undefined }}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={resolved.text.style?.color ?? 'currentColor'}>
                      <path d={platform.icon} />
                    </svg>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-4 space-y-2">
            {activeLinks.length === 0 ? (
              <div
                className={cn('rounded-lg px-3 py-3 text-center text-xs', resolved.card.className, resolved.textSecondary.className)}
                style={{ ...resolved.card.style, ...resolved.textSecondary.style }}
              >
                Adicione links para visualizar
              </div>
            ) : (
              activeLinks.map((link) => {
                if (link.type === 'header') {
                  return (
                    <div key={link.id} className="pt-3 pb-0.5">
                      <p
                        className={cn('text-center text-[10px] font-semibold uppercase tracking-wider', resolved.textSecondary.className)}
                        style={resolved.textSecondary.style}
                      >
                        {link.title}
                      </p>
                    </div>
                  )
                }

                return (
                  <div
                    key={link.id}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 transition-all',
                      resolved.buttonRadius,
                      resolved.card.className
                    )}
                    style={resolved.card.style}
                  >
                    <img
                      src={getFaviconUrl(link.url)}
                      alt=""
                      className="h-3.5 w-3.5 flex-shrink-0"
                    />
                    <span
                      className={cn('flex-1 text-center text-xs font-medium', resolved.text.className)}
                      style={resolved.text.style}
                    >
                      {link.title}
                    </span>
                    <ExternalLink
                      className="h-3 w-3 flex-shrink-0"
                      style={resolved.textSecondary.style}
                    />
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
