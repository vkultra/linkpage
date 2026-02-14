import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Link } from '../../types'
import { LinkItem } from './LinkItem'

interface SortableLinkItemProps {
  link: Link
  onUpdate: (id: string, updates: Partial<Pick<Link, 'title' | 'url' | 'is_active'>>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function SortableLinkItem({ link, onUpdate, onDelete }: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <LinkItem
        link={link}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={listeners}
      />
    </div>
  )
}
