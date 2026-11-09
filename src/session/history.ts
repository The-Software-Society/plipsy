import AsyncStorage from '@react-native-async-storage/async-storage';

// On-device record of recent story sessions for the parent dashboard. Only
// story id, start/end time and completion are kept, capped at MAX entries.
export type LocalSession = {
  id: string;
  story_id: string;
  started_at: string;
  ended_at: string | null;
  completed: boolean;
};

const KEY = '@mia/sessions/v1';
const MAX = 20;

const read = async (): Promise<LocalSession[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalSession[]) : [];
  } catch {
    return [];
  }
};

const write = async (list: LocalSession[]) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* noop */
  }
};

export const recordSessionStart = async (s: LocalSession) => {
  const list = await read();
  await write([s, ...list.filter((x) => x.id !== s.id)]);
};

export const recordSessionEnd = async (id: string, endedAt: string, completed: boolean) => {
  const list = await read();
  await write(list.map((x) => (x.id === id ? { ...x, ended_at: endedAt, completed } : x)));
};

export const recentSessions = read;
