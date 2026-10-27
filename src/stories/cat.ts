import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `cat.${line}`;

export const catStory: Story = {
  id: 'cat',
  title: 'Mia and the Cat',
  heroWord: 'CAT',
  cover: 'cat.cover',
  startSceneId: 's1',
  scenes: {
    s1: {
      id: 's1',
      illustration: 'cat.s1',
      lines: [
        {
          id: 'l1',
          text: 'Mia is in the garden. She has her TOY with her.',
          audioKey: audio('s1.l1'),
          highlights: findSpans('Mia is in the garden. She has her TOY with her.', ['Mia', 'TOY']),
        },
        {
          id: 'l2',
          text: 'Look. Something is moving over by the tree.',
          audioKey: audio('s1.l2'),
          highlights: [],
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'cat.s2',
      lines: [
        {
          id: 'l1',
          text: 'This is Waldo, a little orange cat. Waldo looks right at Mia.',
          audioKey: audio('s2.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'choice',
        promptText: 'How does Mia say hi?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'WAVE', audioKey: 'word.wave', illustration: 'choice.wave', next: 's3a' },
          { word: 'SIT', audioKey: 'word.sit', illustration: 'choice.sit', next: 's3b' },
          { word: 'CALL', audioKey: 'word.call', illustration: 'choice.call', next: 's3c' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'cat.s3a',
      lines: [
        {
          id: 'l1',
          text: 'Mia gives the cat a soft wave.',
          audioKey: audio('s3a.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'WAVE',
        promptText: 'Wave hello! Spell WAVE.',
        promptAudioKey: audio('s3a.spell'),
        sounds: [null, 'long', null, 'silent'], // W, A(ay), V, E(quiet)
        expressionIllustration: 'choice.wave',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'cat.s3b',
      lines: [
        {
          id: 'l1',
          text: 'Mia sits down quiet as can be. The cat watches her.',
          audioKey: audio('s3b.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'SIT',
        promptText: 'Spell SIT so the cat will come.',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.sit',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },
    s3c: {
      id: 's3c',
      illustration: 'cat.s3c',
      lines: [
        {
          id: 'l1',
          text: 'Mia calls out soft. Here, kitty.',
          audioKey: audio('s3c.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'CALL',
        promptText: 'Spell CALL to call the cat.',
        promptAudioKey: audio('s3c.spell'),
        sounds: [null, 'broad', null, null], // C, A(aw), L, L
        expressionIllustration: 'choice.call',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'cat.s4',
      lines: [
        {
          id: 'l1',
          text: 'The cat comes right up close to Mia now.',
          audioKey: audio('s4.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'Mia’s new friend Waldo is a CAT.',
          audioKey: audio('s4.l2'),
          highlights: findSpans('Mia’s new friend Waldo is a CAT.', ['CAT']),
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'CAT',
        promptText: 'Now spell the word CAT!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'cat.expression',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'cat.s5',
      lines: [
        {
          id: 'l1',
          text: 'What does Mia want to share with her new friend?',
          audioKey: audio('s5.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'choice',
        promptText: 'What does Mia share?',
        promptAudioKey: audio('s5.prompt'),
        options: [
          { word: 'TOY', audioKey: 'word.toy', illustration: 'choice.toy', next: 's6a' },
          { word: 'PET', audioKey: 'word.pet', illustration: 'choice.pet', next: 's6b' },
        ],
      },
    },

    s6a: {
      id: 's6a',
      illustration: 'cat.s6a',
      lines: [
        {
          id: 'l1',
          text: 'Mia holds out her soft TOY.',
          audioKey: audio('s6a.l1'),
          highlights: findSpans('Mia holds out her soft TOY.', ['TOY']),
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'TOY',
        promptText: 'Spell TOY to show the cat.',
        promptAudioKey: audio('s6a.spell'),
        sounds: [null, 'long', null], // T, O(oh), Y - "oy" digraph is approximate
        expressionIllustration: 'choice.toy',
        backgroundTone: '#E7E0CF',
        next: 's7',
      },
    },
    s6b: {
      id: 's6b',
      illustration: 'cat.s6b',
      lines: [
        {
          id: 'l1',
          text: 'Mia reaches out a gentle hand.',
          audioKey: audio('s6b.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'PET',
        promptText: 'Spell PET to pet the cat soft.',
        promptAudioKey: audio('s6b.spell'),
        expressionIllustration: 'choice.pet',
        backgroundTone: '#E7E0CF',
        next: 's7',
      },
    },

    s7: {
      id: 's7',
      illustration: 'cat.s7',
      lines: [
        {
          id: 'l1',
          text: 'The cat feels happy and safe. Now they want to play!',
          audioKey: audio('s7.l1'),
          highlights: [],
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'RUN',
        promptText: 'Spell RUN and away they go!',
        promptAudioKey: audio('s7.spell'),
        expressionIllustration: 'choice.run',
        backgroundTone: '#E3E8DD',
        next: 's8',
      },
    },

    s8: {
      id: 's8',
      illustration: 'cat.s8',
      lines: [
        {
          id: 'l1',
          text: 'Mia and the cat play and run in the soft grass.',
          audioKey: audio('s8.l1'),
          highlights: [],
        },
        {
          id: 'l2',
          text: 'They are friends now. What a happy day.',
          audioKey: audio('s8.l2'),
          highlights: [],
        },
      ],
      end: { type: 'end' },
    },
  },
};
