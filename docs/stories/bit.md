# bit — A Bit More Room

Unit 8 · Module 1. Implemented in `src/stories/bit.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** BIT
- **Target words:** HIT · FIT · BIT
- **Review words:** SIT
- **Phonics focus:** short I · `-it` family
- **Moral:** there is always room for one more.
- **Characters:** Mia, **Rosie** (pig, recurring)

## Structure
One branch (how to make the den stand), reconverging on Rosie not quite fitting and
Mia shuffling over. The `-it` family is the last short-I family with unused words
(SIT was taught back in unit 1, so it makes the natural review).

```
s1 → s2 ─choice─┬ HIT → s3a ─┐
                └ FIT → s3b ─┴→ s4 (spell BIT, hero) → s5 (spell SIT, review) → s6 (end)
```

⚠️ **HIT is the one aggressive-sounding word in the short-I set.** It is framed here
purely as building (a small wooden mallet tapping a peg, art directed to match). If
that is not wanted in a toddler's mouth, drop the s3a branch and rebuild the story
around FIT/BIT with a second review word.

## Scene-by-scene

### s1 — building a den
- *"Mia is building a little den from old boards."* — tone: playful
- *"Rosie the PIG trots over to help."* — tone: gentle — highlights: **PIG**
- → continue to s2

### s2 — how to make it stand
- Prompt: *"How can they make the den stand up?"*
- Options: **HIT** (`choice.hit`) → s3a · **FIT** (`choice.fit`) → s3b

### s3a — the peg
- *"Tap, tap! Mia gives the peg a soft hit with her mallet."* — tone: fun
- → spell **HIT** → s4

### s3b — the last board
- *"Push! The last board slides in and the pieces fit."* — tone: fun
- → spell **FIT** → s4

### s4 — not quite room (hero)
- *"The den is small. Rosie needs a BIT more room!"* — tone: giggle — highlights: **BIT**
- → spell **BIT** (`isHeroMoment`) → s5

### s5 — shuffling over (review)
- *"Mia shuffles over so they can both SIT inside."* — tone: warm — highlights: **SIT**
- → spell **SIT** → s6

### s6 — end
- *"Two friends in one little den."* — tone: warm
- *"There is always room for one more!"* — tone: warm

## Media
- **Illustrations:** `bit.s1` (cover), `bit.s2`, `bit.s3a`, `bit.s3b`, `bit.s4`, `bit.s5`,
  `bit.s6`; choice art `choice.hit`, `choice.fit`, `choice.bit`, `choice.sit` ✅
- **Audio:** `bit.s1.l1` … `bit.s6.l2`; word clips `word.hit`, `word.fit`, `word.bit`
