const MAIN_HOSTS = ['rapli.io', 'www.rapli.io']

/**
 * Extrai o username do subdomínio (ex: vkultra.rapli.io → "vkultra").
 * Retorna null se estiver no domínio principal ou em localhost (dev).
 */
export function getSubdomainUsername(): string | null {
  const hostname = window.location.hostname

  // Dev local: sem subdomínio
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null
  }

  // Domínio principal: sem subdomínio
  if (MAIN_HOSTS.includes(hostname)) {
    return null
  }

  // vkultra.rapli.io → ["vkultra", "rapli", "io"]
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    return parts[0]
  }

  return null
}
