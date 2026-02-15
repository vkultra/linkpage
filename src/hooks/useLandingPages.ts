import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchPages = useCallback(async () => {
    if (!user) return
    setError(null)
    try {
      const data = await getLandingPages(user.id)
      if (mountedRef.current) setPages(data)
    } catch (err) {
      if (mountedRef.current) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar páginas'
        setError(message)
      }
      console.error('Error fetching landing pages:', err)
    } finally {
      if (mountedRef.current) setLoading(false)
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
    if (!user) throw new Error('Not authenticated')
    const page = await updateLandingPage(id, user.id, updates)
    setPages((prev) => prev.map((p) => (p.id === id ? page : p)))
    return page
  }

  async function remove(id: string) {
    if (!user) throw new Error('Not authenticated')
    await deleteLandingPage(id, user.id)
    setPages((prev) => prev.filter((p) => p.id !== id))
  }

  return { pages, loading, error, create, update, remove, refetch: fetchPages }
}
