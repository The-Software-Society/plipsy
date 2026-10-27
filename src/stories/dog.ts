import { Story } from './types';
import { findSpans, lettersFor } from './highlights';

const audio = (line: string) => `dog.${line}`;

export const dogStory: Story = {
  id: 'dog',
  title: 'Mia and the Dog',
  heroWord: 'DOG',
  cover: 'dog.cover',
  startSceneId: 's1',
  scenes: {
    s1: {
      id: 's1',
      illustration: 'dog.s1',
      lines: [
        {
          id: 'l1',
          text: 'Mia is at the park. She is holding her TOY.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Mia is at the park. She is holding her TOY.', ['Mia', 'TOY']),
        },
        {
          id: 'l2',
          text: 'Look. A friendly dog is running over to say hi.',
          audioKey: audio('s1.l2'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'dog.s2',
      lines: [
        {
          id: 'l1',
          text: 'The dog has soft brown fur and a happy wagging tail.',
          audioKey: audio('s2.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'choice',
        promptText: 'What does the dog want to do?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'RUN', audioKey: 'word.run', illustration: 'choice.run', next: 's3a' },
          { word: 'PLAY', audioKey: 'word.play', illustration: 'choice.play', next: 's3b' },
          { word: 'PET', audioKey: 'word.pet', illustration: 'choice.pet', next: 's3c' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'dog.s3a',
      lines: [
        {
          id: 'l1',
          text: 'Mia and the dog run across the grass. The dog is fast. Mia laughs.',
          audioKey: audio('s3a.l1'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's4' },
    },
    s3b: {
      id: 's3b',
      illustration: 'dog.s3b',
      lines: [
        {
          id: 'l1',
          text: 'Mia tosses a stick. The dog runs and brings it back. Again. Again.',
          audioKey: audio('s3b.l1'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's4' },
    },
    s3c: {
      id: 's3c',
      illustration: 'dog.s3c',
      lines: [
        {
          id: 'l1',
          text: "Mia pets the dog's soft fur. The dog leans into her hand.",
          audioKey: audio('s3c.l1'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's4' },
    },

    s4: {
      id: 's4',
      illustration: 'dog.s4',
      lines: [
        {
          id: 'l1',
          text: "Mia's new friend has a name for what kind of animal it is.",
          audioKey: audio('s4.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'It is a DOG.',
          audioKey: audio('s4.l2'),
          highlights: findSpans('It is a DOG.', ['DOG']),
        },
      ],
      end: {
        type: 'spellOut',
        word: 'DOG',
        heroAudioKey: 'word.dog.hero',
        letterAudioKeys: lettersFor('DOG'),
        expressionIllustration: 'dog.expression',
        backgroundTone: '#E5BFAF',
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'dog.s5',
      lines: [
        {
          id: 'l1',
          text: 'Where do they go next?',
          audioKey: audio('s5.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'choice',
        promptText: 'Where do they go?',
        promptAudioKey: audio('s5.prompt'),
        options: [
          { word: 'SIT', audioKey: 'word.sit', illustration: 'choice.sit', next: 's6a' },
          { word: 'WALK', audioKey: 'word.walk', illustration: 'choice.walk', next: 's6b' },
        ],
      },
    },

    s6a: {
      id: 's6a',
      illustration: 'dog.s6a',
      lines: [
        {
          id: 'l1',
          text: 'They sit together. The dog rests its head on her knee.',
          audioKey: audio('s6a.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'It is a happy quiet moment.',
          audioKey: audio('s6a.l2'),
          highlights: [],
        },
      ],
      end: { type: 'end' },
    },
    s6b: {
      id: 's6b',
      illustration: 'dog.s6b',
      lines: [
        {
          id: 'l1',
          text: 'They walk along the path. The dog stays close to Mia the whole way.',
          audioKey: audio('s6b.l1'),
          highlights: [],
        },
      ],
      end: { type: 'end' },
    },
  },
};
