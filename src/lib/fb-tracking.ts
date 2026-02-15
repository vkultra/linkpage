import { env } from '../config/env'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`
}

export function getFbp(): string {
  const existing = getCookie('_fbp')
  if (existing) return existing

  const fbp = `fb.1.${Date.now()}.${Math.floor(Math.random() * 1e10)}`
  setCookie('_fbp', fbp, 390) // ~13 months
  return fbp
}

export function getFbc(): string | null {
  const params = new URLSearchParams(window.location.search)
  const fbclid = params.get('fbclid')

  if (fbclid) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`
    setCookie('_fbc', fbc, 90)
    return fbc
  }

  return getCookie('_fbc')
}

interface TrackParams {
  landingPageId: string
  eventName: string
}

export async function trackFbEvent({ landingPageId, eventName }: TrackParams): Promise<void> {
  try {
    const fbp = getFbp()
    const fbc = getFbc()
    const params = new URLSearchParams(window.location.search)

    await fetch(`${env.supabaseUrl}/functions/v1/fb-track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        landing_page_id: landingPageId,
        event_name: eventName,
        event_source_url: window.location.href,
        referrer: document.referrer || undefined,
        fbclid: params.get('fbclid') || undefined,
        fbc: fbc || undefined,
        fbp,
      }),
      keepalive: true,
    })
  } catch {
    // Silent failure — tracking never breaks the page
  }
}
