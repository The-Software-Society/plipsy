import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { env } from '@/src/lib/env';
import { useParentLock } from '@/src/lib/parentLock';
import { type, colors, spacing, radius } from '@/src/theme';

export default function ParentLayout() {
  const unlocked = useParentLock((s) => s.unlocked);
  const unlock = useParentLock((s) => s.unlock);
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (unlocked) {
    return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }} />;
  }

  const press = (digit: string) => {
    setError(false);
    const next = (pin + digit).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === env.parentPin) {
        unlock();
      } else {
        setError(true);
        setTimeout(() => setPin(''), 600);
      }
    }
  };

  const back = () => setPin(pin.slice(0, -1));

  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={() => router.back()} style={styles.cancel}>
        <Text style={[type.small, { color: colors.inkSoft }]}>Cancel</Text>
      </Pressable>

      <Text style={[type.storyTitle, styles.title]}>Parent area</Text>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: error
                  ? colors.terracotta
                  : i < pin.length
                  ? colors.ink
                  : 'transparent',
                borderColor: error ? colors.terracotta : colors.inkSoft,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.pad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', '⌫'],
        ].map((row, ri) => (
          <View key={ri} style={styles.padRow}>
            {row.map((cell, ci) => {
              if (cell === '') return <View key={ci} style={styles.padBtn} />;
              if (cell === '⌫') {
                return (
                  <Pressable key={ci} onPress={back} style={styles.padBtn}>
                    <Text style={type.button}>{cell}</Text>
                  </Pressable>
                );
              }
              return (
                <Pressable key={ci} onPress={() => press(cell)} style={styles.padBtn}>
                  <Text style={type.button}>{cell}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    padding: spacing.sm,
  },
  title: {
    marginBottom: spacing.xl,
    color: colors.inkSoft,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  pad: {
    width: 280,
  },
  padRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  padBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.creamSoft,
  },
});
