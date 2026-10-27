import { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Scene as TScene, ChoiceOption } from '@/src/stories/types';
import { audio } from '@/src/audio/AudioPlayer';
import { useSession } from '@/src/session/store';
import { colors, motion } from '@/src/theme';
import { NarratorLine } from './NarratorLine';
import { Choice } from './Choice';
import { SpellOut } from './SpellOut';
import { SpellInteractive } from './SpellInteractive';
import { IllustrationView } from './IllustrationView';

type Props = {
  scene: TScene;
  onTransition: (nextSceneId: string) => void;
  onEnd: () => void;
};

type Phase = 'lines' | 'end';

export const Scene = ({ scene, onTransition, onEnd }: Props) => {
  const log = useSession((s) => s.log);
  const [lineIdx, setLineIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>(scene.lines.length > 0 ? 'lines' : 'end');

  const fade = useSharedValue(0);

  useEffect(() => {
    setLineIdx(0);
    setPhase(scene.lines.length > 0 ? 'lines' : 'end');
    log('scene_enter', { sceneId: scene.id });
    audio.playPageTurn();
    fade.value = 0;
    fade.value = withTiming(1, {
      duration: motion.duration.pageChange,
      easing: motion.easeOut,
    });
    return () => {
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  const handleLineComplete = () => {
    if (lineIdx + 1 < scene.lines.length) {
      setLineIdx(lineIdx + 1);
    } else {
      setPhase('end');
    }
  };

  const handleChoice = (opt: ChoiceOption) => {
    onTransition(opt.next);
  };

  // Debug-only: jump straight past this scene (skip narration + end action).
  // Requires THREE quick taps in a hidden top-right corner so a toddler can't
  // skip with a stray single tap. Hidden in production.
  const devSkip = () => {
    const e = scene.end;
    if (e.type === 'continue') onTransition(e.next);
    else if (e.type === 'choice') onTransition(e.options[0]!.next);
    else if (e.type === 'spellOut' || e.type === 'spellInteractive') onTransition(e.next);
    else onEnd();
  };
  const tapTimes = useRef<number[]>([]);
  const handleDevTap = () => {
    const t = Date.now();
    tapTimes.current = [...tapTimes.current.filter((x) => t - x < 600), t];
    if (tapTimes.current.length >= 3) {
      tapTimes.current = [];
      devSkip();
    }
  };

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  const renderEnd = () => {
    const e = scene.end;
    if (e.type === 'continue') {
      return <ContinueButton onContinue={() => onTransition(e.next)} />;
    }
    if (e.type === 'choice') {
      return (
        <Choice
          promptText={e.promptText}
          promptAudioKey={e.promptAudioKey}
          options={e.options}
          onChoose={handleChoice}
        />
      );
    }
    if (e.type === 'spellOut') {
      return (
        <SpellOut
          word={e.word}
          letterAudioKeys={e.letterAudioKeys}
          heroAudioKey={e.heroAudioKey}
          expressionIllustration={e.expressionIllustration}
          backgroundTone={e.backgroundTone}
          onComplete={() => onTransition(e.next)}
        />
      );
    }
    if (e.type === 'spellInteractive') {
      return (
        <SpellInteractive
          word={e.word}
          promptText={e.promptText}
          promptAudioKey={e.promptAudioKey}
          sounds={e.sounds}
          expressionIllustration={e.expressionIllustration}
          backgroundTone={e.backgroundTone}
          isHeroMoment={e.isHeroMoment}
          onComplete={() => onTransition(e.next)}
        />
      );
    }
    if (e.type === 'end') {
      return <EndTrigger onEnd={onEnd} />;
    }
    return null;
  };

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.illustrationLayer, fadeStyle]}>
        <IllustrationView
          illustrationKey={scene.illustration}
          fallbackTone={colors.creamDeep}
          resizeMode="cover"
        />
      </Animated.View>

      {phase === 'lines' && scene.lines[lineIdx] && (
        <NarratorLine
          key={scene.lines[lineIdx]!.id}
          line={scene.lines[lineIdx]!}
          onComplete={handleLineComplete}
        />
      )}

      {/* Hold the last line on screen through the beat before a continue/end
          scene turns. Choice and spell ends replace the screen entirely, so
          there is nothing to hold there. */}
      {phase === 'end' &&
        (scene.end.type === 'continue' || scene.end.type === 'end') &&
        scene.lines.length > 0 && (
          <NarratorLine
            key={`${scene.lines[scene.lines.length - 1]!.id}-hold`}
            line={scene.lines[scene.lines.length - 1]!}
            onComplete={() => {}}
            hold
          />
        )}

      {phase === 'end' && renderEnd()}

      {__DEV__ && (
        <Pressable onPress={handleDevTap} style={styles.devSkip} accessibilityLabel="Debug: triple-tap to skip scene" />
      )}
    </View>
  );
};

const ContinueButton = ({ onContinue }: { onContinue: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onContinue, motion.pacing.sceneContinueDelay);
    return () => clearTimeout(t);
  }, [onContinue]);
  return null;
};

const EndTrigger = ({ onEnd }: { onEnd: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onEnd, motion.pacing.sceneEndDelay);
    return () => clearTimeout(t);
  }, [onEnd]);
  return null;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  illustrationLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  devSkip: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 64,
    height: 64,
    zIndex: 50,
    // invisible: a hidden triple-tap zone for testing
  },
});
