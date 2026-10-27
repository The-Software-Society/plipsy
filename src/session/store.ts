import { create } from 'zustand';
import { MIA } from '@/src/child/profile';
import { getSupabase } from '@/src/supabase/client';
import { enqueue } from '@/src/lib/queue';
import { DbSessionRow, DbSessionEventRow } from '@/src/supabase/types';

type ActiveSession = {
  id: string;
  storyId: string;
  startedAt: string;
};

type SessionState = {
  active: ActiveSession | null;
  start: (storyId: string) => Promise<ActiveSession>;
  log: (eventType: DbSessionEventRow['event_type'], payload?: Record<string, unknown>) => Promise<void>;
  end: (completed: boolean) => Promise<void>;
};

const newId = () =>
  // RFC4122-ish but not strictly. Good enough for non-cryptographic IDs.
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const insertRow = async (table: 'sessions' | 'session_events', row: Record<string, unknown>) => {
  const client = getSupabase();
  if (!client) {
    await enqueue({ table, op: 'insert', payload: row });
    return;
  }
  try {
    const { error } = await client.from(table).insert(row as never);
    if (error) await enqueue({ table, op: 'insert', payload: row });
  } catch {
    await enqueue({ table, op: 'insert', payload: row });
  }
};

const updateRow = async (table: 'sessions', payload: { id: string } & Record<string, unknown>) => {
  const client = getSupabase();
  if (!client) {
    await enqueue({ table, op: 'update', payload });
    return;
  }
  try {
    const { id, ...rest } = payload;
    const { error } = await client.from(table).update(rest).eq('id', id);
    if (error) await enqueue({ table, op: 'update', payload });
  } catch {
    await enqueue({ table, op: 'update', payload });
  }
};

export const useSession = create<SessionState>((set, get) => ({
  active: null,

  start: async (storyId: string) => {
    const session: ActiveSession = {
      id: newId(),
      storyId,
      startedAt: new Date().toISOString(),
    };
    set({ active: session });
    const row: DbSessionRow = {
      id: session.id,
      child_id: MIA.id,
      story_id: storyId,
      started_at: session.startedAt,
      ended_at: null,
      completed: false,
    };
    await insertRow('sessions', row);
    return session;
  },

  log: async (eventType, payload = {}) => {
    const active = get().active;
    if (!active) return;
    const row: DbSessionEventRow = {
      session_id: active.id,
      event_type: eventType,
      payload,
      occurred_at: new Date().toISOString(),
    };
    await insertRow('session_events', row);
  },

  end: async (completed: boolean) => {
    const active = get().active;
    if (!active) return;
    set({ active: null });
    await updateRow('sessions', {
      id: active.id,
      ended_at: new Date().toISOString(),
      completed,
    });
  },
}));
