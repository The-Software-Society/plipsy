# fan — Fan the Cat

Unit 3 · Module 1. Implemented in `src/stories/fan.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** FAN
- **Target words:** FAN · CAN · RAN
- **Review words:** HAT
- **Phonics focus:** short A · `-an` family
- **Moral:** helping a friend feels good — cooling off a hot friend.
- **Characters:** Mia, **Waldo** (the cat, too hot to play)

## Structure
One branch (how to cool the cat), reconverging into RAN (hero) and a HAT review.

```
s1 → s2 ─choice─┬ FAN → s3a ─┐
                └ CAN → s3b ─┴→ s4 (spell RAN, hero) → s5 (spell HAT, review) → s6 (end)
```

Note: the story title/hero-word is FAN, but the **`isHeroMoment` reveal is RAN** (the
payoff of the cat running off happy). FAN is the first choice word. Worth confirming we
want the hero spell to be RAN rather than FAN.

## Scene-by-scene

### s1 — hot day
- *"Phew! It is a hot day."* — tone: playful
- *"Waldo the CAT flops down flat. Too hot to play!"* — tone: giggle — highlights: **CAT**
- → continue to s2

### s2 — how to help
- **Choice — "How can Mia help her hot friend?"**
  - **FAN** → s3a
  - **CAN** → s3b

### s3a — fan
- *"Mia flaps a big fan. Whoosh, whoosh!"* — tone: fun
- **Spell FAN** — prompt *"Spell FAN!"* → s4

### s3b — can
- *"Mia brings a cool can of water."* — tone: gentle
- **Spell CAN** — prompt *"Spell CAN!"* → s4

### s4 — the cat runs (hero)
- *"Ahhh, much better! The happy cat RAN!"* — tone: cheer — highlights: **RAN**
- **Spell RAN** ⭐ hero — prompt *"Spell RAN!"* → s5

### s5 — hat and play (review)
- *"Now the cat can wear its HAT and play."* — highlights: **HAT**
- **Spell HAT** (review) — prompt *"Spell HAT!"* → s6

### s6 — end
- *"Mia helped her friend."* — tone: warm
- *"It feels good to help!"* — tone: warm
- → end

## Media
- **Illustrations:** `fan.s1`–`fan.s6` (`fan.s1` doubles as cover), `fan.s3a`, `fan.s3b`;
  choice art `choice.{fan,can,ran,hat}`.
- **Audio:** `fan.<scene>.<line>` + `fan.<scene>.{prompt,spell}`; word clips
  `word.{fan,can}`; shared spelling bank.
