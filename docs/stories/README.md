# Story specs

One doc per unit. Each is the human-readable source-of-truth for a story; the code
that implements it is `src/stories/<id>.ts`. When they disagree, fix one to match the
other on purpose — don't let them drift.

- Curriculum context (order, words, morals): [../CURRICULUM.md](../CURRICULUM.md)
- Review process: [../WORKFLOW.md](../WORKFLOW.md)

## Built (full specs)
- [cat](cat.md) · [pat](pat.md) · [fan](fan.md) · [map](map.md) · [pat2](pat2.md)
- [pig](pig.md) · [pin](pin.md) · [bit](bit.md) · [pigcat](pigcat.md) · [wig](wig.md)
- [doglog](doglog.md) · [pot](pot.md) · [dogpig](dogpig.md) · [hen](hen.md) · [bug](bug.md) · [party](party.md)

All 16 Module 1 units are now written. `pot`, `dogpig`, `hen`, `bug` and `party` are
authored and validating but their **media has not been generated yet** (see each doc's
Media section for the keys they need).

---

## Story shape (the authoring contract)

Defined in `src/stories/types.ts`. A story is a graph of **scenes**; each scene has an
illustration, narrator **lines**, and an **end action** that decides what comes next.

**Scene**
- `illustration` — key into `assets/illustrations/` (e.g. `cat.s2`).
- `lines[]` — narrator lines, each with:
  - `text` — the exact words shown & read.
  - `audioKey` — key into `assets/audio/` (e.g. `cat.s2.l1`).
  - `highlights[]` — words in the text that light up as read (usually the target/CVC words).
  - `tone?` — TTS delivery hint (`soft`, `giggle`, `cheer`, `warm`…); same voice, nuanced read.
- `end` — one of:
  - **continue** → go straight to the next scene.
  - **choice** → a prompt + 2–3 word options, each with its own illustration and next scene (a branch).
  - **spellInteractive** → drag-to-spell the target word. `sounds[]` gives the per-letter
    sound variant aligned to the word (`null` = canonical, else `long`/`broad`/`silent`…).
    `isHeroMoment: true` marks the story's hero-word reveal.

**Spelling audio is a shared bank**, not per-story — letter names, sounds, and feedback
phrases come from `src/audio/bank.ts` (see the `audio-bank` memory). A story only
authors the word, the prompt, and the per-letter sound variants.

## Authoring rules (enforced by `npm run validate:stories`)
- **No em dashes** in `text` or `promptText`.
- Every `highlight` word must exactly match the text slice it points at.
- Every `next` / branch target must be a real scene id.
- A `spellInteractive`'s `sounds[]` length must equal the word's letter count.

## How each spec doc is laid out
1. **At a glance** — hero word, target/review words, phonics focus, moral, characters.
2. **Scene-by-scene script** — the exact narrator text, tone, highlights, and the end
   action (branches and spell words with their sound variants).
3. **Media** — the illustration + audio keys the story references.
