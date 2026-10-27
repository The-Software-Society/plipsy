import { Story } from './types';
import { findSpans } from './highlights';

const audio = (line: string) => `party.${line}`;

// Module 1 · Unit 16 - all vowels, boss story. Moral: sharing with everyone you love.
export const partyStory: Story = {
  id: 'party',
  title: "Mia's Big Day",
  heroWord: 'FUN',
  cover: 'party.s1',
  startSceneId: 's1',
  targetWords: ['CUT', 'NUT', 'FUN'],
  reviewWords: ['SUN'],
  scenes: {
    s1: {
      id: 's1',
      illustration: 'party.s1',
      lines: [
        {
          id: 'l1',
          text: 'It is the big day! Every friend came to the garden.',
          audioKey: audio('s1.l1'),
          highlights: [],
          tone: 'excited',
        },
        {
          id: 'l2',
          text: 'Waldo, Rosie, Biscuit, Ruby and Bea are all here!',
          audioKey: audio('s1.l2'),
          highlights: [],
          tone: 'cheer',
        },
      ],
      end: { type: 'continue', next: 's2' },
    },
    s2: {
      id: 's2',
      illustration: 'party.s2',
      lines: [],
      end: {
        type: 'choice',
        promptText: 'How do we get the party ready?',
        promptAudioKey: audio('s2.prompt'),
        options: [
          { word: 'CUT', audioKey: 'word.cut', illustration: 'choice.cut', next: 's3a' },
          { word: 'NUT', audioKey: 'word.nut', illustration: 'choice.nut', next: 's3b' },
        ],
      },
    },
    s3a: {
      id: 's3a',
      illustration: 'party.s3a',
      lines: [
        { id: 'l1', text: 'Mia cuts the cake into five neat slices.', audioKey: audio('s3a.l1'), highlights: [], tone: 'kind' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'CUT',
        promptText: 'Spell CUT!',
        promptAudioKey: audio('s3a.spell'),
        expressionIllustration: 'choice.cut',
        backgroundTone: '#F0E2D0',
        next: 's4',
      },
    },
    s3b: {
      id: 's3b',
      illustration: 'party.s3b',
      lines: [
        { id: 'l1', text: 'Ruby tips a bowl of nuts onto the table.', audioKey: audio('s3b.l1'), highlights: [], tone: 'playful' },
      ],
      end: {
        type: 'spellInteractive',
        word: 'NUT',
        promptText: 'Spell NUT!',
        promptAudioKey: audio('s3b.spell'),
        expressionIllustration: 'choice.nut',
        backgroundTone: '#EBE3D2',
        next: 's4',
      },
    },
    s4: {
      id: 's4',
      illustration: 'party.s4',
      lines: [
        {
          id: 'l1',
          text: 'Everyone plays together. What FUN!',
          audioKey: audio('s4.l1'),
          highlights: findSpans('Everyone plays together. What FUN!', ['FUN']),
          tone: 'cheer',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'FUN',
        promptText: 'Spell FUN!',
        promptAudioKey: audio('s4.spell'),
        expressionIllustration: 'choice.fun',
        backgroundTone: '#F5E6C8',
        isHeroMoment: true,
        next: 's5',
      },
    },
    s5: {
      id: 's5',
      illustration: 'party.s5',
      lines: [
        {
          id: 'l1',
          text: 'The SUN goes down on a happy day.',
          audioKey: audio('s5.l1'),
          highlights: findSpans('The SUN goes down on a happy day.', ['SUN']),
          tone: 'warm',
        },
      ],
      end: {
        type: 'spellInteractive',
        word: 'SUN',
        promptText: 'Spell SUN!',
        promptAudioKey: audio('s5.spell'),
        expressionIllustration: 'choice.sun',
        backgroundTone: '#F5E6C8',
        next: 's6',
      },
    },
    s6: {
      id: 's6',
      illustration: 'party.s6',
      lines: [
        { id: 'l1', text: 'Mia shared her big day with everyone she loves.', audioKey: audio('s6.l1'), highlights: [], tone: 'warm' },
        { id: 'l2', text: 'The best day is a day you share!', audioKey: audio('s6.l2'), highlights: [], tone: 'warm' },
      ],
      end: { type: 'end' },
    },
  },
};
