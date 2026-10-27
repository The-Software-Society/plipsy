import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  withDelay,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { audio } from '@/src/audio/AudioPlayer';
import { placementSeq, wrongSeq, completionSeq } from '@/src/audio/bank';
import { useVocab } from '@/src/vocab/store';
import { useSession } from '@/src/session/store';
import { type, colors, spacing, motion, radius, useResponsive } from '@/src/theme';
import { IllustrationView } from './IllustrationView';

type Props = {
  word: string;
  promptText: string;
  promptAudioKey: string;
  sounds?: (string | null)[];
  expressionIllustration: string;
  backgroundTone?: string;
  isHeroMoment?: boolean;
  onComplete: () => void;
};

type SlotGeom = { cx: number; cy: number; char: string; filled: boolean };
type Point = { cx: number; cy: number };
type SlotStatus = 'empty' | 'active' | 'filled';

const safeHaptic = (fn: () => void) => {
  try {
    fn();
  } catch {
    /* haptics are a no-op on web */
  }
};

// Deterministic, word-seeded scramble so tiles look shuffled but are stable
// across replays (Math.random is unavailable in this runtime anyway).
const seedFromWord = (w: string): number =>
  [...w].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381) >>> 0;

const scrambleOrder = (n: number, seed: number): number[] => {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed || 1;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  if (n > 1 && idx.every((v, i) => v === i)) idx.reverse();
  return idx;
};

export const SpellInteractive = ({
  word,
  promptText,
  promptAudioKey,
  sounds,
  expressionIllustration,
  backgroundTone,
  isHeroMoment,
  onComplete,
}: Props) => {
  const recordSpellResult = useVocab((s) => s.recordSpellResult);
  const log = useSession((s) => s.log);
  const { pick, width, height } = useResponsive();
  const errorsRef = useRef(0); // wrong drops this spell → SRS quality signal
  const filledCountRef = useRef(0); // letters placed so far (to detect the last)

  const letters = useMemo(
    () => word.toUpperCase().split('').filter((c) => /[A-Z]/.test(c)),
    [word]
  );
  const n = letters.length;

  const tiles = useMemo(() => {
    const order = scrambleOrder(n, seedFromWord(word.toUpperCase()));
    return order.map((origIdx) => ({ id: origIdx, char: letters[origIdx]! }));
  }, [word, letters, n]);

  // ----- responsive sizing (bigger tiles for small fingers) -----
  const basedSize = pick({ xs: 84, sm: 104, md: 112, lg: 120, xl: 132 });
  const gap = pick({ xs: spacing.sm, md: spacing.md, lg: spacing.lg });
  const sidePad = pick({ xs: spacing.md, md: spacing.xl });
  const maxByWidth = (width - sidePad * 2 - gap * (n - 1)) / Math.max(n, 1);
  // Height matters as much as width here: the board is a fixed column (prompt →
  // slots → word → art → tiles/controls) and on a short viewport the bottom row
  // was pushed off-screen, hiding Continue. Cap the two elastic pieces (the
  // cell and the celebration art) against available height so the last row
  // always lands above the fold.
  const maxByHeight = (height - 220) / 2.6; // prompt + word + controls reserve
  const cell = Math.max(56, Math.min(basedSize, maxByWidth, maxByHeight));
  const glyphSize = Math.min(cell * 0.6, 84);
  const expressionSize = Math.min(
    pick({ xs: 96, sm: 120, md: 144, lg: 164, xl: 184 }),
    Math.max(64, height * 0.18)
  );

  // ----- geometry: measure each slot/tile in window (screen) coordinates -----
  const slotRefs = useRef<Array<View | null>>([]);
  const slotsScreen = useRef<(SlotGeom | null)[]>(Array(n).fill(null));
  const tilesScreen = useRef<(Point | null)[]>(Array(n).fill(null));

  const slotsSV = useSharedValue<SlotGeom[]>([]);
  const tilesRestingSV = useSharedValue<Point[]>([]);
  const activeSV = useSharedValue(0); // index of the next expected slot

  const [filled, setFilled] = useState<boolean[]>(() => Array(n).fill(false));
  const [placed, setPlaced] = useState<boolean[]>(() => Array(n).fill(false));
  const [done, setDone] = useState(false); // word complete → celebrate (tiles hidden)
  const [showControls, setShowControls] = useState(false); // recap audio done → show buttons
  const completedRef = useRef(false);
  const mountedRef = useRef(true);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeIdx = filled.indexOf(false); // -1 when all filled

  useEffect(() => {
    activeSV.value = activeIdx;
  }, [activeIdx, activeSV]);

  const pushSlots = useCallback(() => {
    if (slotsScreen.current.every((s) => s != null)) {
      slotsSV.value = slotsScreen.current.map((s) => ({ ...s! }));
    }
  }, [slotsSV]);

  const pushTiles = useCallback(() => {
    if (tilesScreen.current.every((p) => p != null)) {
      tilesRestingSV.value = tilesScreen.current.map((p) => ({ ...p! }));
    }
  }, [tilesRestingSV]);

  const measureSlot = (i: number) => () => {
    const ref = slotRefs.current[i];
    if (!ref) return;
    ref.measureInWindow((x, y, w, h) => {
      if (!w && !h) return;
      slotsScreen.current[i] = { cx: x + w / 2, cy: y + h / 2, char: letters[i]!, filled: false };
      pushSlots();
    });
  };

  const reportTileCenter = useCallback(
    (i: number, cx: number, cy: number) => {
      tilesScreen.current[i] = { cx, cy };
      pushTiles();
    },
    [pushTiles]
  );

  // ----- completion choreography -----
  const pulse = useSharedValue(1);
  const wordOpacity = useSharedValue(0);
  const expressionScale = useSharedValue(1);
  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.97);

  useEffect(() => {
    mountedRef.current = true;
    completedRef.current = false;
    filledCountRef.current = 0;
    setDone(false);
    setShowControls(false);
    audio.playPageTurn();
    containerOpacity.value = withTiming(1, { duration: motion.duration.base, easing: motion.easeOut });
    containerScale.value = withTiming(1, { duration: motion.duration.base, easing: motion.easeOut });
    const t = setTimeout(() => audio.play(promptAudioKey), motion.duration.base + 120);
    return () => {
      mountedRef.current = false;
      clearTimeout(t);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  // Correct letter dropped into the active slot.
  const onCorrect = useCallback(
    (slotIdx: number) => {
      audio.playChime();
      // Snappy "C, kuh" per drop. Skip it for the LAST letter so the full
      // completion recap (which says every name+sound) isn't cut off.
      filledCountRef.current += 1;
      if (filledCountRef.current < n) {
        audio.playSequence(placementSeq(letters[slotIdx]!, sounds?.[slotIdx] ?? null), 50);
      }
      safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      slotsSV.value = slotsSV.value.map((s, i) => (i === slotIdx ? { ...s, filled: true } : s));
      setFilled((prev) => prev.map((v, i) => (i === slotIdx ? true : v)));
    },
    [letters, sounds, slotsSV, n]
  );

  // Wrong letter dropped at the active slot.
  const onWrong = useCallback((expectedChar: string) => {
    errorsRef.current += 1; // feeds the SRS rep quality (clean / messy / lapse)
    safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
    audio.playSequence(wrongSeq(expectedChar), 90); // "Uh-oh! We're looking for the letter… C."
  }, []);

  const markPlaced = useCallback((tileIdx: number) => {
    setPlaced((prev) => prev.map((v, i) => (i === tileIdx ? true : v)));
  }, []);

  // Whole word complete.
  useEffect(() => {
    if (n === 0 || !filled.every(Boolean) || completedRef.current) return;
    completedRef.current = true;

    const errors = errorsRef.current;
    recordSpellResult(word, errors).catch(() => {}); // SRS rep (clean/messy/lapse)
    log('spell_result', { word, errors, clean: errors === 0 });

    pulse.value = withSequence(
      withTiming(isHeroMoment ? 1.12 : 1.08, { duration: motion.pacing.pulseDuration / 2, easing: motion.easeOut }),
      withTiming(1, { duration: motion.pacing.pulseDuration / 2, easing: motion.ease })
    );
    wordOpacity.value = withTiming(1, { duration: motion.pacing.pulseDuration, easing: motion.easeOut });
    expressionScale.value = withSequence(
      withTiming(1.12, { duration: motion.pacing.pulseDuration / 2, easing: motion.easeOut }),
      withTiming(1, { duration: motion.pacing.pulseDuration / 2, easing: motion.ease })
    );

    // Word done: hide tiles and celebrate. The recap ("Great job! You spelled
    // cat. C, kuh. A, aaa. T, tuh...") reinforces names + sounds and the buttons
    // reveal when it finishes. But the reveal must NEVER depend solely on the
    // audio promise: an empty/slow TTS clip can stall playback (up to 30s/clip)
    // and would otherwise trap the child on "Listen..." with no way forward.
    // A guaranteed fallback timer reveals the controls even if audio hangs.
    const reveal = () => {
      if (!mountedRef.current) return;
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
        controlsTimerRef.current = null;
      }
      setShowControls(true);
    };
    setDone(true);
    controlsTimerRef.current = setTimeout(reveal, motion.pacing.spellRecapMaxWait);
    audio.playSequence(completionSeq(word, letters, sounds)).then(reveal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled]);

  // Replay one letter's name+sound (tap a finished slot); cuts off the recap.
  const replayLetter = useCallback(
    (i: number) => audio.playSequence(placementSeq(letters[i]!, sounds?.[i] ?? null), 50),
    [letters, sounds]
  );
  // Replay the whole "C, kuh. A, aaa. T, tuh… that's how you spell CAT" recap.
  const hearAgain = useCallback(
    () => audio.playSequence(completionSeq(word, letters, sounds)),
    [word, letters, sounds]
  );

  // ----- animated styles -----
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));
  const slotsRowStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const wordStyle = useAnimatedStyle(() => ({ opacity: wordOpacity.value }));
  const expressionStyle = useAnimatedStyle(() => ({ transform: [{ scale: expressionScale.value }] }));

  const threshold = cell * 1.6; // forgiving radius around the single active slot

  const statusFor = (i: number): SlotStatus =>
    filled[i] ? 'filled' : i === activeIdx ? 'active' : 'empty';

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: backgroundTone ?? colors.creamDeep }, containerStyle]}
    >
      <Text style={[type.button, styles.instruction]}>{promptText}</Text>

      {/* SLOTS */}
      <Animated.View style={[styles.row, { gap }, slotsRowStyle]}>
        {letters.map((ch, i) => (
          <Slot
            key={`slot-${i}`}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
            char={ch}
            cell={cell}
            glyphSize={glyphSize}
            status={statusFor(i)}
            onLayout={measureSlot(i)}
            onPress={done && showControls ? () => replayLetter(i) : undefined}
          />
        ))}
      </Animated.View>

      {/* assembled-word payoff + celebration art */}
      <Animated.Text
        style={[type.spellOutWord, styles.word, { fontSize: Math.min(cell * 0.7, 64) }, wordStyle]}
      >
        {word.toUpperCase()}
      </Animated.Text>

      <Animated.View
        style={[styles.expression, { width: expressionSize, height: expressionSize }, expressionStyle]}
        pointerEvents="none"
      >
        <IllustrationView
          illustrationKey={expressionIllustration}
          fallbackTone={colors.sageSoft}
          resizeMode="contain"
        />
      </Animated.View>

      {/* TILES (while spelling) → DONE CONTROLS (only after the recap audio) */}
      {done ? (
        showControls ? (
          <View style={styles.doneRow}>
            <Pressable
              onPress={hearAgain}
              style={({ pressed }) => [styles.replayBtn, pressed && styles.btnPressed]}
              accessibilityLabel="Hear it again"
            >
              <Text style={styles.replayText}>🔊 Hear it again</Text>
            </Pressable>
            <Pressable
              onPress={onComplete}
              style={({ pressed }) => [styles.continueBtn, pressed && styles.btnPressed]}
              accessibilityLabel="Continue"
            >
              <Text style={styles.continueText}>Continue →</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.doneRow}>
            <Text style={styles.listening}>👂 Listen…</Text>
          </View>
        )
      ) : (
        <View style={[styles.row, styles.tilesRow, { gap }]}>
          {tiles.map((tile, tileIdx) => (
            <Tile
              key={`tile-${tile.id}`}
              index={tileIdx}
              char={tile.char}
              cell={cell}
              glyphSize={glyphSize}
              hidden={placed[tileIdx]}
              slotsSV={slotsSV}
              tilesRestingSV={tilesRestingSV}
              activeSV={activeSV}
              threshold={threshold}
              onCorrect={onCorrect}
              onWrong={onWrong}
              markPlaced={markPlaced}
              reportCenter={reportTileCenter}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

// ---------- Slot ----------
type SlotProps = {
  char: string;
  cell: number;
  glyphSize: number;
  status: SlotStatus;
  onLayout: () => void;
  onPress?: () => void; // when set (after completion), tapping replays the letter
};

const Slot = forwardRef<View, SlotProps>(({ char, cell, glyphSize, status, onLayout, onPress }, ref) => {
  const glow = useSharedValue(1);

  useEffect(() => {
    if (status === 'active') {
      glow.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 600, easing: motion.easeOut }),
          withTiming(1, { duration: 600, easing: motion.ease })
        ),
        -1,
        true
      );
    } else {
      glow.value = withTiming(1, { duration: 200 });
    }
  }, [status, glow]);

  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: glow.value }] }));

  const inner = (
    <Animated.View
      ref={ref}
      onLayout={onLayout}
      style={[
        styles.slot,
        { width: cell, height: cell, borderRadius: radius.md },
        status === 'filled' ? styles.slotFilled : status === 'active' ? styles.slotActive : styles.slotEmpty,
        aStyle,
      ]}
    >
      <Text
        style={[
          styles.glyph,
          { fontSize: glyphSize },
          status === 'filled'
            ? styles.glyphFilled
            : status === 'active'
              ? styles.glyphActive
              : styles.glyphGhost,
        ]}
      >
        {char}
      </Text>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityLabel={`Hear ${char}`}>
        {inner}
      </Pressable>
    );
  }
  return inner;
});
Slot.displayName = 'Slot';

// ---------- Tile ----------
type TileProps = {
  index: number;
  char: string;
  cell: number;
  glyphSize: number;
  hidden: boolean;
  slotsSV: SharedValue<SlotGeom[]>;
  tilesRestingSV: SharedValue<Point[]>;
  activeSV: SharedValue<number>;
  threshold: number;
  onCorrect: (slotIdx: number) => void;
  onWrong: (expectedChar: string) => void;
  markPlaced: (tileIdx: number) => void;
  reportCenter: (index: number, cx: number, cy: number) => void;
};

const Tile = ({
  index,
  char,
  cell,
  glyphSize,
  hidden,
  slotsSV,
  tilesRestingSV,
  activeSV,
  threshold,
  onCorrect,
  onWrong,
  markPlaced,
  reportCenter,
}: TileProps) => {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const lifted = useSharedValue(0);
  const gone = useSharedValue(0);
  const landed = useSharedValue(0); // 1 once this tile has been accepted into a slot
  const viewRef = useRef<View>(null);

  const measureSelf = () => {
    if (hidden) return;
    viewRef.current?.measureInWindow((x, y, w, h) => {
      if (!w && !h) return;
      reportCenter(index, x + w / 2, y + h / 2);
    });
  };

  const springBack = () => {
    'worklet';
    tx.value = withSpring(0, { damping: 16, stiffness: 180 });
    ty.value = withSpring(0, { damping: 16, stiffness: 180 });
  };

  const settle = (slotIdx: number) => {
    markPlaced(index);
    onCorrect(slotIdx);
    gone.value = withDelay(140, withTiming(1, { duration: 200 }));
  };

  const pan = Gesture.Pan()
    .enabled(!hidden)
    .minDistance(0)
    .onBegin(() => {
      lifted.value = withTiming(1, { duration: 120 });
    })
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd(() => {
      lifted.value = withTiming(0, { duration: 120 });
      const resting = tilesRestingSV.value[index];
      const slots = slotsSV.value;
      const active = activeSV.value;
      // Only the next slot in order is a valid target.
      if (!resting || active < 0 || active >= slots.length) {
        springBack();
        return;
      }
      const activeSlot = slots[active]!;
      const cx = resting.cx + tx.value;
      const cy = resting.cy + ty.value;
      const dist = Math.sqrt((activeSlot.cx - cx) ** 2 + (activeSlot.cy - cy) ** 2);
      if (dist > threshold) {
        springBack(); // released away from the active slot - no penalty
        return;
      }
      if (char === activeSlot.char) {
        landed.value = 1;
        tx.value = withTiming(activeSlot.cx - resting.cx, { duration: 200, easing: motion.easeOut });
        ty.value = withTiming(activeSlot.cy - resting.cy, { duration: 200, easing: motion.easeOut });
        runOnJS(settle)(active);
      } else {
        springBack();
        runOnJS(onWrong)(activeSlot.char);
      }
    })
    // A pan can terminate WITHOUT onEnd (pointer capture lost, gesture cancelled
    // by a parent, pointer released off-target). The tile then kept whatever
    // translation it had and stayed stranded where it was dropped - and since
    // the board never scrolls, a tile left below the fold is unreachable and the
    // word can no longer be finished. Always return an unplaced tile home.
    .onFinalize(() => {
      lifted.value = withTiming(0, { duration: 120 });
      if (!landed.value) springBack();
    });

  const aStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: 1 + lifted.value * 0.06 },
    ],
    opacity: 1 - gone.value,
    zIndex: lifted.value > 0 ? 20 : 1,
    elevation: lifted.value > 0 ? 8 : 2,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        ref={viewRef}
        onLayout={measureSelf}
        style={[
          styles.tile,
          { width: cell, height: cell, borderRadius: radius.md },
          hidden && styles.tileHidden,
          aStyle,
        ]}
      >
        <Text style={[styles.glyph, styles.glyphTile, { fontSize: glyphSize }]} selectable={false}>
          {char}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  instruction: {
    color: colors.inkSoft,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tilesRow: {
    marginTop: spacing.md,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    flexWrap: 'wrap',
  },
  replayBtn: {
    backgroundColor: colors.creamSoft,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: colors.terracottaSoft,
  },
  replayText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: colors.terracottaDeep,
  },
  listening: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: colors.inkFaint,
  },
  continueBtn: {
    backgroundColor: colors.terracotta,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  continueText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: colors.creamSoft,
    letterSpacing: 0.5,
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotEmpty: {
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.inkFaint,
    backgroundColor: 'transparent',
  },
  slotActive: {
    borderWidth: 4,
    borderStyle: 'dashed',
    borderColor: colors.mustard,
    backgroundColor: colors.mustardSoft,
  },
  slotFilled: {
    // Sage, not terracotta: a correctly placed letter should not read as an
    // error. Sage is already in the palette, so this stays on-brand. Revert by
    // swapping these two back to colors.terracotta / colors.terracottaSoft.
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: colors.sage,
    backgroundColor: colors.sageSoft,
  },
  glyph: {
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  glyphGhost: {
    color: colors.inkFaint,
    opacity: 0.35,
  },
  glyphActive: {
    color: colors.inkSoft,
    opacity: 0.55,
  },
  glyphFilled: {
    color: colors.sageDark,
  },
  glyphTile: {
    color: colors.ink,
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.creamSoft,
    borderWidth: 2,
    borderColor: colors.terracottaSoft,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    userSelect: 'none', // web-only: prevent text/drag selection while dragging
  },
  tileHidden: {
    opacity: 0,
  },
  word: {
    marginTop: spacing.sm,
  },
  expression: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
