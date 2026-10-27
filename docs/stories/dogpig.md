# dogpig — The Dog and the Pig

Unit 13 · Module 1 · **spiral**. Implemented in `src/stories/dogpig.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** DOT — *see the open question below; the title names the characters, not the hero word.*
- **Target words:** MOP · POP · DOT
- **Review words:** DOG
- **Phonics focus:** short O · spiral (review-heavy close of short O)
- **Moral:** teamwork makes cleanup fun — the muddy floor gets cleared by everyone at once.
- **Characters:** Mia, **Biscuit** (dog), **Rosie** (pig) together

## Open question
The stub left the hero word as "TBD". This implementation uses **DOT**, because the
branch structure needs the two other targets (MOP, POP) in the branches and DOG is
already the review word. That leaves the title, *The Dog and the Pig*, naming neither
the hero nor a target. Options: rename the story to something `-ot`-flavoured, or move
DOT into a branch and promote MOP to hero. **Decision needed.**

## Structure
One branch (mop vs pop), reconverging into DOT (hero) and a DOG review.

```
s1 → s2 ─choice─┬ MOP → s3a ─┐
                └ POP → s3b ─┴→ s4 (spell DOT, hero) → s5 (spell DOG, review) → s6 (end)
```

## Scene-by-scene

### s1 — muddy trotters
- *"Rosie the pig ran inside from the mud."* — tone: playful
- *"Look! One muddy DOT, then two, then ten!"* — tone: excited — highlights: **DOT**
- → continue to s2

### s2 — how to clean up
- **Choice — "How can we clean it up together?"**
  - **MOP** → s3a
  - **POP** → s3b

### s3a — the mop
- *"Biscuit pushes the mop back and forth."* — tone: kind
- **Spell MOP** — prompt *"Spell MOP!"* → s4

### s3b — the bubbles
- *"Rosie pops the soap bubbles. Pop! Pop!"* — tone: giggle
- **Spell POP** — prompt *"Spell POP!"* → s4

### s4 — the last spot (hero)
- *"Just one little DOT of mud is left!"* — tone: excited — highlights: **DOT**
- **Spell DOT** ⭐ hero — prompt *"Spell DOT!"* → s5

### s5 — the final wipe (review)
- *"The DOG gives the floor one last wipe."* — tone: cheer — highlights: **DOG**
- **Spell DOG** (review) — prompt *"Spell DOG!"* → s6

### s6 — end
- *"The dog and the pig cleaned it all up."* — tone: warm
- *"Work is fun when we do it together!"* — tone: warm
- → end

## Media
- **Illustrations:** `dogpig.s1`–`dogpig.s6` (`dogpig.s1` doubles as cover), `dogpig.s3a`, `dogpig.s3b`;
  choice art `choice.{mop,pop,dot,dog}` (`choice.mop`, `choice.pop`, `choice.dot` are new).
- **Audio:** `dogpig.<scene>.<line>` + `dogpig.<scene>.{prompt,spell}`; word clips
  `word.{mop,pop,dot}` (new), `word.dog` (exists); shared spelling bank.
