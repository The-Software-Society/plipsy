import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `doglog.${line}`;

// Module 1 · Unit 11 - short O (-og/-op). Moral: help a friend be brave.
export const doglogStory: Story = {
  id: 'doglog',
  title: 'The Dog and the Log',
  heroWord: 'DOG',
  cover: 'doglog.s1',
  startSceneId: 's1',
  targetWords: ['LOG', 'HOP', 'DOG'],
  reviewWords: ['PIG'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'doglog.s1',
      lines: [
        {
          id: 'l1',
          text: 'A big LOG fell across the path.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('A big LOG fell across the path.', ['LOG']),
          tone: 'gentle',
        },
        {
          id: 'l2',
          text: 'The pink PIG is stuck on the far side. Oh no!',
          audioKey: audio('s1.l2'),
          highlights: findSpans('The pink PIG is stuck on the far side. Oh no!', ['PIG']),
          tone: 'soft',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },
    s2: {
      id: 's2',
      illustration: 'doglog.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How can the dog help the pig be brave?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'LOG', audioKey: 'word.log', illustration: 'choice.log', next: 's3a' },
          { word: 'HOP', audioKey: 'word.hop', illustration: 'choice.hop', next: 's3b' },
        ],
      },
    },
    s3a: {
      id: 's3a',
      illustration: 'doglog.s3a',
      lines: [
        { id: 'l1', text: 'The dog pats the log. Climb up here!', audioKey: audio('s3a.l1'), highlights: [], tone: 'kind' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'LOG',
        promptText: 'Spell LOG!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.log',
        backgroundTone: '#E3E8DD',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'doglog.s3b',
      lines: [
        { id: 'l1', text: 'The dog does big goofy hops. Boing! Boing!', audioKey: audio('s3b.l1'), highlights: [], tone: 'giggle' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'HOP',
        promptText: 'Spell HOP!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.hop',
        backgroundTone: '#E3E8DD',
        next: 's4',
      },
    },
    s4: {
      id: 's4',
      illustration: 'doglog.s4',
      lines: [
        {
          id: 'l1',
          text: 'Up, up... Rosie the pig hops over! Biscuit the DOG cheers!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Up, up... Rosie the pig hops over! Biscuit the DOG cheers!', ['DOG']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'DOG',
        promptText: 'Spell DOG!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.dog',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },
    s5: {
      id: 's5',
      illustration: 'doglog.s5',
      lines: [
        {
          id: 'l1',
          text: 'The brave PIG did it! Hooray!',
          audioKey: audio('s5.l1'),
          highlights: findSpans('The brave PIG did it! Hooray!', ['PIG']),
          tone: 'cheer',
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
      illustration: 'doglog.s6',
      lines: [
        { id: 'l1', text: 'The dog helped the pig feel brave.', audioKey: audio('s6.l1'), highlights: [], tone: 'warm' },
        { id: 'l2', text: 'A kind friend helps you try!', audioKey: audio('s6.l2'), highlights: [], tone: 'warm' },
      ],
      end: { type: 'end' },
    },
  },
};
