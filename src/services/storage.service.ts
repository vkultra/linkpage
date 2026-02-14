import { supabase } from '../lib/supabase'

export async function uploadAvatar(
  userId: string,
  fileId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'webp'
  const path = `${userId}/${fileId}.${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function deleteAvatar(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('avatars')
    .remove([path])
  if (error) throw error
}
