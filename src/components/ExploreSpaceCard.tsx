import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { NASA_USING_DEMO_KEY } from '../constants/nasa';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ApodData } from '../types/nasa';
import { formatDate } from '../utils/date';
import { getApodWatchLabel, isApodVideo } from '../utils/nasa';
import NASAImageCard from './NASAImageCard';
import { SkeletonLoader } from './SkeletonLoader';

interface ExploreSpaceCardProps {
  apod: ApodData | null;
  isLoading: boolean;
  onReadMore: () => void;
  onRetry: () => void;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      marginTop: 8,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    date: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: '500',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 22,
    },
    explanation: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    videoLabel: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
    },
    readMoreButton: {
      alignSelf: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: colors.primaryLight,
      borderRadius: 8,
    },
    readMoreText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    retryButton: {
      alignSelf: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    retryButtonPressed: {
      opacity: 0.9,
    },
    retryText: {
      color: colors.onPrimary,
      fontWeight: '600',
      fontSize: 14,
    },
    loadingContainer: {
      gap: 12,
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    errorText: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
  });

const ExploreSpaceCard = ({ apod, isLoading, onReadMore, onRetry }: ExploreSpaceCardProps) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const showSkeleton = !apod && isLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Explore Space</Text>

      {showSkeleton ? (
        <View style={[styles.card, styles.loadingContainer]}>
          <SkeletonLoader />
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading today&apos;s NASA image...</Text>
          </View>
        </View>
      ) : apod ? (
        <View style={styles.card}>
          <NASAImageCard apod={apod} onPress={isApodVideo(apod) ? onReadMore : undefined} />
          <Text style={styles.date}>{formatDate(apod.date)}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {apod.title}
          </Text>
          {isApodVideo(apod) ? (
            <>
              <Text style={styles.explanation} numberOfLines={3}>
                {apod.explanation}
              </Text>
              <Text style={styles.videoLabel}>{getApodWatchLabel(apod)}</Text>
            </>
          ) : null}
          <Pressable style={styles.readMoreButton} onPress={onReadMore}>
            <Text style={styles.readMoreText}>
              {isApodVideo(apod) ? 'View Details' : 'Read More'}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.errorText}>
            {NASA_USING_DEMO_KEY
              ? 'NASA demo key is rate-limited. Add your own key in .env, restart Expo with npx expo start -c, then reload.'
              : 'Could not load today\'s NASA image. Check your connection and try again.'}
          </Text>
          <Pressable
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            onPress={onRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ExploreSpaceCard;
