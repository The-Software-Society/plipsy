import { useEffect, useMemo, useRef } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NarratorLine as TLine } from '@/src/stories/types';
import { audio } from '@/src/audio/AudioPlayer';
import { useVocab } from '@/src/vocab/store';
import { useSession } from '@/src/session/store';
import { type, motion, spacing, colors, useResponsive, minTapTarget } from '@/src/theme';
import { HighlightedWord } from './HighlightedWord';

type Props = {
  line: TLine;
  onComplete: () => void;
  // Hold the line on screen after it has been read: no audio, no auto-advance.
  // Keeps the words in front of the child through the beat before the scene
  // turns, instead of the caption vanishing the instant the narration ends.
  hold?: boolean;
};

type Segment = { kind: 'text'; text: string } | { kind: 'highlight'; word: string };

const splitIntoSegments = (line: TLine): Segment[] => {
  const segments: Segment[] = [];
  let cursor = 0;
  const sorted = [...line.highlights].sort((a, b) => a.start - b.start);

  for (const h of sorted) {
    if (h.start > cursor) {
      segments.push({ kind: 'text', text: line.text.slice(cursor, h.start) });
    }
    segments.push({ kind: 'highlight', word: line.text.slice(h.start, h.end) });
    cursor = h.end;
  }
  if (cursor < line.text.length) {
    segments.push({ kind: 'text', text: line.text.slice(cursor) });
  }
  return segments;
};

export const NarratorLine = ({ line, onComplete, hold = false }: Props) => {
  const segments = useMemo(() => splitIntoSegments(line), [line]);
  const recordExposure = useVocab((s) => s.recordExposure);
  const isMasteredFn = useVocab((s) => s.isMastered);
  const log = useSession((s) => s.log);
  const completedRef = useRef(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { pick } = useResponsive();
  const insets = useSafeAreaInsets();
  const fontSize = pick({ xs: 20, sm: 22, md: 26, lg: 28, xl: 32 });
  const lineHeight = Math.round(fontSize * 1.45);
  const padH = pick({ xs: spacing.lg, sm: spacing.xl, md: spacing.xxl });
  const padV = pick({ xs: spacing.md, sm: spacing.lg, md: spacing.xl });

  useEffect(() => {
    if (hold) return; // held copy: already read, stays put until the scene turns
    completedRef.current = false;
    let cancelled = false;
    log('line_played', { lineId: line.id });

    audio.play(line.audioKey).then(() => {
      if (cancelled || completedRef.current) return;
      advanceTimerRef.current = setTimeout(() => {
        if (!completedRef.current) finish();
      }, motion.pacing.lineBreath);
    });

    return () => {
      cancelled = true;
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.audioKey, line.id, hold]);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    audio.stop();
    onComplete();
  };

  // Replay the whole line. A child who looked away had no way back: only single
  // highlighted words were tappable and the scene advanced on a timer. Replaying
  // also restarts the breath timer so the line is not cut off mid-repeat.
  const handleReplay = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    log('line_replay', { lineId: line.id });
    audio.stop();
    audio.play(line.audioKey).then(() => {
      if (hold || completedRef.current) return;
      advanceTimerRef.current = setTimeout(() => {
        if (!completedRef.current) finish();
      }, motion.pacing.lineBreath);
    });
  };

  const handleHighlightTap = (word: string, audioKey: string) => {
    audio.stop();
    log('highlight_tap', { lineId: line.id, word });
    recordExposure(word);
    audio.play(audioKey);
  };

  // No tap-to-advance: the line auto-advances after its audio + a breath, so a
  // toddler can't spam-tap to skip scenes. Highlighted words stay tappable.
  return (
    <View
      style={[
        styles.backdrop,
        {
          paddingHorizontal: padH,
          paddingTop: padV,
          paddingBottom: padV * 1.4 + insets.bottom,
        },
      ]}
    >
      <View style={styles.textWrap}>
        <Pressable
          onPress={handleReplay}
          style={styles.replay}
          accessibilityRole="button"
          accessibilityLabel="Hear that again"
          hitSlop={12}
        >
          <Text style={[styles.replayIcon, { fontSize: Math.round(fontSize * 0.9) }]}>🔊</Text>
        </Pressable>
        <Text style={[type.narratorLine, styles.text, { fontSize, lineHeight }]}>
          {segments.map((seg, i) => {
            if (seg.kind === 'text') return <Text key={i}>{seg.text}</Text>;
            const audioKey = `word.${seg.word.toLowerCase()}`;
            return (
              <HighlightedWord
                key={i}
                word={seg.word}
                mastered={isMasteredFn(seg.word)}
                fontSize={fontSize}
                lineHeight={lineHeight}
                onPress={() => handleHighlightTap(seg.word, audioKey)}
              />
            );
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.scrim,
  },
  textWrap: {
    maxWidth: 920,
    alignSelf: 'center',
    width: '100%',
  },
  replay: {
    position: 'absolute',
    right: 0,
    top: -4,
    minWidth: minTapTarget,
    minHeight: minTapTarget,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  replayIcon: {
    opacity: 0.75,
  },
  text: {
    textAlign: 'center',
  },
});
