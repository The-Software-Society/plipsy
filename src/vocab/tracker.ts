export type VocabStatus = 'introduced' | 'learning' | 'mastered';
export type SrsState = 'active' | 'longTerm' | 'problem';

export type VocabEntry = {
  word: string;
  status: VocabStatus; // legacy status (derived from SRS); kept for back-compat
  exposureCount: number;
  introducedAt: string;
  lastSeenAt: string;
  // SRS (Leitner) fields - optional so older persisted entries still load.
  box?: number; // 0..5
  state?: SrsState;
  cleanCount?: number; // clean reps total (0 errors)
  cleanSpellCount?: number; // clean PRODUCTION reps (spelled it) - gate for long-term
  lapseCount?: number; // lapses (>=2 errors on a rep)
  nextReviewAt?: string;
};

export const MASTERY_THRESHOLD = 5; // legacy

const DAY = 86_400_000;
// Days until next review, indexed by box (0..5). box 5 = long-term cadence.
const BOX_INTERVAL_DAYS = [1, 1, 3, 7, 14, 28];
const LONG_TERM_DAYS = 30;

const now = () => new Date().toISOString();
const upper = (w: string) => w.toUpperCase();

const newEntry = (w: string, ts: string): VocabEntry => ({
  word: w,
  status: 'introduced',
  exposureCount: 0,
  introducedAt: ts,
  lastSeenAt: ts,
  box: 0,
  state: 'active',
  cleanCount: 0,
  cleanSpellCount: 0,
  lapseCount: 0,
  nextReviewAt: ts,
});

const legacyStatus = (state: SrsState, box: number): VocabStatus =>
  state === 'longTerm' ? 'mastered' : box >= 1 ? 'learning' : 'introduced';

// Apply one spelling rep. errors = number of wrong drops during the spell.
// 0 = clean (advance a box), 1 = messy (hold), >=2 = lapse (reset + maybe problem).
// isProduction = the child SPELLED the word (vs. a recognition tap). A word can
// climb boxes via recognition, but only reaches long-term (blooms) after ≥1
// clean spell - so easy guessing never fakes mastery.
export const applyRep = (
  entries: Record<string, VocabEntry>,
  word: string,
  errors: number,
  isProduction = false
): VocabEntry => {
  const w = upper(word);
  const ts = now();
  const e = entries[w] ?? newEntry(w, ts);

  let box = e.box ?? 0;
  let state: SrsState = e.state ?? 'active';
  let lapseCount = e.lapseCount ?? 0;
  let cleanCount = e.cleanCount ?? 0;
  let cleanSpellCount = e.cleanSpellCount ?? 0;

  if (errors >= 2) {
    box = 1;
    lapseCount += 1;
    if (lapseCount >= 3) state = 'problem';
  } else if (errors === 1) {
    box = Math.max(box, 1); // hold position, review again soon
  } else {
    cleanCount += 1;
    if (isProduction) cleanSpellCount += 1;
    if (box >= 5) {
      // Hold at box 5 until the word has been spelled cleanly at least once.
      if (cleanSpellCount >= 1) state = 'longTerm';
    } else {
      box = box + 1;
    }
    if (state === 'problem' && box >= 3) state = 'active';
  }

  const intervalDays = state === 'longTerm' ? LONG_TERM_DAYS : BOX_INTERVAL_DAYS[box] ?? 1;
  const nextReviewAt = new Date(Date.now() + intervalDays * DAY).toISOString();

  return {
    ...e,
    word: w,
    box,
    state,
    lapseCount,
    cleanCount,
    cleanSpellCount,
    exposureCount: (e.exposureCount ?? 0) + 1,
    introducedAt: e.introducedAt ?? ts,
    lastSeenAt: ts,
    nextReviewAt,
    status: legacyStatus(state, box),
  };
};

export const dueWords = (
  entries: Record<string, VocabEntry>,
  nowIso: string = now()
): VocabEntry[] =>
  Object.values(entries)
    .filter((e) => e.nextReviewAt != null && e.nextReviewAt <= nowIso)
    .sort((a, b) => {
      const ap = a.state === 'problem' ? 0 : 1;
      const bp = b.state === 'problem' ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return (a.nextReviewAt ?? '').localeCompare(b.nextReviewAt ?? '');
    });

export const activeCap = (entries: Record<string, VocabEntry>): number => {
  const longTerm = Object.values(entries).filter((e) => e.state === 'longTerm').length;
  return Math.min(8, 4 + Math.floor(longTerm / 5));
};

export const activeLearningCount = (entries: Record<string, VocabEntry>): number =>
  Object.values(entries).filter((e) => (e.state ?? 'active') === 'active' && (e.box ?? 0) <= 2)
    .length;

export const problemCount = (entries: Record<string, VocabEntry>): number =>
  Object.values(entries).filter((e) => e.state === 'problem').length;

export const canIntroduce = (entries: Record<string, VocabEntry>): boolean =>
  activeLearningCount(entries) < activeCap(entries) && problemCount(entries) < 2;

export const countsByState = (entries: Record<string, VocabEntry>): Record<SrsState, number> => {
  const out: Record<SrsState, number> = { active: 0, longTerm: 0, problem: 0 };
  for (const e of Object.values(entries)) out[e.state ?? 'active'] += 1;
  return out;
};

// ----- legacy API (kept; highlight taps still call recordExposure) -----
export const introduce = (entries: Record<string, VocabEntry>, word: string): VocabEntry => {
  const w = upper(word);
  const ts = now();
  const existing = entries[w];
  if (existing) return { ...existing, lastSeenAt: ts };
  return { ...newEntry(w, ts), exposureCount: 1 };
};

export const expose = (entries: Record<string, VocabEntry>, word: string): VocabEntry | null => {
  const w = upper(word);
  const existing = entries[w];
  if (!existing) return null;
  return { ...existing, exposureCount: (existing.exposureCount ?? 0) + 1, lastSeenAt: now() };
};

export const isMastered = (entries: Record<string, VocabEntry>, word: string): boolean => {
  const e = entries[upper(word)];
  return e?.state === 'longTerm' || e?.status === 'mastered';
};

export const isKnown = (entries: Record<string, VocabEntry>, word: string): boolean =>
  upper(word) in entries;

export const wordsByStatus = (
  entries: Record<string, VocabEntry>
): Record<VocabStatus, VocabEntry[]> => {
  const out: Record<VocabStatus, VocabEntry[]> = { introduced: [], learning: [], mastered: [] };
  for (const e of Object.values(entries)) out[e.status].push(e);
  for (const status of ['introduced', 'learning', 'mastered'] as VocabStatus[]) {
    out[status].sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
  }
  return out;
};
