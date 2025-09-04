import { createClient } from '@supabase/supabase-js'

// URL del proyecto para la base de datos (supabase)
const supabaseUrl = 'https://ejelrutzikirrucbjtav.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
