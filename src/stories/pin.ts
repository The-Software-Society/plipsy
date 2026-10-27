import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `pin.${line}`;

// Module 1 · Unit 7 - short I (-in). Moral: playing together is the real prize.
export const pinStory: Story = {
  id: 'pin',
  title: 'Win a Pin',
  heroWord: 'WIN',
  cover: 'pin.s1',
  startSceneId: 's1',
  targetWords: ['PIN', 'WIN', 'FIN'],
  reviewWords: ['PIG'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'pin.s1',
      lines: [
        {
          id: 'l1',
          text: 'It is games day in the garden!',
          audioKey: audio('s1.l1'),
          highlights: [],
          tone: 'cheer',
        },
        {
          id: 'l2',
          text: 'Rosie the PIG spots a shiny PIN for the winner.',
          audioKey: audio('s1.l2'),
          highlights: findSpans('Rosie the PIG spots a shiny PIN for the winner.', ['PIG', 'PIN']),
          tone: 'playful',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },

    s2: {
      id: 's2',
      illustration: 'pin.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'Which game should they play?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'FIN', audioKey: 'word.fin', illustration: 'choice.fin', next: 's3a' },
          { word: 'PIN', audioKey: 'word.pin', illustration: 'choice.pin', next: 's3b' },
        ],
      },
    },

    s3a: {
      id: 's3a',
      illustration: 'pin.s3a',
      lines: [
        {
          id: 'l1',
          text: 'Splash! They race a little wooden fish with a red fin.',
          audioKey: audio('s3a.l1'),
          highlights: [],
          tone: 'fun',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'FIN',
        promptText: 'Spell FIN!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.fin',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s3b: {
      id: 's3b',
      illustration: 'pin.s3b',
      lines: [
        {
          id: 'l1',
          text: 'Toss the ring! The shiny pin wobbles on its post.',
          audioKey: audio('s3b.l1'),
          highlights: [],
          tone: 'fun',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'PIN',
        promptText: 'Spell PIN!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.pin',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },

    s4: {
      id: 's4',
      illustration: 'pin.s4',
      lines: [
        {
          id: 'l1',
          text: 'They finish side by side. Both of them WIN!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('They finish side by side. Both of them WIN!', ['WIN']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'WIN',
        promptText: 'Spell WIN!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.win',
        backgroundTone: '#F0E2D0',
        isHeroMoment: true,
        next: 's5',
      },
    },

    s5: {
      id: 's5',
      illustration: 'pin.s5',
      lines: [
        {
          id: 'l1',
          text: 'Rosie the PIG pins the shiny pin on Mia.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('Rosie the PIG pins the shiny pin on Mia.', ['PIG']),
          tone: 'warm',
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
      illustration: 'pin.s6',
      lines: [
        {
          id: 'l1',
          text: 'One pin, two happy friends.',
          audioKey: audio('s6.l1'),
          highlights: [],
          tone: 'warm',
        },
        {
          id: 'l2',
          text: 'Playing together is the real prize!',
          audioKey: audio('s6.l2'),
          highlights: [],
          tone: 'warm',
        },
      ],
      end: { type: 'end' },
    },
  },
};
