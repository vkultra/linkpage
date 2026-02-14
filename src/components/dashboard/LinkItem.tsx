import { useState } from 'react'
import type { Link } from '../../types'
import { getFaviconUrl } from '../../lib/utils'
import { LinkForm } from './LinkForm'
import { Button } from '../ui/Button'
import { Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'

interface LinkItemProps {
  link: Link
  onUpdate: (id: string, updates: Partial<Pick<Link, 'title' | 'url' | 'is_active'>>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
}

export function LinkItem({ link, onUpdate, onDelete, dragHandleProps }: LinkItemProps) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <LinkForm
          initialValues={{ title: link.title, url: link.url }}
          onSubmit={async (data) => {
            await onUpdate(link.id, data)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-3">
      <button
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
        aria-label="Arrastar para reordenar"
        {...dragHandleProps}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {link.url && (
        <img
          src={getFaviconUrl(link.url)}
          alt=""
          className="h-5 w-5 flex-shrink-0"
          loading="lazy"
        />
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{link.title}</p>
        <p className="truncate text-xs text-gray-500">{link.url}</p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdate(link.id, { is_active: !link.is_active })}
          title={link.is_active ? 'Desativar' : 'Ativar'}
        >
          {link.is_active ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing(true)}
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(link.id)}
          title="Excluir"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
