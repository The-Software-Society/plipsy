// The word curriculum: a priority-ordered, tagged catalog the pathway/SRS
// engine draws from. Decodable-first (CVC short vowels), with high-frequency
// sight words woven in. Words are uppercase to match the vocab store.

export type WordTag =
  | 'cvc' // pure consonant-vowel-consonant, fully decodable with short vowels
  | 'dec' // decodable but not CVC
  | 'heart'; // irregular - memorize the tricky part

export type PhonicsPhase =
  | 'cvc-a'
  | 'cvc-i'
  | 'cvc-o'
  | 'cvc-e'
  | 'cvc-u'
  | 'digraph'
  | 'cvce'
  | 'blend'
  | 'vowel-team'
  | 'r-controlled';

export type CurriculumWord = {
  word: string;
  tag: WordTag;
  family?: string; // e.g. '-at'
  phase: PhonicsPhase;
  sight?: boolean; // high-frequency sight word (woven as recognition)
};

const cvc = (word: string, family: string, phase: PhonicsPhase): CurriculumWord => ({
  word,
  tag: 'cvc',
  family,
  phase,
});

// Module 1 CVC backbone (short vowels), in teaching order.
export const CVC_WORDS: CurriculumWord[] = [
  // short A
  ...['CAT', 'HAT', 'MAT', 'SAT', 'BAT', 'RAT', 'PAT'].map((w) => cvc(w, '-at', 'cvc-a')),
  ...['CAN', 'MAN', 'PAN', 'RAN', 'FAN'].map((w) => cvc(w, '-an', 'cvc-a')),
  ...['MAP', 'TAP', 'CAP', 'NAP'].map((w) => cvc(w, '-ap', 'cvc-a')),
  // short I
  ...['PIG', 'BIG', 'DIG', 'WIG'].map((w) => cvc(w, '-ig', 'cvc-i')),
  ...['SIT', 'HIT', 'FIT', 'BIT'].map((w) => cvc(w, '-it', 'cvc-i')),
  ...['PIN', 'WIN', 'FIN'].map((w) => cvc(w, '-in', 'cvc-i')),
  ...['TIP', 'ZIP', 'RIP', 'LIP'].map((w) => cvc(w, '-ip', 'cvc-i')),
  // short O
  ...['DOG', 'LOG', 'HOG', 'FOG'].map((w) => cvc(w, '-og', 'cvc-o')),
  ...['HOP', 'TOP', 'MOP', 'POP'].map((w) => cvc(w, '-op', 'cvc-o')),
  ...['HOT', 'POT', 'DOT', 'GOT'].map((w) => cvc(w, '-ot', 'cvc-o')),
  // short E
  ...['PET', 'NET', 'WET', 'GET'].map((w) => cvc(w, '-et', 'cvc-e')),
  ...['HEN', 'TEN', 'PEN'].map((w) => cvc(w, '-en', 'cvc-e')),
  // short U
  ...['BUG', 'HUG', 'RUG'].map((w) => cvc(w, '-ug', 'cvc-u')),
  ...['SUN', 'RUN', 'FUN', 'BUN'].map((w) => cvc(w, '-un', 'cvc-u')),
  ...['CUT', 'NUT'].map((w) => cvc(w, '-ut', 'cvc-u')),
];

// High-frequency sight words woven in as recognition (mostly decodable here;
// only THE is a true heart word in Module 1).
export const SIGHT_WORDS: CurriculumWord[] = [
  { word: 'THE', tag: 'heart', phase: 'cvc-a', sight: true },
  { word: 'A', tag: 'dec', phase: 'cvc-a', sight: true },
  { word: 'AND', tag: 'dec', phase: 'cvc-a', sight: true },
  { word: 'IS', tag: 'dec', phase: 'cvc-i', sight: true },
  { word: 'IN', tag: 'cvc', phase: 'cvc-i', sight: true },
  { word: 'IT', tag: 'cvc', phase: 'cvc-i', sight: true },
  { word: 'ON', tag: 'cvc', phase: 'cvc-o', sight: true },
  { word: 'UP', tag: 'cvc', phase: 'cvc-u', sight: true },
  { word: 'GO', tag: 'dec', phase: 'cvc-o', sight: true },
  { word: 'ME', tag: 'dec', phase: 'cvc-e', sight: true },
  { word: 'SEE', tag: 'dec', phase: 'cvc-e', sight: true },
  { word: 'MY', tag: 'dec', phase: 'cvc-u', sight: true },
];

export const ALL_WORDS: CurriculumWord[] = [...CVC_WORDS, ...SIGHT_WORDS];

const BY_WORD: Record<string, CurriculumWord> = Object.fromEntries(
  ALL_WORDS.map((w) => [w.word, w])
);

export const wordInfo = (word: string): CurriculumWord | undefined => BY_WORD[word.toUpperCase()];
