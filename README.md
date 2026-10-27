# Mia

A toddler reading app for one specific 3.5 year old. Three short branching
stories. One designed spell-out moment per story teaches a hero word
(CAT, DOG, ROAR). Anti-CoComelon: muted earthy colors, calm pacing, no
sparkly rewards.

Built with Expo SDK 54 + TypeScript + expo-router + Reanimated 4 +
expo-audio + Supabase + Zustand. Runs on iPad via Expo Go for MVP.

## First-time setup

```bash
cp .env.example .env
# fill in:
#   EXPO_PUBLIC_SUPABASE_URL
#   EXPO_PUBLIC_SUPABASE_ANON_KEY
#   ELEVENLABS_API_KEY
#   GOOGLE_API_KEY
#   EXPO_PUBLIC_PARENT_PIN  (defaults to 1234)
```

### Provision Supabase

1. Create a new Supabase project at https://supabase.com.
2. Open the SQL editor and paste `supabase/migrations/0001_initial.sql`,
   or run `supabase db push` if you have the CLI configured.
3. Copy the project URL and anon key into `.env`.

### Generate audio + illustrations

```bash
npm run generate:audio          # ElevenLabs Matilda voice
npm run generate:illustrations  # Google Imagen 3
npm run generate:manifests      # walks /assets and emits typed manifests
```

All three are idempotent. Pass `--force` to regenerate everything,
`--scene cat.s1` (illustrations only) or `--only cat` (audio only) to
target a subset.

If the app boots before any assets are generated, it still runs end to
end. Illustrations fall back to soft cream tiles. Audio plays silently
but the line auto-advance still works (text-length estimate).

### Run on iPad

```bash
npm start
# Open Expo Go on the iPad and scan the QR code.
```

## What's where

```
app/                    # expo-router routes
  _layout.tsx           # font loading, providers, splash hide
  index.tsx             # Home (story tiles + word chips + gear)
  story/[id].tsx        # Story player + end screen
  parent/_layout.tsx    # PIN gate
  parent/index.tsx      # Dashboard
src/
  theme/                # colors, type, spacing, motion (single source of truth)
  components/           # SpellOut, NarratorLine, Scene, Choice, etc.
  stories/              # cat.ts, dog.ts, roar.ts, types, manifest
  audio/                # AudioPlayer wrapper + manifest
  vocab/                # tracker (pure logic), store (zustand), sync
  session/              # session events store
  supabase/             # client + row types
  lib/                  # env, queue, parentLock
scripts/                # generate-audio, generate-illustrations, build-manifests
supabase/migrations/    # 0001_initial.sql
assets/
  audio/                # generated MP3s
  illustrations/        # generated PNGs (organized by story)
```

## How a story plays

1. `app/story/[id].tsx` calls `useSession.start(storyId)` which inserts a
   `sessions` row and starts a fresh local event log.
2. It mounts `<Scene>` with the start scene from the story registry.
3. `<Scene>` plays each `<NarratorLine>` in turn. Each line plays its
   audio, advances on audio-end + 400ms breath, or on tap. Highlighted
   words are tappable; tapping logs `highlight_tap` and increments the
   word's exposure count via `useVocab.recordExposure`.
4. When all lines are done, `<Scene>` runs the end action:
   - `continue` → calls `onTransition(next)` after a beat.
   - `choice` → renders `<Choice>` cards. On tap, logs `choice_made`,
     plays the chime, fires haptic, calls `onTransition(next)`.
   - `spellOut` → renders `<SpellOut>`, the centerpiece. On complete,
     logs `spellout_complete`, calls `recordIntroduction(word)`, calls
     `onTransition(next)`.
   - `end` → calls `onEnd`. The player logs `story_end`, marks the
     session completed, and shows the end screen with "Read it again".

## Word mastery

Three states: `introduced` → `learning` → `mastered`.

- A spell-out moment introduces a word (status `introduced`, exposure 1).
- Each highlight tap on a known word increments exposure. First tap moves
  it from `introduced` to `learning`. After 5 exposures total, status
  becomes `mastered`.
- Mastered words still appear in stories but render in plain ink instead
  of terracotta. They remain tappable so taps continue to log exposure
  for the dashboard.
- The threshold lives at `MASTERY_THRESHOLD` in
  `src/vocab/tracker.ts` so it can be tuned after observing real play.

## Offline behavior

All Supabase writes route through `src/lib/queue.ts`. If the network or
Supabase is unreachable, writes are persisted to AsyncStorage and
flushed on the next foreground / network restore / 30 second tick.
The kid's UI never blocks on network. Errors are silenced for her and
surfaced in the parent dashboard's "sync status" section.

## Audio voice

ElevenLabs Matilda. Voice settings:

- Standard lines: `stability: 0.45, similarity_boost: 0.75, style: 0.20`
- Hero word reveal: `stability: 0.55, similarity_boost: 0.85, style: 0.40`
  (post-spell-out emphasis)

Phoneme audio for letters (e.g. `letter.C.cat` = "kuh") is keyed per
hero word so vowels can be context aware (the O in DOG sounds different
from the O in ROAR).

To swap voice (Sarah / Charlotte / etc.), change `VOICE_ID_MATILDA` in
`scripts/generate-audio.ts` and regen with `--force`.

## Illustration style

Locked in `scripts/style-prompt.md`. Every Imagen prompt is style prefix
+ character context + scene suffix from `scripts/illustration-prompts.ts`.

To revise one scene without regenerating the rest:

```bash
npm run generate:illustrations -- --scene cat.s4
```

If a recurring character (Mia, the cat, etc.) drifts across scenes, the
plan is to (a) tighten the character description in `style-prompt.md`,
or (b) generate one canonical reference image and pass it as a reference
to subsequent calls. Imagen 3 supports reference images for identity
locking; that hook is not yet wired but the script is structured for
easy extension.

## Parent dashboard

Tap the small gear (top right of home, ~16pt at 0.4 opacity), enter the
4 digit PIN (default 1234, override via `EXPO_PUBLIC_PARENT_PIN`).

Shows: words known with status / exposure / first / last seen, the most
recent 20 sessions with completion + duration, sync queue length, and
the asset regeneration commands.

## Verification (per the build plan)

After step 7 (SpellOut working):

- Run on a physical iPad. Verify letter pacing feels unhurried by
  watching a non-developer adult react.
- Confirm letter sounds are phonetic (kuh ah tuh), not letter names.
- Mix chime volume below narrator volume in headphones.

After step 8 (story player wired):

- Play CAT three times taking different choice paths.
- Open Supabase: 3 `sessions` rows, ~30 `session_events` rows,
  `print_vocabulary` has CAT with `status='introduced'` and exposure_count > 0.
- Airplane mode test: play offline, restore network, queue flushes
  within 30s.

After step 11 (Mia plays):

- She watches a full pass without prompting.
- She replays without being asked.
- The next morning, present CAT, DOG, FISH on paper. She points at CAT.

## Out of scope for v1

- Auth, multiple profiles
- AI generated stories (manual authoring for now)
- Speech recognition
- Streaks, badges, gamification
- App store distribution
- Screen reader / dynamic type accessibility (deferred per spec)

## v1.1 ideas (not implemented)

- Parent recorded narration: the AudioPlayer falls through `audioManifest`
  by key, so a future overlay layer that prefers a recorded version over
  the bundled one is additive, not a rewrite.
- More stories, more hero words.
- Imagen reference images for tighter character consistency.
