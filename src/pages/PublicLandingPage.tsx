import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLandingPageBySlug } from '../services/landing-page.service'
import { getLinks } from '../services/link.service'
import { getTheme } from '../themes'
import { PublicPage } from '../components/public/PublicPage'
import { NotFound } from '../components/public/NotFound'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { loadFont } from '../lib/fonts'
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

  const fetchData = useCallback(async () => {
    if (!username) return
    try {
      const pageData = await getLandingPageBySlug(username, slug)
      setPage(pageData)
      const linksData = await getLinks(pageData.id)
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

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (notFound || !page) {
    return <NotFound />
  }

  const theme = getTheme(page.theme)
  const customization = parseCustomization(page.customization)

  return (
    <PublicPage
      page={page}
      links={links}
      theme={theme}
      profileName={page.profiles.full_name || page.profiles.username}
      profileAvatar={page.profiles.avatar_url}
      customization={customization}
    />
  )
}
