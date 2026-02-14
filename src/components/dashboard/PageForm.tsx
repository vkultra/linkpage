import { useState, type FormEvent } from 'react'
import { landingPageSchema, type LandingPageInput } from '../../lib/validators'
import { slugify } from '../../lib/utils'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'

interface PageFormProps {
  initialValues?: Partial<LandingPageInput>
  onSubmit: (data: LandingPageInput) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function PageForm({ initialValues, onSubmit, onCancel, submitLabel = 'Salvar' }: PageFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [bio, setBio] = useState(initialValues?.bio ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!initialValues?.slug)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (autoSlug) {
      setSlug(slugify(value))
    }
  }

  function handleSlugChange(value: string) {
    setAutoSlug(false)
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = landingPageSchema.safeParse({ title, slug, bio })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      await onSubmit(result.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Título"
        placeholder="Minha Landing Page"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        error={errors.title}
      />
      <Input
        id="slug"
        label="Slug (URL)"
        placeholder="minha-pagina"
        value={slug}
        onChange={(e) => handleSlugChange(e.target.value)}
        error={errors.slug}
      />
      <Textarea
        id="bio"
        label="Bio"
        placeholder="Uma breve descrição..."
        rows={3}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        error={errors.bio}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
