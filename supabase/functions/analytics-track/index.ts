import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

interface TrackRequest {
  landing_page_id: string
  event_type: 'pageview' | 'click'
  link_id?: string
  referrer?: string
}

interface GeoResult {
  status: string
  country: string
  regionName: string
  city: string
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get('ANALYTICS_IP_SALT')
  if (!salt) throw new Error('ANALYTICS_IP_SALT is required')
  const data = new TextEncoder().encode(ip + salt)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function getGeoData(ip: string): Promise<{ country: string; region: string; city: string } | null> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`)
    const data: GeoResult = await res.json()
    if (data.status === 'success') {
      return { country: data.country, region: data.regionName, city: data.city }
    }
  } catch {
    // Silent — geo is optional
  }
  return null
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: TrackRequest = await req.json()

    // Validate required fields
    if (!body.landing_page_id || !body.event_type) {
      return new Response(JSON.stringify({ ok: false }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate UUID format
    if (!UUID_RE.test(body.landing_page_id)) {
      return new Response(JSON.stringify({ ok: false }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (body.event_type === 'click' && body.link_id && !UUID_RE.test(body.link_id)) {
      return new Response(JSON.stringify({ ok: false }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verify landing page exists and get owner user_id
    const { data: page } = await supabase
      .from('landing_pages')
      .select('id, user_id')
      .eq('id', body.landing_page_id)
      .single()

    if (!page) {
      return new Response(JSON.stringify({ ok: true, tracked: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Extract and hash IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
    const ipHash = clientIp ? await hashIp(clientIp) : null

    // Anti-spam: check if same ip_hash visited same page in last 5 seconds
    if (ipHash && body.event_type === 'pageview') {
      const { data: recent } = await supabase
        .from('page_views')
        .select('id')
        .eq('landing_page_id', body.landing_page_id)
        .eq('ip_hash', ipHash)
        .gte('viewed_at', new Date(Date.now() - 5000).toISOString())
        .limit(1)

      if (recent && recent.length > 0) {
        return new Response(JSON.stringify({ ok: true, tracked: false, reason: 'dedup' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    if (body.event_type === 'pageview') {
      // Get geolocation for pageviews
      const geo = clientIp ? await getGeoData(clientIp) : null
      const userAgent = req.headers.get('user-agent') || null

      await supabase.from('page_views').insert({
        landing_page_id: body.landing_page_id,
        user_id: page.user_id,
        ip_hash: ipHash,
        user_agent: userAgent,
        referrer: body.referrer || null,
        country: geo?.country || null,
        region: geo?.region || null,
        city: geo?.city || null,
      })
    } else if (body.event_type === 'click' && body.link_id) {
      // Verify link belongs to the landing page
      const { data: link } = await supabase
        .from('links')
        .select('id')
        .eq('id', body.link_id)
        .eq('landing_page_id', body.landing_page_id)
        .single()

      if (!link) {
        return new Response(JSON.stringify({ ok: true, tracked: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Anti-spam: dedup clicks within 2s window per ip_hash + link_id
      if (ipHash) {
        const { data: recentClick } = await supabase
          .from('link_clicks')
          .select('id')
          .eq('link_id', body.link_id)
          .eq('ip_hash', ipHash)
          .gte('clicked_at', new Date(Date.now() - 2000).toISOString())
          .limit(1)

        if (recentClick && recentClick.length > 0) {
          return new Response(JSON.stringify({ ok: true, tracked: false, reason: 'dedup' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }

      await supabase.from('link_clicks').insert({
        landing_page_id: body.landing_page_id,
        link_id: body.link_id,
        user_id: page.user_id,
        ip_hash: ipHash,
      })
    }

    return new Response(JSON.stringify({ ok: true, tracked: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('analytics-track error:', err)
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
