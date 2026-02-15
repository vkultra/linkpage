import { useState } from 'react'
import { useLandingPages } from '../hooks/useLandingPages'
import { useProfile } from '../hooks/useProfile'
import { PageCard } from '../components/dashboard/PageCard'
import { PageForm } from '../components/dashboard/PageForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Plus } from 'lucide-react'
import type { LandingPageInput } from '../lib/validators'
import toast from 'react-hot-toast'

export function DashboardPage() {
  const { pages, loading, create, remove, update } = useLandingPages()
  const { profile } = useProfile()
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(data: LandingPageInput) {
    try {
      await create(data)
      setShowForm(false)
      toast.success('Página criada com sucesso!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar página')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return
    try {
      await remove(id)
      toast.success('Página excluída')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir')
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await update(id, { is_default: true })
      toast.success('Página definida como principal')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao definir como principal')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Minhas Páginas</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Gerencie suas landing pages
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nova Página
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 px-6 py-12 text-center dark:border-slate-600">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Você ainda não tem nenhuma landing page.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4" />
            Criar primeira página
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              username={profile?.username ?? ''}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Nova Landing Page"
      >
        <PageForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitLabel="Criar"
        />
      </Modal>
    </div>
  )
}
