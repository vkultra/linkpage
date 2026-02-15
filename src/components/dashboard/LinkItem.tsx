import { useState } from 'react'
import type { Link } from '../../types'
import { getFaviconUrl } from '../../lib/utils'
import { LinkForm } from './LinkForm'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Pencil, Trash2, Eye, EyeOff, GripVertical, Type } from 'lucide-react'

interface LinkItemProps {
  link: Link
  onUpdate: (id: string, updates: Partial<Pick<Link, 'title' | 'url' | 'is_active'>>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
}

export function LinkItem({ link, onUpdate, onDelete, dragHandleProps }: LinkItemProps) {
  const [editing, setEditing] = useState(false)
  const isHeader = link.type === 'header'

  if (editing) {
    if (isHeader) {
      return (
        <HeaderEditForm
          initialTitle={link.title}
          onSave={async (title) => {
            await onUpdate(link.id, { title })
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      )
    }

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-800">
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

  // Header rendering
  if (isHeader) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-700/30">
        <button
          className="cursor-grab touch-none text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
          aria-label="Arrastar para reordenar"
          {...dragHandleProps}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <Type className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-slate-500" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-300">{link.title}</p>
        </div>

        <div className="flex items-center gap-1">
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
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Link rendering
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-3 dark:border-slate-700/50 dark:bg-slate-800">
      <button
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
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
        <p className="truncate text-sm font-medium text-gray-900 dark:text-slate-100">{link.title}</p>
        <p className="truncate text-xs text-gray-500 dark:text-slate-400">{link.url}</p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdate(link.id, { is_active: !link.is_active })}
          title={link.is_active ? 'Desativar' : 'Ativar'}
        >
          {link.is_active ? (
            <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
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
          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function HeaderEditForm({ initialTitle, onSave, onCancel }: { initialTitle: string; onSave: (title: string) => Promise<void>; onCancel: () => void }) {
  const [title, setTitle] = useState(initialTitle)
  const [loading, setLoading] = useState(false)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-800">
      <div className="space-y-3">
        <Input
          id="edit-header-title"
          label="Texto do cabeçalho"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            size="sm"
            loading={loading}
            onClick={async () => {
              if (!title.trim()) return
              setLoading(true)
              try { await onSave(title.trim()) } finally { setLoading(false) }
            }}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}
