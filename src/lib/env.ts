const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
const PARENT_PIN = process.env.EXPO_PUBLIC_PARENT_PIN ?? '1234';

export const env = {
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  parentPin: PARENT_PIN,
  hasSupabase: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
} as const;
