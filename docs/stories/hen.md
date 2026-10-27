# hen — The Wet Hen

Unit 14 · Module 1. Implemented in `src/stories/hen.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** HEN
- **Target words:** NET · WET · HEN
- **Review words:** DOG
- **Phonics focus:** short E · `-et` / `-en` families
- **Moral:** help a friend in trouble — Ruby is stuck in the pond and gets pulled out.
- **Characters:** Mia, **Ruby** (hen, debut), **Biscuit** (dog, recurring)

## Structure
One branch (net vs wet), reconverging into HEN (hero) and a DOG review.
Both branches are ways of helping, so neither reads as the "wrong" choice.

```
s1 → s2 ─choice─┬ NET → s3a ─┐
                └ WET → s3b ─┴→ s4 (spell HEN, hero) → s5 (spell DOG, review) → s6 (end)
```

## Scene-by-scene

### s1 — into the pond
- *"Rain, rain! Ruby the HEN slips into the pond."* — tone: soft — highlights: **HEN**
- *"She is cold and very WET. Oh no!"* — tone: soft — highlights: **WET**
- → continue to s2

### s2 — how to help
- **Choice — "How can we help Ruby get out?"**
  - **NET** → s3a
  - **WET** → s3b

### s3a — the net
- *"Mia dips the long net into the pond."* — tone: kind
- **Spell NET** — prompt *"Spell NET!"* → s4

### s3b — wading in
- *"Biscuit wades right in and gets wet too!"* — tone: giggle
- **Spell WET** — prompt *"Spell WET!"* → s4

### s4 — safe on the grass (hero)
- *"Safe! Ruby the HEN shakes out her feathers."* — tone: relieved — highlights: **HEN**
- **Spell HEN** ⭐ hero — prompt *"Spell HEN!"* → s5

### s5 — the dog shakes (review)
- *"The DOG shakes his fur too. Splash!"* — tone: playful — highlights: **DOG**
- **Spell DOG** (review) — prompt *"Spell DOG!"* → s6

### s6 — end
- *"Mia and Biscuit helped Ruby get warm and dry."* — tone: warm
- *"A friend in trouble needs you!"* — tone: warm
- → end

## Media
- **Illustrations:** `hen.s1`–`hen.s6` (`hen.s1` doubles as cover), `hen.s3a`, `hen.s3b`;
  choice art `choice.{net,wet,hen,dog}` (`choice.net`, `choice.wet`, `choice.hen` are new).
- **Audio:** `hen.<scene>.<line>` + `hen.<scene>.{prompt,spell}`; word clips
  `word.{net,wet,hen}` (new), `word.dog` (exists); shared spelling bank.
