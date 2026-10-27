import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { colors } from '@/src/theme';
import { useVocab } from '@/src/vocab/store';
import { useLearner } from '@/src/learner/store';
import { useTreasures } from '@/src/rewards/store';
import { flushQueue } from '@/src/vocab/sync';
import { runOneShotReset } from '@/src/lib/resetProgress';

SplashScreen.preventAutoHideAsync().catch(() => {});
SystemUI.setBackgroundColorAsync(colors.cream).catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const hydrate = useVocab((s) => s.hydrate);
  const hydrateLearner = useLearner((s) => s.hydrate);
  const hydrateTreasures = useTreasures((s) => s.hydrate);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    (async () => {
      // Wipe persisted progress once per RESET_VERSION before stores hydrate,
      // so this launch starts on a clean slate.
      await runOneShotReset();
      await Promise.all([hydrate(), hydrateLearner(), hydrateTreasures()]);
      interval = setInterval(() => {
        flushQueue().catch(() => {});
      }, 30_000);
      flushQueue().catch(() => {});
    })();
    return () => clearInterval(interval);
  }, [hydrate]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.cream }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.cream },
            animation: 'fade',
            animationDuration: 400,
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
