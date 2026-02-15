import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth'
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} from '../services/link.service'
import type { Link, LinkType } from '../types'

export function useLinks(landingPageId: string | undefined) {
  const { user } = useAuth()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchLinks = useCallback(async () => {
    if (!landingPageId) return
    setError(null)
    setLoading(true)
    try {
      const data = await getLinks(landingPageId)
      if (mountedRef.current) setLinks(data)
    } catch (err) {
      if (mountedRef.current) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar links'
        setError(message)
      }
      console.error('Error fetching links:', err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [landingPageId])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  async function create(input: { title: string; url?: string; type?: LinkType }) {
    if (!user || !landingPageId) throw new Error('Not authenticated')
    const position = links.length
    const link = await createLink(landingPageId, user.id, input, position)
    setLinks((prev) => [...prev, link])
    return link
  }

  async function update(id: string, updates: Partial<Pick<Link, 'title' | 'url' | 'is_active'>>) {
    if (!user) throw new Error('Not authenticated')
    const link = await updateLink(id, user.id, updates)
    setLinks((prev) => prev.map((l) => (l.id === id ? link : l)))
    return link
  }

  async function remove(id: string) {
    if (!user) throw new Error('Not authenticated')
    await deleteLink(id, user.id)
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const linksBeforeReorderRef = useRef<Link[]>([])

  async function reorder(oldIndex: number, newIndex: number) {
    if (!user) throw new Error('Not authenticated')

    // Salvar estado anterior via ref antes do optimistic update
    linksBeforeReorderRef.current = links

    const reordered = [...links]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    // Optimistic update
    const withPositions = reordered.map((link, i) => ({ ...link, position: i }))
    setLinks(withPositions)

    try {
      await reorderLinks(withPositions.map((l) => ({ id: l.id, position: l.position })), user.id)
    } catch (err) {
      // Rollback usando ref (evita closure stale)
      setLinks(linksBeforeReorderRef.current)
      throw err
    }
  }

  return { links, loading, error, create, update, remove, reorder, refetch: fetchLinks }
}
