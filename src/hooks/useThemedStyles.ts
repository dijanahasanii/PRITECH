import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { ColorScheme } from '../constants/colors';

export const useThemedStyles = <T>(factory: (colors: ColorScheme) => T): T => {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
};
