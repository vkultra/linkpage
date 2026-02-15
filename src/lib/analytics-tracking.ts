import { env } from '../config/env'

export async function trackAnalyticsEvent(params: {
  landingPageId: string
  eventType: 'pageview' | 'click'
  linkId?: string
}): Promise<void> {
  try {
    await fetch(`${env.supabaseUrl}/functions/v1/analytics-track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        landing_page_id: params.landingPageId,
        event_type: params.eventType,
        link_id: params.linkId,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    })
  } catch {
    // Silent failure — tracking never breaks the page
  }
}
