import { useEffect, useRef, useCallback } from 'react'
import { trackFbEvent } from '../lib/fb-tracking'

export function useFbTracking(landingPageId: string | undefined) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!landingPageId || firedRef.current) return
    firedRef.current = true
    trackFbEvent({ landingPageId, eventName: 'PageView' })
  }, [landingPageId])

  const trackEvent = useCallback(
    (eventName: string) => {
      if (!landingPageId) return
      trackFbEvent({ landingPageId, eventName })
    },
    [landingPageId]
  )

  return { trackEvent }
}
