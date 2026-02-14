import { useState } from 'react'
import { fileUploadSchema } from '../lib/validators'
import { uploadAvatar } from '../services/storage.service'
import { useAuth } from './useAuth'

export function useFileUpload() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)

  async function upload(file: File, fileId: string): Promise<string> {
    if (!user) throw new Error('Not authenticated')

    const result = fileUploadSchema.safeParse({ file })
    if (!result.success) {
      throw new Error(result.error.issues[0].message)
    }

    setUploading(true)
    try {
      return await uploadAvatar(user.id, fileId, file)
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
