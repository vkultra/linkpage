import { describe, it, expect } from 'vitest'
import { cn, slugify, getFaviconUrl } from '../utils'

describe('cn', () => {
  it('combina classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('resolve conflitos Tailwind (last wins)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('ignora valores falsy', () => {
    const condition = false as boolean
    expect(cn('foo', condition && 'bar', null, undefined, 'baz')).toBe('foo baz')
  })

  it('suporta condicionais com objetos', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('retorna string vazia sem argumentos', () => {
    expect(cn()).toBe('')
  })
})

describe('slugify', () => {
  it('converte para lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('remove acentos', () => {
    expect(slugify('Ação Útil')).toBe('acao-util')
  })

  it('substitui espaços por hífens', () => {
    expect(slugify('meu link legal')).toBe('meu-link-legal')
  })

  it('remove caracteres especiais', () => {
    expect(slugify('hello@world!')).toBe('hello-world')
  })

  it('remove hífens no início e fim', () => {
    expect(slugify('--hello--')).toBe('hello')
  })

  it('limita a 50 caracteres', () => {
    const long = 'a'.repeat(60)
    expect(slugify(long).length).toBeLessThanOrEqual(50)
  })

  it('lida com string vazia', () => {
    expect(slugify('')).toBe('')
  })

  it('colapsa múltiplos hífens', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })
})

describe('getFaviconUrl', () => {
  it('retorna URL do favicon do Google', () => {
    const result = getFaviconUrl('https://github.com/user')
    expect(result).toBe('https://www.google.com/s2/favicons?domain=github.com&sz=64')
  })

  it('extrai hostname corretamente', () => {
    const result = getFaviconUrl('https://sub.example.com/path?q=1')
    expect(result).toBe('https://www.google.com/s2/favicons?domain=sub.example.com&sz=64')
  })

  it('retorna string vazia para URL inválida', () => {
    expect(getFaviconUrl('not-a-url')).toBe('')
  })
})
