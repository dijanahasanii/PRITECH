import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import NASAImageCard from '../components/NASAImageCard';
import type { ColorScheme } from '../constants/colors';
import { useApod } from '../context/ApodContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { RootStackParamList } from '../navigation/types';
import type { ApodData } from '../types/nasa';
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
      padding: 16,
      gap: 16,
      paddingBottom: 32,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 30,
    },
    date: {
      fontSize: 14,
      color: colors.textMuted,
      fontWeight: '500',
    },
    videoHint: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
      lineHeight: 20,
    },
    explanation: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 26,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonPressed: {
      opacity: 0.9,
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });

const NASADetailScreen = () => {
  const route = useRoute<NASADetailRoute>();
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
      <NASAImageCard apod={apod} onPress={isVideo ? handleOpenWebsite : undefined} />

      <Text style={styles.title}>{apod.title}</Text>
      <Text style={styles.date}>{formatDate(apod.date)}</Text>

      {isVideo ? (
        <Text style={styles.videoHint}>
          Tap the preview or the button below to {watchLabel.toLowerCase()}.
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
