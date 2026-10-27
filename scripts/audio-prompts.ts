// Maps audio keys to the literal text ElevenLabs should speak.
// Hero word keys use slower / warmer voice settings (handled in generator).

import { allStories } from '../src/stories';
import { Story, Scene, EndAction } from '../src/stories/types';
import { collectBankJobs } from './bank-prompts';
import { collectWorldJobs } from './world-bank-prompts';

export type AudioJob = {
  key: string;
  text: string;
  hero?: boolean; // use warm settings
  style?: string; // overrides the default TTS style directive (e.g. phoneme anchoring)
};

// Phoneme dictionary keyed by `<letter>.<word>` so vowels can be context aware.
const PHONEMES: Record<string, string> = {
  // CAT
  'C.cat': 'kuh',
  'A.cat': 'aaa',
  'T.cat': 'tuh',
  // DOG
  'D.dog': 'duh',
  'O.dog': 'aah',
  'G.dog': 'guh',
  // ROAR
  'R.roar': 'rrrr',
  'O.roar': 'ohhh',
  'A.roar': 'aaa',
  // WAVE
  'W.wave': 'wuh',
  'A.wave': 'ay',
  'V.wave': 'vuh',
  'E.wave': 'ee',
  // SIT
  'S.sit': 'sss',
  'I.sit': 'ih',
  'T.sit': 'tuh',
  // CALL
  'C.call': 'kuh',
  'A.call': 'aw',
  'L.call': 'luh',
  // TOY
  'T.toy': 'tuh',
  'O.toy': 'oy',
  'Y.toy': 'yuh',
  // PET
  'P.pet': 'puh',
  'E.pet': 'eh',
  'T.pet': 'tuh',
  // RUN
  'R.run': 'rrr',
  'U.run': 'uh',
  'N.run': 'nnn',
};

const phonemeFor = (key: string): string => {
  // key shape: letter.<L>.<word>
  const parts = key.split('.');
  if (parts.length !== 3) return key;
  const [, letter, word] = parts;
  return PHONEMES[`${letter}.${word}`] ?? letter!.toLowerCase();
};

const wordTextFor = (key: string): string => {
  // shapes: word.<word> or word.<word>.hero
  const parts = key.split('.');
  const word = parts[1] ?? '';
  // For the hero (post spell-out) playback, render the word in caps with emphasis.
  if (parts[2] === 'hero') return `${word.toUpperCase()}!`;
  return word;
};

const lineTextFor = (story: Story, scene: Scene, lineId: string): string | null => {
  const line = scene.lines.find((l) => l.id === lineId);
  return line ? line.text : null;
};

const promptTextFor = (end: EndAction): string | null => {
  if (end.type === 'choice') return end.promptText;
  return null;
};

// Narration delivery hints → TTS style directive. Same voice, nuanced read.
const TONE_STYLE: Record<string, string> = {
  giggle: 'Say in a warm, gentle storybook voice with a light, giggly smile: ',
  soft: 'Say softly and gently, almost hushed, in a warm storybook voice: ',
  gentle: 'Say gently and tenderly in a warm storybook voice: ',
  tender: 'Say very tenderly and sweetly in a warm storybook voice: ',
  warm: 'Say warmly and lovingly in a gentle storybook voice: ',
  cheer: 'Say brightly and cheerfully, full of happy excitement, in a storybook voice: ',
  playful: 'Say playfully with a fun bounce, in a warm storybook voice: ',
  fun: 'Say playfully with a fun bounce, in a warm storybook voice: ',
  excited: 'Say with bright, eager excitement in a warm storybook voice: ',
  kind: 'Say kindly and encouragingly in a warm storybook voice: ',
  aww: 'Say with a sweet, tender "aww" warmth in a storybook voice: ',
  relieved: 'Say with a warm, relieved sigh in a gentle storybook voice: ',
};

const styleForTone = (tone?: string): string | undefined =>
  tone ? TONE_STYLE[tone] : undefined;

export const collectAudioJobs = (onlyStoryId?: string): AudioJob[] => {
  const seen = new Map<string, AudioJob>();
  const add = (j: AudioJob) => {
    if (!seen.has(j.key)) seen.set(j.key, j);
  };

  // Story-independent bank (letter names, placements, stock phrases).
  for (const j of collectBankJobs()) add(j);
  // World voice bank (friend names + overworld/area phrases).
  for (const j of collectWorldJobs()) add(j);

  for (const story of allStories()) {
    if (onlyStoryId && story.id !== onlyStoryId) continue;
    for (const scene of Object.values(story.scenes)) {
      for (const line of scene.lines) {
        add({ key: line.audioKey, text: line.text, style: styleForTone(line.tone) });
        for (const h of line.highlights) {
          add({ key: h.audioKey, text: wordTextFor(h.audioKey) });
        }
      }
      const e = scene.end;
      if (e.type === 'choice') {
        add({ key: e.promptAudioKey, text: e.promptText });
        for (const opt of e.options) {
          add({ key: opt.audioKey, text: wordTextFor(opt.audioKey) });
        }
      }
      if (e.type === 'spellOut') {
        add({ key: e.heroAudioKey, text: wordTextFor(e.heroAudioKey), hero: true });
        for (const k of e.letterAudioKeys) {
          add({ key: k, text: phonemeFor(k) });
        }
      }
      if (e.type === 'spellInteractive') {
        // Speak the WORD, not its letters: lowercase + an explicit directive so
        // the TTS doesn't read "SIT" as "S-I-T".
        add({
          key: e.promptAudioKey,
          text: `Let's spell the word ${e.word.toLowerCase()}!`,
          style: 'Say warmly to a small child, and say the word as one whole spoken word, do NOT spell out the individual letters: ',
        });
        // Plain word clip for the completion line ("You spelled cat…").
        add({ key: `word.${e.word.toLowerCase()}`, text: e.word.toLowerCase() });
      }
    }
  }

  return [...seen.values()];
};
