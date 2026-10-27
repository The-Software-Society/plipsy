import { useEffect, useMemo, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { IllustrationView } from '@/src/components/IllustrationView';
import { useVocab } from '@/src/vocab/store';
import { useLearner } from '@/src/learner/store';
import { friendById } from '@/src/world/friends';
import { worldView } from '@/src/world/state';
import { areaProgress, AreaStory } from '@/src/world/areas';
import { WorldVoice } from '@/src/world/audio';
import { audio } from '@/src/audio/AudioPlayer';
import { type, colors, spacing, radius, useResponsive } from '@/src/theme';

// Stories are the spine: a shelf of story pictures (read, next, still ahead) with
// one big Continue. The flashcard game is a small corner button, never the main
// event - it only appears once there are at least this many stories read.
const GAME_UNLOCKS_AT = 2;

export default function Area() {
  const router = useRouter();
  const { friend } = useLocalSearchParams<{ friend: string }>();
  const entries = useVocab((s) => s.entries);
  const completed = useLearner((s) => s.completed);
  const { pick } = useResponsive();

  const f = friend ? friendById(friend) : undefined;
  const view = useMemo(() => worldView(entries, completed), [entries, completed]);
  const fv = view.friends.find((x) => x.id === friend);
  const status = fv?.status;
  const prog = useMemo(() => (f ? areaProgress(f, entries, completed) : null), [f, entries, completed]);

  const greeted = useRef(false);
  useEffect(() => {
    if (!f || greeted.current) return;
    greeted.current = true;
    if (status === 'comingSoon' || status === 'locked') return;
    WorldVoice.greet(f.id);
  }, [f, status]);

  if (!f) {
    return (
      <SafeAreaView style={styles.root}>
        <BackButton onPress={() => router.replace('/')} />
        <View style={styles.center}>
          <Text style={type.storyTitle}>Hmm, no friend here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'comingSoon' || status === 'locked') {
    return (
      <SafeAreaView style={styles.root}>
        <BackButton onPress={() => router.replace('/')} />
        <View style={styles.center}>
          <View style={styles.sleepSprite}>
            <IllustrationView illustrationKey={f.sprite} fallbackTone="transparent" resizeMode="contain" />
          </View>
          <Text style={[type.storyTitle, { marginTop: spacing.md }]}>{f.name} is sleeping 💤</Text>
        </View>
      </SafeAreaView>
    );
  }

  const stories = prog!.stories;
  const next = stories.find((s) => s.state === 'next');
  const lastStory = stories[stories.length - 1];
  // With every story read, Continue becomes "read it again" on the most recent one.
  const continueId = next?.id ?? lastStory?.id ?? null;
  const continueLabel = next ? (prog!.storiesDone > 0 ? 'Continue story' : 'Start the story') : 'Read it again';

  const openStory = (id: string) => {
    WorldVoice.say('world.task.read');
    router.push(`/story/${id}` as never);
  };

  const openGame = () => {
    audio.playChime();
    router.push(`/review?friend=${f.id}` as never);
  };

  const gameUnlocked = prog!.storiesDone >= GAME_UNLOCKS_AT;
  const wantsPractice = (fv?.dueWords.length ?? 0) > 0;
  const cardW = pick({ xs: 132, sm: 148, md: 164, lg: 176, xl: 188 });

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <BackButton onPress={() => router.replace('/')} />
      {gameUnlocked && (
        <Pressable
          onPress={openGame}
          hitSlop={12}
          style={({ pressed }) => [styles.gameBtn, pressed && styles.gameBtnPressed]}
          accessibilityLabel="Play a word game"
        >
          <Text style={styles.gameIcon}>🎴</Text>
          {wantsPractice && <View style={styles.gameDot} />}
        </Pressable>
      )}

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <FriendStage friendSprite={f.sprite} />
        <Text style={[type.storyTitle, styles.friendName]}>{f.name}</Text>
        <Stars percent={prog!.percent} />

        {continueId && (
          <Pressable
            style={({ pressed }) => [styles.start, pressed && styles.startPressed]}
            onPress={() => openStory(continueId)}
          >
            <Text style={styles.startText}>{continueLabel} ▸</Text>
          </Pressable>
        )}
        {prog!.complete && <Text style={styles.allDone}>All done! 🌟</Text>}

        {stories.length > 0 && (
          <>
            <Text style={styles.shelfLabel}>
              {f.name}'s stories · {prog!.storiesDone}/{stories.length}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.shelf}
            >
              {stories.map((s) => (
                <StoryCard key={s.id} story={s} width={cardW} onPress={() => openStory(s.id)} />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// A story picture the child can point at: read ones replay, the next one continues,
// later ones stay visible (so there's something to look forward to) but asleep.
const StoryCard = ({
  story,
  width,
  onPress,
}: {
  story: AreaStory;
  width: number;
  onPress: () => void;
}) => {
  const locked = story.state === 'locked';
  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      disabled={locked}
      style={({ pressed }) => [
        styles.card,
        { width },
        story.state === 'next' && styles.cardNext,
        locked && styles.cardLocked,
        pressed && !locked && styles.cardPressed,
      ]}
      accessibilityLabel={locked ? `${story.title}, not yet` : story.title}
    >
      <View style={[styles.cardArt, { height: width * 0.82 }]}>
        <IllustrationView
          illustrationKey={story.cover}
          fallbackTone={colors.sageSoft}
          resizeMode="cover"
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {story.state === 'done' ? '✓' : story.state === 'next' ? '▸' : '💤'}
          </Text>
        </View>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {story.title}
      </Text>
    </Pressable>
  );
};

const FriendStage = ({ friendSprite }: { friendSprite: string }) => {
  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(withSequence(withTiming(1, { duration: 1300 }), withTiming(0, { duration: 1300 })), -1, true);
  }, [bob]);
  const miaStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -6 * bob.value }] }));
  const friendStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -6 * (1 - bob.value) }] }));
  const sprite = 148;

  return (
    <View style={styles.stage}>
      <Animated.View style={[{ width: sprite, height: sprite }, miaStyle]}>
        <IllustrationView illustrationKey="world.mia" fallbackTone="transparent" resizeMode="contain" />
      </Animated.View>
      <Animated.View style={[{ width: sprite, height: sprite, marginLeft: -sprite * 0.18 }, friendStyle]}>
        <IllustrationView illustrationKey={friendSprite} fallbackTone="transparent" resizeMode="contain" />
      </Animated.View>
    </View>
  );
};

const Stars = ({ percent }: { percent: number }) => {
  const filled = Math.round(percent * 5);
  return (
    <View style={styles.stars}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Text key={i} style={[styles.star, i < filled && styles.starFilled]}>★</Text>
      ))}
    </View>
  );
};

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable onPress={onPress} hitSlop={16} style={styles.back} accessibilityLabel="Back to the garden">
    <Text style={styles.backText}>‹ Garden</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  sleepSprite: { width: 160, height: 160, opacity: 0.7 },
  body: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xl },

  back: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.creamSoft,
  },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.inkSoft },

  gameBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.creamSoft,
  },
  gameBtnPressed: { backgroundColor: colors.creamDeep, transform: [{ scale: 0.95 }] },
  gameIcon: { fontSize: 22 },
  gameDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.terracotta,
  },

  stage: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  friendName: { fontSize: 30, color: colors.inkSoft, marginTop: spacing.xs },
  stars: { flexDirection: 'row', gap: 4 },
  star: { fontSize: 26, color: colors.creamDeep },
  starFilled: { color: colors.mustard },

  start: {
    marginTop: spacing.md,
    backgroundColor: colors.mustardSoft,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minWidth: 260,
    alignItems: 'center',
  },
  startPressed: { backgroundColor: colors.mustard, transform: [{ scale: 0.98 }] },
  startText: { fontFamily: 'Nunito_700Bold', fontSize: 24, color: colors.ink },
  allDone: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: colors.terracottaDeep, marginTop: spacing.xs },

  shelfLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.inkFaint,
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  shelf: { gap: spacing.md, paddingVertical: spacing.xs, paddingRight: spacing.lg },
  card: { borderRadius: radius.lg, backgroundColor: colors.creamSoft, padding: spacing.xs },
  cardNext: { backgroundColor: colors.mustardSoft },
  cardLocked: { opacity: 0.45 },
  cardPressed: { transform: [{ scale: 0.97 }] },
  cardArt: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.creamDeep },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.creamSoft,
  },
  badgeText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.inkSoft },
  cardTitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: 2,
  },
});
