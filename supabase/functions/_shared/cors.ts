const allowedOrigins = [
  'https://rapli.io',
  'https://www.rapli.io',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
]

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = allowedOrigins.includes(origin ?? '')
    ? origin!
    : allowedOrigins[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}
