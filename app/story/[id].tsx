import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getStory } from '@/src/stories';
import { Scene } from '@/src/components/Scene';
import { IllustrationView } from '@/src/components/IllustrationView';
import { useSession } from '@/src/session/store';
import { useLearner } from '@/src/learner/store';
import { useTreasures } from '@/src/rewards/store';
import { TreasureReward } from '@/src/components/TreasureReward';
import { type, colors, spacing, radius, motion, useResponsive } from '@/src/theme';

export default function StoryPlayer() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const story = id ? getStory(id) : undefined;

  const startSession = useSession((s) => s.start);
  const endSession = useSession((s) => s.end);
  const log = useSession((s) => s.log);
  const markComplete = useLearner((s) => s.markComplete);
  const award = useTreasures((s) => s.award);

  const [sceneId, setSceneId] = useState(story?.startSceneId);
  const [phase, setPhase] = useState<'playing' | 'treasure' | 'end'>('playing');
  const [treasureId, setTreasureId] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (!story) return;
    setSceneId(story.startSceneId);
    setPhase('playing');
    startSession(story.id);
    return () => {
      // If unmounted mid-play, end as incomplete.
      endSession(false).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, replayKey]);

  if (!story) {
    return (
      <SafeAreaView style={styles.fallback}>
        <Text style={type.body}>Story not found.</Text>
        <Pressable onPress={() => router.replace('/')}>
          <Text style={[type.button, { color: colors.terracottaDeep }]}>Home</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (phase === 'treasure' && treasureId) {
    return <TreasureReward treasureId={treasureId} onContinue={() => setPhase('end')} />;
  }

  if (phase === 'end') {
    return (
      <EndScreen
        story={story}
        onReplay={() => {
          setPhase('playing');
          setSceneId(story.startSceneId);
          setReplayKey((k) => k + 1);
        }}
        onHome={() => router.replace('/')}
      />
    );
  }

  const currentScene = sceneId ? story.scenes[sceneId] : undefined;
  if (!currentScene) {
    return null;
  }

  return (
    // Plain View, no layout animation. Reanimated's entering/exiting pair left
    // both scenes mounted as siblings, so a departing choice row sat on top of
    // the arriving scene's text; stacking them absolutely instead stalled the
    // entering animation on web, leaving scenes blank until something forced a
    // re-render. Scene runs its own fade on the illustration, so the crossfade
    // is kept and the unreliable layer is gone.
    <View key={`scene-${currentScene.id}`} style={styles.root}>
      <Scene
        scene={currentScene}
        onTransition={(next) => setSceneId(next)}
        onEnd={() => {
          log('story_end', { storyId: story.id }).catch(() => {});
          endSession(true).catch(() => {});
          markComplete(story.id).catch(() => {}); // grows the world
          setTreasureId(award()); // earn a treasure for finishing
          setPhase('treasure');
        }}
      />
    </View>
  );
}

const EndScreen = ({
  story,
  onReplay,
  onHome,
}: {
  story: ReturnType<typeof getStory>;
  onReplay: () => void;
  onHome: () => void;
}) => {
  const [showButtons, setShowButtons] = useState(false);
  const { pick, isCompact, isPortrait, width, height } = useResponsive();

  useEffect(() => {
    const t = setTimeout(() => setShowButtons(true), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!story) return null;

  const coverSize = pick({
    xs: Math.min(width * 0.7, height * 0.4),
    sm: 240,
    md: 320,
    lg: 360,
    xl: 400,
  });
  const titleSize = pick({ xs: 22, md: 26, xl: 30 });
  const buttonsStack = isCompact && isPortrait;

  return (
    <SafeAreaView style={styles.endRoot}>
      <View style={[styles.endCover, { width: coverSize, height: coverSize }]}>
        <IllustrationView
          illustrationKey={story.cover}
          fallbackTone={colors.sageSoft}
          resizeMode="contain"
        />
      </View>

      <Text style={[type.storyTitle, styles.endTitle, { fontSize: titleSize }]}>{story.title}</Text>

      {showButtons && (
        <Animated.View
          entering={FadeIn.duration(motion.duration.slow)}
          style={[
            styles.endButtons,
            { flexDirection: buttonsStack ? 'column' : 'row', gap: spacing.md },
          ]}
        >
          <Pressable onPress={onReplay} style={[styles.button, styles.primaryBtn]} accessibilityLabel="Read it again">
            <Text style={[type.button, { color: colors.ink }]}>Read it again</Text>
          </Pressable>
          <Pressable onPress={onHome} style={[styles.button, styles.secondaryBtn]} accessibilityLabel="Home">
            <Text style={[type.button, { color: colors.inkSoft }]}>Home</Text>
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  fallback: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  endRoot: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  endCover: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  endTitle: {
    marginBottom: spacing.xxl,
    color: colors.inkSoft,
  },
  endButtons: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.mustardSoft,
  },
  secondaryBtn: {
    backgroundColor: colors.creamDeep,
  },
});
