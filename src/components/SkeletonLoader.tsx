import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createCardStyle } from '../styles/common';

interface SkeletonLoaderProps {
  style?: ViewStyle;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      gap: spacing.md,
    },
    box: {
      backgroundColor: colors.skeleton,
      borderRadius: radius.sm,
    },
    image: {
      width: '100%',
      aspectRatio: 16 / 9,
      borderRadius: radius.md,
    },
    title: {
      height: 20,
      width: '70%',
    },
    line: {
      height: 14,
      width: '100%',
    },
    lineShort: {
      height: 14,
      width: '60%',
    },
    taskCard: {
      ...createCardStyle(colors),
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    taskTitle: {
      height: 18,
      width: '55%',
    },
    taskLine: {
      height: 14,
      width: '85%',
    },
    taskMeta: {
      height: 12,
      width: '35%',
    },
  });

const SkeletonBox = ({
  style,
  boxStyle,
}: {
  style: ViewStyle;
  boxStyle: ViewStyle;
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[boxStyle, style, { opacity }]} />;
};

export const SkeletonLoader = ({ style }: SkeletonLoaderProps) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, style]}>
      <SkeletonBox style={styles.image} boxStyle={styles.box} />
      <SkeletonBox style={styles.title} boxStyle={styles.box} />
      <SkeletonBox style={styles.line} boxStyle={styles.box} />
      <SkeletonBox style={styles.lineShort} boxStyle={styles.box} />
    </View>
  );
};

export const TaskCardSkeleton = () => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.taskCard}>
      <SkeletonBox style={styles.taskTitle} boxStyle={styles.box} />
      <SkeletonBox style={styles.taskLine} boxStyle={styles.box} />
      <SkeletonBox style={styles.taskMeta} boxStyle={styles.box} />
    </View>
  );
};
