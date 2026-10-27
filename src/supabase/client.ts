import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/src/lib/env';

let _client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!env.hasSupabase) return null;
  if (_client) return _client;
  _client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
};
