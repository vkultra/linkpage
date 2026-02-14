import { supabase } from '../lib/supabase'
import type { RegisterInput, LoginInput } from '../lib/validators'

export async function signUp({ email, password, username, fullName }: RegisterInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
    },
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }: LoginInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
