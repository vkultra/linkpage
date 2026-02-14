import { supabase } from '../lib/supabase'
import type { LandingPage } from '../types'
import type { LandingPageInput } from '../lib/validators'

export async function getLandingPages(userId: string): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getLandingPage(id: string): Promise<LandingPage> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getLandingPageBySlug(
  username: string,
  slug?: string
): Promise<LandingPage & { profiles: { username: string; full_name: string; avatar_url: string | null } }> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .eq('username', username)
    .single()
  if (profileError) throw profileError

  let query = supabase
    .from('landing_pages')
    .select('*')
    .eq('user_id', profile.id)

  if (slug) {
    query = query.eq('slug', slug)
  } else {
    query = query.eq('is_default', true)
  }

  const { data, error } = await query.single()
  if (error) throw error

  return { ...data, profiles: profile }
}

export async function createLandingPage(
  userId: string,
  input: LandingPageInput
): Promise<LandingPage> {
  const { data, error } = await supabase
    .from('landing_pages')
    .insert({
      user_id: userId,
      title: input.title,
      slug: input.slug,
      bio: input.bio ?? '',
      theme: input.theme,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateLandingPage(
  id: string,
  updates: Partial<Pick<LandingPage, 'title' | 'slug' | 'bio' | 'theme' | 'avatar_url' | 'is_default'>>
): Promise<LandingPage> {
  const { data, error } = await supabase
    .from('landing_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteLandingPage(id: string): Promise<void> {
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', id)
  if (error) throw error
}
