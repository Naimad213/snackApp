import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://qsocadsqpxltekoqpchg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzb2NhZHNxcHhsdGVrb3FwY2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NzQ0NTEsImV4cCI6MjA2NDM1MDQ1MX0.Pk8j5n3uupOr0ocJWFKZUe7hrmZZMp3yPe5IJ_neM5I';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase; 