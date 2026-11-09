# Roadmap

Planned work, roughly in priority order. Estimates are focused engineering hours and
assume the current architecture. Total: about 68 hours.

## 1. Tests and CI (about 10 h)

- [ ] Add Jest (`jest-expo` preset) and React Native Testing Library. (1.5 h)
- [ ] Unit tests for the SRS engine: `src/vocab/tracker.ts` box promotion, lapses,
      clean-run counting, `nextReviewAt` scheduling, and `src/srs/select.ts`. (3 h)
- [ ] Unit tests for `src/world/state.ts` unlock rules (friends wake in vowel order,
      finished friends never re-lock). (1.5 h)
- [ ] Move `scripts/validate-stories.ts` into the test suite so every story's branches,
      highlight spans and spell counts are checked on each PR. (1 h)
- [ ] Component test for `SpellInteractive`: correct, incorrect and repeated drops. (2 h)
- [ ] GitHub Actions: `npm ci`, `tsc --noEmit`, tests, story validation. (1 h)

## 2. Media gaps (about 6 h, plus generation quota)

- [ ] Storyboard review, then illustrations and narration for `pot`, `dogpig`, `hen`,
      `bug` and `party`. (4 h)
- [ ] A manifest check that lists every audio and illustration key a story references
      but that has no file, so gaps are visible in CI instead of at runtime. (2 h)

## 3. Accessibility (about 10 h)

- [ ] `accessibilityLabel`/`accessibilityRole` on every tappable (story tiles, choices,
      letter tiles, friends on the map) and a screen-reader pass on iOS VoiceOver and
      Android TalkBack. (3 h)
- [ ] Keyboard and switch-access alternative to drag for `SpellInteractive`: tap a tile,
      then tap a slot. (3 h)
- [ ] Respect Reduce Motion (Reanimated `useReducedMotion`) for bobbing sprites and
      transitions. (1 h)
- [ ] Dynamic type support in the parent screens; contrast audit of the muted palette
      against WCAG AA for all text. (2 h)
- [ ] Optional captions toggle that keeps story text visible for hearing-impaired
      adults reading along. (1 h)

## 4. Parent controls (about 10 h)

- [ ] Set and change the PIN in the app (stored hashed on device) instead of only via
      `EXPO_PUBLIC_PARENT_PIN`. (2 h)
- [ ] Daily time window and a gentle "time to rest" ending instead of a hard stop. (3 h)
- [ ] Reset progress and export progress (JSON share sheet) from the dashboard. (2 h)
- [ ] Choose narration speed (slower / normal) and letter-sound vs letter-name
      emphasis. (2 h)
- [ ] Dashboard per-word history: when introduced, review outcomes, current box. (1 h)

## 5. Offline-first and data (about 9 h)

- [ ] Multiple on-device learner profiles (siblings), still anonymous: a chosen animal
      and color, no names. (4 h)
- [ ] Replace the one-shot `RESET_VERSION` wipe with versioned migrations of persisted
      stores so updates never lose progress. (2 h)
- [ ] For opt-in sync: Supabase Row Level Security with anonymous auth so a device can
      only read and write its own rows; document the threat model. (3 h)

## 6. More stories and curriculum (about 16 h)

- [ ] Finish Ruby (short E) and Bea (short U) chapters to five stories each: new word
      families per `docs/PROGRESSION.md`. (8 h writing and review)
- [ ] Module 2: consonant digraphs (SH, CH, TH) with a new friend. (6 h)
- [ ] A short "read it myself" mode with narration off and tap-to-hear per word. (2 h)

## 7. Platform and release (about 7 h)

- [ ] EAS build profiles for iPad and Android tablets; real app icon and splash. (3 h)
- [ ] Web build polish (pointer drag, layout at desktop widths) for classroom use. (2 h)
- [ ] Privacy policy and kids-category store listing notes (no tracking SDKs, no ads,
      no data collection by default). (2 h)
