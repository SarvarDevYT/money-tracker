import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://dogmxjzawxmnmurehkas.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZ214anphd3htbm11cmVoa2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1MzY2ODksImV4cCI6MjExMTExMjY4OX0.vyvkmpSnSQSMLeZp9tzJiYqfBGKvu7rzvJ2Z4GZxG1A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
