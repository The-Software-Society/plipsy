import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `fan.${line}`;

// Module 1 · Unit 3 - short A (-an). Moral: helping a friend feels good.
export const fanStory: Story = {
  id: 'fan',
  title: 'Fan the Cat',
  heroWord: 'FAN',
  cover: 'fan.s1',
  startSceneId: 's1',
  targetWords: ['FAN', 'CAN', 'RAN'],
  reviewWords: ['HAT'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'fan.s1',
      lines: [
        { id: 'l1', text: 'Phew! It is a hot day.', audioKey: audio('s1.l1'), highlights: [], tone: 'playful' },
        {
          id: 'l2',
          text: 'Waldo the CAT flops down flat. Too hot to play!',
          audioKey: audio('s1.l2'),
          highlights: findSpans('Waldo the CAT flops down flat. Too hot to play!', ['CAT']),
          tone: 'giggle',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },
    s2: {
      id: 's2',
      illustration: 'fan.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How can Mia help her hot friend?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'FAN', audioKey: 'word.fan', illustration: 'choice.fan', next: 's3a' },
          { word: 'CAN', audioKey: 'word.can', illustration: 'choice.can', next: 's3b' },
        ],
      },
    },
    s3a: {
      id: 's3a',
      illustration: 'fan.s3a',
      lines: [
        { id: 'l1', text: 'Mia flaps a big fan. Whoosh, whoosh!', audioKey: audio('s3a.l1'), highlights: [], tone: 'fun' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'FAN',
        promptText: 'Spell FAN!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.fan',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'fan.s3b',
      lines: [
        { id: 'l1', text: 'Mia brings a cool can of water.', audioKey: audio('s3b.l1'), highlights: [], tone: 'gentle' },
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
      illustration: 'fan.s4',
      lines: [
        {
          id: 'l1',
          text: 'Ahhh, much better! The happy cat RAN!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Ahhh, much better! The happy cat RAN!', ['RAN']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'RAN',
        promptText: 'Spell RAN!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.ran',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },
    s5: {
      id: 's5',
      illustration: 'fan.s5',
      lines: [
        {
          id: 'l1',
          text: 'Now the cat can wear its HAT and play.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('Now the cat can wear its HAT and play.', ['HAT']),
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
      illustration: 'fan.s6',
      lines: [
        { id: 'l1', text: 'Mia helped her friend.', audioKey: audio('s6.l1'), highlights: [], tone: 'warm' },
        { id: 'l2', text: 'It feels good to help!', audioKey: audio('s6.l2'), highlights: [], tone: 'warm' },
      ],
      end: { type: 'end' },
    },
  },
};
