/**
 * Gera a URL pública de uma landing page no formato de subdomínio.
 * Ex: getPublicPageUrl('vkultra', 'meu-portfolio') → "https://vkultra.rapli.io/meu-portfolio"
 * Ex: getPublicPageUrl('vkultra') → "https://vkultra.rapli.io"
 */
export function getPublicPageUrl(username: string, slug?: string): string {
  const base = `https://${username}.rapli.io`
  return slug ? `${base}/${slug}` : base
}

/**
 * Retorna a URL de exibição (sem https://) para mostrar no UI.
 * Ex: getPublicPageDisplayUrl('vkultra', 'portfolio') → "vkultra.rapli.io/portfolio"
 */
export function getPublicPageDisplayUrl(username: string, slug?: string): string {
  const base = `${username}.rapli.io`
  return slug ? `${base}/${slug}` : base
}
