import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  interpolateColor,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { ChoiceOption } from '@/src/stories/types';
import { audio } from '@/src/audio/AudioPlayer';
import { useSession } from '@/src/session/store';
import { type, colors, spacing, radius, motion, useResponsive } from '@/src/theme';
import { IllustrationView } from './IllustrationView';

type Props = {
  promptText: string;
  promptAudioKey: string;
  options: ChoiceOption[];
  onChoose: (option: ChoiceOption) => void;
};

export const Choice = ({ promptText, promptAudioKey, options, onChoose }: Props) => {
  const log = useSession((s) => s.log);
  const { pick, width } = useResponsive();
  const [activeIndex, setActiveIndex] = useState(-1);

  const promptSize = pick({ xs: 22, sm: 24, md: 26, xl: 30 });

  // Cards are sized from the width actually available rather than from the
  // breakpoint alone: at 500pt (sm) three 180pt cards overflowed the screen and
  // the outer two were clipped. Fit as many as read legibly per row, then wrap.
  const hPad = pick({ xs: spacing.md, md: spacing.xl });
  const gap = pick({ xs: spacing.md, md: spacing.xl });
  const maxCard = pick({ xs: 180, sm: 190, md: 200, lg: 220, xl: 260 });
  const minCard = 132; // below this the art + word stop reading at arm's length

  const available = Math.max(0, width - hPad * 2);
  const perRow = Math.max(
    1,
    Math.min(options.length, Math.floor((available + gap) / (minCard + gap)))
  );
  const cardSize = Math.min(maxCard, Math.max(96, (available - gap * (perRow - 1)) / perRow));
  const rowMaxWidth = cardSize * perRow + gap * (perRow - 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await audio.play(promptAudioKey);
      if (cancelled) return;
      // Speak each option in turn, growing + highlighting its card while spoken.
      for (let i = 0; i < options.length; i++) {
        setActiveIndex(i);
        await audio.play(options[i]!.audioKey);
        if (cancelled) return;
        setActiveIndex(-1);
      }
    })();
    return () => {
      cancelled = true;
      setActiveIndex(-1);
      audio.stop();
    };
  }, [promptAudioKey, options]);

  const handleChoose = (opt: ChoiceOption) => {
    log('choice_made', { word: opt.word, next: opt.next });
    audio.stop();
    audio.playChime();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      /* noop */
    }
    onChoose(opt);
  };

  return (
    <View style={[styles.container, { paddingHorizontal: hPad }]}>
      <Text
        style={[
          type.storyTitle,
          styles.prompt,
          { fontSize: promptSize, marginBottom: pick({ xs: spacing.lg, md: spacing.xl }) },
        ]}
      >
        {promptText}
      </Text>
      <View style={[styles.row, { gap, maxWidth: rowMaxWidth }]}>
        {options.map((opt, idx) => (
          <ChoiceCard
            key={opt.word}
            option={opt}
            index={idx}
            size={cardSize}
            active={activeIndex === idx}
            onPress={() => handleChoose(opt)}
          />
        ))}
      </View>
    </View>
  );
};

const ChoiceCard = ({
  option,
  index,
  size,
  active,
  onPress,
}: {
  option: ChoiceOption;
  index: number;
  size: number;
  active: boolean;
  onPress: () => void;
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const press = useSharedValue(1);
  const highlight = useSharedValue(0); // grows + rings the card while its name is spoken

  useEffect(() => {
    const delay = index * motion.pacing.choiceStagger;
    opacity.value = withDelay(delay, withTiming(1, { duration: motion.duration.base }));
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: motion.duration.base, easing: motion.easeOut })
    );
  }, [index, opacity, scale]);

  useEffect(() => {
    highlight.value = withTiming(active ? 1 : 0, { duration: 240, easing: motion.easeOut });
  }, [active, highlight]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * press.value * (1 + highlight.value * 0.08) }],
    borderColor: interpolateColor(highlight.value, [0, 1], ['rgba(0,0,0,0)', colors.mustard]),
  }));

  const handlePress = () => {
    press.value = withSequence(
      withTiming(motion.pacing.choicePressScale, { duration: 120, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 160, easing: Easing.in(Easing.quad) }, () => {
        runOnJS(onPress)();
      })
    );
  };

  const illustrationSize = size * 0.62;

  return (
    <Animated.View style={[styles.cardRing, { width: size }, aStyle]}>
      <Pressable
        onPress={handlePress}
        style={[styles.card, { padding: spacing.md, minHeight: size }]}
        accessibilityRole="button"
        accessibilityLabel={option.word}
        hitSlop={12}
      >
        <View
          style={[
            styles.illustration,
            { width: illustrationSize, height: illustrationSize, marginBottom: spacing.sm },
          ]}
        >
          <IllustrationView
            illustrationKey={option.illustration}
            fallbackTone={colors.creamSoft}
            resizeMode="contain"
          />
        </View>
        <Text style={[type.chip, styles.word]}>{option.word}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  prompt: {
    color: colors.inkSoft,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRing: {
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0)',
    borderRadius: radius.lg + 4,
    padding: 2,
  },
  card: {
    backgroundColor: colors.creamSoft,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  illustration: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  word: {
    fontSize: 22,
    letterSpacing: 1,
  },
});
