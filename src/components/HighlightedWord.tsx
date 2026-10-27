import { Text, StyleSheet } from 'react-native';
import { type, colors } from '@/src/theme';

type Props = {
  word: string;
  mastered: boolean;
  onPress: () => void;
  fontSize?: number;
  lineHeight?: number;
};

export const HighlightedWord = ({ word, mastered, onPress, fontSize, lineHeight }: Props) => {
  return (
    <Text
      style={[
        type.narratorLine,
        mastered ? styles.mastered : styles.highlighted,
        fontSize ? { fontSize, lineHeight: lineHeight ?? fontSize * 1.45 } : null,
      ]}
      onPress={onPress}
      suppressHighlighting
    >
      {word}
    </Text>
  );
};

const styles = StyleSheet.create({
  highlighted: {
    color: colors.terracottaDeep,
    fontWeight: '700',
    textDecorationLine: 'underline',
    textDecorationColor: colors.terracottaSoft,
  },
  mastered: {
    color: colors.ink,
  },
});
