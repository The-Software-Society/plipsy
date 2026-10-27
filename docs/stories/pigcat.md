# pigcat — A Gift for Waldo

Unit 9 · Module 1. Implemented in `src/stories/pigcat.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** TIP
- **Target words:** TIP · ZIP · RIP
- **Review words:** PIG
- **Phonics focus:** short I · `-ip` family
- **Moral:** giving a gift feels wonderful.
- **Characters:** Mia, **Rosie** (pig), **Waldo** (cat) — the first cross-chapter meeting

## Structure
One branch (what is wrong with the bag), reconverging on tipping the gift out.

```
s1 → s2 ─choice─┬ RIP → s3a ─┐
                └ ZIP → s3b ─┴→ s4 (spell TIP, hero) → s5 (spell PIG, review) → s6 (end)
```

Title was TBD in the original stub (`pathways.ts` said "The Pig and the Cat"); set to
**A Gift for Waldo**. TIP moved here from `pin`, WIG moved out to `wig`, so this unit
owns the `-ip` family cleanly.

## Scene-by-scene

### s1 — the handmade gift
- *"Rosie has made a little bag for Waldo the CAT."* — tone: gentle — highlights: **CAT**
- *"Oh no! Something is wrong with it."* — tone: soft
- → continue to s2

### s2 — what is wrong
- Prompt: *"What is wrong with the little bag?"*
- Options: **RIP** (`choice.rip`) → s3a · **ZIP** (`choice.zip`) → s3b

### s3a — the tear
- *"There is a little rip in the side. Mia sews it up."* — tone: gentle
- → spell **RIP** → s4

### s3b — the stuck zip
- *"The zip is stuck fast. Mia wiggles it free."* — tone: gentle
- → spell **ZIP** → s4

### s4 — tipping it out (hero)
- *"Mia gives the bag a TIP and out slides a soft ribbon."* — tone: playful — highlights: **TIP**
- → spell **TIP** (`isHeroMoment`) → s5

### s5 — handing it over (review)
- *"Rosie the PIG holds out the mended gift."* — tone: warm — highlights: **PIG**
- → spell **PIG** → s6

### s6 — end
- *"Waldo purrs and pops the ribbon on his tail."* — tone: giggle
- *"Giving a gift feels wonderful!"* — tone: warm

## Media
- **Illustrations:** `pigcat.s1` (cover), `pigcat.s2`, `pigcat.s3a`, `pigcat.s3b`,
  `pigcat.s4`, `pigcat.s5`, `pigcat.s6`; choice art `choice.rip`, `choice.zip`,
  `choice.tip`, `choice.pig` ✅
- **Audio:** `pigcat.s1.l1` … `pigcat.s6.l2`; word clips `word.tip`, `word.zip`, `word.rip`
