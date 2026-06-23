export interface ColorScheme {
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  errorLight: string;
  success: string;
  successLight: string;
  pending: string;
  pendingLight: string;
  shadow: string;
  onPrimary: string;
  placeholder: string;
  skeleton: string;
  overlay: string;
  videoPlaceholder: string;
}

export const lightColors: ColorScheme = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  primary: '#0EA5E9',
  primaryLight: '#E0F2FE',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#16A34A',
  successLight: '#DCFCE7',
  pending: '#D97706',
  pendingLight: '#FEF3C7',
  shadow: '#0F172A',
  onPrimary: '#FFFFFF',
  placeholder: '#94A3B8',
  skeleton: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.35)',
  videoPlaceholder: '#1E293B',
};

export const darkColors: ColorScheme = {
  background: '#0B0F19',
  surface: '#161B28',
  primary: '#38BDF8',
  primaryLight: '#0C4A6E',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  border: '#2A3142',
  error: '#F87171',
  errorLight: '#3F1515',
  success: '#4ADE80',
  successLight: '#14532D',
  pending: '#FBBF24',
  pendingLight: '#3F2E0A',
  shadow: '#000000',
  onPrimary: '#0B0F19',
  placeholder: '#64748B',
  skeleton: '#2A3142',
  overlay: 'rgba(0, 0, 0, 0.55)',
  videoPlaceholder: '#0B1220',
};

/** @deprecated Use useTheme().colors instead */
export const Colors = lightColors;
