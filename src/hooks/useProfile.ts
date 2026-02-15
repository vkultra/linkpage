import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth'
import { getProfile, updateProfile } from '../services/profile.service'
import type { Profile } from '../types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!user) return
    setError(null)
    try {
      const data = await getProfile(user.id)
      if (mountedRef.current) setProfile(data)
    } catch (err) {
      if (mountedRef.current) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar perfil'
        setError(message)
      }
      console.error('Error fetching profile:', err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  async function update(updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) {
    if (!user) throw new Error('Not authenticated')
    const data = await updateProfile(user.id, updates)
    setProfile(data)
    return data
  }

  return { profile, loading, error, update, refetch: fetchProfile }
}
