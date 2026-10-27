import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
} as const;

export const type = {
  narratorLine: {
    fontFamily: fonts.medium,
    fontSize: 28,
    lineHeight: 40,
    letterSpacing: 0.3,
    color: colors.ink,
  },
  highlightedWord: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 40,
    letterSpacing: 0.5,
    color: colors.terracottaDeep,
  },
  spellOutLetter: {
    fontFamily: fonts.bold,
    fontSize: 96,
    letterSpacing: 4,
    color: colors.ink,
  },
  spellOutWord: {
    fontFamily: fonts.bold,
    fontSize: 64,
    letterSpacing: 6,
    color: colors.terracottaDeep,
  },
  storyTitle: {
    fontFamily: fonts.semibold,
    fontSize: 26,
    letterSpacing: 0.5,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
  },
  small: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  button: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    letterSpacing: 0.5,
    color: colors.ink,
  },
  chip: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    letterSpacing: 0.5,
    color: colors.ink,
  },
} as const satisfies Record<string, TextStyle>;
