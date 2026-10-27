import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVocab } from '@/src/vocab/store';
import { useParentLock } from '@/src/lib/parentLock';
import { audio } from '@/src/audio/AudioPlayer';
import { getSupabase } from '@/src/supabase/client';
import { MIA } from '@/src/child/profile';
import { peek } from '@/src/lib/queue';
import { type, colors, spacing, radius } from '@/src/theme';
import { VocabEntry } from '@/src/vocab/tracker';

type SessionRow = {
  id: string;
  story_id: string;
  started_at: string;
  ended_at: string | null;
  completed: boolean;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const formatDuration = (start: string, end: string | null) => {
  if (!end) return 'in progress';
  const s = (new Date(end).getTime() - new Date(start).getTime()) / 1000;
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.round(s / 60)}m`;
};

export default function ParentDashboard() {
  const router = useRouter();
  const lock = useParentLock((s) => s.lock);
  const entries = useVocab((s) => s.entries);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [pendingWrites, setPendingWrites] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const sortedEntries = useMemo(() => {
    const arr = Object.values(entries);
    const order = { mastered: 0, learning: 1, introduced: 2 } as const;
    arr.sort((a, b) => {
      const d = order[a.status] - order[b.status];
      if (d !== 0) return d;
      return b.lastSeenAt.localeCompare(a.lastSeenAt);
    });
    return arr;
  }, [entries]);

  const knownCount = sortedEntries.length;
  const states = useVocab((s) => s.byState)();
  const due = useVocab((s) => s.dueCount)();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const queue = await peek();
      if (!cancelled) setPendingWrites(queue.length);

      const client = getSupabase();
      if (!client) {
        setLoadError('Supabase not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env.');
        return;
      }
      try {
        const { data, error } = await client
          .from('sessions')
          .select('id, story_id, started_at, ended_at, completed')
          .eq('child_id', MIA.id)
          .order('started_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        if (!cancelled) setSessions((data ?? []) as SessionRow[]);
      } catch (e: unknown) {
        if (!cancelled) setLoadError(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClose = () => {
    lock();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={[type.small, { color: colors.inkFaint, letterSpacing: 1 }]}>PARENT DASHBOARD</Text>
          <Text style={[type.storyTitle, { fontSize: 30 }]}>Mia knows {knownCount} {knownCount === 1 ? 'word' : 'words'}.</Text>
          <Text style={[type.small, { color: colors.inkSoft, marginTop: spacing.xs }]}>
            {states.longTerm} long-term · {states.active} active · {states.problem} need work · {due} due.
          </Text>
        </View>
        <Pressable onPress={handleClose} style={styles.closeBtn}>
          <Text style={[type.button, { color: colors.inkSoft }]}>Close</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Section title="Print vocabulary">
          {sortedEntries.length === 0 ? (
            <Text style={[type.small, styles.emptyText]}>No words yet. Read a story to introduce one.</Text>
          ) : (
            <View style={styles.table}>
              <Row cells={['Word', 'State', 'Box', 'Clean', 'Last seen']} isHeader />
              {sortedEntries.map((entry) => (
                <Row
                  key={entry.word}
                  cells={[
                    entry.word,
                    entry.state === 'longTerm' ? 'long-term' : (entry.state ?? 'active'),
                    `${entry.box ?? 0}/5`,
                    String(entry.cleanCount ?? 0),
                    formatRelative(entry.lastSeenAt),
                  ]}
                  onPress={() => audio.play(`word.${entry.word.toLowerCase()}`)}
                  accent={entry.status}
                />
              ))}
            </View>
          )}
        </Section>

        <Section title="Recent sessions">
          {loadError ? (
            <Text style={[type.small, { color: colors.inkSoft }]}>{loadError}</Text>
          ) : sessions.length === 0 ? (
            <Text style={[type.small, styles.emptyText]}>No sessions logged yet.</Text>
          ) : (
            <View style={styles.table}>
              <Row cells={['Story', 'When', 'Length', 'Completed']} isHeader />
              {sessions.map((s) => (
                <Row
                  key={s.id}
                  cells={[
                    s.story_id,
                    formatDate(s.started_at),
                    formatDuration(s.started_at, s.ended_at),
                    s.completed ? 'yes' : 'no',
                  ]}
                />
              ))}
            </View>
          )}
        </Section>

        <Section title="Sync status">
          <Text style={[type.small, { color: colors.inkSoft }]}>
            {pendingWrites === 0 ? 'All writes synced.' : `${pendingWrites} write${pendingWrites === 1 ? '' : 's'} queued for sync.`}
          </Text>
        </Section>

        <Section title="Asset regeneration">
          <Text style={[type.small, { color: colors.inkSoft, marginBottom: spacing.xs }]}>
            From the project root, run:
          </Text>
          <Text style={[type.small, styles.code]}>npm run generate:audio</Text>
          <Text style={[type.small, styles.code]}>npm run generate:illustrations</Text>
          <Text style={[type.small, styles.code]}>npm run generate:manifests</Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={[type.small, styles.sectionTitle]}>{title.toUpperCase()}</Text>
    {children}
  </View>
);

const Row = ({
  cells,
  isHeader,
  onPress,
  accent,
}: {
  cells: string[];
  isHeader?: boolean;
  onPress?: () => void;
  accent?: VocabEntry['status'];
}) => {
  const accentColor =
    accent === 'mastered' ? colors.mustard : accent === 'learning' ? colors.terracotta : accent === 'introduced' ? colors.terracottaSoft : 'transparent';
  const inner = (
    <View style={[styles.row, isHeader && styles.rowHeader]}>
      {accent && <View style={[styles.accent, { backgroundColor: accentColor }]} />}
      {cells.map((c, i) => (
        <Text
          key={i}
          style={[
            type.small,
            styles.cell,
            i === 0 && { fontWeight: '600' },
            isHeader && { color: colors.inkFaint, textTransform: 'uppercase', letterSpacing: 1 },
          ]}
          numberOfLines={1}
        >
          {c}
        </Text>
      ))}
    </View>
  );
  if (onPress) return <Pressable onPress={onPress}>{inner}</Pressable>;
  return inner;
};

const formatRelative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDeep,
  },
  closeBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.creamDeep,
  },
  scroll: {
    padding: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    color: colors.inkFaint,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  table: {
    backgroundColor: colors.creamSoft,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDeep,
  },
  rowHeader: {
    backgroundColor: colors.creamDeep,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cell: {
    flex: 1,
    color: colors.ink,
    paddingHorizontal: spacing.xs,
  },
  emptyText: {
    color: colors.inkSoft,
    fontStyle: 'italic',
  },
  code: {
    fontFamily: 'Menlo',
    color: colors.terracottaDeep,
  },
});
