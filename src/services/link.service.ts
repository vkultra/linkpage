import { supabase } from '../lib/supabase'
import type { Link, LinkType } from '../types'

export async function getLinks(landingPageId: string): Promise<Link[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('landing_page_id', landingPageId)
    .order('position', { ascending: true })
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
  updates: Partial<Pick<Link, 'title' | 'url' | 'is_active' | 'position'>>
): Promise<Link> {
  const { data, error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteLink(id: string): Promise<void> {
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function reorderLinks(
  links: { id: string; position: number }[]
): Promise<void> {
  const updates = links.map(({ id, position }) =>
    supabase
      .from('links')
      .update({ position })
      .eq('id', id)
  )
  const results = await Promise.all(updates)
  const error = results.find((r) => r.error)?.error
  if (error) throw error
}
