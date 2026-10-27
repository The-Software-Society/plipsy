import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVocab } from '@/src/vocab/store';
import { audio } from '@/src/audio/AudioPlayer';
import { type, colors, spacing, radius } from '@/src/theme';

export default function Words() {
  const router = useRouter();
  const entries = useVocab((s) => s.entries);

  const { canRead, learning } = useMemo(() => {
    const all = Object.values(entries);
    return {
      canRead: all.filter((e) => e.state === 'longTerm').sort((a, b) => a.word.localeCompare(b.word)),
      learning: all
        .filter((e) => e.state !== 'longTerm' && (e.box ?? 0) >= 1)
        .sort((a, b) => (b.box ?? 0) - (a.box ?? 0)),
    };
  }, [entries]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[type.storyTitle, { fontSize: 26 }]}>Mia's word garden</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.closeBtn}>
          <Text style={[type.button, { color: colors.inkSoft }]}>Close</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>🌸 Words Mia can read ({canRead.length})</Text>
        <View style={styles.chips}>
          {canRead.length === 0 ? (
            <Text style={[type.small, styles.empty]}>None yet. Spell words in stories to grow flowers!</Text>
          ) : (
            canRead.map((e) => (
              <Pressable key={e.word} style={[styles.chip, styles.bloom]} onPress={() => audio.play(`word.${e.word.toLowerCase()}`)}>
                <Text style={styles.bloomText}>🌸 {e.word}</Text>
              </Pressable>
            ))
          )}
        </View>

        <Text style={[styles.section, { marginTop: spacing.xl }]}>🌱 Still growing ({learning.length})</Text>
        <View style={styles.chips}>
          {learning.length === 0 ? (
            <Text style={[type.small, styles.empty]}>...</Text>
          ) : (
            learning.map((e) => (
              <Pressable key={e.word} style={[styles.chip, styles.sprout]} onPress={() => audio.play(`word.${e.word.toLowerCase()}`)}>
                <Text style={styles.sproutText}>🌱 {e.word} · {e.box ?? 0}/5</Text>
              </Pressable>
            ))
          )}
        </View>
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
    paddingBottom: spacing.sm,
  },
  closeBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.creamDeep },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  section: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: colors.inkSoft, marginBottom: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { borderRadius: radius.pill, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderWidth: 1 },
  bloom: { backgroundColor: colors.mustardSoft, borderColor: colors.mustard },
  bloomText: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: colors.ink },
  sprout: { backgroundColor: colors.creamSoft, borderColor: colors.sageSoft },
  sproutText: { fontFamily: 'Nunito_500Medium', fontSize: 15, color: colors.inkSoft },
  empty: { color: colors.inkFaint, fontStyle: 'italic' },
});
