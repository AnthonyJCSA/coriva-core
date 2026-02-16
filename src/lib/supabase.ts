import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ Configured' : '❌ Missing',
  key: supabaseAnonKey ? '✅ Configured' : '❌ Missing',
  urlValue: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
  keyValue: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET'
})

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!supabase) {
  console.warn('⚠️ Supabase not configured. Using local storage only.')
  console.warn('💡 Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel environment variables')
}
