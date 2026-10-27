import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { IllustrationView } from '@/src/components/IllustrationView';
import { treasureById } from '@/src/rewards/treasures';
import { audio } from '@/src/audio/AudioPlayer';
import { type, colors, spacing, radius, motion } from '@/src/theme';

// A gentle "you found a treasure" reveal shown after an activity. Low-stim: a
// soft chime, a slow scale-in, a slow sway. No confetti.
export const TreasureReward = ({ treasureId, onContinue }: { treasureId: string; onContinue: () => void }) => {
  const t = treasureById(treasureId);
  const pop = useSharedValue(0);
  const sway = useSharedValue(0);

  useEffect(() => {
    audio.playChime();
    audio.playSequence(['world.found', `world.treasure.${treasureId}`], 90);
    pop.value = withSpring(1, { damping: 12, stiffness: 90 });
    sway.value = withRepeat(withSequence(withTiming(1, { duration: 1600 }), withTiming(-1, { duration: 1600 })), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treasureId]);

  const itemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.6 + pop.value * 0.4 }, { rotate: `${sway.value * 4}deg` }],
    opacity: pop.value,
  }));

  if (!t) return null;

  return (
    <Animated.View entering={FadeIn.duration(motion.duration.slow)} style={styles.root}>
      <Text style={styles.label}>You found...</Text>
      <Animated.View style={[styles.item, itemStyle]}>
        <IllustrationView illustrationKey={t.sprite} fallbackTone="transparent" resizeMode="contain" />
      </Animated.View>
      <Text style={[type.storyTitle, styles.name]}>{capitalize(t.name)}!</Text>
      <Pressable style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]} onPress={onContinue}>
        <Text style={styles.btnText}>Yay!</Text>
      </Pressable>
    </Animated.View>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  label: { fontFamily: 'Nunito_600SemiBold', fontSize: 20, color: colors.inkSoft },
  item: { width: 180, height: 180 },
  name: { fontSize: 28, color: colors.terracottaDeep },
  btn: {
    marginTop: spacing.md,
    backgroundColor: colors.mustardSoft,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    minWidth: 200,
    alignItems: 'center',
  },
  btnPressed: { backgroundColor: colors.mustard, transform: [{ scale: 0.98 }] },
  btnText: { fontFamily: 'Nunito_700Bold', fontSize: 22, color: colors.ink },
});
