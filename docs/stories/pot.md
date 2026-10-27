# pot — Hot Pot

Unit 12 · Module 1. Implemented in `src/stories/pot.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** POT
- **Target words:** POT · TOP · HOT
- **Review words:** DOG
- **Phonics focus:** short O · `-ot` / `-op` families
- **Moral:** share a warm meal — Mia ladles her soup into two bowls, one for Biscuit.
- **Characters:** Mia, **Biscuit** (dog, recurring)

## Structure
One branch (top vs hot), reconverging into POT (hero) and a DOG review.

```
s1 → s2 ─choice─┬ TOP → s3a ─┐
                └ HOT → s3b ─┴→ s4 (spell POT, hero) → s5 (spell DOG, review) → s6 (end)
```

## Scene-by-scene

### s1 — soup on the stove
- *"Mia stirs a big POT of soup."* — tone: gentle — highlights: **POT**
- *"Biscuit the DOG comes in from the cold rain."* — tone: soft — highlights: **DOG**
- → continue to s2

### s2 — keeping it warm
- **Choice — "How can we keep the soup warm?"**
  - **TOP** → s3a
  - **HOT** → s3b

### s3a — the lid
- *"Mia sets the top on the pot. Snug and cozy!"* — tone: kind
- **Spell TOP** — prompt *"Spell TOP!"* → s4

### s3b — the bubbling pot
- *"The soup bubbles and steams. It is so hot!"* — tone: excited
- **Spell HOT** — prompt *"Spell HOT!"* → s4

### s4 — two bowls (hero)
- *"Mia fills two warm bowls from the POT."* — tone: warm — highlights: **POT**
- **Spell POT** ⭐ hero — prompt *"Spell POT!"* → s5

### s5 — the dog eats (review)
- *"The DOG laps up his warm soup. Slurp!"* — tone: playful — highlights: **DOG**
- **Spell DOG** (review) — prompt *"Spell DOG!"* → s6

### s6 — end
- *"Mia and Biscuit shared the warm soup."* — tone: warm
- *"A meal is best when you share it!"* — tone: warm
- → end

## Media
- **Illustrations:** `pot.s1`–`pot.s6` (`pot.s1` doubles as cover), `pot.s3a`, `pot.s3b`;
  choice art `choice.{top,hot,pot,dog}` (`choice.top`, `choice.hot`, `choice.pot` are new).
- **Audio:** `pot.<scene>.<line>` + `pot.<scene>.{prompt,spell}`; word clips
  `word.{top,hot,pot}` (new), `word.dog` (exists); shared spelling bank.
