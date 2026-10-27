import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TREASURES } from './treasures';

const KEY = '@mia/treasures/v1';

// The basket of treasures the child has earned. One is awarded per finished
// activity (story or review). New ones come first; once every kind is found we
// cycle so there is always something to collect.
type TreasureState = {
  found: string[];
  loaded: boolean;
  hydrate: () => Promise<void>;
  award: () => string; // returns the treasure id granted (for the reveal)
  has: (id: string) => boolean;
};

const persist = (found: string[]) => {
  AsyncStorage.setItem(KEY, JSON.stringify(found)).catch(() => {});
};

export const useTreasures = create<TreasureState>((set, get) => ({
  found: [],
  loaded: false,
  hydrate: async () => {
    if (get().loaded) return;
    try {
      const raw = await AsyncStorage.getItem(KEY);
      set({ found: raw ? (JSON.parse(raw) as string[]) : [], loaded: true });
    } catch {
      set({ found: [], loaded: true });
    }
  },
  award: () => {
    const found = get().found;
    // Prefer a treasure not yet collected; otherwise cycle deterministically.
    const next = TREASURES.find((t) => !found.includes(t.id));
    const id = next ? next.id : TREASURES[found.length % TREASURES.length]!.id;
    if (!found.includes(id)) {
      const updated = [...found, id];
      set({ found: updated });
      persist(updated);
    }
    return id;
  },
  has: (id: string) => get().found.includes(id),
}));
