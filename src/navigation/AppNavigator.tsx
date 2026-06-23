import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ThemeToggleButton from '../components/ThemeToggleButton';
import { useTheme } from '../context/ThemeContext';
import AddTaskScreen from '../screens/AddTaskScreen';
import HomeScreen from '../screens/HomeScreen';
import NASADetailScreen from '../screens/NASADetailScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'My Tasks',
          headerRight: () => <ThemeToggleButton />,
        }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ title: 'Add Task' }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen
        name="NASADetail"
        component={NASADetailScreen}
        options={{ title: 'Explore Space' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
