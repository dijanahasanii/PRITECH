import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import ExploreSpaceCard from '../components/ExploreSpaceCard';
import TaskList from '../components/TaskList';
import type { ColorScheme } from '../constants/colors';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useApod } from '../context/ApodContext';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { RootStackParamList } from '../navigation/types';
import {
  createInputStyle,
  pressedStyle,
  screenHorizontalPadding,
} from '../styles/common';
import type { Task, TaskFilter } from '../types/task';

type HomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const FILTER_TABS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: screenHorizontalPadding,
      paddingTop: spacing.md,
    },
    headerSection: {
      marginBottom: spacing.md,
      gap: spacing.md,
    },
    searchInput: {
      ...createInputStyle(colors),
      fontSize: typography.body.fontSize,
      color: colors.text,
    },
    filterTabs: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    filterTab: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    filterTabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterTabPressed: {
      opacity: 0.9,
    },
    filterTabText: {
      ...typography.bodySmall,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    filterTabTextActive: {
      color: colors.onPrimary,
    },
    taskCount: {
      ...typography.caption,
      color: colors.textMuted,
    },
    fab: {
      position: 'absolute',
      right: spacing.xl,
      bottom: spacing.xl,
      width: 56,
      height: 56,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.22,
      shadowRadius: 12,
      elevation: 8,
    },
    fabPressed: pressedStyle,
    fabText: {
      fontSize: 30,
      color: colors.onPrimary,
      lineHeight: 32,
      marginTop: -2,
    },
  });

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigation>();
  const { tasks, isLoading, deleteTask } = useTasks();
  const { apod, isLoading: apodLoading, error: apodError, refreshApod } = useApod();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');

  const handleRetryApod = useCallback(() => {
    void refreshApod();
  }, [refreshApod]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter =
        activeFilter === 'all' || task.status === activeFilter;
      const matchesSearch = !query || task.title.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, searchQuery, activeFilter]);

  const emptyMessage =
    searchQuery.trim() || activeFilter !== 'all'
      ? 'No tasks match your search.'
      : 'No tasks yet. Tap + to add one.';

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetails', { taskId: task.id });
  };

  const handleReadMore = useCallback(() => {
    if (apod) {
      navigation.navigate('NASADetail', { apod });
    }
  }, [apod, navigation]);

  const listHeader = (
    <View style={styles.headerSection}>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search tasks..."
        placeholderTextColor={colors.placeholder}
      />

      <View style={styles.filterTabs}>
        {FILTER_TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={({ pressed }) => [
              styles.filterTab,
              activeFilter === tab.key && styles.filterTabActive,
              pressed && styles.filterTabPressed,
            ]}
            onPress={() => setActiveFilter(tab.key)}>
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab.key && styles.filterTabTextActive,
              ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.taskCount}>
        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
      </Text>
    </View>
  );

  const renderExploreSpace = useCallback(
    () => (
      <ExploreSpaceCard
        apod={apod}
        isLoading={apodLoading && !apod}
        error={apodError}
        onReadMore={handleReadMore}
        onRetry={handleRetryApod}
      />
    ),
    [apod, apodLoading, apodError, handleReadMore, handleRetryApod],
  );

  return (
    <View style={styles.container}>
      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        onTaskPress={handleTaskPress}
        onTaskDelete={(task) => deleteTask(task.id)}
        listHeader={listHeader}
        renderFooter={renderExploreSpace}
      />

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => {
          setActiveFilter('all');
          setSearchQuery('');
          navigation.navigate('AddTask');
        }}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;
