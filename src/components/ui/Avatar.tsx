import { cn } from '../../lib/utils'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28',
}

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
  xl: 'h-14 w-14',
}

const sizePixels = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 112,
}

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const px = sizePixels[size]

  return (
    <div
      className={cn(
        'relative flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          width={px}
          height={px}
          loading={size === 'xl' ? 'eager' : 'lazy'}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User className={cn('text-gray-400 dark:text-slate-500', iconSizeClasses[size])} />
        </div>
      )}
    </div>
  )
}
