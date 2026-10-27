# pat — Pat the Cat

Unit 2 · Module 1. Implemented in `src/stories/pat.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** PAT
- **Target words:** HAT · MAT · PAT
- **Review words:** CAT
- **Phonics focus:** short A · `-at` family
- **Moral:** a kind friend makes you cozy — small comforts warm a shy, cold friend.
- **Characters:** Mia, **Waldo** (the cat, cold today)

## Structure
One branch (how to make the cat cozy), reconverging into the hero PAT and a CAT review.

```
s1 → s2 ─choice─┬ HAT → s3a ─┐
                └ MAT → s3b ─┴→ s4 (spell PAT, hero) → s5 (spell CAT, review) → s6 (end)
```

## Scene-by-scene

### s1 — cold cat
- *"Brrr! Waldo the CAT shivers in the cool air."* — tone: soft — highlights: **CAT**
- *"Mia's cat feels shy and cold today."* — tone: gentle
- → continue to s2

### s2 — how to help
- **Choice — "How can Mia make her friend cozy?"**
  - **HAT** → s3a
  - **MAT** → s3b

### s3a — hat
- *"Mia pops a hat on the cat. So big and floppy!"* — tone: giggle
- **Spell HAT** — prompt *"Spell HAT!"* → s4

### s3b — mat
- *"Mia lays down a soft, snug mat to sit on."* — tone: gentle
- **Spell MAT** — prompt *"Spell MAT!"* → s4

### s4 — the pat (hero)
- *"Mia gives a soft, kind PAT. Purr, purr!"* — tone: warm — highlights: **PAT**
- **Spell PAT** ⭐ hero — prompt *"Spell PAT!"* → s5

### s5 — cozy cat (review)
- *"Now the CAT is warm and snug all over."* — highlights: **CAT**
- **Spell CAT** (review) — prompt *"Spell CAT!"* → s6

### s6 — end
- *"Mia made her friend feel cozy."* — tone: warm
- *"A kind friend keeps you snug!"* — tone: soft
- → end

## Media
- **Illustrations:** `pat.s1`–`pat.s6` (`pat.s1` doubles as cover), `pat.s3a`, `pat.s3b`;
  choice art `choice.{hat,mat,pat}`; reused `cat.expression`.
- **Audio:** `pat.<scene>.<line>` + `pat.<scene>.{prompt,spell}`; word clips
  `word.{hat,mat}`; shared spelling bank.
