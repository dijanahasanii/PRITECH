import type { TextStyle, ViewStyle } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export const pressedStyle = {
  opacity: 0.88,
  transform: [{ scale: 0.98 }],
} as const;

export const screenHorizontalPadding = spacing.lg;

export const createCardStyle = (colors: ColorScheme): ViewStyle => ({
  backgroundColor: colors.surface,
  borderRadius: radius.lg,
  padding: spacing.lg,
  borderWidth: 1,
  borderColor: colors.border,
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 3,
});

export const createInputStyle = (colors: ColorScheme): ViewStyle => ({
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.md,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md + 2,
});

export const createPrimaryButtonStyle = (colors: ColorScheme): ViewStyle => ({
  backgroundColor: colors.primary,
  borderRadius: radius.md,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.xl,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 52,
});

export const createPrimaryButtonTextStyle = (colors: ColorScheme): TextStyle => ({
  color: colors.onPrimary,
  fontSize: typography.body.fontSize,
  fontWeight: '600',
});

export const createSectionTitleStyle = (colors: ColorScheme): TextStyle => ({
  ...typography.sectionTitle,
  color: colors.text,
});
