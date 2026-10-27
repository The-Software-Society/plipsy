import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `pat2.${line}`;

// Module 1 · Unit 5 - short A spiral (-at). Moral: welcome a new friend.
export const pat2Story: Story = {
  id: 'pat2',
  title: 'The New Friend',
  heroWord: 'SAT',
  cover: 'pat2.s1',
  startSceneId: 's1',
  targetWords: ['BAT', 'RAT', 'SAT'],
  reviewWords: ['HAT'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'pat2.s1',
      lines: [
        {
          id: 'l1',
          text: 'Mia and Waldo the CAT sat on the warm MAT.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Mia and Waldo the CAT sat on the warm MAT.', ['CAT', 'MAT']),
          tone: 'gentle',
        },
        {
          id: 'l2',
          text: 'Tap, tap! Someone new is at the gate.',
          audioKey: audio('s1.l2'),
          highlights: [],
          tone: 'playful',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'pat2.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'Who is at the gate?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'BAT', audioKey: 'word.bat', illustration: 'choice.bat', next: 's3a' },
          { word: 'RAT', audioKey: 'word.rat', illustration: 'choice.rat', next: 's3b' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'pat2.s3a',
      lines: [
        {
          id: 'l1',
          text: 'A little bat flaps down. Hello, hello!',
          audioKey: audio('s3a.l1'),
          highlights: [],
          tone: 'giggle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'BAT',
        promptText: 'Spell BAT!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.bat',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s3b: {
      id: 's3b',
      illustration: 'pat2.s3b',
      lines: [
        {
          id: 'l1',
          text: 'A small rat pops out. Hello, hello!',
          audioKey: audio('s3b.l1'),
          highlights: [],
          tone: 'giggle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'RAT',
        promptText: 'Spell RAT!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.rat',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'pat2.s4',
      lines: [
        {
          id: 'l1',
          text: 'Waldo shuffles over. The new friend SAT down too.',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Waldo shuffles over. The new friend SAT down too.', ['SAT']),
          tone: 'warm',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'SAT',
        promptText: 'Spell SAT!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.sat',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'pat2.s5',
      lines: [
        {
          id: 'l1',
          text: 'Waldo lends the new friend his floppy HAT.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('Waldo lends the new friend his floppy HAT.', ['HAT']),
          tone: 'fun',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'HAT',
        promptText: 'Spell HAT!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.hat',
        backgroundTone: '#EBE3D2',
        next: 's6',
      },
    },

    s6: {
      id: 's6',
      illustration: 'pat2.s6',
      lines: [
        {
          id: 'l1',
          text: 'Three friends on one little mat.',
          audioKey: audio('s6.l1'),
          highlights: [],
          tone: 'warm',
        },
        {
          id: 'l2',
          text: 'There is always room for a new friend!',
          audioKey: audio('s6.l2'),
          highlights: [],
          tone: 'warm',
        },
      ],
      end: { type: 'end' },
    },
  },
};
