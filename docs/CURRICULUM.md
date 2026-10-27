# Curriculum — the whole picture

High-level map of what Mia teaches, in what order, and why. This is the human
source-of-truth; the code that implements it lives in `src/curriculum/` and
`src/stories/`. Per-story detail lives in [stories/](stories/) (one doc per unit).

- Word catalog (code): `src/curriculum/words.ts`
- Unit order (code): `src/curriculum/pathways.ts`
- Mastery/decay engine: `src/vocab/tracker.ts` (see the `pathways-srs` memory)

---

## What this app is

A structured **early-reading curriculum**, delivered as short interactive stories.
Not standalone stories — every story exists to introduce and review specific words
on a decodable-phonics-first path. A child reads a story, makes choices, and
**drags letter tiles to spell** the words; spelling accuracy feeds a Leitner SRS that
decides when words are mastered and when to introduce new ones.

**Design principles**
- **Decodable first.** Words are consonant-vowel-consonant (CVC) with short vowels,
  taught one vowel/family at a time, so a child can sound them out.
- **Spiral review.** Each new story reviews a word from an earlier one, so nothing is
  taught once and dropped.
- **Recurring characters + a moral.** Each unit has a small social-emotional moral and
  a returning cast, so the words live inside a world worth caring about.
- **Short, forgiving loops.** Toddlers race ahead; feedback is short, celebration is big.

---

## Phonics progression (Module 1 · "First Sounds")

Short vowels, one at a time, by word family. From `src/curriculum/words.ts`:

| Vowel | Families (words) |
|-------|------------------|
| short **A** | `-at` CAT HAT MAT SAT BAT RAT PAT · `-an` CAN MAN PAN RAN FAN · `-ap` MAP TAP CAP NAP |
| short **I** | `-ig` PIG BIG DIG WIG · `-it` SIT HIT FIT BIT · `-in` PIN WIN FIN · `-ip` TIP ZIP RIP LIP |
| short **O** | `-og` DOG LOG HOG FOG · `-op` HOP TOP MOP POP · `-ot` HOT POT DOT GOT |
| short **E** | `-et` PET NET WET GET · `-en` HEN TEN PEN |
| short **U** | `-ug` BUG HUG RUG · `-un` SUN RUN FUN BUN · `-ut` CUT NUT |

**Sight words** woven in for recognition (mostly decodable; only THE is a true "heart"
word here): THE, A, AND, IS, IN, IT, ON, UP, GO, ME, SEE, MY.

---

## Character roster

| Character | Who | Debuts | Vowel arc |
|-----------|-----|--------|-----------|
| **Mia** | The child hero, present in every story | u1 | — |
| **Waldo** | Orange cat, Mia's first friend | u1 (cat) | short A stories |
| **Ruby** | Hen | u14 (hen) | short E |
| **Rosie** | Pig | u6 (pig) | short I |
| **Biscuit** | Dog | u11 (doglog) | short O |
| **Bea** | Bug | u15 (bug) | short U |

Characters recur across units (e.g. the dog and pig meet in `doglog` and `dogpig`),
which is how the spiral review is motivated in-story.

---

## Module 1 — the 16 units

Each unit = one story. `target` = new words taught; `review` = prior words practiced;
each has a one-line moral. Spiral units are review-heavy re-appearances of a character.

| # | Story | Focus | Target words | Review | Moral | Status |
|---|-------|-------|--------------|--------|-------|--------|
| 1 | [cat](stories/cat.md) | mixed CVC | CAT · SIT · PET · RUN | — | friendship | ✅ built |
| 2 | [pat](stories/pat.md) | short A · -at | HAT · MAT · PAT | CAT | a kind friend makes you cozy | ✅ built |
| 3 | [fan](stories/fan.md) | short A · -an | FAN · CAN · RAN | HAT | helping a friend feels good | ✅ built |
| 4 | [map](stories/map.md) | short A · -ap | MAP · TAP · CAP | CAN | sharing the treasure is the best part | ✅ built |
| 5 | [pat2](stories/pat2.md) | short A · spiral | BAT · RAT · SAT | HAT | welcome a new friend | ✅ built |
| 6 | [pig](stories/pig.md) | short I · -ig | BIG · DIG · PIG | SIT | use what makes you special to help | ✅ built |
| 7 | [pin](stories/pin.md) | short I · -in | PIN · WIN · FIN | PIG | playing together is the real prize | ✅ built |
| 8 | [bit](stories/bit.md) | short I · -it | HIT · FIT · BIT | SIT | there is always room for one more | ✅ built |
| 9 | [pigcat](stories/pigcat.md) | short I · -ip | TIP · ZIP · RIP | PIG | giving a gift feels wonderful | ✅ built |
| 10 | [wig](stories/wig.md) | short I · spiral | WIG · LIP | HAT · ZIP | being silly together is the best | ✅ built |
| 11 | [doglog](stories/doglog.md) | short O · -og/-op | LOG · HOP · DOG | PIG | help a friend be brave | ✅ built |
| 12 | [pot](stories/pot.md) | short O · -ot/-op | POT · TOP · HOT | DOG | share a warm meal | ⬜ unwritten |
| 13 | [dogpig](stories/dogpig.md) | short O · spiral | MOP · POP · DOT | DOG | teamwork makes cleanup fun | ⬜ unwritten |
| 14 | [hen](stories/hen.md) | short E · -et/-en | NET · WET · HEN | DOG | help a friend in trouble | ⬜ unwritten |
| 15 | [bug](stories/bug.md) | short U · -ug/-un | HUG · SUN · BUG | RUN | kindness to the smallest | ⬜ unwritten |
| 16 | [party](stories/party.md) | all vowels · boss | CUT · NUT · FUN | SUN | sharing with everyone you love | ⬜ unwritten |

Vowel order is **A → I → O → E → U** (short E late, since e/i are the easiest pair to
confuse). `pathways.ts`, `words.ts`, and `FRIENDS` all follow it.

---

## Spiral word map — where each word lives

Every target word and the unit that later reviews it. Reading this top-to-bottom is
how you check the spiral holds (a word should be *taught* before it's *reviewed*).

| Word | Introduced (unit) | Reviewed (unit) |
|------|-------------------|-----------------|
| CAT | 1 | 2, 9 |
| SIT | 1 | 6, 8 |
| PET | 1 | — |
| RUN | 1 | 15 |
| HAT | 2 | 3, 5, 10 |
| MAT | 2 | — |
| PAT | 2 | — |
| FAN | 3 | — |
| CAN | 3 | 4 |
| RAN | 3 | — |
| MAP·TAP·CAP | 4 | — |
| BAT·RAT·SAT | 5 | — |
| BIG·DIG | 6 | — |
| PIG | 6 | 7, 9, 11 |
| PIN·WIN·FIN | 7 | — |
| HIT·FIT·BIT | 8 | — |
| TIP·RIP | 9 | — |
| ZIP | 9 | 10 |
| WIG·LIP | 10 | — |
| LOG·HOP | 11 | — |
| DOG | 11 | 12, 13, 14 |
| POT·TOP·HOT | 12 | — |
| MOP·POP·DOT | 13 | — |
| NET·WET·HEN | 14 | — |
| HUG·BUG | 15 | — |
| SUN | 15 | 16 |
| CUT·NUT·FUN | 16 | — |

Every word is now taught before it is reviewed.

---

## ⚠️ Open questions & proposed improvements

Things we agreed to revisit. The curriculum is "keep what exists, but open to
improvements" — these are the specific spots to confirm before we call Module 1 final.

1. ✅ **RESOLVED — Review-before-taught bug.** Unit 6 (`hen`) reviewed **DOG**, which
   wasn't taught until unit 10. Fixed by adopting the canonical vowel order below:
   `hen` is now unit **12** and `doglog` unit **9**, so DOG is taught three units
   before it is reviewed. No word is now reviewed before it is taught.

2. ✅ **RESOLVED — Vowel order mismatch.** Canonical order is now **A → I → O → E → U**
   in all three places (`pathways.ts`, `words.ts`/`PhonicsPhase`, `FRIENDS`). Short E
   sits late because e/i are the easiest pair for a new reader to confuse. As a bonus
   this matches the unit numbers already written in the story file headers.

3. **Unit 1 mixes vowels.** `cat` teaches CAT (a), SIT (i), PET (e), RUN (u) all in
   the first unit — before any single-vowel foundation. It predates the formal
   curriculum. Options: keep it as a gentle "mixed intro," or re-scope it to short-A
   only and relocate SIT/PET/RUN to their vowel units. **Decision needed.**

4. **Non-catalog words in `cat`.** `cat`'s branches spell **WAVE, CALL, TOY** — none
   are CVC or in `words.ts` (WAVE/CALL are long-vowel/double-l; TOY is a vowel team).
   They break "decodable-first." Options: keep as untracked "choice flavor" words
   (not SRS-tracked) and document that clearly, or swap them for decodable choices.

5. ✅ **RESOLVED — Unit-number drift in code comments.** `pig.ts` ("Unit 6") and
   `doglog.ts` ("Unit 9") were right all along; `pathways.ts` was the file that had
   drifted. The reorder above makes every story header match its unit number.

6. **Chapter size.** Each friend should own **5 stories** (see
   [PROGRESSION.md](PROGRESSION.md)). Waldo ✅ and Rosie ✅ are there; Biscuit needs
   +2; Ruby and Bea need new word families (`-ed`/`-eg` for E, `-up`/`-ub`/`-um` for
   U) before they can support 5. **Decision needed for E and U.**

   Short **A** and short **I** are now fully taught: every word in both families in
   `words.ts` appears in a story.

7. **Thin review coverage.** Many words are taught and never reviewed (MAT, PAT, FAN,
   RAN, whole -ap/-in/-ip/-ot/-op families). The SRS engine will still resurface them
   via decay, but the *story* spiral only re-teaches one word per unit. Confirm that's
   intended (SRS carries the rest) or add a second review slot per unit.

---

## Links

- Per-story specs: [stories/](stories/) — full word-for-word scripts for built units.
- Review process: [WORKFLOW.md](WORKFLOW.md)
- Root guide: [../CLAUDE.md](../CLAUDE.md)
