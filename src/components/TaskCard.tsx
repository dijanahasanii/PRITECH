import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { useThemedStyles } from '../hooks/useThemedStyles';
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
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    cardPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 8,
    },
    title: {
      flex: 1,
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
    },
    titleCompleted: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    date: {
      fontSize: 12,
      color: colors.textMuted,
    },
    deleteText: {
      fontSize: 13,
      color: colors.error,
      fontWeight: '500',
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    badgePending: {
      backgroundColor: colors.pendingLight,
    },
    badgeCompleted: {
      backgroundColor: colors.successLight,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '600',
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
        <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={1}>
          {task.title}
        </Text>
        <View style={[styles.badge, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
          <Text style={[styles.badgeText, isCompleted ? styles.badgeTextCompleted : styles.badgeTextPending]}>
            {isCompleted ? 'Completed' : 'Pending'}
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
          <Pressable onPress={handleDelete} hitSlop={8}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
};

export default TaskCard;
