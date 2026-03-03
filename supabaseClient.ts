
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Assuming these environment variables are provided similarly to the API_KEY
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
