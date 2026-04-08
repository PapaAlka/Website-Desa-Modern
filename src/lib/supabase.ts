import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://etkxfwpbzcxrvwxihxva.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0a3hmd3BiemN4cnZ3eGloeHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzI2OTIsImV4cCI6MjA5MTE0ODY5Mn0.ouV--QUYL3-0IxqxK347lCrjhQlTUQ3UA2t4RrIQFWA';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');

if (!isSupabaseConfigured) {
  console.warn('Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
