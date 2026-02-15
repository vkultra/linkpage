import { z } from 'zod/v4'

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(30, 'Username deve ter no máximo 30 caracteres')
    .regex(/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/, 'Username deve conter apenas letras minúsculas, números e hífens'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  fullName: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const landingPageSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  slug: z
    .string()
    .max(50, 'Slug muito longo')
    .regex(/^[a-z0-9-]{0,50}$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  bio: z.string().max(500, 'Bio muito longa').optional().default(''),
  theme: z.string().default('light'),
})

export const linkSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  url: z.string().url('URL inválida'),
})

export const headerSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
})

const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida')

export const customColorsSchema = z.object({
  background: hexColorSchema.optional(),
  text: hexColorSchema.optional(),
  cardBackground: hexColorSchema.optional(),
  cardText: hexColorSchema.optional(),
})

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url('URL inválida'),
})

export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 2 * 1024 * 1024,
    'Arquivo deve ter no máximo 2MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Formato inválido. Use JPEG, PNG ou WebP'
  ),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type LandingPageInput = z.infer<typeof landingPageSchema>
export type LinkInput = z.infer<typeof linkSchema>
