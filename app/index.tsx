import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { IllustrationView } from '@/src/components/IllustrationView';
import { useVocab } from '@/src/vocab/store';
import { useLearner } from '@/src/learner/store';
import { worldView, FriendView } from '@/src/world/state';
import { areaProgress } from '@/src/world/areas';
import { audio } from '@/src/audio/AudioPlayer';
import { type, colors, spacing, radius, useResponsive } from '@/src/theme';
import type { VocabEntry } from '@/src/vocab/tracker';

const hashStr = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const variantFor = (w: string) => (['a', 'b', 'c'] as const)[hashStr(w) % 3]!;

// A flower for each of a friend's words: bloomed (longTerm) = flower, started = sprout.
const gardenIcons = (
  f: FriendView,
  entries: Record<string, VocabEntry>,
  completed: string[]
): string[] => {
  const words = areaProgress(f, entries, completed).words;
  const out: string[] = [];
  for (const w of words) {
    const e = entries[w.word];
    if (w.bloomed) out.push(`world.flower.${variantFor(w.word)}`);
    else if (e && (e.box ?? 0) >= 1) out.push('world.sprout');
  }
  return out;
};

// The home: Mia's garden, drawn as a calm winding path. Friends live along the
// trail in vowel order; one gently glows (the next thing to do). The garden
// visibly grows as words bloom (a flower patch by each friend) and friends wake.
export default function Home() {
  const router = useRouter();
  const entries = useVocab((s) => s.entries);
  const completed = useLearner((s) => s.completed);
  const { width, pick } = useResponsive();

  const view = useMemo(() => worldView(entries, completed), [entries, completed]);
  const disc = Math.min(pick({ xs: 128, md: 148, lg: 164, xl: 180 }), width * 0.32);

  const onFriend = (f: FriendView) => {
    if (f.status === 'locked' || f.status === 'comingSoon') return;
    audio.playChime();
    router.push(`/area/${f.id}` as never);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* The generated garden map. It was produced (and paid for) and sat in the
          manifest unused, leaving the world a flat green field. Held back at
          partial opacity so the trail and friend discs stay readable on top. */}
      <View style={styles.bgLayer} pointerEvents="none">
        <IllustrationView illustrationKey="world.bg" fallbackTone={colors.sageSoft} resizeMode="cover" />
      </View>

      <View style={styles.topBar}>
        <Text style={[type.storyTitle, styles.title]}>Mia's Garden 🌷</Text>
        <View style={styles.topBtns}>
          <Pressable onPress={() => router.push('/words' as never)} hitSlop={12} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Word flowers">
            <Text style={styles.iconText}>🌸</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/treasures' as never)} hitSlop={12} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Your basket">
            <Text style={styles.iconText}>🧺</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/parent' as never)} hitSlop={12} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Parent area">
            <Text style={styles.iconText}>⚙</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FlowerBorder count={7} />

        <View style={styles.path}>
          {/* the winding garden trail behind the friends */}
          <View style={styles.trail} pointerEvents="none" />
          {view.friends.map((f, i) => (
            <PathNode
              key={f.id}
              friend={f}
              first={i === 0}
              side={i % 2 === 0 ? -1 : 1}
              glow={f.id === view.glowFriendId}
              disc={disc}
              stars={f.storyIds.length ? Math.round(areaProgress(f, entries, completed).percent * 5) : 0}
              icons={f.status === 'locked' || f.status === 'comingSoon' ? [] : gardenIcons(f, entries, completed)}
              onPress={() => onFriend(f)}
            />
          ))}
        </View>

        <FlowerBorder count={9} />
      </ScrollView>
    </SafeAreaView>
  );
}

const FlowerBorder = ({ count }: { count: number }) => (
  <View style={styles.border} pointerEvents="none">
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={styles.borderFlower}>
        <IllustrationView illustrationKey={`world.flower.${(['a', 'b', 'c'] as const)[i % 3]}`} fallbackTone="transparent" resizeMode="contain" />
      </View>
    ))}
  </View>
);

const PathNode = ({
  friend,
  first,
  side,
  glow,
  disc,
  stars,
  icons,
  onPress,
}: {
  friend: FriendView;
  first: boolean;
  side: number; // -1 left, 1 right (gentle weave)
  glow: boolean;
  disc: number;
  stars: number;
  icons: string[];
  onPress: () => void;
}) => {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = glow
      ? withRepeat(withSequence(withTiming(1.1, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true)
      : withTiming(1, { duration: 200 });
  }, [glow, pulse]);
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }], opacity: glow ? 0.55 : 0 }));

  const asleep = friend.status === 'locked' || friend.status === 'comingSoon';
  const showStars = friend.storyIds.length > 0 && !asleep;

  return (
    <View style={styles.nodeWrap}>
      {!first && <View style={styles.connector} />}
      <View style={[styles.nodeRow, { transform: [{ translateX: side * disc * 0.32 }] }]}>
        <Pressable
          disabled={asleep}
          onPress={onPress}
          style={[styles.disc, { width: disc, height: disc, borderRadius: disc / 2 }, glow && styles.discGlow, asleep && styles.discAsleep]}
          accessibilityRole="button"
          accessibilityLabel={asleep ? `${friend.name} (asleep)` : friend.name}
        >
          <Animated.View style={[styles.ring, { borderRadius: disc / 2 }, ring]} />
          <View style={[styles.sprite, { opacity: asleep ? 0.45 : 1 }]}>
            <IllustrationView illustrationKey={friend.sprite} fallbackTone="transparent" resizeMode="contain" />
          </View>
          {friend.status === 'wantsPlay' && <Text style={styles.badge}>✨</Text>}
          {asleep && <Text style={styles.zzz}>💤</Text>}
        </Pressable>

        {/* this friend's little garden patch (grows as words bloom) */}
        {icons.length > 0 && (
          <View style={styles.patch}>
            {icons.slice(0, 8).map((key, k) => (
              <View key={k} style={styles.patchFlower}>
                <IllustrationView illustrationKey={key} fallbackTone="transparent" resizeMode="contain" />
              </View>
            ))}
          </View>
        )}
      </View>

      <Text style={[styles.name, asleep && styles.nameAsleep]}>{friend.name}</Text>
      {showStars && (
        <View style={styles.stars}>
          {[0, 1, 2, 3, 4].map((s) => (
            <Text key={s} style={[styles.star, s < stars && styles.starFilled]}>★</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sageSoft }, // grass (behind the map)
  // Kept low: at full strength the map's own painted animals (a large dog near
  // the left edge) compete with the friend discs on top of it. At this weight it
  // reads as garden texture behind the trail rather than as literal scenery.
  bgLayer: { ...StyleSheet.absoluteFillObject, opacity: 0.32 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.creamSoft,
  },
  title: { fontSize: 22, color: colors.inkSoft },
  topBtns: { flexDirection: 'row', gap: spacing.xs },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20 },

  scroll: { alignItems: 'center', paddingBottom: spacing.xl },

  border: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, flexWrap: 'wrap' },
  borderFlower: { width: 26, height: 26 },

  // Cap the column so the trail does not sit in an ocean of empty grass on a
  // laptop; it stays centred and the map fills the rest.
  path: { alignSelf: 'center', width: '100%', maxWidth: 720, alignItems: 'center', paddingVertical: spacing.md },
  trail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 56,
    marginLeft: -28,
    backgroundColor: colors.cream,
    borderRadius: radius.pill,
    opacity: 0.9,
  },

  nodeWrap: { alignItems: 'center' },
  nodeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  connector: { width: 0, height: 24, borderLeftWidth: 4, borderColor: colors.cream, borderStyle: 'dotted', marginVertical: 2 },
  disc: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.creamSoft, borderWidth: 3, borderColor: colors.cream },
  discGlow: { borderColor: colors.mustard, backgroundColor: colors.mustardSoft },
  discAsleep: { backgroundColor: colors.creamDeep, borderColor: colors.creamDeep },
  ring: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.mustardSoft },
  sprite: { width: '80%', height: '80%' },
  badge: { position: 'absolute', top: -2, right: 2, fontSize: 22 },
  zzz: { position: 'absolute', top: -2, right: 4, fontSize: 18 },
  name: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: colors.inkSoft, marginTop: spacing.xs, textShadowColor: colors.creamSoft, textShadowRadius: 3 },
  nameAsleep: { color: colors.inkSoft, opacity: 0.85 },
  stars: { flexDirection: 'row', gap: 2, marginTop: 2 },
  // Empty stars were cream on sage: all but invisible. Muted ink reads at a
  // glance without competing with the earned mustard ones.
  star: { fontSize: 16, color: colors.inkFaint, textShadowColor: colors.creamSoft, textShadowRadius: 3 },
  starFilled: { color: colors.mustard },

  patch: { width: 78, flexDirection: 'row', flexWrap: 'wrap', gap: 1, alignItems: 'center' },
  patchFlower: { width: 24, height: 24 },
});
