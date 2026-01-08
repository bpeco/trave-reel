// app/lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yqhntlvzwhqffteasxtx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaG50bHZ6d2hxZmZ0ZWFzeHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzI3ODUsImV4cCI6MjA2NjcwODc4NX0.Kvi7kqD8-vCnSWgz6kRdslCCk9aluXr7C077F9JvY4Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: 'travel-reel' },
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
