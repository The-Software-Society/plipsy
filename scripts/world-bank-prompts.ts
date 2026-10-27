// World (overworld + area hub) voice bank: friend names and short stock phrases
// the world speaks aloud on every tap, since a 3 year old cannot read the text.
// Composed at runtime by src/world/audio.ts (e.g. name + "is sleeping." +
// "Finish playing with" + blockerName + "first!"). Generated once, reused.

import type { AudioJob } from './audio-prompts';

const NAMES: Record<string, string> = {
  waldo: 'Waldo',
  rosie: 'Rosie',
  biscuit: 'Biscuit',
  ruby: 'Ruby',
  bea: 'Bea',
};

const PHRASES: Record<string, string> = {
  'world.sleeping': 'is sleeping.',
  'world.finishWith': 'Finish playing with',
  'world.first': 'first!',
  'world.letsPlay': "Let's play!",
  'world.wantsPlay': 'wants to play!',
  'world.comingSoonTail': 'A new friend is coming soon!',
  'world.hi': "Hi! I'm so happy to see you!",
  'world.task.read': 'Read a story',
  'world.task.play': 'Play a game',
  'world.task.words': 'Your words',
  'world.allDone': 'You did it! All done!',
  'world.tapFriend': 'Tap a friend to play!',
  'world.found': 'You found...',
};

// Treasure name clips, spoken on the reveal ("You found..." + name) and in the
// basket. Keys: world.treasure.<id>.
const TREASURE_NAMES: Record<string, string> = {
  shell: 'a shell!',
  leaf: 'a leaf!',
  acorn: 'an acorn!',
  pebble: 'a pebble!',
  feather: 'a feather!',
  berry: 'a berry!',
  pinecone: 'a pinecone!',
  stone: 'a stone!',
};

export const collectWorldJobs = (): AudioJob[] => {
  const jobs: AudioJob[] = [];
  for (const [id, name] of Object.entries(NAMES)) {
    jobs.push({
      key: `world.name.${id}`,
      text: name,
      style: 'Say this name warmly and clearly for a small child, just the name and nothing else: ',
    });
  }
  for (const [key, text] of Object.entries(PHRASES)) {
    jobs.push({ key, text, style: 'Say warmly and brightly for a small child: ' });
  }
  for (const [id, text] of Object.entries(TREASURE_NAMES)) {
    jobs.push({ key: `world.treasure.${id}`, text, style: 'Say warmly and brightly for a small child: ' });
  }
  return jobs;
};
