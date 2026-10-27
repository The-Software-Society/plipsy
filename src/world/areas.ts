// Derives a friend's "area" checklist: the stories to read and the words to
// bloom. 100% an area = every story read AND every word the friend teaches
// reached long-term (bloomed). Pure, used by app/area/[friend].tsx.

import { VocabEntry } from '@/src/vocab/tracker';
import { Friend } from './friends';
import { getStory } from '@/src/stories';

// 'done' = read at least once (replayable), 'next' = the one to continue with,
// 'locked' = still ahead on the path (shown, but not yet playable).
export type AreaStoryState = 'done' | 'next' | 'locked';
export type AreaStory = {
  id: string;
  title: string;
  cover: string;
  done: boolean;
  state: AreaStoryState;
};
export type AreaProgress = {
  stories: AreaStory[];
  words: { word: string; bloomed: boolean }[];
  bloomed: number;
  wordTotal: number;
  storiesDone: number;
  percent: number; // 0..1 toward 100% the area
  complete: boolean;
};

const friendWords = (f: Friend): string[] => {
  const set = new Set<string>();
  for (const id of f.storyIds) {
    const s = getStory(id);
    for (const w of s?.targetWords ?? []) set.add(w.toUpperCase());
    for (const w of s?.reviewWords ?? []) set.add(w.toUpperCase());
  }
  return [...set];
};

export const areaProgress = (
  f: Friend,
  entries: Record<string, VocabEntry>,
  completed: string[]
): AreaProgress => {
  const nextId = f.storyIds.find((id) => !completed.includes(id)) ?? null;
  const stories: AreaStory[] = f.storyIds.map((id) => {
    const s = getStory(id);
    const done = completed.includes(id);
    return {
      id,
      title: s?.title ?? id,
      cover: s?.cover ?? '',
      done,
      state: done ? 'done' : id === nextId ? 'next' : 'locked',
    };
  });
  const words = friendWords(f).map((word) => ({
    word,
    bloomed: entries[word]?.state === 'longTerm',
  }));
  const bloomed = words.filter((w) => w.bloomed).length;
  const storiesDone = stories.filter((s) => s.done).length;

  const total = stories.length + words.length;
  const got = storiesDone + bloomed;
  const percent = total > 0 ? got / total : 0;

  return {
    stories,
    words,
    bloomed,
    wordTotal: words.length,
    storiesDone,
    percent,
    complete: total > 0 && got >= total,
  };
};
