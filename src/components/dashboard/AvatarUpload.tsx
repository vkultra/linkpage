import { useRef } from 'react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Camera } from 'lucide-react'

interface AvatarUploadProps {
  src?: string | null
  uploading?: boolean
  onUpload: (file: File) => void
}

export function AvatarUpload({ src, uploading = false, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar src={src} size="lg" />
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white shadow-sm hover:bg-gray-800"
          aria-label="Alterar avatar"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          loading={uploading}
        >
          Alterar foto
        </Button>
        <p className="mt-1 text-xs text-gray-500">JPG, PNG ou WebP. Max 2MB.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
