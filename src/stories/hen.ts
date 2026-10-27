import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `hen.${line}`;

// Module 1 · Unit 14 - short E (-et/-en). Moral: help a friend in trouble.
export const henStory: Story = {
  id: 'hen',
  title: 'The Wet Hen',
  heroWord: 'HEN',
  cover: 'hen.s1',
  startSceneId: 's1',
  targetWords: ['NET', 'WET', 'HEN'],
  reviewWords: ['DOG'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'hen.s1',
      lines: [
        {
          id: 'l1',
          text: 'Rain, rain! Ruby the HEN slips into the pond.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Rain, rain! Ruby the HEN slips into the pond.', ['HEN']),
          tone: 'soft',
        },
        {
          id: 'l2',
          text: 'She is cold and very WET. Oh no!',
          audioKey: audio('s1.l2'),
          highlights: findSpans('She is cold and very WET. Oh no!', ['WET']),
          tone: 'soft',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },
    s2: {
      id: 's2',
      illustration: 'hen.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How can we help Ruby get out?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'NET', audioKey: 'word.net', illustration: 'choice.net', next: 's3a' },
          { word: 'WET', audioKey: 'word.wet', illustration: 'choice.wet', next: 's3b' },
        ],
      },
    },
    s3a: {
      id: 's3a',
      illustration: 'hen.s3a',
      lines: [
        { id: 'l1', text: 'Mia dips the long net into the pond.', audioKey: audio('s3a.l1'), highlights: [], tone: 'kind' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'NET',
        promptText: 'Spell NET!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.net',
        backgroundTone: '#DDE4EC',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'hen.s3b',
      lines: [
        { id: 'l1', text: 'Biscuit wades right in and gets wet too!', audioKey: audio('s3b.l1'), highlights: [], tone: 'giggle' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'WET',
        promptText: 'Spell WET!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.wet',
        backgroundTone: '#DDE4EC',
        next: 's4',
      },
    },
    s4: {
      id: 's4',
      illustration: 'hen.s4',
      lines: [
        {
          id: 'l1',
          text: 'Safe! Ruby the HEN shakes out her feathers.',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Safe! Ruby the HEN shakes out her feathers.', ['HEN']),
          tone: 'relieved',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'HEN',
        promptText: 'Spell HEN!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.hen',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },
    s5: {
      id: 's5',
      illustration: 'hen.s5',
      lines: [
        {
          id: 'l1',
          text: 'The DOG shakes his fur too. Splash!',
          audioKey: audio('s5.l1'),
          highlights: findSpans('The DOG shakes his fur too. Splash!', ['DOG']),
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
      illustration: 'hen.s6',
      lines: [
        { id: 'l1', text: 'Mia and Biscuit helped Ruby get warm and dry.', audioKey: audio('s6.l1'), highlights: [], tone: 'warm' },
        { id: 'l2', text: 'A friend in trouble needs you!', audioKey: audio('s6.l2'), highlights: [], tone: 'warm' },
      ],
      end: { type: 'end' },
    },
  },
};
