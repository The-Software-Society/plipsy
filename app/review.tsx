import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVocab } from '@/src/vocab/store';
import { useSession } from '@/src/session/store';
import { buildReviewNode, ReviewItem } from '@/src/srs/review';
import { friendById } from '@/src/world/friends';
import { WordTap } from '@/src/components/activities/WordTap';
import { Snack } from '@/src/components/activities/Snack';
import { SpellInteractive } from '@/src/components/SpellInteractive';
import { IllustrationView } from '@/src/components/IllustrationView';
import { TreasureReward } from '@/src/components/TreasureReward';
import { useTreasures } from '@/src/rewards/store';
import { audio } from '@/src/audio/AudioPlayer';
import { BANK } from '@/src/audio/bank';
import { type, colors, spacing, radius } from '@/src/theme';

export default function Review() {
  const router = useRouter();
  const { friend } = useLocalSearchParams<{ friend?: string }>();
  const entries = useVocab((s) => s.entries);
  const recordRep = useVocab((s) => s.recordRep);
  const start = useSession((s) => s.start);
  const end = useSession((s) => s.end);
  const log = useSession((s) => s.log);

  const friendObj = friend ? friendById(friend) : undefined;
  const initial = useMemo(() => buildReviewNode(entries, friend), []); // build once
  const [queue, setQueue] = useState<ReviewItem[]>(initial);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'play' | 'done'>(initial.length ? 'play' : 'done');
  const correctRef = useRef(0);
  const requeued = useRef<Set<string>>(new Set());
  const award = useTreasures((s) => s.award);
  const [treasureId, setTreasureId] = useState<string | null>(null);
  const [showTreasure, setShowTreasure] = useState(false);

  useEffect(() => {
    start(`visit:${friend ?? 'review'}`).catch(() => {});
    return () => {
      end(true).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 'done') return;
    if (initial.length > 0) {
      // Earn a treasure for finishing a visit (TreasureReward plays its own audio).
      setTreasureId(award());
      setShowTreasure(true);
    } else {
      audio.playSequence([BANK.great], 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finishItem = (item: ReviewItem, errors: number) => {
    if (item.game !== 'plant') recordRep(item.word, errors, false).catch(() => {});
    log('activity_result', { game: item.game, word: item.word, errors, clean: errors === 0 }).catch(() => {});
    if (errors === 0) correctRef.current += 1;

    // Re-queue a missed word once, later in the visit.
    let next = queue;
    if (errors > 0 && !requeued.current.has(item.word)) {
      requeued.current.add(item.word);
      next = [...queue, { ...item }];
      setQueue(next);
    }
    if (idx + 1 >= next.length) setPhase('done');
    else setIdx(idx + 1);
  };

  if (phase === 'done') {
    return (
      <SafeAreaView style={styles.done}>
        {friendObj && (
          <View style={styles.friendBig}>
            <IllustrationView illustrationKey={friendObj.sprite} fallbackTone={colors.creamDeep} resizeMode="contain" />
          </View>
        )}
        <Text style={styles.bigTitle}>
          {initial.length ? `You played with ${friendObj?.name ?? 'a friend'}!` : 'All caught up!'}
        </Text>
        {initial.length > 0 && <Text style={styles.stars}>{'⭐'.repeat(Math.max(1, Math.min(3, correctRef.current)))}</Text>}
        <Pressable style={styles.continueBtn} onPress={() => router.replace('/')}>
          <Text style={styles.continueText}>Back to the garden →</Text>
        </Pressable>
        {showTreasure && treasureId && (
          <TreasureReward treasureId={treasureId} onContinue={() => setShowTreasure(false)} />
        )}
      </SafeAreaView>
    );
  }

  const item = queue[idx]!;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/')} hitSlop={16}>
          <Text style={styles.back}>✕</Text>
        </Pressable>
        <View style={styles.dots}>
          {queue.map((_, i) => (
            <View key={i} style={[styles.dot, i < idx && styles.dotDone, i === idx && styles.dotNow]} />
          ))}
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.stage}>
        {item.game === 'plant' ? (
          <SpellInteractive
            key={`plant-${idx}`}
            word={item.word}
            promptText={`Spell ${item.word} to grow it!`}
            promptAudioKey={`word.${item.word.toLowerCase()}`}
            expressionIllustration={`choice.${item.word.toLowerCase()}`}
            backgroundTone={colors.creamDeep}
            onComplete={() => finishItem(item, 0)}
          />
        ) : item.game === 'snack' ? (
          <Snack
            key={`snack-${idx}`}
            word={item.word}
            options={item.options}
            friendName={friendObj?.name ?? 'Your friend'}
            onResult={(e) => finishItem(item, e)}
          />
        ) : (
          <WordTap
            key={`tap-${idx}`}
            word={item.word}
            options={item.options}
            variant={item.game === 'bubble' ? 'bubble' : 'peekaboo'}
            onResult={(e) => finishItem(item, e)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  back: { fontSize: 24, color: colors.inkFaint, width: 24 },
  dots: { flexDirection: 'row', gap: 6, flex: 1, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.creamDeep },
  dotDone: { backgroundColor: colors.sage },
  dotNow: { backgroundColor: colors.terracotta, transform: [{ scale: 1.3 }] },
  stage: { flex: 1 },
  done: { flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.xl },
  friendBig: { width: 160, height: 160 },
  bigTitle: { fontFamily: 'Nunito_700Bold', fontSize: 26, color: colors.inkSoft, textAlign: 'center' },
  stars: { fontSize: 40 },
  continueBtn: { backgroundColor: colors.terracotta, borderRadius: radius.pill, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  continueText: { fontFamily: 'Nunito_700Bold', fontSize: 20, color: colors.creamSoft },
});
