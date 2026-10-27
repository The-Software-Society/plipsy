import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@mia/learner/v1';

// Remembers which stories Mia has finished (drives the world growing).
type LearnerState = {
  completed: string[];
  loaded: boolean;
  hydrate: () => Promise<void>;
  markComplete: (storyId: string) => Promise<void>;
  isComplete: (storyId: string) => boolean;
};

export const useLearner = create<LearnerState>((set, get) => ({
  completed: [],
  loaded: false,
  hydrate: async () => {
    if (get().loaded) return;
    try {
      const raw = await AsyncStorage.getItem(KEY);
      set({ completed: raw ? (JSON.parse(raw) as string[]) : [], loaded: true });
    } catch {
      set({ completed: [], loaded: true });
    }
  },
  markComplete: async (storyId: string) => {
    if (get().completed.includes(storyId)) return;
    const completed = [...get().completed, storyId];
    set({ completed });
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(completed));
    } catch {
      /* noop */
    }
  },
  isComplete: (storyId: string) => get().completed.includes(storyId),
}));
