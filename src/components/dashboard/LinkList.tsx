import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Link } from '../../types'
import { SortableLinkItem } from './SortableLinkItem'
import toast from 'react-hot-toast'

interface LinkListProps {
  links: Link[]
  onUpdate: (id: string, updates: Partial<Pick<Link, 'title' | 'url' | 'is_active'>>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onReorder: (oldIndex: number, newIndex: number) => Promise<void>
}

export function LinkList({ links, onUpdate, onDelete, onReorder }: LinkListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = links.findIndex((l) => l.id === active.id)
    const newIndex = links.findIndex((l) => l.id === over.id)

    onReorder(oldIndex, newIndex).catch(() => {
      toast.error('Erro ao reordenar links')
    })
  }

  if (links.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 text-center dark:border-slate-600">
        <p className="text-sm text-gray-500 dark:text-slate-400">Nenhum link adicionado ainda.</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {links.map((link) => (
            <SortableLinkItem
              key={link.id}
              link={link}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
