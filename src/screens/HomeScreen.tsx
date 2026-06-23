import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import ExploreSpaceCard from '../components/ExploreSpaceCard';
import TaskList from '../components/TaskList';
import type { ColorScheme } from '../constants/colors';
import { useApod } from '../context/ApodContext';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { RootStackParamList } from '../navigation/types';
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
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    headerSection: {
      marginBottom: 8,
      gap: 12,
    },
    searchInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    filterTabs: {
      flexDirection: 'row',
      gap: 8,
    },
    filterTab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    filterTabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    filterTabTextActive: {
      color: colors.onPrimary,
    },
    taskCount: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: '500',
    },
    fab: {
      position: 'absolute',
      right: 24,
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    fabPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.96 }],
    },
    fabText: {
      fontSize: 28,
      color: colors.onPrimary,
      lineHeight: 30,
      marginTop: -2,
    },
  });

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigation>();
  const { tasks, isLoading, deleteTask } = useTasks();
  const { apod, isLoading: apodLoading, refreshApod } = useApod();
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
            style={[styles.filterTab, activeFilter === tab.key && styles.filterTabActive]}
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
        onReadMore={handleReadMore}
        onRetry={handleRetryApod}
      />
    ),
    [apod, apodLoading, handleReadMore, handleRetryApod],
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
