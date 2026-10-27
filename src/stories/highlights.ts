import { HighlightSpan } from './types';

export const findSpans = (text: string, words: string[]): HighlightSpan[] => {
  const spans: HighlightSpan[] = [];
  for (const word of words) {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      spans.push({
        word: word.toUpperCase(),
        start: m.index,
        end: m.index + m[0].length,
        audioKey: `word.${word.toLowerCase()}`,
      });
    }
  }
  return spans.sort((a, b) => a.start - b.start);
};

export const lettersFor = (word: string): string[] => {
  const w = word.toUpperCase();
  return w
    .split('')
    .filter((c) => /[A-Z]/.test(c))
    .map((c) => `letter.${c}.${w.toLowerCase()}`);
};
