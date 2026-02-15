import { memo, useMemo } from 'react'
import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { getTheme } from '../../themes'
import { resolveStyles } from '../../themes/resolve'
import type { Link, ThemeName, PageCustomization, SocialLink } from '../../types'
import { ExternalLink } from 'lucide-react'
import { LinkFavicon } from '../ui/LinkFavicon'
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

function PagePreviewInner({ title, bio, theme: themeName, avatarUrl, links, customization, socialLinks = [] }: PagePreviewProps) {
  const theme = getTheme(themeName)
  const resolved = resolveStyles(theme, customization)
  const activeLinks = useMemo(() => links.filter((l) => l.is_active), [links])

  return (
    <div className="flex justify-center">
      <div className="w-[280px] overflow-hidden rounded-[2rem] border-4 border-gray-800 bg-gray-800 shadow-xl">
        {/* Phone notch */}
        <div className="flex justify-center bg-gray-800 py-2">
          <div className="h-4 w-20 rounded-full bg-gray-700" />
        </div>

        {/* Screen */}
        <div
          className={cn('h-[500px] overflow-y-auto px-3 pt-8 pb-4', resolved.background.className)}
          style={{ ...resolved.background.style, fontFamily: resolved.fontFamily }}
        >
          {/* Avatar — floats above profile card */}
          <div className="relative z-10 flex justify-center">
            <Avatar
              src={avatarUrl}
              size="lg"
              className={cn('shadow-md ring-2', resolved.avatarBorder)}
            />
          </div>

          {/* Profile Card — overlaps avatar */}
          <div
            className={cn(
              '-mt-10 px-3 pt-14 pb-4 text-center',
              resolved.profileCard.className
            )}
            style={resolved.profileCard.style}
          >
            <h2
              className={cn('text-sm font-bold', resolved.text.className)}
              style={resolved.text.style}
            >
              {title || 'Titulo da pagina'}
            </h2>
            {bio && (
              <p
                className={cn('mt-1 text-xs line-clamp-2', resolved.textSecondary.className)}
                style={resolved.textSecondary.style}
              >
                {bio.slice(0, 100)}
              </p>
            )}

            {/* Social icons mini — inside card */}
            {socialLinks.length > 0 && (
              <div className="mt-2.5 flex flex-wrap justify-center gap-2">
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
          </div>

          <div className="mt-3 space-y-2">
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
                      'flex items-center gap-2 px-3 py-2.5 shadow-sm transition-all',
                      resolved.buttonRadius,
                      resolved.card.className
                    )}
                    style={resolved.card.style}
                  >
                    <LinkFavicon url={link.url} title={link.title} className="h-3.5 w-3.5" />
                    <span
                      className={cn('flex-1 text-center text-xs font-medium', resolved.text.className)}
                      style={resolved.text.style}
                    >
                      {link.title}
                    </span>
                    <ExternalLink
                      className="h-3 w-3 flex-shrink-0 opacity-50"
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

export const PagePreview = memo(PagePreviewInner)
