// "What to play next": the SRS layer decides between a review session (when
// enough words are due) and the next pathway story. The pathway provides order;
// the SRS keeps earlier words alive underneath.

import { VocabEntry, dueWords } from '@/src/vocab/tracker';
import { MODULE_1, Unit } from '@/src/curriculum/pathways';

export type NextSession =
  | { type: 'story'; storyId: string; unit: Unit }
  | { type: 'review'; words: string[] };

const REVIEW_THRESHOLD = 3; // surface a review once this many words are due
const REVIEW_MAX = 6;

const isIntroduced = (entries: Record<string, VocabEntry>, word: string): boolean =>
  word.toUpperCase() in entries;

// First unit that still has an unintroduced target word (else the last unit).
export const currentUnit = (entries: Record<string, VocabEntry>): Unit => {
  const next = MODULE_1.units.find((u) =>
    u.targetWords.some((w) => !isIntroduced(entries, w))
  );
  return next ?? MODULE_1.units[MODULE_1.units.length - 1]!;
};

export const currentUnitIndex = (entries: Record<string, VocabEntry>): number => {
  const idx = MODULE_1.units.findIndex((u) =>
    u.targetWords.some((w) => !isIntroduced(entries, w))
  );
  return idx < 0 ? MODULE_1.units.length - 1 : idx;
};

export const selectNextSession = (entries: Record<string, VocabEntry>): NextSession => {
  const due = dueWords(entries).map((e) => e.word);
  if (due.length >= REVIEW_THRESHOLD) {
    return { type: 'review', words: due.slice(0, REVIEW_MAX) };
  }
  const unit = currentUnit(entries);
  return { type: 'story', storyId: unit.storyId, unit };
};
