import { allStories } from '@/src/stories';

// Build a key → text length map once at module load so the audio player
// can produce a reading-paced estimate when no MP3 is available.
const textLengthByKey: Record<string, number> = {};

for (const story of allStories()) {
  for (const scene of Object.values(story.scenes)) {
    for (const line of scene.lines) {
      textLengthByKey[line.audioKey] = line.text.length;
    }
    if (scene.end.type === 'choice') {
      textLengthByKey[scene.end.promptAudioKey] = scene.end.promptText.length;
    }
  }
}

const MS_PER_CHAR = 95;
const BASE_MS = 1200;
const MIN_MS = 2400;

export const lineEstimateMs = (audioKey: string): number => {
  const len = textLengthByKey[audioKey] ?? 40;
  return Math.max(MIN_MS, BASE_MS + len * MS_PER_CHAR);
};
