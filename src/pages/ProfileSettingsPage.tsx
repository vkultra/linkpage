import { useState, type FormEvent } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useFileUpload } from '../hooks/useFileUpload'
import { AvatarUpload } from '../components/dashboard/AvatarUpload'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile } from '../types'

export function ProfileSettingsPage() {
  const { profile, loading, update } = useProfile()
  const { upload, uploading } = useFileUpload()

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!profile) return null

  return (
    <ProfileSettingsForm
      profile={profile}
      uploading={uploading}
      onUpdate={update}
      onUpload={upload}
    />
  )
}

function ProfileSettingsForm({
  profile,
  uploading,
  onUpdate,
  onUpload,
}: {
  profile: Profile
  uploading: boolean
  onUpdate: (updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) => Promise<Profile>
  onUpload: (file: File, fileId: string) => Promise<string>
}) {
  const [fullName, setFullName] = useState(profile.full_name)

  async function handleAvatarUpload(file: File) {
    try {
      const url = await onUpload(file, 'profile')
      await onUpdate({ avatar_url: url })
      toast.success('Avatar atualizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no upload')
    }
  }

  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onUpdate({ full_name: fullName })
      toast.success('Perfil atualizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Configurações do Perfil</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Gerencie suas informações pessoais</p>
      </div>

      <div className="max-w-lg space-y-6">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-50">Avatar</h2>
          <AvatarUpload
            src={profile.avatar_url}
            uploading={uploading}
            onUpload={handleAvatarUpload}
          />
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-slate-50">Informações</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="username"
              label="Username"
              value={profile.username}
              disabled
              className="bg-gray-50 dark:bg-slate-900"
            />
            <Input
              id="fullName"
              label="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={saving} disabled={saving}>
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
