# map — The Map

Unit 4 · Module 1. Implemented in `src/stories/map.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** MAP
- **Target words:** MAP · TAP · CAP
- **Review words:** CAN
- **Phonics focus:** short A · `-ap` family
- **Moral:** sharing the treasure is the best part.
- **Characters:** Mia, **Waldo** (the cat, treasure-hunt partner)

## Structure
One branch (what to pack), reconverging into TAP and the MAP hero reveal. The
branch is where the CAN review lives, so both paths teach an `-ap` word plus one
short-A word already known.

```
s1 → s2 ─choice─┬ CAP → s3a ─┐
                └ CAN → s3b ─┴→ s4 (spell TAP) → s5 (spell MAP, hero) → s6 (end)
```

Unlike `fan`, the `isHeroMoment` reveal **is** the title word (MAP), on the
always-visited path.

## Scene-by-scene

### s1 — the find
- *"Look! Mia found an old MAP in the shed."* — tone: playful — highlights: **MAP**
- *"Waldo the CAT sniffs it. A big red X!"* — tone: giggle — highlights: **CAT**
- → continue to s2

### s2 — what to pack
- Prompt: *"What should Mia pack for the hunt?"*
- Options: **CAP** (`choice.cap`) → s3a · **CAN** (`choice.can`) → s3b

### s3a — cap
- *"Mia pops on her sun cap. Off we go!"* — tone: fun
- → spell **CAP** → s4

### s3b — can (review)
- *"Mia packs a can of cool water. Off we go!"* — tone: fun
- → spell **CAN** → s4

### s4 — the X
- *"Here is the X! Waldo gives the ground a TAP."* — tone: playful — highlights: **TAP**
- → spell **TAP** → s5

### s5 — the treasure (hero)
- *"A tin of seeds! The MAP led them right to it."* — tone: cheer — highlights: **MAP**
- → spell **MAP** (`isHeroMoment`) → s6

### s6 — end
- *"Mia gives half of the seeds to Waldo."* — tone: warm
- *"Sharing the treasure is the best part!"* — tone: warm

## Media
- **Illustrations:** `map.s1` (also the cover), `map.s2`, `map.s3a`, `map.s3b`,
  `map.s4`, `map.s5`, `map.s6`; choice art `choice.cap`, `choice.can` ✅ exists,
  `choice.tap`, `choice.map`
- **Audio:** `map.s1.l1`, `map.s1.l2`, `map.s2.prompt`, `map.s3a.l1`, `map.s3a.spell`,
  `map.s3b.l1`, `map.s3b.spell`, `map.s4.l1`, `map.s4.spell`, `map.s5.l1`,
  `map.s5.spell`, `map.s6.l1`, `map.s6.l2`; word clips `word.map`, `word.tap`,
  `word.cap` (`word.can` ✅ exists)
- ⚠️ **Not yet generated** (blocked on a valid `GOOGLE_API_KEY`).
