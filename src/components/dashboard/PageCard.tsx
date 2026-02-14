import { Link } from 'react-router-dom'
import type { LandingPage } from '../../types'
import { Card } from '../ui/Card'
import { ExternalLink, Pencil, Trash2, Star } from 'lucide-react'
import { Button } from '../ui/Button'

interface PageCardProps {
  page: LandingPage
  username: string
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

export function PageCard({ page, username, onDelete, onSetDefault }: PageCardProps) {
  const publicUrl = page.slug
    ? `/${username}/${page.slug}`
    : `/${username}`

  return (
    <Card className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-gray-900">
            {page.title || 'Sem título'}
          </h3>
          {page.is_default && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              <Star className="h-3 w-3" />
              Principal
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-gray-500">
          {page.slug ? `/${username}/${page.slug}` : `/${username}`}
        </p>
      </div>

      <div className="flex items-center gap-1">
        {!page.is_default && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetDefault(page.id)}
            title="Definir como principal"
          >
            <Star className="h-4 w-4" />
          </Button>
        )}
        <Link to={publicUrl} target="_blank">
          <Button variant="ghost" size="sm" title="Visualizar">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
        <Link to={`/dashboard/pages/${page.id}`}>
          <Button variant="ghost" size="sm" title="Editar">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(page.id)}
          title="Excluir"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
