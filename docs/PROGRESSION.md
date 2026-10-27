# Progression — stories, unlocks, and the path

How a child actually moves through Mia today, what gates what, and what the shape
needs to become. Companion to [CURRICULUM.md](CURRICULUM.md) (what is taught) —
this doc is about **order, unlocks, and pacing**.

Code that implements it: `src/world/friends.ts`, `src/world/state.ts`,
`src/world/areas.ts`, `src/learner/store.ts`, `app/index.tsx`, `app/area/[friend].tsx`.

---

## 1. The unlock machine (as built)

Five screens, one rule set:

**Garden** (`app/index.tsx`) → friends laid along a trail in `FRIENDS` array order.
Tapping a friend opens their area, unless locked/asleep.

**Friend area** (`app/area/[friend].tsx`) → one big button. That's the whole menu.

The rules, from `src/world/state.ts`:

| Rule | Code | Effect |
|------|------|--------|
| Wake order | `FRIENDS` array order | waldo(A) → rosie(I) → biscuit(O) → ruby(E) → bea(U) |
| Who counts | `contentFriends = FRIENDS.filter(storyIds.length > 0)` | friends with **zero built stories are skipped entirely** (`comingSoon`) |
| Who's current | first contentFriend where `!allDone` | `allDone` = every `storyIds` entry in `learner.completed` |
| Who's locked | after `current` **and** not yet finished | a finished friend never re-locks |
| Who glows | first `wantsPlay`, else first `ready` | the "one next thing" |
| Story done | `markComplete(storyId)` on reaching the end | **reading is the only unlock currency** — word mastery gates nothing |

**Two different definitions of "done" coexist:**
- `allDone()` (`state.ts:34`) — stories read. This is what unlocks the next friend.
- `areaProgress.complete` (`areas.ts:57`) — stories read **AND** every word bloomed
  (`state === 'longTerm'`, which needs box 5 + ≥1 clean spell). This drives the 5 stars
  and "All done! 🌟" only.

A child can unlock the entire world without mastering a single word.

---

## 2. The path that actually ships today

5 of 14 units are built. Ruby and Bea have **no** built stories, so they're filtered
out of `contentFriends` and skipped. The real playable path:

```
Waldo (cat → pat → fan → map → pat2)  →  Rosie (pig → pin → bit → pigcat → wig)  →  Biscuit (doglog)
   5 stories (complete chapter)              5 stories (complete chapter)              1 story
```

That's the whole game: **11 stories**. Ruby (short E) and Bea (short U) render as
"sleeping 💤" and are unreachable.

Two authored stories are **orphans**: `src/stories/dog.ts` and `src/stories/roar.ts`
are in the registry but in no `storyOrder` and no friend's `storyIds`, so they are
unreachable in-app.

---

## 3. Why the flashcards feel premature

It's one line — `app/area/[friend].tsx:68-77`:

```js
const unread = f.storyIds.find((id) => !completed.includes(id));
// button label: unread ? 'Read a story' : 'Play a game'
```

The friend screen offers exactly one action, and **review is its terminal state**.
Since Rosie and Biscuit have one built story each, their button flips to flashcards
after a single story. `/review` is reachable from nowhere else in the app.

Three consequences:

1. **Review arrives as "you're finished", not "want to practise?"** It reads like the
   end of content, because it is.
2. **The deck is tiny.** `buildReviewNode` draws from due words; after one story that's
   3–4 words with 2 distractors from the same tiny pool, so cards repeat immediately.
3. **You cannot re-read a story.** Once all of a friend's stories are complete, the
   area offers *only* review. There is no story picker anywhere.

---

## 4. Chapter sizes — planned vs the 5+ target

Grouping the 14 planned units by friend:

| Friend | Vowel | Planned units | Count | Built | To reach 5 |
|--------|-------|---------------|-------|-------|-----------|
| **Waldo** (cat) | A | cat, pat, fan, map, pat2 | 5 | **5** | ✅ chapter complete |
| **Ruby** (hen) | E | hen | 1 | 0 | **+4** |
| **Rosie** (pig) | I | pig, pin, bit, pigcat, wig | 5 | **5** | ✅ chapter complete |
| **Biscuit** (dog) | O | doglog, pot, dogpig | 3 | 1 | **+2** |
| **Bea** (bug) | U | bug, party* | 2 | 0 | **+3** |

\* `party` is an all-cast finale, not really a Bea story. Treating it as a shared
Module 1 boss makes Bea +4.

**Target shape: 5 friends × 5 stories + 1 finale = 26 units.** 11 built, ~15 to write.

### The constraint: word supply per vowel

From `src/curriculum/words.ts`:

| Vowel | Families in catalog | Words | Enough for 5 stories? |
|-------|--------------------|-------|----------------------|
| A | -at, -an, -ap | 16 | ✅ yes |
| I | -ig, -it, -in, -ip | 15 | ✅ yes |
| O | -og, -op, -ot | 12 | ⚠️ tight — only HOG, FOG, GOT unassigned after the 3 planned units |
| E | -et, -en | 7 | ❌ **no** — 6 new words (PET is taught in unit 1) |
| U | -ug, -un, -ut | 9 | ❌ **no** — 8 new words (RUN is taught in unit 1) |

To give Ruby and Bea real chapters the catalog needs new families. Standard-sequence
candidates that stay CVC and short-vowel:

- **short E:** `-ed` (BED, RED, FED, LED), `-eg` (LEG, BEG, PEG) → +7, total 13
- **short U:** `-up` (CUP, PUP), `-ub` (TUB, RUB, CUB), `-um` (GUM, HUM) → +7, total 16
- **short O** (if the 5th story needs new words): `-ox` (BOX, FOX), `-ob` (JOB, ROB) → +4

**This is a curriculum decision, not a code one** — it widens Module 1's scope.

---

## 5. Hazards to fix before writing 21 stories

**① Shipping Ruby's first story will LOCK friends the child already finished.**
This is a live bug in `state.ts:51-56`. `beforeCurrent` is decided by array *index*,
not by whether the friend is finished. Walk it through with a child who has completed
everything today:

```
contentFriends (once hen exists) = [waldo(0), ruby(1), rosie(2), biscuit(3)]
current = first !allDone = ruby (index 1)
rosie:   indexOf(2) < indexOf(1)? no  → status 'locked'   ← already completed!
biscuit: indexOf(3) < indexOf(1)? no  → status 'locked'   ← already completed!
```

Rosie and Biscuit go back to sleep and their words become unreachable for review.
Fix: any friend with `allDone` should be `home`/`wantsPlay` regardless of position.

**② ✅ FIXED — Vowel order is now canonical A→I→O→E→U** in `pathways.ts`,
`words.ts`, and `FRIENDS`. Ruby moves from 2nd to 4th on the trail, which is also
where the shipped order already had her by accident. Story-file unit comments
(`pig.ts` "Unit 6", `doglog.ts` "Unit 9") now match their real unit numbers.

**③ ✅ FIXED — `hen` reviews DOG before DOG is taught.** Resolved by ②: `hen` is unit
12, `doglog` is unit 9. Every word in the spiral is now taught before it is reviewed.

**④ Orphan stories.** `src/stories/dog.ts` and `roar.ts` use the legacy passive
`spellOut` end action (superseded by `spellInteractive`) and sit in no `storyOrder`
and no friend's `storyIds`. Treat them as retired: they stay in the registry only so
the legacy `spellOut` type keeps a reference implementation. Delete when that type goes.

---

## 6. Proposed progression

### Story-first, review-optional

**Friend area gets a real menu** instead of one mode-switching button:

```
┌─────────────────────────────┐
│      Mia + Waldo            │
│      ★★★☆☆                  │
│      ●●●○○   (5 story dots) │
│                             │
│   ╭───────────────────────╮ │
│   │    Read a story  ▸    │ │  ← primary, always present
│   ╰───────────────────────╯ │     (picker once >1 story is read)
│                             │
│   ╭───────────────────────╮ │
│   │   Play a game  🎴     │ │  ← secondary, only when
│   ╰───────────────────────╯ │     storiesDone ≥ 2 AND dueWords > 0
└─────────────────────────────┘
```

- **Primary is always the story.** Until all 5 are read it launches the next unread
  one; after that it opens a picker of that friend's stories so any can be re-read.
- **Review is a visible, optional side door.** Gate it on `storiesDone >= 2` (so the
  deck has ≥6 words) and `dueWords.length > 0` (so it's never an empty visit).
  It never blocks progression and never replaces the story button.
- **Keep story-reading as the unlock currency.** The storyline is the spine; word
  mastery drives the garden (flowers, stars), not the gate.

### Unlock rule with 5-story chapters

Next friend wakes when the current friend's **5 stories are all read**. Optionally
soften to 4 of 5 so one stubborn story can't wall a child off — worth deciding, but
"finish the chapter" is the cleaner story.

### Suggested chapter arcs

| Friend | # | Story | Family | New words |
|--------|---|-------|--------|-----------|
| **Waldo** A | 1 | cat ✅ | mixed | CAT SIT PET RUN |
| | 2 | pat ✅ | -at | HAT MAT PAT |
| | 3 | fan ✅ | -an | FAN CAN RAN |
| | 4 | map ⬜ | -ap | MAP TAP CAP |
| | 5 | pat2 ⬜ | -at spiral | BAT RAT SAT |
| **Rosie** I | 1 | pig ✅ | -ig | BIG DIG PIG |
| | 2 | pin ✅ | -in | PIN WIN FIN |
| | 3 | bit ✅ | -it | HIT FIT BIT (reviews SIT) |
| | 4 | pigcat ✅ | -ip | TIP ZIP RIP |
| | 5 | wig ✅ | spiral | WIG LIP (reviews HAT, ZIP) |
| **Biscuit** O | 1 | doglog ✅ | -og/-op | LOG HOP DOG |
| | 2 | pot ⬜ | -ot | POT TOP HOT |
| | 3 | *new* | -og/-ot | HOG FOG GOT |
| | 4 | dogpig ⬜ | -op spiral | MOP POP DOT |
| | 5 | *new* | short-O spiral | needs -ox/-ob, or pure review |
| **Ruby** E | 1–5 | hen ⬜ + 4 *new* | -et, -en, **-ed**, **-eg** | needs catalog expansion |
| **Bea** U | 1–5 | bug ⬜ + 4 *new* | -ug, -un, -ut, **-up**, **-ub** | needs catalog expansion |
| **Finale** | — | party ⬜ | all vowels | CUT NUT FUN |

**Build order:** Waldo ✅ and Rosie ✅ are done, and hazard ① is fixed, so Ruby can
ship safely whenever her words are decided. Biscuit is next and needs no decisions:
`pot` and `dogpig` are specced, plus 2 new short-O units (only HOG, FOG, GOT are
unassigned, so the 5th needs `-ox`/`-ob` or is a pure review spiral).

---

## 7. Decisions needed

1. **Canonical vowel order** — A→I→O→E→U (recommended) or A→E→I→O→U? All three files
   must agree, and it determines where Ruby inserts.
2. **Expand the word catalog** for short E (`-ed`, `-eg`) and short U (`-up`, `-ub`,
   `-um`)? Without this, Ruby and Bea cannot have 5-story chapters.
3. **Is 26 units the Module 1 scope**, or does 5-per-friend mean splitting into
   Module 1 (A, I, O) and Module 2 (E, U + finale)?
4. **Review gate** — `storiesDone >= 2` the right threshold, or per-friend once the
   chapter is done?
5. **Unlock threshold** — all 5 stories, or 4 of 5?
6. **Orphans** — fold `dog`/`roar` into Biscuit, or delete?
7. **`hen` reviews DOG** — swap the review word, or move DOG earlier?

---

## Links

- What is taught: [CURRICULUM.md](CURRICULUM.md)
- Review/approval loop: [WORKFLOW.md](WORKFLOW.md)
- Per-story specs: [stories/](stories/)
