import { useState, type FormEvent } from 'react'
import { linkSchema } from '../../lib/validators'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface LinkFormProps {
  initialValues?: { title: string; url: string }
  onSubmit: (data: { title: string; url: string }) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function LinkForm({ initialValues, onSubmit, onCancel, submitLabel = 'Salvar' }: LinkFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [url, setUrl] = useState(initialValues?.url ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = linkSchema.safeParse({ title, url })
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        id="link-title"
        label="Título"
        placeholder="Ex: Meu Portfolio"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />
      <Input
        id="link-url"
        label="URL"
        type="url"
        placeholder="https://exemplo.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={errors.url}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
