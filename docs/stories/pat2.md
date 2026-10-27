# pat2 — The New Friend

Unit 5 · Module 1 · **spiral**. Implemented in `src/stories/pat2.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** SAT
- **Target words:** BAT · RAT · SAT
- **Review words:** HAT
- **Phonics focus:** short A · `-at` spiral (closes the short-A arc)
- **Moral:** welcome a new friend.
- **Characters:** Mia, **Waldo** (the cat), plus a new critter (BAT or RAT, the child picks)

## Structure
The branch *is* the new friend: whichever the child picks becomes the character who
stays for the rest of the story. Reconverges into the SAT hero reveal and a HAT review.

```
s1 → s2 ─choice─┬ BAT → s3a ─┐
                └ RAT → s3b ─┴→ s4 (spell SAT, hero) → s5 (spell HAT, review) → s6 (end)
```

Title was TBD in the original stub; set to **The New Friend** (also updated in
`pathways.ts`, which previously said "Pat the Cat Again").

## Scene-by-scene

### s1 — on the mat
- *"Mia and Waldo the CAT sat on the warm MAT."* — tone: gentle — highlights: **CAT**, **MAT**
- *"Tap, tap! Someone new is at the gate."* — tone: playful
- → continue to s2

### s2 — who is there?
- Prompt: *"Who is at the gate?"*
- Options: **BAT** (`choice.bat`) → s3a · **RAT** (`choice.rat`) → s3b

### s3a — the bat
- *"A little bat flaps down. Hello, hello!"* — tone: giggle
- → spell **BAT** → s4

### s3b — the rat
- *"A small rat pops out. Hello, hello!"* — tone: giggle
- → spell **RAT** → s4

### s4 — making room (hero)
- *"Waldo shuffles over. The new friend SAT down too."* — tone: warm — highlights: **SAT**
- → spell **SAT** (`isHeroMoment`) → s5

### s5 — lending the hat (review)
- *"Waldo lends the new friend his floppy HAT."* — tone: fun — highlights: **HAT**
- → spell **HAT** → s6

### s6 — end
- *"Three friends on one little mat."* — tone: warm
- *"There is always room for a new friend!"* — tone: warm

## Media
- **Illustrations:** `pat2.s1` (also the cover), `pat2.s2`, `pat2.s3a`, `pat2.s3b`,
  `pat2.s4`, `pat2.s5`, `pat2.s6`; choice art `choice.bat`, `choice.rat`,
  `choice.sat`, `choice.hat` ✅ exists
- **Audio:** `pat2.s1.l1`, `pat2.s1.l2`, `pat2.s2.prompt`, `pat2.s3a.l1`,
  `pat2.s3a.spell`, `pat2.s3b.l1`, `pat2.s3b.spell`, `pat2.s4.l1`, `pat2.s4.spell`,
  `pat2.s5.l1`, `pat2.s5.spell`, `pat2.s6.l1`, `pat2.s6.l2`; word clips `word.bat`,
  `word.rat`, `word.sat` (`word.hat` ✅ exists)
- ⚠️ **Not yet generated** (blocked on a valid `GOOGLE_API_KEY`).
