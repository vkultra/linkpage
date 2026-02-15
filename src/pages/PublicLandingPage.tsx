import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPublicPage } from '../services/landing-page.service'
import { getTheme } from '../themes'
import { PublicPage } from '../components/public/PublicPage'
import { NotFound } from '../components/public/NotFound'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { loadFont } from '../lib/fonts'
import { useFbTracking } from '../hooks/useFbTracking'
import type { LandingPage, Link, PageCustomization, FontFamily } from '../types'

function parseCustomization(raw: unknown): PageCustomization {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as PageCustomization
  }
  return {}
}

export function PublicLandingPage() {
  const { username, slug } = useParams<{ username: string; slug?: string }>()
  const [page, setPage] = useState<(LandingPage & { profiles: { username: string; full_name: string; avatar_url: string | null } }) | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useFbTracking(page?.id)

  const fetchData = useCallback(async () => {
    if (!username) return

    // Validate username format before querying
    const usernameRegex = /^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/
    if (!usernameRegex.test(username)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    try {
      const { page: pageData, links: linksData } = await getPublicPage(username, slug)
      setPage(pageData)
      setLinks(linksData)

      // Load custom font
      const cust = parseCustomization(pageData.customization)
      if (cust.fontFamily && cust.fontFamily !== 'inter') {
        loadFont(cust.fontFamily as FontFamily)
      }
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [username, slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
        {page.avatar_url && <meta property="og:image" content={page.avatar_url} />}
      </Helmet>
      <PublicPage
      page={page}
      links={links}
      theme={theme}
      profileName={page.profiles.full_name || page.profiles.username}
      profileAvatar={page.profiles.avatar_url}
      customization={customization}
    />
    </>
  )
}
