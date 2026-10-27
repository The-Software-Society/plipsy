import { create } from 'zustand';

type ParentLockState = {
  unlocked: boolean;
  unlock: () => void;
  lock: () => void;
};

export const useParentLock = create<ParentLockState>((set) => ({
  unlocked: false,
  unlock: () => set({ unlocked: true }),
  lock: () => set({ unlocked: false }),
}));
