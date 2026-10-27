import { Easing } from 'react-native-reanimated';

export const motion = {
  ease: Easing.bezier(0.25, 0.1, 0.25, 1),
  easeOut: Easing.bezier(0.16, 1, 0.3, 1),
  easeIn: Easing.bezier(0.42, 0, 1, 1),

  duration: {
    fast: 200,
    base: 400,
    slow: 700,
    pageChange: 600,
  },

  pacing: {
    lineBreath: 700,
    letterCadence: 900,
    letterFadeIn: 200,
    pulseDuration: 600,
    holdAfterLastLetter: 700,
    holdAfterPulse: 2000,
    choiceStagger: 240,
    choicePressScale: 1.08,
    tapDebounce: 250,
    sceneContinueDelay: 1400,
    sceneEndDelay: 1200,
    // Max time the spell "Continue / Hear again" buttons stay hidden while the
    // completion recap plays. The recap keeps playing after this; the cap only
    // guarantees the child is never trapped if an audio clip stalls.
    spellRecapMaxWait: 7000,
  },
} as const;
