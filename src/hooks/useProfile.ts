import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { getProfile, updateProfile } from '../services/profile.service'
import type { Profile } from '../types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    try {
      const data = await getProfile(user.id)
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
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

  return { profile, loading, update, refetch: fetchProfile }
}
