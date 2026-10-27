import { AppState } from 'react-native';
import {
  AudioPlayer as ExpoAudioPlayer,
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';
import { audioManifest, sfxManifest } from './manifest';
import { lineEstimateMs } from './textEstimate';

export type PlayResult = { played: boolean; durationMs: number };

const AUDIO_MODE = {
  playsInSilentMode: true,
  shouldPlayInBackground: false,
  interruptionMode: 'duckOthers',
} as const;

// expo-audio tears the iOS audio session down on every pause AND every natural
// clip end unless the player opts out (ios/AudioModule.swift -> deactivateSession,
// which fires on a 100ms delay). A story is hundreds of short clips, so that
// deactivation lands mid-load on the clip that is starting next and we go silent
// with no error. Every player we make keeps the session active instead.
const PLAYER_OPTS = { keepAudioSessionActive: true } as const;

// Safety net: if status updates never arrive, don't stall the story forever.
const MAX_CLIP_MS = 30_000;

const warn = (where: string, err: unknown) => {
  // Never throw from audio, but never fail silently either - silent audio used
  // to be undebuggable because every catch here was empty.
  console.warn(`[audio] ${where} failed:`, err);
};

let modeApplied: Promise<void> | null = null;

const applyAudioMode = (): Promise<void> => {
  const attempt: Promise<void> = setAudioModeAsync(AUDIO_MODE).catch((err) => {
    warn('setAudioModeAsync', err);
    // Drop the cached attempt so the next clip retries instead of latching a
    // one-time failure for the rest of the session.
    if (modeApplied === attempt) modeApplied = null;
  });
  modeApplied = attempt;
  return attempt;
};

const ensureConfigured = (): Promise<void> => modeApplied ?? applyAudioMode();

// On web, HTMLMediaElement.play() returns a promise that REJECTS with AbortError
// when the element is paused before playback starts. Interrupting a clip (which
// is normal here: every new line cancels the last) therefore produced an
// unhandled rejection on each scene change. Swallow it at the source; a genuine
// failure still surfaces through the clip's own timeout/settle path.
const startPlayback = (player: { play: () => unknown }, where: string): void => {
  try {
    const result = player.play();
    if (result && typeof (result as Promise<void>).catch === 'function') {
      (result as Promise<void>).catch((err: unknown) => {
        const name = (err as { name?: string } | null)?.name;
        if (name !== 'AbortError') warn(where, err);
      });
    }
  } catch (err) {
    warn(where, err);
  }
};

// iOS drops our category on interruptions (call, Siri, alarm) and on
// backgrounding, so re-arm it every time we come back to the foreground.
AppState.addEventListener('change', (state) => {
  if (state === 'active') applyAudioMode();
});

type Clip = {
  key: string;
  player: ExpoAudioPlayer;
  subscription: { remove: () => void };
  resolve: (r: PlayResult) => void;
  timer: ReturnType<typeof setTimeout> | null;
  settled: boolean;
};

class AudioController {
  private active: Clip | null = null;
  // Bumped whenever a new playback (or stop) begins, so an in-flight
  // playSequence() detects it was superseded and bails between clips.
  private generation = 0;

  async play(key: string): Promise<PlayResult> {
    this.generation++;
    return this.playClip(key);
  }

  private async playClip(key: string): Promise<PlayResult> {
    await ensureConfigured();
    this.cancelActive(); // interrupt + resolve any clip already playing

    const source = audioManifest[key];
    if (source == null) {
      return await waitOut(estimateDurationFromKey(key));
    }

    return new Promise<PlayResult>((resolve) => {
      let clip: Clip | null = null;
      try {
        const player = createAudioPlayer(source, PLAYER_OPTS);

        const subscription = player.addListener('playbackStatusUpdate', (status) => {
          // A listener can outlive its clip. Without this guard a stale callback
          // settles - and tears down - whatever clip is playing now.
          if (clip == null || clip.settled || this.active !== clip) return;
          if (!status.isLoaded || !status.didJustFinish) return;
          // Read duration off the status, not the player: the player is a native
          // shared object and touching it after release throws.
          this.settle(clip, { played: true, durationMs: (status.duration || 0) * 1000 });
        });

        clip = { key, player, subscription, resolve, timer: null, settled: false };
        const pending = clip;
        clip.timer = setTimeout(() => {
          this.settle(pending, { played: true, durationMs: 0 });
        }, MAX_CLIP_MS);

        this.active = clip;
        startPlayback(player, `play(${key})`);
      } catch (err) {
        warn(`play(${key})`, err);
        if (clip) this.teardown(clip);
        if (this.active === clip) this.active = null;
        resolve({ played: false, durationMs: estimateDurationFromKey(key) });
      }
    });
  }

  // Play clips back-to-back. A newer play()/playSequence()/stop() interrupts it
  // mid-clip - exactly what we want for snappy letter feedback (cut and jump).
  async playSequence(keys: string[], gapMs: number = 140): Promise<void> {
    const gen = ++this.generation;
    for (const key of keys) {
      if (this.generation !== gen) return; // superseded by a newer playback
      await this.playClip(key);
      if (this.generation !== gen) return;
      if (gapMs > 0) await wait(gapMs);
    }
  }

  async playChime(): Promise<void> {
    this.playSfx('chime', 0.65);
  }

  async playPageTurn(): Promise<void> {
    this.playSfx('pageTurn', 0.5);
  }

  stop(): void {
    this.generation++;
    this.cancelActive();
  }

  // Interrupt the current clip and resolve its pending promise so any awaiting
  // playSequence() loop unblocks (then bails on the generation check).
  private cancelActive(): void {
    const clip = this.active;
    this.active = null;
    if (clip) this.settle(clip, { played: false, durationMs: 0 });
  }

  private settle(clip: Clip, result: PlayResult): void {
    if (clip.settled) return;
    clip.settled = true;
    this.teardown(clip);
    if (this.active === clip) this.active = null;
    clip.resolve(result);
  }

  private teardown(clip: Clip): void {
    if (clip.timer) {
      clearTimeout(clip.timer);
      clip.timer = null;
    }
    // Always unsubscribe. Leaving these attached leaked one listener per
    // interrupted clip, each firing against a released player.
    try {
      clip.subscription.remove();
    } catch (err) {
      warn('subscription.remove', err);
    }
    try {
      clip.player.pause();
      clip.player.remove();
    } catch (err) {
      warn('player teardown', err);
    }
  }

  // Sfx are fire-and-forget and may overlap narration, so they get their own
  // short-lived player rather than going through the clip lifecycle.
  private playSfx(name: 'chime' | 'pageTurn', volume: number): void {
    const source = sfxManifest[name];
    if (source == null) return;
    try {
      const player = createAudioPlayer(source, PLAYER_OPTS);
      player.volume = volume;
      startPlayback(player, `sfx ${name}`);
      setTimeout(() => {
        try {
          player.remove();
        } catch (err) {
          warn(`sfx ${name} teardown`, err);
        }
      }, 1500);
    } catch (err) {
      warn(`sfx ${name}`, err);
    }
  }

  get nowPlaying(): string | null {
    return this.active?.key ?? null;
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const waitOut = async (ms: number): Promise<PlayResult> => {
  await wait(ms);
  return { played: false, durationMs: ms };
};

const estimateDurationFromKey = (key: string): number => {
  if (key.startsWith('letter.')) return 1100;
  if (key.startsWith('word.')) return 1400;
  if (key.includes('.prompt')) return 1900;
  if (/\.l\d+/.test(key)) return lineEstimateMs(key);
  return 1500;
};

export const audio = new AudioController();
