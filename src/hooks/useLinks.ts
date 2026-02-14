import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} from '../services/link.service'
import type { Link } from '../types'

export function useLinks(landingPageId: string | undefined) {
  const { user } = useAuth()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLinks = useCallback(async () => {
    if (!landingPageId) return
    try {
      const data = await getLinks(landingPageId)
      setLinks(data)
    } catch (err) {
      console.error('Error fetching links:', err)
    } finally {
      setLoading(false)
    }
  }, [landingPageId])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  async function create(input: { title: string; url: string }) {
    if (!user || !landingPageId) throw new Error('Not authenticated')
    const position = links.length
    const link = await createLink(landingPageId, user.id, input, position)
    setLinks((prev) => [...prev, link])
    return link
  }

  async function update(id: string, updates: Partial<Pick<Link, 'title' | 'url' | 'is_active'>>) {
    const link = await updateLink(id, updates)
    setLinks((prev) => prev.map((l) => (l.id === id ? link : l)))
    return link
  }

  async function remove(id: string) {
    await deleteLink(id)
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  async function reorder(oldIndex: number, newIndex: number) {
    const reordered = [...links]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    // Optimistic update
    const withPositions = reordered.map((link, i) => ({ ...link, position: i }))
    setLinks(withPositions)

    try {
      await reorderLinks(withPositions.map((l) => ({ id: l.id, position: l.position })))
    } catch (err) {
      // Rollback
      setLinks(links)
      throw err
    }
  }

  return { links, loading, create, update, remove, reorder, refetch: fetchLinks }
}
