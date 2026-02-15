import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

interface TrackRequest {
  landing_page_id: string
  event_name: string
  event_source_url: string
  referrer?: string
  fbclid?: string
  fbc?: string
  fbp?: string
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: TrackRequest = await req.json()

    if (!body.landing_page_id || !body.event_name) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Admin client — bypasses RLS to read access_token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch pixel config
    const { data: pixel, error } = await supabase
      .from('facebook_pixels')
      .select('pixel_id, access_token, test_event_code, events')
      .eq('landing_page_id', body.landing_page_id)
      .eq('is_active', true)
      .single()

    if (error || !pixel) {
      return new Response(
        JSON.stringify({ ok: true, tracked: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if event is enabled
    if (!pixel.events.includes(body.event_name)) {
      return new Response(
        JSON.stringify({ ok: true, tracked: false, reason: 'event_not_enabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract visitor info from headers
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
    const userAgent = req.headers.get('user-agent') || ''

    // Build Facebook CAPI payload
    const eventTime = Math.floor(Date.now() / 1000)
    const userData: Record<string, string> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    }
    if (body.fbc) userData.fbc = body.fbc
    if (body.fbp) userData.fbp = body.fbp

    const eventData: Record<string, unknown> = {
      event_name: body.event_name,
      event_time: eventTime,
      event_source_url: body.event_source_url,
      action_source: 'website',
      user_data: userData,
    }

    const capiPayload: Record<string, unknown> = {
      data: [eventData],
    }
    if (pixel.test_event_code) {
      capiPayload.test_event_code = pixel.test_event_code
    }

    // Send to Facebook Conversions API
    const fbResponse = await fetch(
      `https://graph.facebook.com/v21.0/${pixel.pixel_id}/events?access_token=${pixel.access_token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload),
      }
    )

    const fbResult = await fbResponse.json()

    if (!fbResponse.ok) {
      console.error('Facebook CAPI error:', JSON.stringify(fbResult))
    }

    return new Response(
      JSON.stringify({ ok: true, tracked: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('fb-track error:', err)
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
