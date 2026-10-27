import AsyncStorage from '@react-native-async-storage/async-storage';

// One-shot progress wipe. On launch we compare a stored sentinel against
// RESET_VERSION; if they differ, all persisted app state (vocab/SRS, completed
// stories, treasures, sync queue, profile, world) is cleared exactly once, then
// the sentinel is stamped so subsequent launches keep whatever progress is made.
//
// To force a fresh start again (e.g. for another round of device testing), bump
// RESET_VERSION to any new value.
export const RESET_VERSION = '2026-07-16-fresh-test';

const SENTINEL_KEY = '@mia/reset-version';

export const runOneShotReset = async (): Promise<boolean> => {
  try {
    const current = await AsyncStorage.getItem(SENTINEL_KEY);
    if (current === RESET_VERSION) return false;
    await AsyncStorage.clear();
    await AsyncStorage.setItem(SENTINEL_KEY, RESET_VERSION);
    return true;
  } catch {
    // If the wipe fails, leave the sentinel unset so it retries next launch.
    return false;
  }
};
