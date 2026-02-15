const allowedOrigins = [
  'https://rapli.io',
  'https://www.rapli.io',
]

// Accept any localhost port for development
function isLocalhost(origin: string): boolean {
  return /^http:\/\/localhost:\d+$/.test(origin)
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = allowedOrigins.includes(origin ?? '') || isLocalhost(origin ?? '')
  const allowed = isAllowed ? origin! : allowedOrigins[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}
