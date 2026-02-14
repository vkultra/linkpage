import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import { env } from '../config/env'

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey)
