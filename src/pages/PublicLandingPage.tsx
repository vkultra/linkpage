import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPublicPage } from '../services/landing-page.service'
import { getTheme } from '../themes'
import { PublicPage } from '../components/public/PublicPage'
import { NotFound } from '../components/public/NotFound'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { loadFont } from '../lib/fonts'
import { getOptimizedAvatarUrl } from '../lib/utils'
import { useFbTracking } from '../hooks/useFbTracking'
import { trackAnalyticsEvent } from '../lib/analytics-tracking'
import type { LandingPage, Link, PageCustomization, FontFamily } from '../types'

function parseCustomization(raw: unknown): PageCustomization {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as PageCustomization
  }
  return {}
}

export function PublicLandingPage({ username: usernameProp }: { username?: string }) {
  const params = useParams<{ username?: string; slug?: string }>()
  const username = usernameProp || params.username
  const slug = params.slug
  const [page, setPage] = useState<(LandingPage & { profiles: { username: string; full_name: string; avatar_url: string | null } }) | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useFbTracking(page?.id)

  // Analytics tracking — pageview on mount
  const analyticsTrackedRef = useRef(false)
  useEffect(() => {
    if (!page?.id || analyticsTrackedRef.current) return
    analyticsTrackedRef.current = true
    trackAnalyticsEvent({ landingPageId: page.id, eventType: 'pageview' })
  }, [page?.id])

  const handleLinkClick = useCallback((linkId: string) => {
    if (!page?.id) return
    trackAnalyticsEvent({ landingPageId: page.id, eventType: 'click', linkId })
  }, [page?.id])

  useEffect(() => {
    let stale = false

    async function load() {
      if (!username) return

      const usernameRegex = /^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/
      if (!usernameRegex.test(username)) {
        if (!stale) { setNotFound(true); setLoading(false) }
        return
      }

      try {
        const { page: pageData, links: linksData } = await getPublicPage(username, slug)
        if (stale) return
        setPage(pageData)
        setLinks(linksData)

        const cust = parseCustomization(pageData.customization)
        if (cust.fontFamily && cust.fontFamily !== 'inter') {
          loadFont(cust.fontFamily as FontFamily)
        }
      } catch {
        if (!stale) setNotFound(true)
      } finally {
        if (!stale) setLoading(false)
      }
    }

    setLoading(true)
    setNotFound(false)
    load()

    return () => { stale = true }
  }, [username, slug])

  // Compute theme-color before early returns (hooks must be unconditional)
  const themeColor = page
    ? parseCustomization(page.customization).customColors?.background || getTheme(page.theme).themeColor
    : null

  // Safari: set theme-color meta + body background so browser chrome matches the page
  useEffect(() => {
    if (!themeColor) return
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', themeColor)
    document.body.style.backgroundColor = themeColor
    return () => {
      if (meta) meta.setAttribute('content', '#ffffff')
      document.body.style.backgroundColor = ''
    }
  }, [themeColor])

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (notFound || !page) {
    return <NotFound />
  }

  const theme = getTheme(page.theme)
  const customization = parseCustomization(page.customization)
  const displayName = page.profiles.full_name || page.profiles.username
  const pageTitle = page.title ? `${page.title} — ${displayName}` : displayName
  const pageDescription = page.bio || `Confira os links de ${displayName}`

  return (
    <>
      <Helmet>
        <title>{pageTitle} | rapli.io</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="profile" />
        {page.avatar_url && <meta property="og:image" content={getOptimizedAvatarUrl(page.avatar_url, 'og')} />}
      </Helmet>
      <PublicPage
      page={page}
      links={links}
      theme={theme}
      profileName={page.profiles.full_name || page.profiles.username}
      profileAvatar={page.profiles.avatar_url}
      customization={customization}
      onLinkClick={handleLinkClick}
    />
    </>
  )
}
