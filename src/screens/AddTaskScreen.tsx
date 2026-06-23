import { StyleSheet, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import TaskForm from '../components/TaskForm';
import type { ColorScheme } from '../constants/colors';
import { useTasks } from '../context/TaskContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { RootStackParamList } from '../navigation/types';

type AddTaskNavigation = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
  });

const AddTaskScreen = () => {
  const navigation = useNavigation<AddTaskNavigation>();
  const { addTask } = useTasks();
  const styles = useThemedStyles(createStyles);

  const handleSubmit = (title: string, description: string) => {
    addTask(title, description);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TaskForm onSubmit={handleSubmit} />
    </View>
  );
};

export default AddTaskScreen;
