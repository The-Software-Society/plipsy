import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Story } from '@/src/stories/types';
import { type, colors, spacing, radius } from '@/src/theme';
import { IllustrationView } from './IllustrationView';

type Props = {
  story: Story;
  onPress: () => void;
  size?: number;
};

export const StoryTile = ({ story, onPress, size = 280 }: Props) => {
  const coverSize = size - spacing.md * 2;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, { width: size }]}
      accessibilityLabel={story.title}
    >
      <View style={[styles.cover, { width: coverSize, height: coverSize }]}>
        <IllustrationView
          illustrationKey={story.cover}
          fallbackTone={colors.sageSoft}
          resizeMode="cover"
        />
      </View>
      <Text style={[type.storyTitle, styles.title]} numberOfLines={2}>
        {story.title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.creamSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  cover: {
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
