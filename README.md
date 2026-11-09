# Plipsy

A calm, ad-free early reading app for toddlers and preschoolers (roughly ages 3 to 5).
A child follows Mia, the story hero, and a small cast of garden animals through short, branching,
decodable stories. Each story builds to a "spell it" moment: the child drags letter
tiles to spell a hero word (CAT, PIG, MAP...), hearing each letter's name and sound as it
lands. A gentle spaced-repetition engine tracks which words are known and paces new ones.

It is deliberately the opposite of attention-farming kids' media: muted earthy colors,
unhurried narration, no ads, no streaks, no sparkly reward loops, no accounts, and no
data leaving the device unless a parent opts in.

**Who it's for:** parents and early educators who want a quiet first-reading tool for a
pre-reader, and developers who want a worked example of an offline-first Expo app with a
real phonics curriculum behind it.

## What's inside

- **16 stories on a phonics path** (Module 1, "First Sounds"): short vowels taught one
  family at a time (`-at`, `-an`, `-ig`, `-og`...), with spiral review of earlier words.
  Two older demo stories (`dog`, `roar`) are kept as examples.
- **A garden overworld** where five animal friends (one per short vowel) wake up as the
  child finishes the previous friend's stories.
- **Interactive spelling** (`SpellInteractive`): drag letter tiles; each placement plays
  the letter name and its sound in context (the O in DOG differs from the O in TOY).
- **Leitner SRS** (`src/vocab/tracker.ts`, `src/srs/`): boxes, clean-run counting,
  lapse handling, and a review screen for due words.
- **Parent dashboard** behind a PIN: words with their SRS state, recent sessions, sync status.
- **Content tooling**: a story validator, an illustration and narration generator, a
  sprite cutout tool, typed asset manifests, and a storyboard renderer for reviewing a
  story's full flow before spending generation quota.

## Built with

Expo SDK 54, React Native 0.81, TypeScript, expo-router, Reanimated 4, expo-audio,
Zustand, AsyncStorage. Optional Supabase sync. Content generation scripts use Google
Gemini TTS and Gemini/Imagen image models via `@google/genai`.

## Run it (no keys needed)

```bash
npm install
npm start          # Expo dev server: press i (iOS sim), a (Android), w (web),
                   # or scan the QR code with Expo Go on a tablet
npm run validate:stories   # structural checks on every story
npx tsc --noEmit           # type-check
```

That's it. All stories, illustrations and narration are bundled in `assets/`, and
progress is stored on the device with AsyncStorage. No `.env` file is required.

The parent dashboard is the small gear at the top right of the home screen. The
default PIN is `1234`; set `EXPO_PUBLIC_PARENT_PIN` in `.env` to change it.

## Optional configuration

Copy `.env.example` to `.env` (all `.env*` files except the example are gitignored):

| Variable | Used by | Default |
|---|---|---|
| `EXPO_PUBLIC_PARENT_PIN` | app | `1234` |
| `EXPO_PUBLIC_ENABLE_CLOUD_SYNC` | app | `false` |
| `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | app, only when cloud sync is on | empty |
| `GOOGLE_API_KEY` | generation scripts only, never bundled | empty |

### Privacy and the optional cloud sync

By default nothing about the child leaves the device: no backend client is created and
nothing is queued for upload. Nothing identifying about the child is collected:
the only profile is the built-in story hero.

If a parent wants progress backed up (for example, across two tablets), set
`EXPO_PUBLIC_ENABLE_CLOUD_SYNC=true` plus the Supabase URL and anon key, and apply
`supabase/migrations/*.sql` to their own Supabase project. Synced data is limited to
word progress, story sessions and in-story events, keyed by an anonymous id. Writes go
through an on-device retry queue (`src/lib/queue.ts`), so the child's UI never waits
on the network.

## Content generation (optional, needs a Google AI Studio key)

```bash
npm run generate:audio -- --story cat           # Gemini TTS narration (WAV)
npm run generate:illustrations -- --story cat   # Gemini image model, style-locked
npm run cutout                                  # key sprite backgrounds to transparent
npm run generate:manifests                      # ALWAYS run after generating media
npx expo start --clear                          # restart Metro to pick up new assets
npm run storyboard -- --story cat               # review the whole story flow
```

Generation is idempotent; pass `--force` to regenerate. Some stories (`pot`, `dogpig`,
`hen`, `bug`, `party`, plus the `dog`/`roar` demos) have no media yet. The app handles that: missing illustrations render as soft cream tiles, and
missing narration is silent, with lines still advancing on a reading-time estimate.

## Asset provenance

- **Illustrations** (`assets/illustrations/`) were generated with Google image models
  (Imagen, then Gemini image models using earlier approved illustrations as style
  references) from the text prompts in `scripts/illustration-prompts.ts` and
  `scripts/style-prompt.md`. No photographs of real people were used as input. Each PNG
  carries Google's C2PA "Created by Google Generative AI" manifest and SynthID watermark.
  Mia and her animal friends are fictional characters.
- **Narration** (`assets/audio/`) was generated with Google Gemini TTS using the stock
  prebuilt voice "Leda", from the text in `src/stories/` and `scripts/*-prompts.ts`. No
  real person's voice was recorded or cloned.
- **App icons** are the Expo template defaults.

## Project layout

```
app/                    expo-router screens
  index.tsx             garden overworld (home)
  area/[friend].tsx     a friend's area: stories, games, words
  story/[id].tsx        story player
  review.tsx            SRS review of due words
  words.tsx, treasures.tsx
  parent/               PIN gate + dashboard
src/
  stories/              story data (one file per story), registry, types + validator
  curriculum/           word catalog and unit order
  components/           Scene, NarratorLine, Choice, SpellInteractive, SpellOut...
  vocab/, srs/          mastery tracking and review selection
  session/              session log (on-device history; optional upload)
  world/                overworld friends, areas, unlock state
  audio/                AudioPlayer, letter/phrase bank, generated manifest
  theme/                colors, type, spacing, motion (single source of truth)
  lib/                  env, retry queue, parent lock
  supabase/             optional sync client + row types
scripts/                generation, manifests, validation, storyboard
supabase/migrations/    schema for the optional sync backend
docs/                   curriculum, progression, workflow, per-story scripts
```

Start with `docs/CURRICULUM.md` for the teaching design and `docs/stories/README.md` for
the story data shape. `ROADMAP.md` lists planned work.

## Design rules

- Muted palette (sage, terracotta, cream, dusty blue, mustard) from `src/theme/`.
- Calm pacing: narration advances on audio end plus a breath, or on tap.
- Celebration is warm but brief: a found nature treasure (a leaf, a shell) for the
  basket, never points, streaks, leaderboards or timers.
- No em dashes in story text (the validator rejects them; TTS reads them badly).

## License

MIT, see [LICENSE](LICENSE). Copyright (c) 2026 The Software Society.
