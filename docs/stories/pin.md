# pin — Win a Pin

Unit 7 · Module 1. Implemented in `src/stories/pin.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** WIN
- **Target words:** PIN · WIN · FIN
- **Review words:** PIG
- **Phonics focus:** short I · `-in` family
- **Moral:** playing together is the real prize.
- **Characters:** Mia, **Rosie** (pig, recurring)

## Structure
One branch (which game), reconverging on a dead heat so nobody loses.

```
s1 → s2 ─choice─┬ FIN → s3a ─┐
                └ PIN → s3b ─┴→ s4 (spell WIN, hero) → s5 (spell PIG, review) → s6 (end)
```

TIP moved out of this unit into `pigcat` so the story owns one clean family (`-in`:
PIN, WIN, FIN).

## Scene-by-scene

### s1 — games day
- *"It is games day in the garden!"* — tone: cheer
- *"Rosie the PIG spots a shiny PIN for the winner."* — tone: playful — highlights: **PIG**, **PIN**
- → continue to s2

### s2 — which game
- Prompt: *"Which game should they play?"*
- Options: **FIN** (`choice.fin`) → s3a · **PIN** (`choice.pin`) → s3b

### s3a — the fish race
- *"Splash! They race a little wooden fish with a red fin."* — tone: fun
- → spell **FIN** → s4

### s3b — the ring toss
- *"Toss the ring! The shiny pin wobbles on its post."* — tone: fun
- → spell **PIN** → s4

### s4 — a dead heat (hero)
- *"They finish side by side. Both of them WIN!"* — tone: cheer — highlights: **WIN**
- → spell **WIN** (`isHeroMoment`) → s5

### s5 — the prize (review)
- *"Rosie the PIG pins the shiny pin on Mia."* — tone: warm — highlights: **PIG**
- → spell **PIG** → s6

### s6 — end
- *"One pin, two happy friends."* — tone: warm
- *"Playing together is the real prize!"* — tone: warm

## Media
- **Illustrations:** `pin.s1` (cover), `pin.s2`, `pin.s3a`, `pin.s3b`, `pin.s4`, `pin.s5`,
  `pin.s6`; choice art `choice.fin`, `choice.pin`, `choice.win`, `choice.pig` ✅
- **Audio:** `pin.s1.l1` … `pin.s6.l2`; word clips `word.pin`, `word.win`, `word.fin`
