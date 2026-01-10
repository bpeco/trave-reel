// app/lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fhonxmsnbuiwnjhwavvt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZob254bXNuYnVpd25qaHdhdnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTg4NjgsImV4cCI6MjA4MzUzNDg2OH0.Ybuc9jEmL786tbR7n2B2sth3_fvRO161lqdsIbcXC0k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: 'public' },
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
