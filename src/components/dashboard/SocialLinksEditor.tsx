import { useState } from 'react'
import { socialPlatforms } from '../../lib/social-platforms'
import type { SocialLink } from '../../types'
import { Input } from '../ui/Input'
import { X } from 'lucide-react'

interface SocialLinksEditorProps {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
}

export function SocialLinksEditor({ links, onChange }: SocialLinksEditorProps) {
  const [addingPlatform, setAddingPlatform] = useState<string | null>(null)
  const usedPlatforms = new Set(links.map((l) => l.platform))
  const availablePlatforms = socialPlatforms.filter((p) => !usedPlatforms.has(p.key))

  function addLink(platform: string, url: string) {
    if (!url.trim()) return
    onChange([...links, { platform, url: url.trim() }])
    setAddingPlatform(null)
  }

  function removeLink(platform: string) {
    onChange(links.filter((l) => l.platform !== platform))
  }

  function updateUrl(platform: string, url: string) {
    onChange(links.map((l) => l.platform === platform ? { ...l, url } : l))
  }

  return (
    <div className="space-y-3">
      {/* Active links */}
      {links.map((link) => {
        const platform = socialPlatforms.find((p) => p.key === link.platform)
        if (!platform) return null
        return (
          <div key={link.platform} className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: platform.color + '1a' }}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill={platform.color}>
                <path d={platform.icon} />
              </svg>
            </div>
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateUrl(link.platform, e.target.value)}
              placeholder={platform.placeholder}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeLink(link.platform)}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}

      {/* Add platform */}
      {addingPlatform ? (
        <AddLinkForm
          platform={socialPlatforms.find((p) => p.key === addingPlatform)!}
          onAdd={(url) => addLink(addingPlatform, url)}
          onCancel={() => setAddingPlatform(null)}
        />
      ) : (
        availablePlatforms.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {availablePlatforms.map((platform) => (
              <button
                key={platform.key}
                type="button"
                onClick={() => setAddingPlatform(platform.key)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill={platform.color}>
                  <path d={platform.icon} />
                </svg>
                {platform.label}
              </button>
            ))}
          </div>
        )
      )}
    </div>
  )
}

function AddLinkForm({
  platform,
  onAdd,
  onCancel,
}: {
  platform: (typeof socialPlatforms)[number]
  onAdd: (url: string) => void
  onCancel: () => void
}) {
  const [url, setUrl] = useState('')

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: platform.color + '1a' }}>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill={platform.color}>
          <path d={platform.icon} />
        </svg>
      </div>
      <Input
        id={`social-${platform.key}`}
        placeholder={platform.placeholder}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); onAdd(url) }
          if (e.key === 'Escape') onCancel()
        }}
      />
      <button
        type="button"
        onClick={() => onAdd(url)}
        className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
      >
        Adicionar
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-gray-500 hover:text-gray-700"
      >
        Cancelar
      </button>
    </div>
  )
}
