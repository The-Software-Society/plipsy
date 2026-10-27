import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `bug.${line}`;

// Module 1 · Unit 15 - short U (-ug/-un). Moral: kindness to the smallest.
export const bugStory: Story = {
  id: 'bug',
  title: 'Hug the Bug',
  heroWord: 'BUG',
  cover: 'bug.s1',
  startSceneId: 's1',
  targetWords: ['HUG', 'SUN', 'BUG'],
  reviewWords: ['RUN'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'bug.s1',
      lines: [
        {
          id: 'l1',
          text: 'Mia finds a tiny BUG on a cold leaf.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Mia finds a tiny BUG on a cold leaf.', ['BUG']),
          tone: 'gentle',
        },
        {
          id: 'l2',
          text: 'Poor Bea is too chilly to fly.',
          audioKey: audio('s1.l2'),
          highlights: [],
          tone: 'soft',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },
    s2: {
      id: 's2',
      illustration: 'bug.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How can we warm up the little bug?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'SUN', audioKey: 'word.sun', illustration: 'choice.sun', next: 's3a' },
          { word: 'HUG', audioKey: 'word.hug', illustration: 'choice.hug', next: 's3b' },
        ],
      },
    },
    s3a: {
      id: 's3a',
      illustration: 'bug.s3a',
      lines: [
        { id: 'l1', text: 'Mia lifts the leaf into a patch of warm sun.', audioKey: audio('s3a.l1'), highlights: [], tone: 'kind' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'SUN',
        promptText: 'Spell SUN!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.sun',
        backgroundTone: '#F5E6C8',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'bug.s3b',
      lines: [
        { id: 'l1', text: 'Mia cups her hands into a soft little hug.', audioKey: audio('s3b.l1'), highlights: [], tone: 'tender' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'HUG',
        promptText: 'Spell HUG!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.hug',
        backgroundTone: '#F0E2D0',
        next: 's4',
      },
    },
    s4: {
      id: 's4',
      illustration: 'bug.s4',
      lines: [
        {
          id: 'l1',
          text: 'The little BUG opens her shiny wings!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('The little BUG opens her shiny wings!', ['BUG']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'BUG',
        promptText: 'Spell BUG!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.bug',
        backgroundTone: '#E3E8DD',
        isHeroMoment: true,
        next: 's5',
      },
    },
    s5: {
      id: 's5',
      illustration: 'bug.s5',
      lines: [
        {
          id: 'l1',
          text: 'Mia and Bea RUN through the tall grass.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('Mia and Bea RUN through the tall grass.', ['RUN']),
          tone: 'playful',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'RUN',
        promptText: 'Spell RUN!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.run',
        backgroundTone: '#E3E8DD',
        next: 's6',
      },
    },
    s6: {
      id: 's6',
      illustration: 'bug.s6',
      lines: [
        { id: 'l1', text: 'Bea is the smallest friend of all.', audioKey: audio('s6.l1'), highlights: [], tone: 'warm' },
        { id: 'l2', text: 'Be kind to the tiniest one!', audioKey: audio('s6.l2'), highlights: [], tone: 'warm' },
      ],
      end: { type: 'end' },
    },
  },
};
