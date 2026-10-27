// Derives the whole world view from the child's progress: which friend glows,
// who's asleep/locked, and the garden flowers. Pure - no side effects.

import { VocabEntry, dueWords } from '@/src/vocab/tracker';
import { getStory } from '@/src/stories';
import { FRIENDS, Friend } from './friends';

export type FriendStatus = 'comingSoon' | 'locked' | 'ready' | 'wantsPlay' | 'home';
export type FriendView = Friend & {
  status: FriendStatus;
  nextStoryId: string | null;
  dueWords: string[];
};
export type Flower = { word: string; kind: 'sprout' | 'flower'; variant: 'a' | 'b' | 'c' };
export type WorldView = {
  friends: FriendView[];
  glowFriendId: string | null;
  flowers: Flower[];
};

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// All words a friend's built stories teach/review.
const friendWords = (f: Friend): string[] => {
  const set = new Set<string>();
  for (const id of f.storyIds) {
    const s = getStory(id);
    for (const w of s?.targetWords ?? []) set.add(w.toUpperCase());
    for (const w of s?.reviewWords ?? []) set.add(w.toUpperCase());
  }
  return [...set];
};

const allDone = (f: Friend, completed: string[]) =>
  f.storyIds.length > 0 && f.storyIds.every((s) => completed.includes(s));

export const worldView = (
  entries: Record<string, VocabEntry>,
  completed: string[]
): WorldView => {
  const dueSet = new Set(dueWords(entries).map((e) => e.word));
  const contentFriends = FRIENDS.filter((f) => f.storyIds.length > 0);
  const current = contentFriends.find((f) => !allDone(f, completed)) ?? null;

  const friends: FriendView[] = FRIENDS.map((f) => {
    if (f.storyIds.length === 0) {
      return { ...f, status: 'comingSoon', nextStoryId: null, dueWords: [] };
    }
    const due = friendWords(f).filter((w) => dueSet.has(w));
    const isCurrent = current?.id === f.id;
    const beforeCurrent =
      !current || contentFriends.indexOf(f) < contentFriends.indexOf(current);
    // A friend the child has ALREADY finished must never re-lock, whatever their
    // position. Without this, giving a new friend their first story (e.g. Ruby,
    // who sits at index 1) makes `current` jump backwards and re-locks every
    // finished friend after her.
    const finished = allDone(f, completed);
    let status: FriendStatus;
    if (isCurrent) status = due.length ? 'wantsPlay' : 'ready';
    else if (finished || beforeCurrent) status = due.length ? 'wantsPlay' : 'home';
    else status = 'locked';
    const nextStoryId = f.storyIds.find((s) => !completed.includes(s)) ?? f.storyIds[0] ?? null;
    return { ...f, status, nextStoryId, dueWords: due };
  });

  // The one thing to do next: a friend who wants to play (review), else the
  // current friend to read with.
  const glow =
    friends.find((f) => f.status === 'wantsPlay') ?? friends.find((f) => f.status === 'ready');

  const flowers: Flower[] = Object.values(entries)
    .filter((e) => (e.box ?? 0) >= 1 || e.state === 'longTerm')
    .map((e) => ({
      word: e.word,
      kind: e.state === 'longTerm' ? ('flower' as const) : ('sprout' as const),
      variant: (['a', 'b', 'c'] as const)[hash(e.word) % 3]!,
    }))
    .sort((a, b) => a.word.localeCompare(b.word));

  return { friends, glowFriendId: glow?.id ?? null, flowers };
};

// The friend the child should finish before a locked friend wakes.
export const blockingFriendName = (friends: FriendView[]): string | null => {
  const cur = friends.find((f) => f.status === 'ready' || f.status === 'wantsPlay');
  return cur?.name ?? null;
};
