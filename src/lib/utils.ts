import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFaviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  } catch {
    return ''
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

const AVATAR_SIZES = {
  thumb: 64,
  md: 128,
  lg: 256,
  og: 512,
} as const

type AvatarSize = keyof typeof AVATAR_SIZES

export function getOptimizedAvatarUrl(
  url: string | null | undefined,
  size: AvatarSize
): string {
  if (!url) return ''

  // Only transform Supabase Storage URLs
  if (!url.includes('.supabase.co/storage/')) return url

  const dimension = AVATAR_SIZES[size]
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}width=${dimension}&height=${dimension}&resize=cover`
}
