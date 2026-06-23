import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TaskProvider } from './src/context/TaskContext';
import { ApodProvider } from './src/context/ApodContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      primary: colors.primary,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ApodProvider>
      <TaskProvider>
        <NavigationContainer theme={navTheme}>
          <AppNavigator />
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </NavigationContainer>
      </TaskProvider>
    </ApodProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
