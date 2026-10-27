import { useEffect, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { audio } from '@/src/audio/AudioPlayer';
import { wordKey, wrongWordSeq } from '@/src/audio/bank';
import { type, colors, spacing, radius, useResponsive } from '@/src/theme';

type Props = {
  word: string;
  options: string[];
  variant: 'peekaboo' | 'bubble';
  onResult: (errors: number) => void;
};

const safeHaptic = (fn: () => void) => {
  try {
    fn();
  } catch {
    /* web no-op */
  }
};

const GAP = spacing.md;
const PAD_H = spacing.lg;

// Listen → find the printed word (recognition). Same mechanic, two skins.
export const WordTap = ({ word, options, variant, onResult }: Props) => {
  const { pick, width } = useResponsive();
  const errorsRef = useRef(0);
  const cards = useMemo(
    () => [...options].sort((a, b) => (a + word).localeCompare(b + word)),
    [options, word]
  );

  useEffect(() => {
    audio.play(wordKey(word)); // say the word to find
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  const onTap = (w: string) => {
    if (w === word) {
      audio.playChime();
      audio.play(wordKey(word));
      safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      onResult(errorsRef.current);
    } else {
      errorsRef.current += 1;
      safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
      // One sequence, no trailing timer: "Uh-oh! This is the word… MAT. You need
      // to press the one that says… CAT." A second audio call here would cut the
      // uh-oh off mid-clip, which is what used to happen.
      audio.playSequence(wrongWordSeq(w, word), 120);
    }
  };

  // The word is the thing being read, so it gets the room: two cards per row on
  // a phone (wrapping the third) rather than three squeezed ones.
  const perRow = width >= 600 ? Math.min(cards.length, 3) : Math.min(cards.length, 2);
  const widthCap = (width - PAD_H * 2 - GAP * (perRow - 1)) / perRow;
  const cardSize = Math.floor(
    Math.min(widthCap, pick({ xs: 176, sm: 196, md: 208, lg: 224, xl: 240 }))
  );
  const isBubble = variant === 'bubble';
  // Circles waste their corners, so their text runs a touch smaller.
  const wordSize = Math.round(cardSize * (isBubble ? 0.3 : 0.36));

  return (
    <View style={styles.root}>
      <Text style={[type.button, styles.prompt]}>Which one says…</Text>
      <Pressable onPress={() => audio.play(wordKey(word))} style={styles.hearBtn} accessibilityLabel="Hear it again">
        <Text style={styles.hearText}>🔊 {variant === 'bubble' ? 'pop the word you hear' : 'find the word you hear'}</Text>
      </Pressable>
      <View style={styles.row}>
        {cards.map((w) => (
          <Pressable
            key={w}
            onPress={() => onTap(w)}
            style={({ pressed }) => [
              isBubble ? styles.bubble : styles.bush,
              { width: cardSize, height: cardSize, borderRadius: isBubble ? cardSize / 2 : radius.lg },
              pressed && styles.pressed,
            ]}
            accessibilityLabel={w}
          >
            <Text
              style={[styles.word, { fontSize: wordSize, paddingHorizontal: cardSize * 0.08 }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {w}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: PAD_H, paddingVertical: spacing.lg, gap: spacing.lg },
  prompt: { color: colors.inkSoft },
  hearBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.pill, backgroundColor: colors.creamSoft },
  hearText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: colors.terracottaDeep },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: GAP },
  bush: {
    backgroundColor: colors.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.sage,
  },
  bubble: {
    backgroundColor: colors.dustyBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.dustyBlue,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
  word: { fontFamily: 'Nunito_700Bold', letterSpacing: 1.5, color: colors.ink, textAlign: 'center' },
});
