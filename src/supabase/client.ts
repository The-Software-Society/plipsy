import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/src/lib/env';

let _client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  // Opt-in only: no client (and so no network) unless EXPO_PUBLIC_ENABLE_CLOUD_SYNC=true.
  if (!env.cloudSync) return null;
  if (_client) return _client;
  _client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
};
