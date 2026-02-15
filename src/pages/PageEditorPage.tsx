import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useBeforeUnload } from 'react-router-dom'
import { getLandingPage, updateLandingPage } from '../services/landing-page.service'
import { useLinks } from '../hooks/useLinks'
import { useAuth } from '../hooks/useAuth'
import { useFileUpload } from '../hooks/useFileUpload'
import { LinkList } from '../components/dashboard/LinkList'
import { LinkForm } from '../components/dashboard/LinkForm'
import { ThemeSelector } from '../components/dashboard/ThemeSelector'
import { AvatarUpload } from '../components/dashboard/AvatarUpload'
import { CustomColorEditor } from '../components/dashboard/CustomColorEditor'
import { ButtonStyleSelector } from '../components/dashboard/ButtonStyleSelector'
import { FontSelector } from '../components/dashboard/FontSelector'
import { SocialLinksEditor } from '../components/dashboard/SocialLinksEditor'
import { FacebookPixelConfig } from '../components/dashboard/FacebookPixelConfig'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { PagePreview } from '../components/dashboard/PagePreview'
import { getTheme } from '../themes'
import { ArrowLeft, Plus, Save, Type } from 'lucide-react'
import type { LandingPage, ThemeName, PageCustomization, CustomColors, ButtonStyle, FontFamily, SocialLink, Link } from '../types'
import type { Json } from '../types/database'
import toast from 'react-hot-toast'

function parseCustomization(raw: unknown): PageCustomization {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as PageCustomization
  }
  return {}
}

export function PageEditorPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { links, loading: linksLoading, create, update: updateLink, remove, reorder } = useLinks(pageId)
  const { upload, uploading } = useFileUpload()

  const [page, setPage] = useState<LandingPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [showHeaderForm, setShowHeaderForm] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [bio, setBio] = useState('')
  const [theme, setTheme] = useState<ThemeName>('light')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Customization state
  const [customColors, setCustomColors] = useState<CustomColors>({})
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>('rounded')
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  // Dirty state tracking
  const [isDirty, setIsDirty] = useState(false)
  const initialStateRef = useRef<string>('')

  useBeforeUnload(
    useCallback((e) => {
      if (isDirty) e.preventDefault()
    }, [isDirty])
  )

  const fetchPage = useCallback(async () => {
    if (!pageId || !user) return
    try {
      const data = await getLandingPage(pageId, user.id)
      setPage(data)
      setTitle(data.title)
      setSlug(data.slug)
      setBio(data.bio)
      setTheme(data.theme as ThemeName)
      setAvatarUrl(data.avatar_url)

      const cust = parseCustomization(data.customization)
      setCustomColors(cust.customColors ?? {})
      setButtonStyle(cust.buttonStyle ?? 'rounded')
      setFontFamily(cust.fontFamily ?? 'inter')
      setSocialLinks(cust.socialLinks ?? [])

      initialStateRef.current = JSON.stringify({ title: data.title, slug: data.slug, bio: data.bio, theme: data.theme, avatar_url: data.avatar_url, customization: cust })
      setIsDirty(false)
    } catch {
      toast.error('Página não encontrada')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }, [pageId, user, navigate])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  // Track changes
  useEffect(() => {
    if (!page) return
    const cust: PageCustomization = {}
    if (Object.keys(customColors).length > 0) cust.customColors = customColors
    if (buttonStyle !== 'rounded') cust.buttonStyle = buttonStyle
    if (fontFamily !== 'inter') cust.fontFamily = fontFamily
    if (socialLinks.length > 0) cust.socialLinks = socialLinks
    const current = JSON.stringify({ title, slug, bio, theme, avatar_url: avatarUrl, customization: cust })
    setIsDirty(current !== initialStateRef.current)
  }, [page, title, slug, bio, theme, avatarUrl, customColors, buttonStyle, fontFamily, socialLinks])

  function buildCustomization(): PageCustomization {
    const cust: PageCustomization = {}
    if (Object.keys(customColors).length > 0) cust.customColors = customColors
    if (buttonStyle !== 'rounded') cust.buttonStyle = buttonStyle
    if (fontFamily !== 'inter') cust.fontFamily = fontFamily
    if (socialLinks.length > 0) cust.socialLinks = socialLinks
    return cust
  }

  async function handleSave() {
    if (!pageId || !user) return
    setSaving(true)
    try {
      const customization = buildCustomization()
      const updated = await updateLandingPage(pageId, user.id, {
        title,
        slug,
        bio,
        theme,
        avatar_url: avatarUrl,
        customization: (Object.keys(customization).length > 0 ? customization : {}) as Json,
      })
      setPage(updated)
      initialStateRef.current = JSON.stringify({ title, slug, bio, theme, avatar_url: avatarUrl, customization })
      setIsDirty(false)
      toast.success('Página salva!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarUpload(file: File) {
    if (!pageId || !user) return
    try {
      const url = await upload(file, `page-${pageId}`)
      setAvatarUrl(url)
      await updateLandingPage(pageId, user.id, { avatar_url: url })
      toast.success('Avatar atualizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar avatar')
    }
  }

  async function handleAddLink(data: { title: string; url: string }) {
    try {
      await create({ ...data, type: 'link' })
      setShowLinkForm(false)
      toast.success('Link adicionado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao adicionar link')
    }
  }

  async function handleAddHeader(headerTitle: string) {
    try {
      await create({ title: headerTitle, type: 'header' })
      setShowHeaderForm(false)
      toast.success('Cabeçalho adicionado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao adicionar cabeçalho')
    }
  }

  async function handleUpdateLink(id: string, updates: Partial<Pick<Link, 'title' | 'url' | 'is_active'>>) {
    try {
      await updateLink(id, updates)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar link')
    }
  }

  async function handleDeleteLink(id: string) {
    try {
      await remove(id)
      toast.success('Link removido')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover link')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!page) return null

  const themeConfig = getTheme(theme)
  const customization = buildCustomization()

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-50">Editar Página</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Coluna esquerda - Configurações + Links */}
        <div className="space-y-6">
          {/* Card Informações */}
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-50">Informações</h2>
            <div className="space-y-4">
              <AvatarUpload
                src={avatarUrl}
                uploading={uploading}
                onUpload={handleAvatarUpload}
              />
              <Input
                id="page-title"
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                id="page-slug"
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              />
              <Textarea
                id="page-bio"
                label="Bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </Card>

          {/* Card Aparência */}
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-50">Aparência</h2>
            <div className="space-y-5">
              <ThemeSelector value={theme} onChange={setTheme} />
              <CustomColorEditor
                colors={customColors}
                theme={themeConfig}
                onChange={setCustomColors}
              />
              <ButtonStyleSelector value={buttonStyle} onChange={setButtonStyle} />
              <FontSelector value={fontFamily} onChange={setFontFamily} />
            </div>
          </Card>

          {/* Card Redes Sociais */}
          <Card>
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-50">Redes Sociais</h2>
            <SocialLinksEditor links={socialLinks} onChange={setSocialLinks} />
          </Card>

          {/* Card Links */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-slate-50">Links</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => { setShowHeaderForm(true); setShowLinkForm(false) }}>
                  <Type className="h-4 w-4" />
                  Cabeçalho
                </Button>
                <Button size="sm" onClick={() => { setShowLinkForm(true); setShowHeaderForm(false) }}>
                  <Plus className="h-4 w-4" />
                  Link
                </Button>
              </div>
            </div>

            {showHeaderForm && (
              <HeaderForm
                onSubmit={handleAddHeader}
                onCancel={() => setShowHeaderForm(false)}
              />
            )}

            {showLinkForm && (
              <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-slate-700/50 dark:bg-slate-700/30">
                <LinkForm
                  onSubmit={handleAddLink}
                  onCancel={() => setShowLinkForm(false)}
                  submitLabel="Adicionar"
                />
              </div>
            )}

            {linksLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <LinkList
                links={links}
                onUpdate={handleUpdateLink}
                onDelete={handleDeleteLink}
                onReorder={reorder}
              />
            )}
          </Card>

          {/* Facebook Pixel */}
          <FacebookPixelConfig pageId={pageId!} />

          {/* Botão salvar */}
          <div className="flex justify-end">
            <Button onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4" />
              Salvar alterações
            </Button>
          </div>
        </div>

        {/* Coluna direita - Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <h2 className="mb-4 text-center text-sm font-medium text-gray-500 dark:text-slate-400">Preview</h2>
            <PagePreview
              title={title}
              bio={bio}
              theme={theme}
              avatarUrl={avatarUrl}
              links={links}
              customization={customization}
              socialLinks={socialLinks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function HeaderForm({ onSubmit, onCancel }: { onSubmit: (title: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('')

  return (
    <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-slate-700/50 dark:bg-slate-700/30">
      <div className="space-y-3">
        <Input
          id="header-title"
          label="Texto do cabeçalho"
          placeholder="Ex: Minhas Redes"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={() => { if (title.trim()) onSubmit(title.trim()) }}
            disabled={!title.trim()}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}
