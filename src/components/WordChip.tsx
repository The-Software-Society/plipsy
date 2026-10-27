import { View, Text, Pressable, StyleSheet } from 'react-native';
import { VocabEntry, VocabStatus } from '@/src/vocab/tracker';
import { type, colors, spacing, radius } from '@/src/theme';

type Props = {
  entry: VocabEntry;
  onPress?: () => void;
};

const stylesByStatus: Record<VocabStatus, { bg: string; border: string; text: string }> = {
  introduced: { bg: colors.cream, border: colors.terracottaSoft, text: colors.terracottaDeep },
  learning: { bg: colors.terracottaSoft, border: colors.terracotta, text: colors.terracottaDeep },
  mastered: { bg: colors.mustardSoft, border: colors.mustard, text: colors.ink },
};

export const WordChip = ({ entry, onPress }: Props) => {
  const tone = stylesByStatus[entry.status];

  const inner = (
    <View
      style={[
        styles.chip,
        { backgroundColor: tone.bg, borderColor: tone.border },
      ]}
    >
      <Text style={[type.chip, { color: tone.text }]}>{entry.word}</Text>
    </View>
  );

  if (!onPress) return inner;

  return (
    <Pressable onPress={onPress} accessibilityLabel={entry.word}>
      {inner}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 2,
    minWidth: 88,
    alignItems: 'center',
  },
});
