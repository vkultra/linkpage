import { useEffect, useState } from 'react'
import { useFacebookPixel } from '../../hooks/useFacebookPixel'
import { facebookPixelSchema } from '../../lib/validators'
import { FACEBOOK_EVENTS } from '../../types'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { ChevronDown, ChevronRight, Eye, EyeOff, Facebook, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  pageId: string
}

export function FacebookPixelConfig({ pageId }: Props) {
  const { pixel, loading, save, remove } = useFacebookPixel(pageId)

  const [expanded, setExpanded] = useState(false)
  const [pixelId, setPixelId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [tokenEdited, setTokenEdited] = useState(false)
  const [testEventCode, setTestEventCode] = useState('')
  const [events, setEvents] = useState<string[]>(['PageView'])
  const [isActive, setIsActive] = useState(true)
  const [showToken, setShowToken] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmRemove, setConfirmRemove] = useState(false)

  const hasExistingToken = !!pixel?.access_token && !tokenEdited

  useEffect(() => {
    if (pixel) {
      setPixelId(pixel.pixel_id)
      setAccessToken(pixel.access_token)
      setTokenEdited(false)
      setTestEventCode(pixel.test_event_code || '')
      setEvents(pixel.events)
      setIsActive(pixel.is_active)
      setExpanded(true)
    }
  }, [pixel])

  function toggleEvent(eventName: string) {
    setEvents((prev) =>
      prev.includes(eventName)
        ? prev.filter((e) => e !== eventName)
        : [...prev, eventName]
    )
  }

  async function handleSave() {
    setErrors({})
    const tokenToSave = hasExistingToken ? pixel!.access_token : accessToken
    const result = facebookPixelSchema.safeParse({
      pixel_id: pixelId,
      access_token: tokenToSave,
      test_event_code: testEventCode || undefined,
      events,
      is_active: isActive,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0])
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    try {
      await save(result.data)
      toast.success('Facebook Pixel salvo!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar pixel')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove() {
    if (!confirmRemove) {
      setConfirmRemove(true)
      return
    }
    try {
      await remove()
      setPixelId('')
      setAccessToken('')
      setTestEventCode('')
      setEvents(['PageView'])
      setIsActive(true)
      setConfirmRemove(false)
      toast.success('Facebook Pixel removido')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover pixel')
    }
  }

  if (loading) return null

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-slate-50">Facebook Pixel</h2>
          {pixel && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              pixel.is_active
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'
            }`}>
              {pixel.is_active ? 'Ativo' : 'Inativo'}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <Input
            id="fb-pixel-id"
            label="Pixel ID"
            placeholder="123456789012345"
            value={pixelId}
            onChange={(e) => setPixelId(e.target.value)}
            error={errors.pixel_id}
          />

          <div className="space-y-1">
            <label htmlFor="fb-access-token" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Access Token
            </label>
            <div className="relative">
              <input
                id="fb-access-token"
                type={showToken && !hasExistingToken ? 'text' : 'password'}
                className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-600 ${
                  errors.access_token
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900 dark:focus:ring-slate-400'
                }`}
                value={hasExistingToken ? `••••••••${accessToken.slice(-4)}` : accessToken}
                onChange={(e) => { setAccessToken(e.target.value); setTokenEdited(true) }}
                onFocus={() => { if (hasExistingToken) { setAccessToken(''); setTokenEdited(true) } }}
                placeholder={hasExistingToken ? 'Token salvo — clique para editar' : ''}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.access_token && <p className="text-xs text-red-600">{errors.access_token}</p>}
          </div>

          <Input
            id="fb-test-event-code"
            label="Test Event Code (opcional)"
            placeholder="TEST12345"
            value={testEventCode}
            onChange={(e) => setTestEventCode(e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Eventos</label>
            {errors.events && <p className="text-xs text-red-600">{errors.events}</p>}
            <div className="grid grid-cols-2 gap-2">
              {FACEBOOK_EVENTS.map((event) => (
                <label
                  key={event.value}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
                >
                  <input
                    type="checkbox"
                    checked={events.includes(event.value)}
                    onChange={() => toggleEvent(event.value)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-slate-500 dark:bg-slate-800 dark:focus:ring-slate-400"
                  />
                  <span className="text-gray-700 dark:text-slate-300">{event.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-slate-600">
            <span className="text-sm text-gray-700 dark:text-slate-300">Pixel ativo</span>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            {pixel ? (
              <Button
                variant="danger"
                size="sm"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" />
                {confirmRemove ? 'Confirmar remoção' : 'Remover'}
              </Button>
            ) : (
              <div />
            )}
            <Button onClick={handleSave} loading={saving} size="sm">
              Salvar Pixel
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
