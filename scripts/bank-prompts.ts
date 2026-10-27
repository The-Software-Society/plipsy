// Story-independent audio "bank": letter names, short letter sounds (with
// alternate variants), and stock phrases. Generated once and reused across
// every story. Keys:
//   bank.name.<L>            single letter name ("A")
//   bank.sound.<L>           default short sound ("kuh")
//   bank.sound.<L>.<variant> alternate short sound ("ay")
//   bank.<phrase>            stock phrase
//
// Placement feedback chains these as name+sound (e.g. "C, kuh, kuh, C") - kept
// deliberately short so a toddler isn't waiting through a sentence per letter.
// Runtime helpers that build these keys live in src/audio/bank.ts.

import type { AudioJob } from './audio-prompts';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Canonical (default) sound per letter - short vowels, hard c/g.
const DEFAULT_SOUND: Record<string, string> = {
  A: 'aaa', B: 'buh', C: 'kuh', D: 'duh', E: 'eh', F: 'ff', G: 'guh', H: 'huh',
  I: 'ih', J: 'juh', K: 'kuh', L: 'luh', M: 'mm', N: 'nn', O: 'ah', P: 'puh',
  Q: 'kwuh', R: 'rr', S: 'ss', T: 'tuh', U: 'uh', V: 'vuh', W: 'wuh', X: 'ks',
  Y: 'yuh', Z: 'zz',
};

// Example word per letter so the TTS produces the right phoneme rather than
// reading the spelling loosely (e.g. "ah" → wrong vowel without an anchor).
const EXAMPLE: Record<string, string> = {
  A: 'apple', B: 'ball', C: 'cat', D: 'dog', E: 'egg', F: 'fish', G: 'goat',
  H: 'hat', I: 'igloo', J: 'jam', K: 'kite', L: 'lion', M: 'moon', N: 'nest',
  O: 'octopus', P: 'pig', Q: 'queen', R: 'rabbit', S: 'sun', T: 'top',
  U: 'umbrella', V: 'van', W: 'wet', X: 'fox', Y: 'yes', Z: 'zip',
};
const VARIANT_EXAMPLE: Record<string, string> = {
  'A.long': 'rain', 'A.broad': 'ball', 'E.long': 'bee', 'I.long': 'bike',
  'O.long': 'go', 'U.long': 'menu', 'C.soft': 'city', 'G.soft': 'giraffe',
  'S.z': 'is', 'Y.ee': 'happy', 'Y.eye': 'sky',
};

const soundStyle = (letter: string, example: string): string =>
  `Say only the sound the letter ${letter} makes in the word "${example}" - just that short sound by itself, no letter name and no other words: `;

// Alternate sound variants. Key is `<L>.<variant>`. The special value SILENT
// renders a "the letter is quiet here" line instead of a sound.
const SILENT = '__silent__';
const VARIANT_SOUND: Record<string, string> = {
  'A.long': 'ay',
  'A.broad': 'aw',
  'E.long': 'ee',
  'E.silent': SILENT,
  'I.long': 'eye',
  'O.long': 'oh',
  'U.long': 'you',
  'C.soft': 'sss',
  'G.soft': 'juh',
  'S.z': 'zzz',
  'Y.ee': 'ee',
  'Y.eye': 'eye',
};

// Stock phrases chained around letters at runtime.
const PHRASES: Record<string, string> = {
  'bank.uhoh': 'Uh-oh!',
  'bank.lookingFor': 'We are looking for the letter…',
  'bank.thisIsTheWord': 'This is the word…',
  'bank.pressTheOne': 'You need to press the one that says…',
  'bank.great': 'Great job!',
  'bank.youSpelled': 'You spelled…',
  'bank.spellEnd': 'And that is how you spell…',
};

export const collectBankJobs = (): AudioJob[] => {
  const jobs: AudioJob[] = [];

  for (const [key, text] of Object.entries(PHRASES)) {
    jobs.push({ key, text });
  }

  for (const L of LETTERS) {
    jobs.push({ key: `bank.name.${L}`, text: L });
    jobs.push({ key: `bank.sound.${L}`, text: DEFAULT_SOUND[L]!, style: soundStyle(L, EXAMPLE[L]!) });
  }

  for (const [code, sound] of Object.entries(VARIANT_SOUND)) {
    if (sound === SILENT) continue; // silent letters have no sound clip
    const letter = code.split('.')[0]!;
    const variant = code.split('.')[1]!;
    jobs.push({
      key: `bank.sound.${letter}.${variant}`,
      text: sound,
      style: soundStyle(letter, VARIANT_EXAMPLE[code] ?? EXAMPLE[letter]!),
    });
  }

  return jobs;
};
