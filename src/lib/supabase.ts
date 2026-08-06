import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide safe fallback values so createClient does not crash if env vars are missing on Vercel
const validUrl = (supabaseUrl && supabaseUrl.trim() !== '') ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = (supabaseAnonKey && supabaseAnonKey.trim() !== '') ? supabaseAnonKey : 'placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing in environment variables. Falling back to local catalog mode.');
}

export const isSupabaseConfigured = 
  !!supabaseUrl && 
  supabaseUrl.trim() !== '' && 
  !supabaseUrl.includes('your-project-id') && 
  !!supabaseAnonKey && 
  supabaseAnonKey.trim() !== '' && 
  supabaseAnonKey !== 'your-anon-key';

export const supabase = createClient(validUrl, validKey);

