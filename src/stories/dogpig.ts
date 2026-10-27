import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `dogpig.${line}`;

// Module 1 · Unit 13 - short O spiral (-op/-ot). Moral: teamwork makes cleanup fun.
export const dogpigStory: Story = {
  id: 'dogpig',
  title: 'The Dog and the Pig',
  heroWord: 'DOT',
  cover: 'dogpig.s1',
  startSceneId: 's1',
  targetWords: ['MOP', 'POP', 'DOT'],
  reviewWords: ['DOG'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'dogpig.s1',
      lines: [
        {
          id: 'l1',
          text: 'Rosie the pig ran inside from the mud.',
          audioKey: audio('s1.l1'),
          highlights: [],
          tone: 'playful',
        },
        {
          id: 'l2',
          text: 'Look! One muddy DOT, then two, then ten!',
          audioKey: audio('s1.l2'),
          highlights: findSpans('Look! One muddy DOT, then two, then ten!', ['DOT']),
          tone: 'excited',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },
    s2: {
      id: 's2',
      illustration: 'dogpig.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How can we clean it up together?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'MOP', audioKey: 'word.mop', illustration: 'choice.mop', next: 's3a' },
          { word: 'POP', audioKey: 'word.pop', illustration: 'choice.pop', next: 's3b' },
        ],
      },
    },
    s3a: {
      id: 's3a',
      illustration: 'dogpig.s3a',
      lines: [
        { id: 'l1', text: 'Biscuit pushes the mop back and forth.', audioKey: audio('s3a.l1'), highlights: [], tone: 'kind' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'MOP',
        promptText: 'Spell MOP!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.mop',
        backgroundTone: '#E3E8DD',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'dogpig.s3b',
      lines: [
        { id: 'l1', text: 'Rosie pops the soap bubbles. Pop! Pop!', audioKey: audio('s3b.l1'), highlights: [], tone: 'giggle' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'POP',
        promptText: 'Spell POP!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.pop',
        backgroundTone: '#DDE4EC',
        next: 's4',
      },
    },
    s4: {
      id: 's4',
      illustration: 'dogpig.s4',
      lines: [
        {
          id: 'l1',
          text: 'Just one little DOT of mud is left!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Just one little DOT of mud is left!', ['DOT']),
          tone: 'excited',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'DOT',
        promptText: 'Spell DOT!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.dot',
        backgroundTone: '#EBE3D2',
        isHeroMoment: true,
        next: 's5',
      },
    },
    s5: {
      id: 's5',
      illustration: 'dogpig.s5',
      lines: [
        {
          id: 'l1',
          text: 'The DOG gives the floor one last wipe.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('The DOG gives the floor one last wipe.', ['DOG']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'DOG',
        promptText: 'Spell DOG!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.dog',
        backgroundTone: '#F0E2D0',
        next: 's6',
      },
    },
    s6: {
      id: 's6',
      illustration: 'dogpig.s6',
      lines: [
        { id: 'l1', text: 'The dog and the pig cleaned it all up.', audioKey: audio('s6.l1'), highlights: [], tone: 'warm' },
        { id: 'l2', text: 'Work is fun when we do it together!', audioKey: audio('s6.l2'), highlights: [], tone: 'warm' },
      ],
      end: { type: 'end' },
    },
  },
};
