# doglog — The Dog and the Log

Unit 10 · Module 1. Implemented in `src/stories/doglog.ts`.
(Code comment says "Unit 9" — stale; pathways places it at unit 10. See curriculum open question #5.)
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** DOG
- **Target words:** LOG · HOP · DOG
- **Review words:** PIG
- **Phonics focus:** short O · `-og` / `-op` families
- **Moral:** help a friend be brave — the dog coaxes the shy pig across a log.
- **Characters:** Mia, **Biscuit** (dog, debut), **Rosie** (pig, recurring)

## Structure
One branch (log vs hop), reconverging into DOG (hero) and a PIG review.

```
s1 → s2 ─choice─┬ LOG → s3a ─┐
                └ HOP → s3b ─┴→ s4 (spell DOG, hero) → s5 (spell PIG, review) → s6 (end)
```

## Scene-by-scene

### s1 — the fallen log
- *"A big LOG fell across the path."* — tone: gentle — highlights: **LOG**
- *"The pink PIG is stuck on the far side. Oh no!"* — tone: soft — highlights: **PIG**
- → continue to s2

### s2 — how to help
- **Choice — "How can the dog help the pig be brave?"**
  - **LOG** → s3a
  - **HOP** → s3b

### s3a — log
- *"The dog pats the log. Climb up here!"* — tone: kind
- **Spell LOG** — prompt *"Spell LOG!"* → s4

### s3b — hop
- *"The dog does big goofy hops. Boing! Boing!"* — tone: giggle
- **Spell HOP** — prompt *"Spell HOP!"* → s4

### s4 — the pig crosses (hero)
- *"Up, up... Rosie the pig hops over! Biscuit the DOG cheers!"* — tone: cheer — highlights: **DOG**
- **Spell DOG** ⭐ hero — prompt *"Spell DOG!"* → s5

### s5 — brave pig (review)
- *"The brave PIG did it! Hooray!"* — tone: cheer — highlights: **PIG**
- **Spell PIG** (review) — prompt *"Spell PIG!"* → s6

### s6 — end
- *"The dog helped the pig feel brave."* — tone: warm
- *"A kind friend helps you try!"* — tone: warm
- → end

## Media
- **Illustrations:** `doglog.s1`–`doglog.s6` (`doglog.s1` doubles as cover), `doglog.s3a`, `doglog.s3b`;
  choice art `choice.{log,hop,dog,pig}`.
- **Audio:** `doglog.<scene>.<line>` + `doglog.<scene>.{prompt,spell}`; word clips
  `word.{log,hop}`; shared spelling bank.
