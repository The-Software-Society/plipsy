// Builds a short, interleaved review "visit" for a friend: due words, rotated
// across the mini-games, with fair distractors. Recognition games work for any
// word; snack/plant need a word icon.

import { VocabEntry, dueWords } from '@/src/vocab/tracker';
import { friendById } from '@/src/world/friends';
import { getStory } from '@/src/stories';
import { hasIllustration } from '@/src/stories/illustration-manifest';

export type ReviewGame = 'peekaboo' | 'snack' | 'bubble' | 'plant';
export type ReviewItem = { word: string; game: ReviewGame; options: string[] };

const iconWord = (w: string) => hasIllustration(`choice.${w.toLowerCase()}`);

const friendWordSet = (friendId: string | undefined): Set<string> | null => {
  const f = friendId ? friendById(friendId) : undefined;
  if (!f) return null;
  const set = new Set<string>();
  for (const id of f.storyIds) {
    const s = getStory(id);
    for (const w of s?.targetWords ?? []) set.add(w.toUpperCase());
    for (const w of s?.reviewWords ?? []) set.add(w.toUpperCase());
  }
  return set;
};

const pickDistractors = (word: string, pool: string[], needIcon: boolean, n = 2): string[] => {
  const candidates = pool.filter((w) => w !== word && (!needIcon || iconWord(w)));
  // stable-ish shuffle by word hash so it's deterministic per session build
  const seeded = [...candidates].sort((a, b) => (a + word).localeCompare(b + word));
  return seeded.slice(0, n);
};

export const buildReviewNode = (
  entries: Record<string, VocabEntry>,
  friendId?: string
): ReviewItem[] => {
  const fset = friendWordSet(friendId);
  const known = (w: string) => w in entries;
  let due = dueWords(entries).map((e) => e.word);
  if (fset) {
    const f = due.filter((w) => fset.has(w));
    due = f.length ? f : due;
  }
  due = [...new Set(due)].slice(0, 4);
  // Fallback (also lets a friend be practiced anytime): the friend's known
  // words, else any known words.
  if (due.length === 0) {
    const fallback = fset
      ? [...fset].filter(known)
      : Object.keys(entries);
    due = fallback.slice(0, 4);
  }
  if (due.length === 0) return [];

  // distractor pool = all known words (+ the due set), uppercase
  const pool = [...new Set([...Object.keys(entries), ...due])];

  const items: ReviewItem[] = [];
  due.forEach((w, i) => {
    const recog: ReviewGame = i % 2 === 0 ? 'peekaboo' : 'bubble';
    items.push({ word: w, game: recog, options: [w, ...pickDistractors(w, pool, false)] });
    // second encounter: snack/plant if it has an icon, else the other recog
    const second: ReviewGame = iconWord(w)
      ? i % 2 === 0
        ? 'snack'
        : 'plant'
      : recog === 'peekaboo'
        ? 'bubble'
        : 'peekaboo';
    const opts = second === 'plant' ? [w] : [w, ...pickDistractors(w, pool, second === 'snack')];
    items.push({ word: w, game: second, options: opts });
  });

  // interleave so the same word isn't back-to-back
  return interleave(items).slice(0, 8);
};

const interleave = (items: ReviewItem[]): ReviewItem[] => {
  const out: ReviewItem[] = [];
  const queue = [...items];
  while (queue.length) {
    const idx = queue.findIndex((it) => out.length === 0 || it.word !== out[out.length - 1]!.word);
    out.push(queue.splice(idx < 0 ? 0 : idx, 1)[0]!);
  }
  return out;
};
