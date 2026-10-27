# party — Mia's Big Day

Unit 16 · Module 1 · **boss story**. Implemented in `src/stories/party.ts`.
[← Curriculum](../CURRICULUM.md) · [Story specs](README.md)

## At a glance
- **Hero word:** FUN
- **Target words:** CUT · NUT · FUN
- **Review words:** SUN
- **Phonics focus:** all vowels · the closing celebration of Module 1
- **Moral:** sharing with everyone you love — every friend from the module is at the table.
- **Characters:** Mia + **all five friends** (Waldo, Rosie, Biscuit, Ruby, Bea)

## Structure
One branch (cut vs nut), reconverging into FUN (hero) and a SUN review.

```
s1 → s2 ─choice─┬ CUT → s3a ─┐
                └ NUT → s3b ─┴→ s4 (spell FUN, hero) → s5 (spell SUN, review) → s6 (end)
```

## Scene-by-scene

### s1 — everyone arrives
- *"It is the big day! Every friend came to the garden."* — tone: excited
- *"Waldo, Rosie, Biscuit, Ruby and Bea are all here!"* — tone: cheer
- → continue to s2

### s2 — getting ready
- **Choice — "How do we get the party ready?"**
  - **CUT** → s3a
  - **NUT** → s3b

### s3a — the cake
- *"Mia cuts the cake into five neat slices."* — tone: kind
- **Spell CUT** — prompt *"Spell CUT!"* → s4

### s3b — the nuts
- *"Ruby tips a bowl of nuts onto the table."* — tone: playful
- **Spell NUT** — prompt *"Spell NUT!"* → s4

### s4 — everyone plays (hero)
- *"Everyone plays together. What FUN!"* — tone: cheer — highlights: **FUN**
- **Spell FUN** ⭐ hero — prompt *"Spell FUN!"* → s5

### s5 — sundown (review)
- *"The SUN goes down on a happy day."* — tone: warm — highlights: **SUN**
- **Spell SUN** (review) — prompt *"Spell SUN!"* → s6

### s6 — end
- *"Mia shared her big day with everyone she loves."* — tone: warm
- *"The best day is a day you share!"* — tone: warm
- → end

## Note on placement
`party` is a boss story belonging to no single friend, so it is **not** in any entry of
`FRIENDS` in `src/world/friends.ts`. Confirm how it is meant to be reached from the
overworld map (a shared spot? unlocked when every friend is finished?). **Decision needed.**

## Media
- **Illustrations:** `party.s1`–`party.s6` (`party.s1` doubles as cover), `party.s3a`, `party.s3b`;
  choice art `choice.{cut,nut,fun,sun}` (all four new; `choice.sun` is shared with `bug`).
- **Audio:** `party.<scene>.<line>` + `party.<scene>.{prompt,spell}`; word clips
  `word.{cut,nut,fun,sun}` (new, `word.sun` shared with `bug`); shared spelling bank.
