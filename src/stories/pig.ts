import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `pig.${line}`;

// Module 1 · Unit 6 - short I (-ig). Moral: use what makes you special to help.
export const pigStory: Story = {
  id: 'pig',
  title: 'The Big Pig',
  heroWord: 'PIG',
  cover: 'pig.s1',
  startSceneId: 's1',
  targetWords: ['BIG', 'DIG', 'PIG'],
  reviewWords: ['SIT'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'pig.s1',
      lines: [
        {
          id: 'l1',
          text: 'Oh no! The ball is stuck IN the mud.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Oh no! The ball is stuck IN the mud.', ['IN']),
          tone: 'soft',
        },
        {
          id: 'l2',
          text: 'It is too deep! No one can reach.',
          audioKey: audio('s1.l2'),
          highlights: [],
          tone: 'playful',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'pig.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'Who is big and strong? Who can help dig?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'BIG', audioKey: 'word.big', illustration: 'choice.big', next: 's3a' },
          { word: 'DIG', audioKey: 'word.dig', illustration: 'choice.dig', next: 's3b' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'pig.s3a',
      lines: [
        {
          id: 'l1',
          text: 'The pig is big and strong! I can help!',
          audioKey: audio('s3a.l1'),
          highlights: [],
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'BIG',
        promptText: 'Spell BIG!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.big',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'pig.s3b',
      lines: [
        {
          id: 'l1',
          text: 'The pig digs and digs. Mud splats. Splat, splat!',
          audioKey: audio('s3b.l1'),
          highlights: [],
          tone: 'giggle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'DIG',
        promptText: 'Spell DIG!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.dig',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'pig.s4',
      lines: [
        {
          id: 'l1',
          text: 'Up comes the ball! Rosie the PIG saved the day.',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Up comes the ball! Rosie the PIG saved the day.', ['PIG']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'PIG',
        promptText: 'Spell PIG!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.pig',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'pig.s5',
      lines: [
        {
          id: 'l1',
          text: 'The big pig can SIT and rest now.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('The big pig can SIT and rest now.', ['SIT']),
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
      illustration: 'pig.s6',
      lines: [
        {
          id: 'l1',
          text: 'The pig used what made it special.',
          audioKey: audio('s6.l1'),
          highlights: [],
          tone: 'warm',
        },
        {
          id: 'l2',
          text: 'Being you can help your friends!',
          audioKey: audio('s6.l2'),
          highlights: [],
          tone: 'warm',
        },
      ],
      end: { type: 'end' },
    },
  },
};
