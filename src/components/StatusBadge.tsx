import { StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { TaskStatus } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
  compact?: boolean;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
    },
    badgePending: {
      backgroundColor: colors.pendingLight,
    },
    badgeCompleted: {
      backgroundColor: colors.successLight,
    },
    badgeText: {
      ...typography.overline,
      fontSize: 10,
    },
    badgeTextPending: {
      color: colors.pending,
    },
    badgeTextCompleted: {
      color: colors.success,
    },
  });

const StatusBadge = ({ status, compact = false }: StatusBadgeProps) => {
  const styles = useThemedStyles(createStyles);
  const isCompleted = status === 'completed';
  const label = isCompleted ? (compact ? 'Done' : 'Completed') : 'Pending';

  return (
    <View style={[styles.badge, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
      <Text style={[styles.badgeText, isCompleted ? styles.badgeTextCompleted : styles.badgeTextPending]}>
        {label}
      </Text>
    </View>
  );
};

export default StatusBadge;
