const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
const PARENT_PIN = process.env.EXPO_PUBLIC_PARENT_PIN ?? '1234';
// Cloud sync is OFF unless a parent explicitly opts in. With it off the app is
// fully on-device: nothing about the child (progress, sessions, taps) leaves
// the device, even if Supabase credentials happen to be present.
const CLOUD_SYNC = (process.env.EXPO_PUBLIC_ENABLE_CLOUD_SYNC ?? '').toLowerCase() === 'true';

const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const env = {
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  parentPin: PARENT_PIN,
  hasSupabase,
  cloudSync: CLOUD_SYNC && hasSupabase,
} as const;
