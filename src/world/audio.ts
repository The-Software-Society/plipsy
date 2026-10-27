// Speaks the world aloud. A 3 year old can't read the on-screen text, so every
// tap in the overworld and area hub plays a short spoken line, composed from the
// world voice bank (friend names + stock phrases, see scripts/world-bank-prompts.ts).
// Text builders below produce the matching on-screen string so audio and caption
// always agree.

import { audio } from '@/src/audio/AudioPlayer';

const nameKey = (id: string) => `world.name.${id}`;
const GAP = 110;

export const WorldVoice = {
  // Friend greeting when opening their area: "Waldo! Hi, I'm so happy to see you!"
  greet(id: string) {
    audio.playSequence([nameKey(id), 'world.hi'], GAP);
  },
  // Ready friend tapped: "Waldo! Let's play!"
  letsPlay(id: string) {
    audio.playSequence([nameKey(id), 'world.letsPlay'], GAP);
  },
  // A friend who wants to practice: "Rosie wants to play!"
  wantsPlay(id: string) {
    audio.playSequence([nameKey(id), 'world.wantsPlay'], GAP);
  },
  // Locked friend: "Ruby is sleeping. Finish playing with Waldo first!"
  sleeping(id: string, blockerId?: string | null) {
    const seq = [nameKey(id), 'world.sleeping'];
    if (blockerId) seq.push('world.finishWith', nameKey(blockerId), 'world.first');
    audio.playSequence(seq, GAP);
  },
  // Coming-soon friend: "Bea is sleeping. A new friend is coming soon!"
  comingSoon(id: string) {
    audio.playSequence([nameKey(id), 'world.sleeping', 'world.comingSoonTail'], GAP);
  },
  // Area-hub task labels and one-shots.
  say(key: string) {
    audio.playSequence([key], 0);
  },
};

export const worldText = {
  sleeping: (name: string, blocker?: string | null) =>
    blocker ? `${name} is sleeping. Finish playing with ${blocker} first!` : `${name} is sleeping.`,
  comingSoon: (name: string) => `${name} is sleeping. A new friend is coming soon!`,
  wantsPlay: (name: string) => `${name} wants to play!`,
  letsPlay: (name: string) => `Let's play, ${name}!`,
};
