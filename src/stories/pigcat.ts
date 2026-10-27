import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `pigcat.${line}`;

// Module 1 · Unit 9 - short I (-ip). Moral: giving a gift feels wonderful.
export const pigcatStory: Story = {
  id: 'pigcat',
  title: 'A Gift for Waldo',
  heroWord: 'TIP',
  cover: 'pigcat.s1',
  startSceneId: 's1',
  targetWords: ['TIP', 'ZIP', 'RIP'],
  reviewWords: ['PIG'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'pigcat.s1',
      lines: [
        {
          id: 'l1',
          text: 'Rosie has made a little bag for Waldo the CAT.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Rosie has made a little bag for Waldo the CAT.', ['CAT']),
          tone: 'gentle',
        },
        {
          id: 'l2',
          text: 'Oh no! Something is wrong with it.',
          audioKey: audio('s1.l2'),
          highlights: [],
          tone: 'soft',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'pigcat.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'What is wrong with the little bag?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'RIP', audioKey: 'word.rip', illustration: 'choice.rip', next: 's3a' },
          { word: 'ZIP', audioKey: 'word.zip', illustration: 'choice.zip', next: 's3b' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'pigcat.s3a',
      lines: [
        {
          id: 'l1',
          text: 'There is a little rip in the side. Mia sews it up.',
          audioKey: audio('s3a.l1'),
          highlights: [],
          tone: 'gentle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'RIP',
        promptText: 'Spell RIP!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.rip',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s3b: {
      id: 's3b',
      illustration: 'pigcat.s3b',
      lines: [
        {
          id: 'l1',
          text: 'The zip is stuck fast. Mia wiggles it free.',
          audioKey: audio('s3b.l1'),
          highlights: [],
          tone: 'gentle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'ZIP',
        promptText: 'Spell ZIP!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.zip',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'pigcat.s4',
      lines: [
        {
          id: 'l1',
          text: 'Mia gives the bag a TIP and out slides a soft ribbon.',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Mia gives the bag a TIP and out slides a soft ribbon.', ['TIP']),
          tone: 'playful',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'TIP',
        promptText: 'Spell TIP!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.tip',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'pigcat.s5',
      lines: [
        {
          id: 'l1',
          text: 'Rosie the PIG holds out the mended gift.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('Rosie the PIG holds out the mended gift.', ['PIG']),
          tone: 'warm',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'PIG',
        promptText: 'Spell PIG!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.pig',
        backgroundTone: '#EBE3D2',
        next: 's6',
      },
    },

    s6: {
      id: 's6',
      illustration: 'pigcat.s6',
      lines: [
        {
          id: 'l1',
          text: 'Waldo purrs and pops the ribbon on his tail.',
          audioKey: audio('s6.l1'),
          highlights: [],
          tone: 'giggle',
        },
        {
          id: 'l2',
          text: 'Giving a gift feels wonderful!',
          audioKey: audio('s6.l2'),
          highlights: [],
          tone: 'warm',
        },
      ],
      end: { type: 'end' },
    },
  },
};
