import { Image, View, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { illustrationManifest } from '@/src/stories/illustration-manifest';
import { colors } from '@/src/theme';

type Props = {
  illustrationKey: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  fallbackTone?: string;
  resizeMode?: 'cover' | 'contain';
};

export const IllustrationView = ({
  illustrationKey,
  style,
  imageStyle,
  fallbackTone,
  resizeMode = 'cover',
}: Props) => {
  const source = illustrationManifest[illustrationKey];

  if (source == null) {
    return (
      <View
        style={[
          styles.fallback,
          { backgroundColor: fallbackTone ?? colors.creamDeep },
          style,
        ]}
      />
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image source={source} style={[styles.image, imageStyle]} resizeMode={resizeMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
  },
});
