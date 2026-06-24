import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { FALLBACK_APOD } from '../constants/fallbackApod';
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
  createSectionTitleStyle,
  pressedStyle,
} from '../styles/common';
import NASAImageCard from './NASAImageCard';
import { SkeletonLoader } from './SkeletonLoader';

interface ExploreSpaceCardProps {
  apod: ApodData | null;
  isLoading: boolean;
  isVideoActive?: boolean;
  onReadMore: () => void;
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
    loadingOverlay: {
      opacity: 0.72,
    },
    loadingOverlayPressed: pressedStyle,
  });

const ExploreSpaceCard = ({
  apod,
  isLoading,
  isVideoActive = true,
  onReadMore,
}: ExploreSpaceCardProps) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const showInitialSkeleton = isLoading && !apod;
  const displayApod = apod ?? FALLBACK_APOD;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Take a break, explore space!</Text>

      {showInitialSkeleton ? (
        <View style={[styles.card, styles.loadingContainer]}>
          <SkeletonLoader />
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading today&apos;s NASA image...</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.card, isLoading && styles.loadingOverlay]}>
          <NASAImageCard
            apod={displayApod}
            isVideoActive={isVideoActive}
            onPress={isApodVideo(displayApod) ? onReadMore : undefined}
          />
          <Text style={styles.date}>{formatDate(displayApod.date)}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {displayApod.title}
          </Text>
          {isApodVideo(displayApod) ? (
            <>
              <Text style={styles.explanation} numberOfLines={3}>
                {displayApod.explanation}
              </Text>
              <Text style={styles.videoLabel}>{getApodWatchLabel(displayApod)}</Text>
            </>
          ) : null}
          <Pressable
            style={({ pressed }) => [styles.readMoreButton, pressed && styles.readMoreButtonPressed]}
            onPress={onReadMore}>
            <Text style={styles.readMoreText}>
              {isApodVideo(displayApod) ? 'View Details' : 'Read More'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ExploreSpaceCard;
