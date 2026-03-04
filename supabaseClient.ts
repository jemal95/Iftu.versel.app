import { createClient } from '@supabase/supabase-js';

// Environment variables fayyadamna (NEXT_PUBLIC_ prefix ni gorfama)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Qindaa'uun isaa mirkaneessuuf
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project'));

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;
