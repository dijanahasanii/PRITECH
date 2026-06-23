import { FlatList, ScrollView, StyleSheet } from 'react-native';

import EmptyState from './EmptyState';
import TaskCard from './TaskCard';
import { TaskCardSkeleton } from './SkeletonLoader';
import type { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  emptyMessage?: string;
  onTaskPress: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
  listHeader?: React.ReactElement | null;
  renderFooter?: () => React.ReactElement | null;
}

const TaskList = ({
  tasks,
  isLoading = false,
  emptyMessage = 'No tasks yet. Tap + to add one.',
  onTaskPress,
  onTaskDelete,
  listHeader,
  renderFooter,
}: TaskListProps) => {
  if (isLoading) {
    return (
      <ScrollView
        contentContainerStyle={styles.skeletonContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {listHeader}
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        {renderFooter?.()}
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskCard task={item} onPress={onTaskPress} onDelete={onTaskDelete} />
      )}
      ListHeaderComponent={listHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<EmptyState message={emptyMessage} />}
      contentContainerStyle={tasks.length === 0 ? styles.emptyList : styles.list}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    />
  );
};

export default TaskList;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  skeletonContainer: {
    paddingBottom: 24,
  },
});
