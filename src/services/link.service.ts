import { supabase } from '../lib/supabase'
import type { Link, LinkType } from '../types'

export async function getLinks(landingPageId: string, userId?: string): Promise<Link[]> {
  let query = supabase
    .from('links')
    .select('*')
    .eq('landing_page_id', landingPageId)
  if (userId) query = query.eq('user_id', userId)
  const { data, error } = await query.order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createLink(
  landingPageId: string,
  userId: string,
  input: { title: string; url?: string; type?: LinkType },
  position: number
): Promise<Link> {
  const { data, error } = await supabase
    .from('links')
    .insert({
      landing_page_id: landingPageId,
      user_id: userId,
      title: input.title,
      url: input.url ?? '',
      type: input.type ?? 'link',
      position,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateLink(
  id: string,
  userId: string,
  updates: Partial<Pick<Link, 'title' | 'url' | 'is_active' | 'position'>>
): Promise<Link> {
  const { data, error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteLink(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function reorderLinks(
  links: { id: string; position: number }[],
  userId: string
): Promise<void> {
  const { error } = await supabase.rpc('reorder_links', {
    p_link_ids: links.map((l) => l.id),
    p_positions: links.map((l) => l.position),
    p_user_id: userId,
  })
  if (error) throw error
}
