import { supabase } from '../lib/supabase'
import type { FacebookPixelSafe } from '../types'
import type { FacebookPixelInput, FacebookPixelUpdateInput } from '../lib/validators'

const SAFE_SELECT = 'id, landing_page_id, user_id, pixel_id, test_event_code, events, is_active, created_at' as const

export async function getFacebookPixel(landingPageId: string, userId: string): Promise<FacebookPixelSafe | null> {
  const { data, error } = await supabase
    .from('facebook_pixels')
    .select(SAFE_SELECT)
    .eq('landing_page_id', landingPageId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data as FacebookPixelSafe | null
}

export async function upsertFacebookPixel(
  landingPageId: string,
  userId: string,
  input: FacebookPixelInput | FacebookPixelUpdateInput,
  keepExistingToken = false
): Promise<FacebookPixelSafe> {
  if (keepExistingToken) {
    const { data, error } = await supabase
      .from('facebook_pixels')
      .update({
        pixel_id: input.pixel_id,
        test_event_code: input.test_event_code || null,
        events: input.events,
        is_active: input.is_active,
      })
      .eq('landing_page_id', landingPageId)
      .eq('user_id', userId)
      .select(SAFE_SELECT)
      .single()
    if (error) throw error
    return data as FacebookPixelSafe
  }

  const fullInput = input as FacebookPixelInput
  const { data, error } = await supabase
    .from('facebook_pixels')
    .upsert(
      {
        landing_page_id: landingPageId,
        user_id: userId,
        pixel_id: fullInput.pixel_id,
        access_token: fullInput.access_token,
        test_event_code: fullInput.test_event_code || null,
        events: fullInput.events,
        is_active: fullInput.is_active,
      },
      { onConflict: 'landing_page_id' }
    )
    .select(SAFE_SELECT)
    .single()
  if (error) throw error
  return data as FacebookPixelSafe
}

export async function deleteFacebookPixel(landingPageId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('facebook_pixels')
    .delete()
    .eq('landing_page_id', landingPageId)
    .eq('user_id', userId)
  if (error) throw error
}
