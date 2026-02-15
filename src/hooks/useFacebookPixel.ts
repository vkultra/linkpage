import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  getFacebookPixel,
  upsertFacebookPixel,
  deleteFacebookPixel,
} from '../services/facebook-pixel.service'
import type { FacebookPixelSafe } from '../types'
import type { FacebookPixelInput, FacebookPixelUpdateInput } from '../lib/validators'

export function useFacebookPixel(landingPageId: string | undefined) {
  const { user } = useAuth()
  const [pixel, setPixel] = useState<FacebookPixelSafe | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPixel = useCallback(async () => {
    if (!landingPageId || !user) return
    try {
      const data = await getFacebookPixel(landingPageId, user.id)
      setPixel(data)
    } catch (err) {
      console.error('Error fetching facebook pixel:', err)
    } finally {
      setLoading(false)
    }
  }, [landingPageId, user])

  useEffect(() => {
    fetchPixel()
  }, [fetchPixel])

  async function save(input: FacebookPixelInput | FacebookPixelUpdateInput, keepExistingToken = false) {
    if (!user || !landingPageId) throw new Error('Not authenticated')
    const data = await upsertFacebookPixel(landingPageId, user.id, input, keepExistingToken)
    setPixel(data)
    return data
  }

  async function remove() {
    if (!user || !landingPageId) throw new Error('Not authenticated')
    await deleteFacebookPixel(landingPageId, user.id)
    setPixel(null)
  }

  return { pixel, loading, save, remove, refetch: fetchPixel }
}
