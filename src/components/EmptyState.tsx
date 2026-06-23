import { StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { useThemedStyles } from '../hooks/useThemedStyles';

interface EmptyStateProps {
  message: string;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    icon: {
      fontSize: 40,
      marginBottom: 12,
    },
    message: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

const EmptyState = ({ message }: EmptyStateProps) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📋</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default EmptyState;
