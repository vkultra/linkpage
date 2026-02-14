import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  getLandingPages,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
} from '../services/landing-page.service'
import type { LandingPage } from '../types'
import type { LandingPageInput } from '../lib/validators'

export function useLandingPages() {
  const { user } = useAuth()
  const [pages, setPages] = useState<LandingPage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPages = useCallback(async () => {
    if (!user) return
    try {
      const data = await getLandingPages(user.id)
      setPages(data)
    } catch (err) {
      console.error('Error fetching landing pages:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  async function create(input: LandingPageInput) {
    if (!user) throw new Error('Not authenticated')
    const page = await createLandingPage(user.id, input)
    setPages((prev) => [page, ...prev])
    return page
  }

  async function update(id: string, updates: Partial<Pick<LandingPage, 'title' | 'slug' | 'bio' | 'theme' | 'avatar_url' | 'is_default'>>) {
    const page = await updateLandingPage(id, updates)
    setPages((prev) => prev.map((p) => (p.id === id ? page : p)))
    return page
  }

  async function remove(id: string) {
    await deleteLandingPage(id)
    setPages((prev) => prev.filter((p) => p.id !== id))
  }

  return { pages, loading, create, update, remove, refetch: fetchPages }
}
