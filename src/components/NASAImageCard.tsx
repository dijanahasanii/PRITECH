import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import NASAVideoPreview from './NASAVideoPreview';
import { useTheme } from '../context/ThemeContext';
import type { ColorScheme } from '../constants/colors';
import { radius } from '../constants/radius';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { pressedStyle } from '../styles/common';
import type { ApodData } from '../types/nasa';
import { getApodDirectVideoUrl, getApodThumbnailUrl, isApodVideo } from '../utils/nasa';

interface NASAImageCardProps {
  apod: ApodData;
  aspectRatio?: number;
  onPress?: () => void;
  isVideoActive?: boolean;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    pressable: {
      width: '100%',
    },
    container: {
      width: '100%',
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: colors.skeleton,
      position: 'relative',
    },
    videoContainer: {
      maxHeight: 220,
    },
    media: {
      ...StyleSheet.absoluteFillObject,
    },
    placeholder: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.videoPlaceholder,
    },
    playOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.overlay,
    },
    playButton: {
      width: 56,
      height: 56,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 4,
    },
    playIcon: {
      fontSize: 22,
      color: colors.primary,
    },
    pressed: pressedStyle,
  });

const PlayOverlay = ({ styles }: { styles: ReturnType<typeof createStyles> }) => (
  <View style={styles.playOverlay} pointerEvents="none">
    <View style={styles.playButton}>
      <Text style={styles.playIcon}>▶</Text>
    </View>
  </View>
);

const NASAImageCard = ({
  apod,
  aspectRatio = 16 / 9,
  onPress,
  isVideoActive = true,
}: NASAImageCardProps) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isVideo = isApodVideo(apod);
  const thumbnailUri = getApodThumbnailUrl(apod);
  const directVideoUri = getApodDirectVideoUrl(apod);
  const [imageFailed, setImageFailed] = useState(false);

  const showThumbnail = Boolean(thumbnailUri && !imageFailed);
  const showVideoPreview = isVideo && !showThumbnail && Boolean(directVideoUri);
  const showPlaceholder = !showThumbnail && !showVideoPreview;

  const content = (
    <View style={[styles.container, { aspectRatio }, isVideo && styles.videoContainer]}>
      {showPlaceholder ? (
        <View style={styles.placeholder}>
          {isVideo ? (
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {showThumbnail ? (
        <Image
          source={{ uri: thumbnailUri }}
          style={styles.media}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
          transition={300}
          onError={() => setImageFailed(true)}
        />
      ) : null}

      {showVideoPreview && directVideoUri ? (
        <NASAVideoPreview
          uri={directVideoUri}
          style={styles.media}
          placeholderColor={colors.videoPlaceholder}
          isActive={isVideoActive}
        />
      ) : null}

      {isVideo && (showThumbnail || showVideoPreview) ? <PlayOverlay styles={styles} /> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return content;
};

export default NASAImageCard;
