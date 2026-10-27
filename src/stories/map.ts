import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `map.${line}`;

// Module 1 · Unit 4 - short A (-ap). Moral: sharing the treasure is the best part.
export const mapStory: Story = {
  id: 'map',
  title: 'The Map',
  heroWord: 'MAP',
  cover: 'map.s1',
  startSceneId: 's1',
  targetWords: ['MAP', 'TAP', 'CAP'],
  reviewWords: ['CAN'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'map.s1',
      lines: [
        {
          id: 'l1',
          text: 'Look! Mia found an old MAP in the shed.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Look! Mia found an old MAP in the shed.', ['MAP']),
          tone: 'playful',
        },
        {
          id: 'l2',
          text: 'Waldo the CAT sniffs it. A big red X!',
          audioKey: audio('s1.l2'),
          highlights: findSpans('Waldo the CAT sniffs it. A big red X!', ['CAT']),
          tone: 'giggle',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'map.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'What should Mia pack for the hunt?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'CAP', audioKey: 'word.cap', illustration: 'choice.cap', next: 's3a' },
          { word: 'CAN', audioKey: 'word.can', illustration: 'choice.can', next: 's3b' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'map.s3a',
      lines: [
        {
          id: 'l1',
          text: 'Mia pops on her sun cap. Off we go!',
          audioKey: audio('s3a.l1'),
          highlights: [],
          tone: 'fun',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'CAP',
        promptText: 'Spell CAP!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.cap',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s3b: {
      id: 's3b',
      illustration: 'map.s3b',
      lines: [
        {
          id: 'l1',
          text: 'Mia packs a can of cool water. Off we go!',
          audioKey: audio('s3b.l1'),
          highlights: [],
          tone: 'fun',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'CAN',
        promptText: 'Spell CAN!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.can',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'map.s4',
      lines: [
        {
          id: 'l1',
          text: 'Here is the X! Waldo gives the ground a TAP.',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Here is the X! Waldo gives the ground a TAP.', ['TAP']),
          tone: 'playful',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'TAP',
        promptText: 'Spell TAP!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.tap',
        backgroundTone: '#EBE3D2',
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'map.s5',
      lines: [
        {
          id: 'l1',
          text: 'A tin of seeds! The MAP led them right to it.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('A tin of seeds! The MAP led them right to it.', ['MAP']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'MAP',
        promptText: 'Spell MAP!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.map',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's6',
      },
    },

    s6: {
      id: 's6',
      illustration: 'map.s6',
      lines: [
        {
          id: 'l1',
          text: 'Mia gives half of the seeds to Waldo.',
          audioKey: audio('s6.l1'),
          highlights: [],
          tone: 'warm',
        },
        {
          id: 'l2',
          text: 'Sharing the treasure is the best part!',
          audioKey: audio('s6.l2'),
          highlights: [],
          tone: 'warm',
        },
      ],
      end: { type: 'end' },
    },
  },
};
