import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import type { ColorScheme } from '../constants/colors';
import { FALLBACK_APOD } from '../constants/fallbackApod';
import {
  NASA_LOADING_HINT,
  NASA_LOADING_TITLE,
  NASA_REFRESHING_HINT,
  NASA_SLOW_HINT,
} from '../constants/nasa';
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
  isRefreshing?: boolean;
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
      textAlign: 'center',
    },
    loadingTitle: {
      ...typography.body,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    loadingHint: {
      ...typography.bodySmall,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 300,
    },
    refreshingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    refreshingText: {
      ...typography.caption,
      color: colors.textMuted,
      fontWeight: '500',
      flex: 1,
    },
    loadingOverlay: {
      opacity: 0.72,
    },
    loadingOverlayPressed: pressedStyle,
  });

const ExploreSpaceCard = ({
  apod,
  isLoading,
  isRefreshing = false,
  isVideoActive = true,
  onReadMore,
}: ExploreSpaceCardProps) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [showSlowHint, setShowSlowHint] = useState(false);
  const showInitialSkeleton = isLoading && !apod;
  const displayApod = apod ?? FALLBACK_APOD;

  useEffect(() => {
    if (!showInitialSkeleton) {
      setShowSlowHint(false);
      return;
    }

    const timer = setTimeout(() => setShowSlowHint(true), 4000);
    return () => clearTimeout(timer);
  }, [showInitialSkeleton]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Take a break, explore space!</Text>

      {showInitialSkeleton ? (
        <View style={[styles.card, styles.loadingContainer]}>
          <SkeletonLoader />
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingTitle}>{NASA_LOADING_TITLE}</Text>
          </View>
          <Text style={styles.loadingHint}>
            {showSlowHint ? NASA_SLOW_HINT : NASA_LOADING_HINT}
          </Text>
        </View>
      ) : (
        <View style={[styles.card, isRefreshing && styles.loadingOverlay]}>
          {isRefreshing ? (
            <View style={styles.refreshingRow}>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={styles.refreshingText}>{NASA_REFRESHING_HINT}</Text>
            </View>
          ) : null}
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
