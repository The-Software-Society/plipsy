import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  VocabEntry,
  applyRep,
  countsByState,
  dueWords,
  expose,
  introduce,
  isMastered,
  wordsByStatus,
} from './tracker';
import { syncVocabEntry } from './sync';

const STORAGE_KEY = '@mia/vocab/v1';

type VocabState = {
  entries: Record<string, VocabEntry>;
  loaded: boolean;

  hydrate: () => Promise<void>;
  recordIntroduction: (word: string) => Promise<VocabEntry>;
  recordExposure: (word: string) => Promise<VocabEntry | null>;
  // SRS: record a spelling result (errors = wrong drops during the spell).
  recordSpellResult: (word: string, errors: number) => Promise<VocabEntry>;
  // SRS: record any activity rep (recognition or spell). isSpell gates long-term.
  recordRep: (word: string, errors: number, isSpell?: boolean) => Promise<VocabEntry>;
  dueCount: () => number;
  byState: () => ReturnType<typeof countsByState>;
  isMastered: (word: string) => boolean;
  byStatus: () => ReturnType<typeof wordsByStatus>;
};

const persist = async (entries: Record<string, VocabEntry>) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* noop */
  }
};

export const useVocab = create<VocabState>((set, get) => ({
  entries: {},
  loaded: false,

  hydrate: async () => {
    if (get().loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const entries = raw ? (JSON.parse(raw) as Record<string, VocabEntry>) : {};
      set({ entries, loaded: true });
    } catch {
      set({ entries: {}, loaded: true });
    }
  },

  recordIntroduction: async (word: string) => {
    const entries = { ...get().entries };
    const next = introduce(entries, word);
    entries[next.word] = next;
    set({ entries });
    await persist(entries);
    syncVocabEntry(next);
    return next;
  },

  recordExposure: async (word: string) => {
    const entries = { ...get().entries };
    const next = expose(entries, word);
    if (!next) return null;
    entries[next.word] = next;
    set({ entries });
    await persist(entries);
    syncVocabEntry(next);
    return next;
  },

  recordRep: async (word: string, errors: number, isSpell = false) => {
    const entries = { ...get().entries };
    const next = applyRep(entries, word, errors, isSpell);
    entries[next.word] = next;
    set({ entries });
    await persist(entries);
    syncVocabEntry(next);
    return next;
  },

  // A spell completion is a production rep.
  recordSpellResult: async (word: string, errors: number) => get().recordRep(word, errors, true),

  dueCount: () => dueWords(get().entries).length,

  byState: () => countsByState(get().entries),

  isMastered: (word: string) => isMastered(get().entries, word),

  byStatus: () => wordsByStatus(get().entries),
}));
