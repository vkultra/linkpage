import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  loginSchema,
  landingPageSchema,
  linkSchema,
  headerSchema,
  customColorsSchema,
  socialLinkSchema,
  fileUploadSchema,
  facebookPixelSchema,
} from '../validators'

describe('registerSchema', () => {
  const valid = { username: 'joao123', email: 'joao@email.com', password: '12345678', fullName: 'João Silva' }

  it('aceita dados válidos', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('rejeita username curto', () => {
    const result = registerSchema.safeParse({ ...valid, username: 'ab' })
    expect(result.success).toBe(false)
  })

  it('rejeita username com maiúsculas', () => {
    const result = registerSchema.safeParse({ ...valid, username: 'JoaoABC' })
    expect(result.success).toBe(false)
  })

  it('rejeita username com caracteres especiais', () => {
    const result = registerSchema.safeParse({ ...valid, username: 'joao@123' })
    expect(result.success).toBe(false)
  })

  it('rejeita username começando com hífen', () => {
    const result = registerSchema.safeParse({ ...valid, username: '-joao' })
    expect(result.success).toBe(false)
  })

  it('rejeita email inválido', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'nao-email' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha menor que 8 caracteres', () => {
    const result = registerSchema.safeParse({ ...valid, password: '1234567' })
    expect(result.success).toBe(false)
  })

  it('aceita senha com exatamente 8 caracteres', () => {
    const result = registerSchema.safeParse({ ...valid, password: '12345678' })
    expect(result.success).toBe(true)
  })

  it('rejeita nome vazio', () => {
    const result = registerSchema.safeParse({ ...valid, fullName: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita nome muito longo', () => {
    const result = registerSchema.safeParse({ ...valid, fullName: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('aceita dados válidos', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'qualquer' }).success).toBe(true)
  })

  it('rejeita email inválido', () => {
    expect(loginSchema.safeParse({ email: 'invalido', password: 'x' }).success).toBe(false)
  })

  it('rejeita senha vazia', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false)
  })
})

describe('landingPageSchema', () => {
  it('aceita dados válidos com defaults', () => {
    const result = landingPageSchema.safeParse({ title: 'Minha Página', slug: 'minha-pagina' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.bio).toBe('')
      expect(result.data.theme).toBe('light')
    }
  })

  it('rejeita título vazio', () => {
    expect(landingPageSchema.safeParse({ title: '', slug: 'ok' }).success).toBe(false)
  })

  it('rejeita slug com maiúsculas', () => {
    expect(landingPageSchema.safeParse({ title: 'Ok', slug: 'Maiuscula' }).success).toBe(false)
  })

  it('aceita slug vazio', () => {
    expect(landingPageSchema.safeParse({ title: 'Ok', slug: '' }).success).toBe(true)
  })

  it('aceita todos os temas válidos', () => {
    for (const theme of ['light', 'dark', 'gradient', 'neon', 'glassmorphism']) {
      expect(landingPageSchema.safeParse({ title: 'Ok', slug: 'ok', theme }).success).toBe(true)
    }
  })

  it('rejeita tema inválido', () => {
    expect(landingPageSchema.safeParse({ title: 'Ok', slug: 'ok', theme: 'invalid' }).success).toBe(false)
  })

  it('rejeita bio muito longa', () => {
    expect(landingPageSchema.safeParse({ title: 'Ok', slug: 'ok', bio: 'a'.repeat(501) }).success).toBe(false)
  })
})

describe('linkSchema', () => {
  it('aceita link válido com https', () => {
    expect(linkSchema.safeParse({ title: 'Google', url: 'https://google.com' }).success).toBe(true)
  })

  it('aceita link válido com http', () => {
    expect(linkSchema.safeParse({ title: 'Site', url: 'http://example.com' }).success).toBe(true)
  })

  it('rejeita título vazio', () => {
    expect(linkSchema.safeParse({ title: '', url: 'https://google.com' }).success).toBe(false)
  })

  it('rejeita URL sem protocolo', () => {
    expect(linkSchema.safeParse({ title: 'Site', url: 'google.com' }).success).toBe(false)
  })

  it('rejeita URL com protocolo javascript:', () => {
    expect(linkSchema.safeParse({ title: 'XSS', url: 'javascript:alert(1)' }).success).toBe(false)
  })

  it('rejeita URL com protocolo ftp:', () => {
    expect(linkSchema.safeParse({ title: 'FTP', url: 'ftp://files.com/doc' }).success).toBe(false)
  })

  it('rejeita URL com protocolo data:', () => {
    expect(linkSchema.safeParse({ title: 'Data', url: 'data:text/html,<script>alert(1)</script>' }).success).toBe(false)
  })
})

describe('headerSchema', () => {
  it('aceita título válido', () => {
    expect(headerSchema.safeParse({ title: 'Minhas Redes' }).success).toBe(true)
  })

  it('rejeita título vazio', () => {
    expect(headerSchema.safeParse({ title: '' }).success).toBe(false)
  })
})

describe('customColorsSchema', () => {
  it('aceita cores hex válidas', () => {
    expect(customColorsSchema.safeParse({
      background: '#ff0000',
      text: '#000000',
    }).success).toBe(true)
  })

  it('aceita objeto vazio', () => {
    expect(customColorsSchema.safeParse({}).success).toBe(true)
  })

  it('rejeita cor sem #', () => {
    expect(customColorsSchema.safeParse({ background: 'ff0000' }).success).toBe(false)
  })

  it('rejeita cor com 3 dígitos', () => {
    expect(customColorsSchema.safeParse({ background: '#f00' }).success).toBe(false)
  })

  it('rejeita cor com caracteres inválidos', () => {
    expect(customColorsSchema.safeParse({ background: '#gggggg' }).success).toBe(false)
  })
})

describe('socialLinkSchema', () => {
  it('aceita link social válido', () => {
    expect(socialLinkSchema.safeParse({ platform: 'instagram', url: 'https://instagram.com/user' }).success).toBe(true)
  })

  it('rejeita plataforma vazia', () => {
    expect(socialLinkSchema.safeParse({ platform: '', url: 'https://x.com' }).success).toBe(false)
  })

  it('rejeita URL javascript:', () => {
    expect(socialLinkSchema.safeParse({ platform: 'x', url: 'javascript:alert(1)' }).success).toBe(false)
  })
})

describe('fileUploadSchema', () => {
  function mockFile(size: number, type: string): File {
    const buffer = new ArrayBuffer(size)
    return new File([buffer], 'test.jpg', { type })
  }

  it('aceita JPEG válido', () => {
    expect(fileUploadSchema.safeParse({ file: mockFile(1024, 'image/jpeg') }).success).toBe(true)
  })

  it('aceita PNG válido', () => {
    expect(fileUploadSchema.safeParse({ file: mockFile(1024, 'image/png') }).success).toBe(true)
  })

  it('aceita WebP válido', () => {
    expect(fileUploadSchema.safeParse({ file: mockFile(1024, 'image/webp') }).success).toBe(true)
  })

  it('rejeita arquivo maior que 2MB', () => {
    expect(fileUploadSchema.safeParse({ file: mockFile(3 * 1024 * 1024, 'image/jpeg') }).success).toBe(false)
  })

  it('rejeita tipo inválido (GIF)', () => {
    expect(fileUploadSchema.safeParse({ file: mockFile(1024, 'image/gif') }).success).toBe(false)
  })

  it('rejeita tipo inválido (SVG)', () => {
    expect(fileUploadSchema.safeParse({ file: mockFile(1024, 'image/svg+xml') }).success).toBe(false)
  })
})

describe('facebookPixelSchema', () => {
  const valid = {
    pixel_id: '123456789',
    access_token: 'EAAxxxxxxxx',
    events: ['PageView'],
    is_active: true,
  }

  it('aceita dados válidos', () => {
    expect(facebookPixelSchema.safeParse(valid).success).toBe(true)
  })

  it('rejeita pixel_id vazio', () => {
    expect(facebookPixelSchema.safeParse({ ...valid, pixel_id: '' }).success).toBe(false)
  })

  it('rejeita pixel_id com letras', () => {
    expect(facebookPixelSchema.safeParse({ ...valid, pixel_id: 'abc123' }).success).toBe(false)
  })

  it('rejeita access_token vazio', () => {
    expect(facebookPixelSchema.safeParse({ ...valid, access_token: '' }).success).toBe(false)
  })

  it('rejeita events vazio', () => {
    expect(facebookPixelSchema.safeParse({ ...valid, events: [] }).success).toBe(false)
  })

  it('aceita test_event_code opcional', () => {
    expect(facebookPixelSchema.safeParse({ ...valid, test_event_code: 'TEST123' }).success).toBe(true)
  })
})
