import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

import type { ColorScheme } from '../constants/colors';
import { useTasks } from '../context/TaskContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { RootStackParamList } from '../navigation/types';
import { formatDate } from '../utils/date';

type TaskDetailsRoute = RouteProp<RootStackParamList, 'TaskDetails'>;
type TaskDetailsNavigation = NativeStackNavigationProp<RootStackParamList, 'TaskDetails'>;

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      gap: 12,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      gap: 16,
    },
    notFound: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    backButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
      borderRadius: 8,
    },
    backButtonText: {
      color: colors.onPrimary,
      fontWeight: '600',
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
    },
    badgePending: {
      backgroundColor: colors.pendingLight,
    },
    badgeCompleted: {
      backgroundColor: colors.successLight,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    badgeTextPending: {
      color: colors.pending,
    },
    badgeTextCompleted: {
      color: colors.success,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 32,
    },
    dateLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 4,
    },
    date: {
      fontSize: 15,
      color: colors.textSecondary,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 8,
    },
    description: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    actionButton: {
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1,
    },
    markCompleteButton: {
      backgroundColor: colors.successLight,
      borderColor: colors.success,
    },
    markPendingButton: {
      backgroundColor: colors.pendingLight,
      borderColor: colors.pending,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    markCompleteText: {
      color: colors.success,
    },
    markPendingText: {
      color: colors.pending,
    },
    deleteButton: {
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      backgroundColor: colors.errorLight,
      borderWidth: 1,
      borderColor: colors.error,
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.error,
    },
    buttonPressed: {
      opacity: 0.9,
    },
  });

const TaskDetailsScreen = () => {
  const navigation = useNavigation<TaskDetailsNavigation>();
  const route = useRoute<TaskDetailsRoute>();
  const { getTaskById, toggleTaskStatus, deleteTask } = useTasks();
  const styles = useThemedStyles(createStyles);

  const task = getTaskById(route.params.taskId);

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Task not found</Text>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isCompleted = task.status === 'completed';

  const handleToggle = () => {
    toggleTaskStatus(task.id);
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={[styles.badge, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
          <Text style={[styles.badgeText, isCompleted ? styles.badgeTextCompleted : styles.badgeTextPending]}>
            {isCompleted ? 'Completed' : 'Pending'}
          </Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>

        <Text style={styles.dateLabel}>Created</Text>
        <Text style={styles.date}>{formatDate(task.createdDate)}</Text>

        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>
          {task.description || 'No description provided.'}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.actionButton,
          isCompleted ? styles.markPendingButton : styles.markCompleteButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleToggle}>
        <Text style={[styles.actionButtonText, isCompleted ? styles.markPendingText : styles.markCompleteText]}>
          {isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
        onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Task</Text>
      </Pressable>
    </ScrollView>
  );
};

export default TaskDetailsScreen;
