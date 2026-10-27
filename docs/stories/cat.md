# cat — Mia and the Cat

Unit 1 · Module 1. Implemented in `src/stories/cat.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** CAT
- **Target words (SRS):** CAT · SIT · PET · RUN
- **Also spelled (branch/flavor words):** WAVE · CALL · TOY *(not in the CVC catalog — see [curriculum open questions](../CURRICULUM.md#-open-questions--proposed-improvements))*
- **Review words:** none (first unit)
- **Phonics focus:** mixed CVC (intro story, predates single-vowel sequencing)
- **Moral:** friendship — a gentle first meeting; small kind actions make a friend.
- **Characters:** Mia, **Waldo** (orange cat, debut)

## Structure
Two branch points. First: how Mia greets the cat (3 ways). Second: what she shares
(2 ways). All paths reconverge; the hero word CAT is spelled at the midpoint, and RUN
closes the play.

```
s1 → s2 ─choice─┬ WAVE → s3a ─┐
                ├ SIT  → s3b ─┼→ s4 (spell CAT, hero) → s5 ─choice─┬ TOY → s6a ─┐
                └ CALL → s3c ─┘                                     └ PET → s6b ─┴→ s7 (spell RUN) → s8 (end)
```

## Scene-by-scene

### s1 — garden
- *"Mia is in the garden. She has her TOY with her."* — highlights: **Mia**, **TOY**
- *"Look. Something is moving over by the tree."*
- → continue to s2

### s2 — meet Waldo
- *"This is Waldo, a little orange cat. Waldo looks right at Mia."*
- **Choice — "How does Mia say hi?"**
  - **WAVE** → s3a
  - **SIT** → s3b
  - **CALL** → s3c

### s3a — wave
- *"Mia gives the cat a soft wave."*
- **Spell WAVE** — prompt *"Wave hello! Spell WAVE."* — sounds: `W · A(long) · V · E(silent)` → s4

### s3b — sit
- *"Mia sits down quiet as can be. The cat watches her."*
- **Spell SIT** — prompt *"Spell SIT so the cat will come."* → s4

### s3c — call
- *"Mia calls out soft. Here, kitty."*
- **Spell CALL** — prompt *"Spell CALL to call the cat."* — sounds: `C · A(broad) · L · L` → s4

### s4 — the cat comes (hero)
- *"The cat comes right up close to Mia now."*
- *"Mia's new friend Waldo is a CAT."* — highlights: **CAT**
- **Spell CAT** ⭐ hero — prompt *"Now spell the word CAT!"* → s5

### s5 — what to share
- *"What does Mia want to share with her new friend?"*
- **Choice — "What does Mia share?"**
  - **TOY** → s6a
  - **PET** → s6b

### s6a — toy
- *"Mia holds out her soft TOY."* — highlights: **TOY**
- **Spell TOY** — prompt *"Spell TOY to show the cat."* — sounds: `T · O(long) · Y` → s7

### s6b — pet
- *"Mia reaches out a gentle hand."*
- **Spell PET** — prompt *"Spell PET to pet the cat soft."* → s7

### s7 — play
- *"The cat feels happy and safe. Now they want to play!"*
- **Spell RUN** — prompt *"Spell RUN and away they go!"* → s8

### s8 — end
- *"Mia and the cat play and run in the soft grass."*
- *"They are friends now. What a happy day."*
- → end

## Media
- **Illustrations:** `cat.cover`, `cat.s1`, `cat.s2`, `cat.s3a`, `cat.s3b`, `cat.s3c`,
  `cat.s4`, `cat.s5`, `cat.s6a`, `cat.s6b`, `cat.s7`, `cat.s8`, `cat.expression`;
  choice art `choice.{wave,sit,call,toy,pet,run}`.
- **Audio:** `cat.<scene>.<line>` for narration + `cat.<scene>.{prompt,spell}`;
  word clips `word.{wave,sit,call,toy,pet}`; spelling bank is shared (`bank.*`).

## Notes / to confirm
- Only story that isn't set up with inline `targetWords`/`reviewWords` on the `Story`
  object — the pathway supplies them. Consider adding them for consistency.
- WAVE/CALL/TOY are non-decodable; see curriculum open question #4.
