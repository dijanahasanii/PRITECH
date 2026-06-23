import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createCardStyle, pressedStyle } from '../styles/common';
import { formatDate } from '../utils/date';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    card: {
      ...createCardStyle(colors),
      marginBottom: spacing.md,
    },
    cardPressed: pressedStyle,
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    title: {
      flex: 1,
      ...typography.title,
      color: colors.text,
    },
    titleCompleted: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    description: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    date: {
      ...typography.caption,
      color: colors.textMuted,
    },
    deleteButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.sm,
    },
    deleteButtonPressed: {
      opacity: 0.7,
      backgroundColor: colors.errorLight,
    },
    deleteText: {
      ...typography.bodySmall,
      color: colors.error,
      fontWeight: '600',
    },
    badge: {
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

const TaskCard = ({ task, onPress, onDelete }: TaskCardProps) => {
  const styles = useThemedStyles(createStyles);
  const isCompleted = task.status === 'completed';

  const handleDelete = () => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(task) },
    ]);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(task)}>
      <View style={styles.header}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={[styles.badge, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
          <Text style={[styles.badgeText, isCompleted ? styles.badgeTextCompleted : styles.badgeTextPending]}>
            {isCompleted ? 'Done' : 'Pending'}
          </Text>
        </View>
      </View>

      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(task.createdDate)}</Text>
        {onDelete ? (
          <Pressable
            onPress={handleDelete}
            hitSlop={8}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
};

export default TaskCard;
