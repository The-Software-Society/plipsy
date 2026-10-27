import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IllustrationView } from '@/src/components/IllustrationView';
import { TREASURES } from '@/src/rewards/treasures';
import { useTreasures } from '@/src/rewards/store';
import { audio } from '@/src/audio/AudioPlayer';
import { type, colors, spacing, radius, useResponsive } from '@/src/theme';

export default function Treasures() {
  const router = useRouter();
  const found = useTreasures((s) => s.found);
  const { width } = useResponsive();
  const cols = width >= 760 ? 4 : 3;
  const tile = Math.min(140, (width - spacing.xl * 2 - spacing.md * (cols + 1)) / cols);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[type.storyTitle, { fontSize: 26 }]}>Mia's basket 🧺</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.closeBtn}>
          <Text style={[type.button, { color: colors.inkSoft }]}>Close</Text>
        </Pressable>
      </View>

      <Text style={styles.count}>{found.length} of {TREASURES.length} treasures found</Text>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {TREASURES.map((t) => {
          const have = found.includes(t.id);
          return (
            <Pressable
              key={t.id}
              style={[styles.tile, { width: tile, height: tile }, have ? styles.tileHave : styles.tileEmpty]}
              onPress={() => have && audio.playSequence([`world.treasure.${t.id}`], 0)}
              accessibilityLabel={have ? t.name : 'not found yet'}
            >
              <View style={[styles.tileImg, !have && styles.silhouette]}>
                <IllustrationView illustrationKey={t.sprite} fallbackTone="transparent" resizeMode="contain" />
              </View>
              {!have && <Text style={styles.q}>?</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  closeBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.creamDeep },
  count: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: colors.inkFaint, paddingHorizontal: spacing.xl, marginTop: spacing.xs, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl, justifyContent: 'center' },
  tile: { borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  tileHave: { backgroundColor: colors.creamSoft, borderColor: colors.mustardSoft },
  tileEmpty: { backgroundColor: colors.cream, borderColor: colors.creamDeep, borderStyle: 'dashed' },
  tileImg: { width: '72%', height: '72%' },
  silhouette: { opacity: 0.12 },
  q: { position: 'absolute', fontFamily: 'Nunito_700Bold', fontSize: 30, color: colors.inkFaint },
});
