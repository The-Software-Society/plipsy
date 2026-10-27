import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `wig.${line}`;

// Module 1 · Unit 10 - short I spiral. Moral: being silly together is the best.
export const wigStory: Story = {
  id: 'wig',
  title: 'The Dress Up Show',
  heroWord: 'WIG',
  cover: 'wig.s1',
  startSceneId: 's1',
  targetWords: ['WIG', 'LIP'],
  reviewWords: ['HAT', 'ZIP'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'wig.s1',
      lines: [
        {
          id: 'l1',
          text: 'Mia tips out the dress up box in the garden.',
          audioKey: audio('s1.l1'),
          highlights: [],
          tone: 'cheer',
        },
        {
          id: 'l2',
          text: 'Rosie the PIG wants to be in the show!',
          audioKey: audio('s1.l2'),
          highlights: findSpans('Rosie the PIG wants to be in the show!', ['PIG']),
          tone: 'giggle',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'wig.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'What should Rosie put on?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'HAT', audioKey: 'word.hat', illustration: 'choice.hat', next: 's3a' },
          { word: 'ZIP', audioKey: 'word.zip', illustration: 'choice.zip', next: 's3b' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'wig.s3a',
      lines: [
        {
          id: 'l1',
          text: 'A floppy hat slides down over one eye. Ha!',
          audioKey: audio('s3a.l1'),
          highlights: [],
          tone: 'giggle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'HAT',
        promptText: 'Spell HAT!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.hat',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s3b: {
      id: 's3b',
      illustration: 'wig.s3b',
      lines: [
        {
          id: 'l1',
          text: 'A stripy coat goes on and Mia does up the zip.',
          audioKey: audio('s3b.l1'),
          highlights: [],
          tone: 'giggle',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'ZIP',
        promptText: 'Spell ZIP!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.zip',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'wig.s4',
      lines: [
        {
          id: 'l1',
          text: 'Last of all, a curly yellow WIG. Rosie twirls!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Last of all, a curly yellow WIG. Rosie twirls!', ['WIG']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'WIG',
        promptText: 'Spell WIG!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.wig',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'wig.s5',
      lines: [
        {
          id: 'l1',
          text: 'After the show, a picnic. Rosie licks her LIP. Yum!',
          audioKey: audio('s5.l1'),
          highlights: findSpans('After the show, a picnic. Rosie licks her LIP. Yum!', ['LIP']),
          tone: 'fun',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'LIP',
        promptText: 'Spell LIP!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.lip',
        backgroundTone: '#EBE3D2',
        next: 's6',
      },
    },

    s6: {
      id: 's6',
      illustration: 'wig.s6',
      lines: [
        {
          id: 'l1',
          text: 'A pig in a wig and a girl in a hat.',
          audioKey: audio('s6.l1'),
          highlights: [],
          tone: 'giggle',
        },
        {
          id: 'l2',
          text: 'Being silly together is the best!',
          audioKey: audio('s6.l2'),
          highlights: [],
          tone: 'warm',
        },
      ],
      end: { type: 'end' },
    },
  },
};
