import { Story } from './types';
import { findSpans, lettersFor } from './highlights';

const audio = (line: string) => `roar.${line}`;

export const roarStory: Story = {
  id: 'roar',
  title: 'Mia and the Dinosaur',
  heroWord: 'ROAR',
  cover: 'roar.cover',
  startSceneId: 's1',
  scenes: {
    s1: {
      id: 's1',
      illustration: 'roar.s1',
      lines: [
        {
          id: 'l1',
          text: 'Mia opens her favorite book.',
          audioKey: audio('s1.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'WHOOSH. A little green dinosaur hops right off the page.',
          audioKey: audio('s1.l2'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'roar.s2',
      lines: [
        {
          id: 'l1',
          text: 'The dinosaur looks happy to see Mia. It opens its mouth wide.',
          audioKey: audio('s2.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'choice',
        promptText: 'What does the dinosaur do?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'ROAR', audioKey: 'word.roar', illustration: 'choice.roar', next: 's3a' },
          { word: 'SMILE', audioKey: 'word.smile', illustration: 'choice.smile', next: 's3b' },
          { word: 'WAVE', audioKey: 'word.wave', illustration: 'choice.wave', next: 's3c' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'roar.s3a',
      lines: [
        {
          id: 'l1',
          text: 'ROAR. The dinosaur roars. But it is a tiny squeaky roar.',
          audioKey: audio('s3a.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'Mia giggles.',
          audioKey: audio('s3a.l2'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's4' },
    },
    s3b: {
      id: 's3b',
      illustration: 'roar.s3b',
      lines: [
        {
          id: 'l1',
          text: 'The dinosaur grins big. Then it leans in and goes ROAR anyway.',
          audioKey: audio('s3b.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'Mia giggles.',
          audioKey: audio('s3b.l2'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's4' },
    },
    s3c: {
      id: 's3c',
      illustration: 'roar.s3c',
      lines: [
        {
          id: 'l1',
          text: 'The dinosaur waves with its tiny arms. Then it lifts its head and goes ROAR.',
          audioKey: audio('s3c.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'Mia giggles.',
          audioKey: audio('s3c.l2'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's4' },
    },

    s4: {
      id: 's4',
      illustration: 'roar.s4',
      lines: [
        {
          id: 'l1',
          text: 'What a funny dinosaur sound.',
          audioKey: audio('s4.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'That sound has a name. It is called a ROAR.',
          audioKey: audio('s4.l2'),
          highlights: findSpans('That sound has a name. It is called a ROAR.', ['ROAR']),
        },
      ],
      end: {
        type: 'spellOut',
        word: 'ROAR',
        heroAudioKey: 'word.roar.hero',
        letterAudioKeys: lettersFor('ROAR'),
        expressionIllustration: 'roar.expression',
        backgroundTone: '#B5C9B5',
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'roar.s5',
      lines: [
        {
          id: 'l1',
          text: 'What should they do together?',
          audioKey: audio('s5.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'choice',
        promptText: 'What should they do?',
        promptAudioKey: audio('s5.prompt'),
        options: [
          { word: 'RUN', audioKey: 'word.run', illustration: 'choice.run', next: 's6a' },
          { word: 'READ', audioKey: 'word.read', illustration: 'choice.read', next: 's6b' },
        ],
      },
    },

    s6a: {
      id: 's6a',
      illustration: 'roar.s6a',
      lines: [
        {
          id: 'l1',
          text: 'Mia and the dinosaur run all around the room.',
          audioKey: audio('s6a.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'The dinosaur tries to ROAR while running. It comes out funny.',
          audioKey: audio('s6a.l2'),
          highlights: findSpans('The dinosaur tries to ROAR while running. It comes out funny.', ['ROAR']),
        },
      ],
      end: { type: 'end' },
    },
    s6b: {
      id: 's6b',
      illustration: 'roar.s6b',
      lines: [
        {
          id: 'l1',
          text: 'Mia and the dinosaur sit and read the book together.',
          audioKey: audio('s6b.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'The dinosaur points at pictures and gives a tiny ROAR every time.',
          audioKey: audio('s6b.l2'),
          highlights: findSpans('The dinosaur points at pictures and gives a tiny ROAR every time.', ['ROAR']),
        },
      ],
      end: { type: 'end' },
    },
  },
};
