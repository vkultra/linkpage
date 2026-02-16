import { useMemo } from 'react'
import { cn, getOptimizedAvatarUrl } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { PublicLinkItem } from './PublicLinkItem'
import { SocialIconsBar } from './SocialIconsBar'
import { resolveStyles } from '../../themes/resolve'
import type { LandingPage, Link, ThemeConfig, PageCustomization, SocialLink } from '../../types'

interface PublicPageProps {
  page: LandingPage
  links: Link[]
  theme: ThemeConfig
  profileName: string
  profileAvatar?: string | null
  customization?: PageCustomization
  onLinkClick?: (linkId: string) => void
}

export function PublicPage({ page, links, theme, profileName, profileAvatar, customization, onLinkClick }: PublicPageProps) {
  const activeLinks = links.filter((l) => l.is_active)
  const avatarSrc = getOptimizedAvatarUrl(page.avatar_url ?? profileAvatar, 'lg')
  const hasBio = !!page.bio
  const resolved = useMemo(() => resolveStyles(theme, customization), [theme, customization])
  const socialLinks: SocialLink[] = customization?.socialLinks ?? []

  return (
    <div
      className={cn('flex min-h-screen flex-col items-center px-5 pt-16 pb-12 sm:px-6', resolved.background.className)}
      style={{ ...resolved.background.style, fontFamily: resolved.fontFamily }}
    >
      <div className="w-full max-w-md">
        {/* Avatar — floats above profile card */}
        <div className="public-avatar-enter relative z-10 flex justify-center">
          <Avatar
            src={avatarSrc}
            alt={profileName}
            size="xl"
            className={cn('shadow-lg ring-4', resolved.avatarBorder)}
          />
        </div>

        {/* Profile Card — overlaps avatar by 56px */}
        <div
          className={cn(
            'public-profile-enter -mt-14 px-6 pt-[4.5rem] pb-6 text-center',
            resolved.profileCard.className
          )}
          style={resolved.profileCard.style}
        >
          <h1
            className={cn('text-xl font-bold', resolved.text.className)}
            style={resolved.text.style}
          >
            {page.title || profileName}
          </h1>

          {hasBio && (
            <p
              className={cn('mt-2 whitespace-pre-wrap text-sm', resolved.textSecondary.className)}
              style={resolved.textSecondary.style}
            >
              {page.bio}
            </p>
          )}

          {/* Social Icons — inside profile card */}
          {socialLinks.length > 0 && (
            <div className="mt-4 [&>div]:mb-0">
              <SocialIconsBar links={socialLinks} textStyle={resolved.text} />
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mt-6 space-y-3">
          {activeLinks.map((link, index) => {
            if (link.type === 'header') {
              return (
                <div
                  key={link.id}
                  className="public-link-enter pt-4 pb-1"
                  style={{ animationDelay: `${0.3 + index * 0.06}s` }}
                >
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
              <div
                key={link.id}
                className="public-link-enter"
                style={{ animationDelay: `${0.3 + index * 0.06}s` }}
              >
                <PublicLinkItem
                  title={link.title}
                  url={link.url}
                  resolved={resolved}
                  onClick={onLinkClick ? () => onLinkClick(link.id) : undefined}
                />
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
