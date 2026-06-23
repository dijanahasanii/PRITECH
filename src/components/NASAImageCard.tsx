import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { radius } from '../constants/radius';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { pressedStyle } from '../styles/common';
import type { ApodData } from '../types/nasa';
import { getApodThumbnailUrl, isApodVideo } from '../utils/nasa';

interface NASAImageCardProps {
  apod: ApodData;
  aspectRatio?: number;
  onPress?: () => void;
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
    image: {
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

const NASAImageCard = ({ apod, aspectRatio = 16 / 9, onPress }: NASAImageCardProps) => {
  const styles = useThemedStyles(createStyles);
  const isVideo = isApodVideo(apod);
  const imageUri = getApodThumbnailUrl(apod);
  const [imageFailed, setImageFailed] = useState(false);
  const showPlaceholder = !imageUri || imageFailed;

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
      ) : (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
          transition={300}
          onError={() => setImageFailed(true)}
        />
      )}
      {isVideo && !showPlaceholder ? (
        <View style={styles.playOverlay} pointerEvents="none">
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      ) : null}
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
