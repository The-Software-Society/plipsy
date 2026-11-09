# CLAUDE.md — Plipsy

Read this first. It's the map: what the app is, how we work on it, and where to go
depending on what we're doing.

## What this is

**Plipsy** is an early-reading curriculum for young children (the hero is Mia), delivered as short
interactive stories (Expo / React Native, runs on web + iOS + Android). A child reads a
decodable story, makes choices, and **drags letter tiles to spell** the words. Spelling
accuracy drives a Leitner SRS that tracks mastery and paces new-word introduction.

It's a **curriculum first, stories second** — every story exists to teach and review
specific words on a phonics path. See [docs/CURRICULUM.md](docs/CURRICULUM.md).

## How we work — the story review loop

**One story at a time, to approval, before the next.** The signature step: after I
build or change a story, I hand you a **sped-up, simulated run of it** — every scene,
every branch, every spell exercise — so you review the *experience*, not the code.
Approve or give feedback, then we advance.

→ Full process, incl. the two fidelity levels (storyboard video, then real-app pass):
**[docs/WORKFLOW.md](docs/WORKFLOW.md)**

## Where to go

| I'm working on… | Go to |
|-----------------|-------|
| The overall plan, word order, characters, morals | [docs/CURRICULUM.md](docs/CURRICULUM.md) |
| Story order, unlocks, how a child progresses | [docs/PROGRESSION.md](docs/PROGRESSION.md) |
| The review/approval process | [docs/WORKFLOW.md](docs/WORKFLOW.md) |
| A specific story's script/branches/exercises | [docs/stories/](docs/stories/) (one doc per unit) |
| The story data shape & authoring rules | [docs/stories/README.md](docs/stories/README.md) |
| Generating audio/illustrations | `memory: media-generation` + `scripts/*-prompts.ts` |
| The spelling audio bank | `memory: audio-bank` + `src/audio/bank.ts` |
| The SRS / mastery engine | `memory: pathways-srs` + `src/vocab/tracker.ts` |

## Key code locations

- **Curriculum:** `src/curriculum/words.ts` (word catalog), `src/curriculum/pathways.ts` (unit order)
- **Stories:** `src/stories/<id>.ts` (data), `src/stories/index.ts` (registry), `src/stories/types.ts` (shape + validator)
- **SRS:** `src/vocab/tracker.ts`, selection in `src/srs/select.ts`
- **Screens:** `app/` (expo-router) — `app/story/[id].tsx` is the player
- **Media on disk:** `assets/illustrations/`, `assets/audio/`

## Commands

```bash
npm start                       # Expo dev server
npm run validate:stories        # structure / highlight / spell-count checks
npm run storyboard -- --story cat   # generate the review "video" (see WORKFLOW.md)

# Media (quota-limited Google AI — read the media-generation memory first)
npm run generate:audio -- --story cat
npm run generate:illustrations -- --story cat
npm run cutout                  # key sprite backgrounds to transparent
npm run generate:manifests      # ALWAYS run after generating media
# then restart Metro with:  npx expo start --clear
```

## House rules

- **No em dashes** in story `text` / prompts (the validator rejects them).
- After any media generation: `generate:manifests`, then restart Metro `--clear`.
- Keep `docs/stories/<id>.md` and `src/stories/<id>.ts` in sync — fix drift on purpose.
- The app works offline; Supabase sync is optional.

## Status (Module 1)

All 16 stories are written and validating. The five newest (`pot`, `dogpig`, `hen`,
`bug`, `party`) are **awaiting review and have no media generated yet** — run the
storyboard pass before spending image/TTS quota on them.
Waldo (short A) and Rosie (short I) both have complete 5-story chapters; Biscuit is at
3, Ruby and Bea at 1 each. Open curriculum questions to confirm are tracked in
[docs/CURRICULUM.md → Open questions](docs/CURRICULUM.md#-open-questions--proposed-improvements).
