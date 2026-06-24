import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useIsFocused, useRoute } from '@react-navigation/native';

import NASAImageCard from '../components/NASAImageCard';
import type { ColorScheme } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useApod } from '../context/ApodContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { RootStackParamList } from '../navigation/types';
import type { ApodData } from '../types/nasa';
import {
  createPrimaryButtonStyle,
  createPrimaryButtonTextStyle,
  pressedStyle,
  screenHorizontalPadding,
} from '../styles/common';
import { formatDate } from '../utils/date';
import { getApodWatchLabel, isApodVideo } from '../utils/nasa';
import { openApodLink } from '../utils/openApodLink';

type NASADetailRoute = RouteProp<RootStackParamList, 'NASADetail'>;

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: screenHorizontalPadding,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.lg,
    },
    title: {
      ...typography.titleLarge,
      fontSize: 22,
      lineHeight: 30,
      color: colors.text,
    },
    date: {
      ...typography.bodySmall,
      color: colors.textMuted,
      fontWeight: '500',
    },
    videoHint: {
      ...typography.bodySmall,
      color: colors.primary,
      fontWeight: '500',
    },
    explanation: {
      ...typography.body,
      lineHeight: 26,
      color: colors.textSecondary,
    },
    button: {
      ...createPrimaryButtonStyle(colors),
      marginTop: spacing.sm,
    },
    buttonPressed: pressedStyle,
    buttonText: createPrimaryButtonTextStyle(colors),
  });

const NASADetailScreen = () => {
  const route = useRoute<NASADetailRoute>();
  const isFocused = useIsFocused();
  const styles = useThemedStyles(createStyles);
  const { apod: sharedApod } = useApod();
  const [apod, setApod] = useState<ApodData>(route.params.apod);

  useEffect(() => {
    if (sharedApod) {
      setApod(sharedApod);
    }
  }, [sharedApod]);

  const isVideo = isApodVideo(apod);
  const watchLabel = getApodWatchLabel(apod);

  const handleOpenWebsite = async () => {
    await openApodLink(apod);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NASAImageCard
        apod={apod}
        isVideoActive={isFocused}
        onPress={isVideo ? handleOpenWebsite : undefined}
      />

      <Text style={styles.title}>{apod.title}</Text>
      <Text style={styles.date}>{formatDate(apod.date)}</Text>

      {isVideo ? (
        <Text style={styles.videoHint}>
          Tap the preview or the button below to watch this video on NASA.
        </Text>
      ) : null}

      <Text style={styles.explanation}>{apod.explanation}</Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleOpenWebsite}>
        <Text style={styles.buttonText}>{watchLabel}</Text>
      </Pressable>
    </ScrollView>
  );
};

export default NASADetailScreen;
