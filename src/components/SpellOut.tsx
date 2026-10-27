import { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import { audio } from '@/src/audio/AudioPlayer';
import { useVocab } from '@/src/vocab/store';
import { useSession } from '@/src/session/store';
import { type, colors, spacing, motion, radius, useResponsive } from '@/src/theme';
import { IllustrationView } from './IllustrationView';

type Props = {
  word: string;
  letterAudioKeys: string[];
  heroAudioKey: string;
  expressionIllustration: string;
  backgroundTone?: string;
  onComplete: () => void;
};

const FADE_IN = motion.pacing.letterFadeIn;
const HOLD_AFTER_LAST = motion.pacing.holdAfterLastLetter;
const PULSE = motion.pacing.pulseDuration;
const HOLD_AFTER_PULSE = motion.pacing.holdAfterPulse;

type LetterProps = {
  char: string;
  startAtMs: number;
  pulseScale: SharedValue<number>;
  fontSize: number;
  letterSpacing: number;
};

const Letter = ({ char, startAtMs, pulseScale, fontSize, letterSpacing }: LetterProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    opacity.value = withDelay(
      startAtMs,
      withTiming(1, { duration: FADE_IN, easing: motion.easeOut })
    );
    scale.value = withDelay(
      startAtMs,
      withTiming(1, { duration: FADE_IN, easing: motion.easeOut })
    );
  }, [startAtMs, opacity, scale]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * pulseScale.value }],
  }));

  return (
    <Animated.Text style={[type.spellOutLetter, styles.letter, { fontSize, letterSpacing }, aStyle]}>
      {char}
    </Animated.Text>
  );
};

export const SpellOut = ({
  word,
  letterAudioKeys,
  heroAudioKey,
  expressionIllustration,
  backgroundTone,
  onComplete,
}: Props) => {
  const recordIntroduction = useVocab((s) => s.recordIntroduction);
  const log = useSession((s) => s.log);
  const introducedRef = useRef(false);
  const { pick, isCompact, isPortrait, width, height } = useResponsive();

  const letters = useMemo(
    () => word.toUpperCase().split('').filter((c) => /[A-Z]/.test(c)),
    [word]
  );

  const letterFontSize = pick({ xs: 56, sm: 72, md: 88, lg: 104, xl: 128 });
  const letterSpacing = pick({ xs: 2, md: 4, xl: 6 });
  const letterGap = pick({ xs: spacing.sm, md: spacing.md, lg: spacing.lg });
  const wordFontSize = pick({ xs: 36, sm: 44, md: 56, lg: 64, xl: 80 });
  const expressionSize = pick({
    xs: Math.min(width * 0.45, 180),
    sm: 200,
    md: 220,
    lg: 240,
    xl: 280,
  });
  const stackVertical = (isCompact && isPortrait) || height < 500;

  const enterDuration = motion.duration.base;

  const pulseScale = useSharedValue(1);
  const wordOpacity = useSharedValue(0);
  const wordTranslate = useSharedValue(24);
  const expressionOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.96);

  useEffect(() => {
    if (!introducedRef.current) {
      introducedRef.current = true;
      recordIntroduction(word);
      log('spellout_complete', { word });
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => timeouts.push(setTimeout(fn, ms));

    audio.playPageTurn();

    containerOpacity.value = withTiming(1, {
      duration: enterDuration,
      easing: motion.easeOut,
    });
    containerScale.value = withTiming(1, {
      duration: enterDuration,
      easing: motion.easeOut,
    });

    let cursor = enterDuration;

    letters.forEach((_letter, i) => {
      const playLetterAt = cursor + i * motion.pacing.letterCadence + 50;
      after(playLetterAt, () => {
        audio.play(letterAudioKeys[i] ?? `letter.${letters[i]}`);
        after(350, () => audio.playChime());
      });
    });

    cursor += letters.length * motion.pacing.letterCadence;
    cursor += HOLD_AFTER_LAST;

    after(cursor, () => {
      pulseScale.value = withSequence(
        withTiming(1.08, { duration: PULSE / 2, easing: motion.easeOut }),
        withTiming(1, { duration: PULSE / 2, easing: motion.ease })
      );
      wordOpacity.value = withTiming(1, { duration: PULSE, easing: motion.easeOut });
      wordTranslate.value = withTiming(0, { duration: PULSE, easing: motion.easeOut });
      expressionOpacity.value = withDelay(
        160,
        withTiming(1, { duration: motion.duration.slow, easing: motion.easeOut })
      );
      audio.play(heroAudioKey);
    });

    cursor += PULSE;

    after(cursor + HOLD_AFTER_PULSE, () => {
      containerOpacity.value = withTiming(
        0,
        { duration: motion.duration.pageChange, easing: motion.ease },
        () => {
          runOnJS(onComplete)();
        }
      );
    });

    return () => {
      for (const t of timeouts) clearTimeout(t);
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const wordStyle = useAnimatedStyle(() => ({
    opacity: wordOpacity.value,
    transform: [{ translateY: wordTranslate.value }],
  }));

  const expressionStyle = useAnimatedStyle(() => ({
    opacity: expressionOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: backgroundTone ?? colors.creamDeep,
          flexDirection: stackVertical ? 'column' : 'row',
          gap: stackVertical ? spacing.xl : spacing.xxxl,
        },
        containerStyle,
      ]}
    >
      <View style={styles.center}>
        <View style={[styles.lettersRow, { gap: letterGap }]}>
          {letters.map((ch, i) => (
            <Letter
              key={`${word}-${i}`}
              char={ch}
              startAtMs={enterDuration + i * motion.pacing.letterCadence}
              pulseScale={pulseScale}
              fontSize={letterFontSize}
              letterSpacing={letterSpacing}
            />
          ))}
        </View>

        <Animated.Text
          style={[
            type.spellOutWord,
            styles.word,
            { fontSize: wordFontSize, letterSpacing: letterSpacing * 1.5 },
            wordStyle,
          ]}
        >
          {word.toUpperCase()}
        </Animated.Text>
      </View>

      <Animated.View
        style={[
          styles.expression,
          { width: expressionSize, height: expressionSize },
          expressionStyle,
        ]}
      >
        <IllustrationView
          illustrationKey={expressionIllustration}
          fallbackTone={colors.sageSoft}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lettersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  word: {
    marginTop: spacing.xl,
  },
  expression: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
