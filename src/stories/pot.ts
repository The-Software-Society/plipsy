import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `pot.${line}`;

// Module 1 · Unit 12 - short O (-ot/-op). Moral: share a warm meal.
export const potStory: Story = {
  id: 'pot',
  title: 'Hot Pot',
  heroWord: 'POT',
  cover: 'pot.s1',
  startSceneId: 's1',
  targetWords: ['POT', 'TOP', 'HOT'],
  reviewWords: ['DOG'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'pot.s1',
      lines: [
        {
          id: 'l1',
          text: 'Mia stirs a big POT of soup.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Mia stirs a big POT of soup.', ['POT']),
          tone: 'gentle',
        },
        {
          id: 'l2',
          text: 'Biscuit the DOG comes in from the cold rain.',
          audioKey: audio('s1.l2'),
          highlights: findSpans('Biscuit the DOG comes in from the cold rain.', ['DOG']),
          tone: 'soft',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },
    s2: {
      id: 's2',
      illustration: 'pot.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How can we keep the soup warm?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'TOP', audioKey: 'word.top', illustration: 'choice.top', next: 's3a' },
          { word: 'HOT', audioKey: 'word.hot', illustration: 'choice.hot', next: 's3b' },
        ],
      },
    },
    s3a: {
      id: 's3a',
      illustration: 'pot.s3a',
      lines: [
        { id: 'l1', text: 'Mia sets the top on the pot. Snug and cozy!', audioKey: audio('s3a.l1'), highlights: [], tone: 'kind' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'TOP',
        promptText: 'Spell TOP!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.top',
        backgroundTone: '#E3E8DD',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'pot.s3b',
      lines: [
        { id: 'l1', text: 'The soup bubbles and steams. It is so hot!', audioKey: audio('s3b.l1'), highlights: [], tone: 'excited' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'HOT',
        promptText: 'Spell HOT!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.hot',
        backgroundTone: '#F0E2D0',
        next: 's4',
      },
    },
    s4: {
      id: 's4',
      illustration: 'pot.s4',
      lines: [
        {
          id: 'l1',
          text: 'Mia fills two warm bowls from the POT.',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Mia fills two warm bowls from the POT.', ['POT']),
          tone: 'warm',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'POT',
        promptText: 'Spell POT!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.pot',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },
    s5: {
      id: 's5',
      illustration: 'pot.s5',
      lines: [
        {
          id: 'l1',
          text: 'The DOG laps up his warm soup. Slurp!',
          audioKey: audio('s5.l1'),
          highlights: findSpans('The DOG laps up his warm soup. Slurp!', ['DOG']),
          tone: 'playful',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'DOG',
        promptText: 'Spell DOG!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.dog',
        backgroundTone: '#EBE3D2',
        next: 's6',
      },
    },
    s6: {
      id: 's6',
      illustration: 'pot.s6',
      lines: [
        { id: 'l1', text: 'Mia and Biscuit shared the warm soup.', audioKey: audio('s6.l1'), highlights: [], tone: 'warm' },
        { id: 'l2', text: 'A meal is best when you share it!', audioKey: audio('s6.l2'), highlights: [], tone: 'warm' },
      ],
      end: { type: 'end' },
    },
  },
};
