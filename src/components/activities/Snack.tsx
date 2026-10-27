import { useEffect, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { audio } from '@/src/audio/AudioPlayer';
import { wordKey, wrongWordSeq, BANK } from '@/src/audio/bank';
import { IllustrationView } from '@/src/components/IllustrationView';
import { type, colors, spacing, radius, useResponsive } from '@/src/theme';

type Props = {
  word: string;
  options: string[]; // all have icons
  friendName: string;
  onResult: (errors: number) => void;
};

const safeHaptic = (fn: () => void) => {
  try {
    fn();
  } catch {
    /* web no-op */
  }
};

// Match the WORD to its picture (word ↔ meaning), framed as feeding a friend.
export const Snack = ({ word, options, friendName, onResult }: Props) => {
  const { pick } = useResponsive();
  const errorsRef = useRef(0);
  const cards = useMemo(
    () => [...options].sort((a, b) => (a + word).localeCompare(b + word)),
    [options, word]
  );

  useEffect(() => {
    audio.play(wordKey(word));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  const onTap = (w: string) => {
    if (w === word) {
      audio.playChime();
      audio.playSequence([BANK.great], 0);
      safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      onResult(errorsRef.current);
    } else {
      errorsRef.current += 1;
      safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
      // Same one-shot correction as the word cards. The old play() + timer pair
      // cut the uh-oh off before it finished.
      audio.playSequence(wrongWordSeq(w, word), 120);
    }
  };

  const cardSize = pick({ xs: 104, sm: 124, md: 136, lg: 148, xl: 160 });

  return (
    <View style={styles.root}>
      <Text style={[type.button, styles.prompt]}>{friendName} wants the…</Text>
      <Pressable onPress={() => audio.play(wordKey(word))} style={styles.wordBtn}>
        <Text style={styles.bigWord}>{word}</Text>
      </Pressable>
      <View style={styles.row}>
        {cards.map((w) => (
          <Pressable
            key={w}
            onPress={() => onTap(w)}
            style={({ pressed }) => [styles.card, { width: cardSize, height: cardSize }, pressed && styles.pressed]}
            accessibilityLabel={w}
          >
            <IllustrationView illustrationKey={`choice.${w.toLowerCase()}`} fallbackTone={colors.creamSoft} resizeMode="contain" />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  prompt: { color: colors.inkSoft },
  wordBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.creamSoft },
  bigWord: { fontFamily: 'Nunito_700Bold', fontSize: 40, letterSpacing: 3, color: colors.terracottaDeep },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.lg },
  card: { backgroundColor: colors.creamSoft, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 2, borderColor: colors.terracottaSoft },
  pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
});
