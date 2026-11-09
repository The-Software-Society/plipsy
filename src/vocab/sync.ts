import { VocabEntry } from './tracker';
import { MIA } from '@/src/child/profile';
import { env } from '@/src/lib/env';
import { getSupabase } from '@/src/supabase/client';
import { enqueue, drain } from '@/src/lib/queue';
import { DbVocabRow } from '@/src/supabase/types';

const toRow = (entry: VocabEntry): DbVocabRow => ({
  child_id: MIA.id,
  word: entry.word,
  status: entry.status,
  exposure_count: entry.exposureCount,
  introduced_at: entry.introducedAt,
  last_seen_at: entry.lastSeenAt,
  box: entry.box ?? 0,
  state: entry.state ?? 'active',
  clean_count: entry.cleanCount ?? 0,
  lapse_count: entry.lapseCount ?? 0,
  next_review_at: entry.nextReviewAt ?? null,
});

export const syncVocabEntry = async (entry: VocabEntry): Promise<void> => {
  if (!env.cloudSync) return; // progress stays in on-device storage (src/vocab/store.ts)
  const row = toRow(entry);
  const client = getSupabase();
  if (!client) {
    await enqueue({ table: 'print_vocabulary', op: 'upsert', payload: row });
    return;
  }
  try {
    const { error } = await client
      .from('print_vocabulary')
      .upsert(row, { onConflict: 'child_id,word' });
    if (error) {
      await enqueue({ table: 'print_vocabulary', op: 'upsert', payload: row });
    }
  } catch {
    await enqueue({ table: 'print_vocabulary', op: 'upsert', payload: row });
  }
};

export const flushQueue = async () => {
  const client = getSupabase();
  if (!client) return { flushed: 0, failed: 0, queued: 0 };

  return drain(async (item) => {
    try {
      if (item.op === 'upsert') {
        const { error } = await client
          .from(item.table)
          .upsert(item.payload as never, { onConflict: 'child_id,word' });
        return { ok: !error };
      }
      if (item.op === 'insert') {
        const { error } = await client.from(item.table).insert(item.payload as never);
        return { ok: !error };
      }
      if (item.op === 'update') {
        const { id, ...rest } = item.payload as { id: string } & Record<string, unknown>;
        const { error } = await client.from(item.table).update(rest).eq('id', id);
        return { ok: !error };
      }
      return { ok: false };
    } catch {
      return { ok: false };
    }
  });
};
