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

export function ProfileSettingsPage() {
  const { profile, loading, update } = useProfile()
  const { upload, uploading } = useFileUpload()
  const [fullName, setFullName] = useState('')
  const [initialized, setInitialized] = useState(false)

  if (profile && !initialized) {
    setFullName(profile.full_name)
    setInitialized(true)
  }

  async function handleAvatarUpload(file: File) {
    if (!profile) return
    try {
      const url = await upload(file, 'profile')
      await update({ avatar_url: url })
      toast.success('Avatar atualizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no upload')
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await update({ full_name: fullName })
      toast.success('Perfil atualizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!profile) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações do Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">Gerencie suas informações pessoais</p>
      </div>

      <div className="max-w-lg space-y-6">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900">Avatar</h2>
          <AvatarUpload
            src={profile.avatar_url}
            uploading={uploading}
            onUpload={handleAvatarUpload}
          />
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900">Informações</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="username"
              label="Username"
              value={profile.username}
              disabled
              className="bg-gray-50"
            />
            <Input
              id="fullName"
              label="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit">
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
