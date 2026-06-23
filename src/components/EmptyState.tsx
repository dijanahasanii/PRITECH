import { StyleSheet, Text, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useThemedStyles } from '../hooks/useThemedStyles';

interface EmptyStateProps {
  message: string;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl + spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: radius.full,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    icon: {
      fontSize: 32,
    },
    message: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 280,
    },
  });

const EmptyState = ({ message }: EmptyStateProps) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>📋</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default EmptyState;
