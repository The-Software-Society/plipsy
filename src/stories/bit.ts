import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `bit.${line}`;

// Module 1 · Unit 8 - short I (-it). Moral: there is always room for one more.
export const bitStory: Story = {
  id: 'bit',
  title: 'A Bit More Room',
  heroWord: 'BIT',
  cover: 'bit.s1',
  startSceneId: 's1',
  targetWords: ['HIT', 'FIT', 'BIT'],
  reviewWords: ['SIT'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'bit.s1',
      lines: [
        {
          id: 'l1',
          text: 'Mia is building a little den from old boards.',
          audioKey: audio('s1.l1'),
          highlights: [],
          tone: 'playful',
        },
        {
          id: 'l2',
          text: 'Rosie the PIG trots over to help.',
          audioKey: audio('s1.l2'),
          highlights: findSpans('Rosie the PIG trots over to help.', ['PIG']),
          tone: 'gentle',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'bit.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How can they make the den stand up?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'HIT', audioKey: 'word.hit', illustration: 'choice.hit', next: 's3a' },
          { word: 'FIT', audioKey: 'word.fit', illustration: 'choice.fit', next: 's3b' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'bit.s3a',
      lines: [
        {
          id: 'l1',
          text: 'Tap, tap! Mia gives the peg a soft hit with her mallet.',
          audioKey: audio('s3a.l1'),
          highlights: [],
          tone: 'fun',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'HIT',
        promptText: 'Spell HIT!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.hit',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s3b: {
      id: 's3b',
      illustration: 'bit.s3b',
      lines: [
        {
          id: 'l1',
          text: 'Push! The last board slides in and the pieces fit.',
          audioKey: audio('s3b.l1'),
          highlights: [],
          tone: 'fun',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'FIT',
        promptText: 'Spell FIT!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.fit',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'bit.s4',
      lines: [
        {
          id: 'l1',
          text: 'The den is small. Rosie needs a BIT more room!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('The den is small. Rosie needs a BIT more room!', ['BIT']),
          tone: 'giggle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'BIT',
        promptText: 'Spell BIT!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.bit',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'bit.s5',
      lines: [
        {
          id: 'l1',
          text: 'Mia shuffles over so they can both SIT inside.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('Mia shuffles over so they can both SIT inside.', ['SIT']),
          tone: 'warm',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'SIT',
        promptText: 'Spell SIT!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.sit',
        backgroundTone: '#EBE3D2',
        next: 's6',
      },
    },

    s6: {
      id: 's6',
      illustration: 'bit.s6',
      lines: [
        {
          id: 'l1',
          text: 'Two friends in one little den.',
          audioKey: audio('s6.l1'),
          highlights: [],
          tone: 'warm',
        },
        {
          id: 'l2',
          text: 'There is always room for one more!',
          audioKey: audio('s6.l2'),
          highlights: [],
          tone: 'warm',
        },
      ],
      end: { type: 'end' },
    },
  },
};
