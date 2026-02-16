import { supabase } from '../lib/supabase'
import type { LandingPage } from '../types'
import type { LandingPageInput } from '../lib/validators'

// In-memory cache for public pages (60s TTL)
const CACHE_TTL_MS = 60_000
const pageCache = new Map<string, { data: PublicPageData; timestamp: number }>()

function getCacheKey(username: string, slug?: string): string {
  return slug ? `${username}/${slug}` : username
}

export async function getLandingPages(userId: string): Promise<LandingPage[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getLandingPage(id: string, userId: string): Promise<LandingPage> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

export interface PublicPageData {
  page: LandingPage & { profiles: { username: string; full_name: string; avatar_url: string | null } }
  links: import('../types').Link[]
}

export async function getPublicPage(
  username: string,
  slug?: string
): Promise<PublicPageData> {
  const key = getCacheKey(username, slug)
  const cached = pageCache.get(key)
  const now = Date.now()

  // Return cached data if fresh
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const { data, error } = await supabase.rpc('get_public_page', {
    p_username: username,
    p_slug: slug || null,
  })
  if (error) throw error
  if (!data) throw new Error('Not found')

  const result = data as { profile: Record<string, unknown>; page: Record<string, unknown>; links: Record<string, unknown>[] }

  const pageData: PublicPageData = {
    page: { ...result.page, profiles: result.profile } as PublicPageData['page'],
    links: result.links as PublicPageData['links'],
  }

  // Store in cache
  pageCache.set(key, { data: pageData, timestamp: now })

  return pageData
}

/** @deprecated Use getPublicPage instead — kept for backwards compatibility */
export async function getLandingPageBySlug(
  username: string,
  slug?: string
): Promise<LandingPage & { profiles: { username: string; full_name: string; avatar_url: string | null } }> {
  const { page } = await getPublicPage(username, slug)
  return page
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
  userId: string,
  updates: Partial<Pick<LandingPage, 'title' | 'slug' | 'bio' | 'theme' | 'avatar_url' | 'is_default' | 'customization'>>
): Promise<LandingPage> {
  const { data, error } = await supabase
    .from('landing_pages')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteLandingPage(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}
