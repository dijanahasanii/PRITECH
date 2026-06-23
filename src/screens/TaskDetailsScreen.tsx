import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

import StatusBadge from '../components/StatusBadge';
import type { ColorScheme } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useTasks } from '../context/TaskContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { RootStackParamList } from '../navigation/types';
import {
  createCardStyle,
  createDangerButtonStyle,
  createDangerButtonTextStyle,
  createOutlineButtonStyle,
  createPrimaryButtonStyle,
  createPrimaryButtonTextStyle,
  pressedStyle,
  screenHorizontalPadding,
} from '../styles/common';
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
      paddingHorizontal: screenHorizontalPadding,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.md,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      gap: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    notFound: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    backButton: createPrimaryButtonStyle(colors),
    backButtonPressed: pressedStyle,
    backButtonText: createPrimaryButtonTextStyle(colors),
    card: {
      ...createCardStyle(colors),
      gap: spacing.md,
      padding: spacing.xl,
    },
    title: {
      ...typography.titleLarge,
      color: colors.text,
    },
    dateLabel: {
      ...typography.overline,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
    date: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    sectionLabel: {
      ...typography.overline,
      color: colors.textMuted,
      marginTop: spacing.sm,
    },
    description: {
      ...typography.body,
      color: colors.text,
    },
    actionButton: createOutlineButtonStyle(colors),
    markCompleteButton: {
      backgroundColor: colors.successLight,
      borderColor: colors.success,
    },
    markPendingButton: {
      backgroundColor: colors.pendingLight,
      borderColor: colors.pending,
    },
    actionButtonText: {
      ...typography.body,
      fontWeight: '600',
    },
    markCompleteText: {
      color: colors.success,
    },
    markPendingText: {
      color: colors.pending,
    },
    deleteButton: createDangerButtonStyle(colors),
    deleteButtonText: createDangerButtonTextStyle(colors),
    buttonPressed: pressedStyle,
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
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={() => navigation.goBack()}>
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
        <StatusBadge status={task.status} />

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
