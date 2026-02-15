import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { PublicLinkItem } from './PublicLinkItem'
import { SocialIconsBar } from './SocialIconsBar'
import { resolveStyles } from '../../themes/resolve'
import type { LandingPage, Link, ThemeConfig, PageCustomization, SocialLink } from '../../types'
import DOMPurify from 'dompurify'

interface PublicPageProps {
  page: LandingPage
  links: Link[]
  theme: ThemeConfig
  profileName: string
  profileAvatar?: string | null
  customization?: PageCustomization
}

export function PublicPage({ page, links, theme, profileName, profileAvatar, customization }: PublicPageProps) {
  const activeLinks = links.filter((l) => l.is_active)
  const avatarSrc = page.avatar_url ?? profileAvatar
  const sanitizedBio = page.bio ? DOMPurify.sanitize(page.bio) : ''
  const resolved = resolveStyles(theme, customization)
  const socialLinks: SocialLink[] = customization?.socialLinks ?? []

  return (
    <div
      className={cn('flex min-h-screen flex-col items-center px-4 py-12', resolved.background.className)}
      style={{ ...resolved.background.style, fontFamily: resolved.fontFamily }}
    >
      <div className="w-full max-w-md">
        {/* Avatar + Info */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Avatar
            src={avatarSrc}
            alt={profileName}
            size="xl"
            className={cn('mb-4 ring-4', resolved.avatarBorder)}
          />
          <h1
            className={cn('text-xl font-bold', resolved.text.className)}
            style={resolved.text.style}
          >
            {page.title || profileName}
          </h1>
          {sanitizedBio && (
            <p
              className={cn('mt-2 max-w-xs text-sm', resolved.textSecondary.className)}
              style={resolved.textSecondary.style}
              dangerouslySetInnerHTML={{ __html: sanitizedBio }}
            />
          )}
        </div>

        {/* Social Icons */}
        {socialLinks.length > 0 && (
          <SocialIconsBar links={socialLinks} textStyle={resolved.text} />
        )}

        {/* Links */}
        <div className="space-y-3">
          {activeLinks.map((link) => {
            // Header type
            if (link.type === 'header') {
              return (
                <div key={link.id} className="pt-4 pb-1">
                  <p
                    className={cn('text-center text-sm font-semibold uppercase tracking-wider', resolved.textSecondary.className)}
                    style={resolved.textSecondary.style}
                  >
                    {link.title}
                  </p>
                </div>
              )
            }

            return (
              <PublicLinkItem
                key={link.id}
                title={link.title}
                url={link.url}
                resolved={resolved}
              />
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p
            className={cn('text-xs', resolved.textSecondary.className)}
            style={resolved.textSecondary.style}
          >
            Feito com LinkPage
          </p>
        </div>
      </div>
    </div>
  )
}
