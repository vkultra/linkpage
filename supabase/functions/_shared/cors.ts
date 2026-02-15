const allowedOrigins = [
  'https://rapli.io',
  'https://www.rapli.io',
]

// Accept any localhost port for development
function isLocalhost(origin: string): boolean {
  return /^http:\/\/localhost:\d+$/.test(origin)
}

// Accept any *.rapli.io subdomain
function isRapliSubdomain(origin: string): boolean {
  return /^https:\/\/[a-z0-9-]+\.rapli\.io$/.test(origin)
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = allowedOrigins.includes(origin ?? '') || isLocalhost(origin ?? '') || isRapliSubdomain(origin ?? '')
  const allowed = isAllowed ? origin! : allowedOrigins[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}
