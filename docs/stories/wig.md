# wig — The Dress Up Show

Unit 10 · Module 1 · **spiral**. Implemented in `src/stories/wig.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** WIG
- **Target words:** WIG · LIP
- **Review words:** HAT · ZIP
- **Phonics focus:** short I · spiral (closes the short-I arc)
- **Moral:** being silly together is the best.
- **Characters:** Mia, **Rosie** (pig)

## Structure
Review-heavy by design, like every spiral unit: only two new words, and the branch is
made entirely of words the child already knows. HAT reaches back to Waldo's chapter,
which is the first time the spiral crosses characters.

```
s1 → s2 ─choice─┬ HAT → s3a ─┐
                └ ZIP → s3b ─┴→ s4 (spell WIG, hero) → s5 (spell LIP) → s6 (end)
```

WIG and LIP are the last two unused short-I words in `words.ts`; with this unit the
short-I catalog is fully taught.

## Scene-by-scene

### s1 — the dress up box
- *"Mia tips out the dress up box in the garden."* — tone: cheer
- *"Rosie the PIG wants to be in the show!"* — tone: giggle — highlights: **PIG**
- → continue to s2

### s2 — what to put on
- Prompt: *"What should Rosie put on?"*
- Options: **HAT** (`choice.hat`) → s3a · **ZIP** (`choice.zip`) → s3b

### s3a — the floppy hat (review)
- *"A floppy hat slides down over one eye. Ha!"* — tone: giggle
- → spell **HAT** → s4

### s3b — the stripy coat (review)
- *"A stripy coat goes on and Mia does up the zip."* — tone: giggle
- → spell **ZIP** → s4

### s4 — the wig (hero)
- *"Last of all, a curly yellow WIG. Rosie twirls!"* — tone: cheer — highlights: **WIG**
- → spell **WIG** (`isHeroMoment`) → s5

### s5 — the picnic
- *"After the show, a picnic. Rosie licks her LIP. Yum!"* — tone: fun — highlights: **LIP**
- → spell **LIP** → s6

### s6 — end
- *"A pig in a wig and a girl in a hat."* — tone: giggle
- *"Being silly together is the best!"* — tone: warm

## Media
- **Illustrations:** `wig.s1` (cover), `wig.s2`, `wig.s3a`, `wig.s3b`, `wig.s4`, `wig.s5`,
  `wig.s6`; choice art `choice.wig`, `choice.lip`, `choice.hat` ✅, `choice.zip`
- **Audio:** `wig.s1.l1` … `wig.s6.l2`; word clips `word.wig`, `word.lip`
