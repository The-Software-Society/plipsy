import AsyncStorage from '@react-native-async-storage/async-storage';

export type QueuedWrite = {
  id: string;
  table: 'print_vocabulary' | 'sessions' | 'session_events';
  op: 'upsert' | 'update' | 'insert';
  payload: Record<string, unknown>;
  attempts: number;
  enqueuedAt: string;
};

const STORAGE_KEY = '@mia/write-queue/v1';
const MAX_ATTEMPTS = 5;

let memoryQueue: QueuedWrite[] = [];
let loaded = false;

const persist = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(memoryQueue));
  } catch {
    /* noop */
  }
};

const load = async () => {
  if (loaded) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    memoryQueue = raw ? JSON.parse(raw) : [];
  } catch {
    memoryQueue = [];
  }
  loaded = true;
};

export const enqueue = async (write: Omit<QueuedWrite, 'id' | 'attempts' | 'enqueuedAt'>) => {
  await load();
  memoryQueue.push({
    ...write,
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    attempts: 0,
    enqueuedAt: new Date().toISOString(),
  });
  await persist();
};

export const drain = async (
  flush: (item: QueuedWrite) => Promise<{ ok: boolean }>
): Promise<{ flushed: number; failed: number; queued: number }> => {
  await load();
  const next: QueuedWrite[] = [];
  let flushed = 0;
  let failed = 0;

  for (const item of memoryQueue) {
    try {
      const { ok } = await flush(item);
      if (ok) {
        flushed++;
        continue;
      }
      const attempts = item.attempts + 1;
      if (attempts >= MAX_ATTEMPTS) {
        failed++;
        continue;
      }
      next.push({ ...item, attempts });
    } catch {
      const attempts = item.attempts + 1;
      if (attempts >= MAX_ATTEMPTS) {
        failed++;
      } else {
        next.push({ ...item, attempts });
      }
    }
  }

  memoryQueue = next;
  await persist();
  return { flushed, failed, queued: next.length };
};

export const queueLength = async () => {
  await load();
  return memoryQueue.length;
};

export const peek = async () => {
  await load();
  return [...memoryQueue];
};
