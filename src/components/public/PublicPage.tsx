import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { PublicLinkItem } from './PublicLinkItem'
import type { LandingPage, Link, ThemeConfig } from '../../types'
import DOMPurify from 'dompurify'

interface PublicPageProps {
  page: LandingPage
  links: Link[]
  theme: ThemeConfig
  profileName: string
  profileAvatar?: string | null
}

export function PublicPage({ page, links, theme, profileName, profileAvatar }: PublicPageProps) {
  const activeLinks = links.filter((l) => l.is_active)
  const avatarSrc = page.avatar_url ?? profileAvatar
  const sanitizedBio = page.bio ? DOMPurify.sanitize(page.bio) : ''

  return (
    <div className={cn('flex min-h-screen flex-col items-center px-4 py-12', theme.background)}>
      <div className="w-full max-w-md">
        {/* Avatar + Info */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Avatar
            src={avatarSrc}
            alt={profileName}
            size="xl"
            className={cn('mb-4 ring-4', theme.avatarBorder)}
          />
          <h1 className={cn('text-xl font-bold', theme.text)}>
            {page.title || profileName}
          </h1>
          {sanitizedBio && (
            <p
              className={cn('mt-2 max-w-xs text-sm', theme.textSecondary)}
              dangerouslySetInnerHTML={{ __html: sanitizedBio }}
            />
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {activeLinks.map((link) => (
            <PublicLinkItem
              key={link.id}
              title={link.title}
              url={link.url}
              theme={theme}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className={cn('text-xs', theme.textSecondary)}>
            Feito com LinkPage
          </p>
        </div>
      </div>
    </div>
  )
}
