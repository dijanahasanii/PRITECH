import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { NASA_USING_DEMO_KEY } from '../constants/nasa';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ApodData } from '../types/nasa';
import { formatDate } from '../utils/date';
import { getApodWatchLabel, isApodVideo } from '../utils/nasa';
import {
  createCardStyle,
  createPrimaryButtonStyle,
  createPrimaryButtonTextStyle,
  createSectionTitleStyle,
  pressedStyle,
} from '../styles/common';
import NASAImageCard from './NASAImageCard';
import { SkeletonLoader } from './SkeletonLoader';

interface ExploreSpaceCardProps {
  apod: ApodData | null;
  isLoading: boolean;
  error?: string | null;
  onReadMore: () => void;
  onRetry: () => void;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.sm,
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...createSectionTitleStyle(colors),
      marginBottom: spacing.lg,
    },
    card: {
      ...createCardStyle(colors),
      gap: spacing.md,
    },
    date: {
      ...typography.caption,
      color: colors.textMuted,
    },
    title: {
      ...typography.title,
      color: colors.text,
    },
    explanation: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    videoLabel: {
      ...typography.bodySmall,
      color: colors.primary,
      fontWeight: '600',
    },
    readMoreButton: {
      alignSelf: 'flex-start',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.primaryLight,
      borderRadius: radius.sm,
      minHeight: 40,
      justifyContent: 'center',
    },
    readMoreButtonPressed: {
      opacity: 0.88,
    },
    readMoreText: {
      color: colors.primary,
      ...typography.bodySmall,
      fontWeight: '600',
    },
    retryButton: {
      ...createPrimaryButtonStyle(colors),
      alignSelf: 'flex-start',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      minHeight: 40,
    },
    retryButtonPressed: pressedStyle,
    retryText: createPrimaryButtonTextStyle(colors),
    loadingContainer: {
      gap: spacing.md,
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    loadingText: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    errorText: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
  });

const ExploreSpaceCard = ({ apod, isLoading, error, onReadMore, onRetry }: ExploreSpaceCardProps) => {
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
          <Pressable
            style={({ pressed }) => [styles.readMoreButton, pressed && styles.readMoreButtonPressed]}
            onPress={onReadMore}>
            <Text style={styles.readMoreText}>
              {isApodVideo(apod) ? 'View Details' : 'Read More'}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.errorText}>
            {error ??
              (NASA_USING_DEMO_KEY
                ? 'NASA demo key is rate-limited. Add your own key in .env, restart Expo with npx expo start -c, then reload.'
                : 'Could not load today\'s NASA image. Check your connection and try again.')}
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
