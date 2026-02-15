import { supabase } from '../lib/supabase'
import type { FacebookPixel } from '../types'
import type { FacebookPixelInput } from '../lib/validators'

export async function getFacebookPixel(landingPageId: string): Promise<FacebookPixel | null> {
  const { data, error } = await supabase
    .from('facebook_pixels')
    .select('id, landing_page_id, user_id, pixel_id, access_token, test_event_code, events, is_active, created_at')
    .eq('landing_page_id', landingPageId)
    .maybeSingle()
  if (error) throw error
  return data as FacebookPixel | null
}

export async function upsertFacebookPixel(
  landingPageId: string,
  userId: string,
  input: FacebookPixelInput
): Promise<FacebookPixel> {
  const { data, error } = await supabase
    .from('facebook_pixels')
    .upsert(
      {
        landing_page_id: landingPageId,
        user_id: userId,
        pixel_id: input.pixel_id,
        access_token: input.access_token,
        test_event_code: input.test_event_code || null,
        events: input.events,
        is_active: input.is_active,
      },
      { onConflict: 'landing_page_id' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteFacebookPixel(landingPageId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('facebook_pixels')
    .delete()
    .eq('landing_page_id', landingPageId)
    .eq('user_id', userId)
  if (error) throw error
}
