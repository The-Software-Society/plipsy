import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `pat.${line}`;

// Module 1 · Unit 2 - short A (-at). Moral: a kind friend makes you cozy.
export const patStory: Story = {
  id: 'pat',
  title: 'Pat the Cat',
  heroWord: 'PAT',
  cover: 'pat.s1',
  startSceneId: 's1',
  targetWords: ['HAT', 'MAT', 'PAT'],
  reviewWords: ['CAT'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'pat.s1',
      lines: [
        {
          id: 'l1',
          text: 'Brrr! Waldo the CAT shivers in the cool air.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Brrr! Waldo the CAT shivers in the cool air.', ['CAT']),
          tone: 'soft',
        },
        {
          id: 'l2',
          text: 'Mia’s cat feels shy and cold today.',
          audioKey: audio('s1.l2'),
          highlights: [],
          tone: 'gentle',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'pat.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How can Mia make her friend cozy?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'HAT', audioKey: 'word.hat', illustration: 'choice.hat', next: 's3a' },
          { word: 'MAT', audioKey: 'word.mat', illustration: 'choice.mat', next: 's3b' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'pat.s3a',
      lines: [
        {
          id: 'l1',
          text: 'Mia pops a hat on the cat. So big and floppy!',
          audioKey: audio('s3a.l1'),
          highlights: [],
          tone: 'giggle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'HAT',
        promptText: 'Spell HAT!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.hat',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'pat.s3b',
      lines: [
        {
          id: 'l1',
          text: 'Mia lays down a soft, snug mat to sit on.',
          audioKey: audio('s3b.l1'),
          highlights: [],
          tone: 'gentle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'MAT',
        promptText: 'Spell MAT!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.mat',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'pat.s4',
      lines: [
        {
          id: 'l1',
          text: 'Mia gives a soft, kind PAT. Purr, purr!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Mia gives a soft, kind PAT. Purr, purr!', ['PAT']),
          tone: 'warm',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'PAT',
        promptText: 'Spell PAT!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.pat',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'pat.s5',
      lines: [
        {
          id: 'l1',
          text: 'Now the CAT is warm and snug all over.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('Now the CAT is warm and snug all over.', ['CAT']),
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'CAT',
        promptText: 'Spell CAT!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'cat.expression',
        backgroundTone: '#EBE3D2',
        next: 's6',
      },
    },

    s6: {
      id: 's6',
      illustration: 'pat.s6',
      lines: [
        {
          id: 'l1',
          text: 'Mia made her friend feel cozy.',
          audioKey: audio('s6.l1'),
          highlights: [],
          tone: 'warm',
        },
        {
          id: 'l2',
          text: 'A kind friend keeps you snug!',
          audioKey: audio('s6.l2'),
          highlights: [],
          tone: 'soft',
        },
      ],
      end: { type: 'end' },
    },
  },
};
