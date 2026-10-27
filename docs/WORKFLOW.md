# Story Review Workflow

How we build and sign off on stories. The loop is designed so you review a
**simulated, sped-up run of the story** — not a wall of code — before we move on.

> Rule of thumb: **one story at a time, all the way to approval, before the next.**

## The loop

```
1. Author / edit    →  Claude writes or changes src/stories/<id>.ts (+ docs/stories/<id>.md)
2. Validate         →  npm run validate:stories   (structure, highlights, spell-letter counts)
3. Storyboard video →  Claude generates a self-contained HTML "video" of the whole story,
                       auto-playing every scene and walking every branch, sped up.
4. You review       →  Approve, or give feedback. Feedback → back to step 1.
5. Real-app pass     →  Once content is approved, a Playwright run drives the actual Expo
                       web build through every branch as a regression gate (crashes,
                       missing audio/art, dead navigation).
6. Media (if needed) →  Generate audio/illustrations for new/changed lines (quota-limited).
7. Advance          →  Move to the next unit.
```

Steps 3 and 5 are the two fidelity levels we agreed on: **storyboard first** (fast,
content-focused), **real app second** (high-confidence, pre-merge test gate).

## Step 3 — the storyboard video (content sign-off)

Generated from the story graph in `src/stories/<id>.ts`, so it always matches the
real script. It embeds the actual illustrations from `assets/illustrations/` and can
play the actual narration from `assets/audio/`.

```
npm run storyboard -- --story cat        # → writes a self-contained HTML file
```

What it shows, sped up:
- Every scene in order, with its illustration and the **exact narrator text**, word
  highlights lit as they're read.
- Every **choice** — each branch is walked (not just the first option), labelled so
  you can see all paths a child could take.
- Every **spell exercise** — the target word, the letter tiles, and the per-letter
  sound variants (e.g. `WAVE = W, A(long), V, E(silent)`).
- The moral / closing line.

The output is one page you can scrub. Approve it, or point at a scene/line/branch and
say what to change.

## Step 5 — the real-app pass (regression gate)

After content approval, Playwright drives `expo start --web`, auto-advances scenes,
clicks through **every choice branch**, performs the drag-to-spell, and screen-records
it. ffmpeg speeds the recording up. This is the real runtime — it catches what the
storyboard can't: crashes, missing/blank assets, broken navigation, timing bugs.

Kept as a checked-in script so any story can be re-run on demand.

## What "approval" gates

- Content approval (step 4) unlocks media generation and the real-app pass.
- A green real-app pass (step 5) is the bar for calling a unit **done** and advancing.

## Pointers

- Story shape & authoring rules: [stories/README.md](stories/README.md)
- Curriculum order / word map: [CURRICULUM.md](CURRICULUM.md)
- Media generation (quota gotchas): see the `media-generation` memory and
  `scripts/*-prompts.ts`.
