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
  background: '#F5F7FA',
  surface: '#FFFFFF',
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  text: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#22C55E',
  successLight: '#DCFCE7',
  pending: '#F59E0B',
  pendingLight: '#FEF3C7',
  shadow: '#000000',
  onPrimary: '#FFFFFF',
  placeholder: '#94A3B8',
  skeleton: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.35)',
  videoPlaceholder: '#1E293B',
};

export const darkColors: ColorScheme = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#60A5FA',
  primaryLight: '#1E3A8A',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  border: '#334155',
  error: '#F87171',
  errorLight: '#450A0A',
  success: '#4ADE80',
  successLight: '#14532D',
  pending: '#FBBF24',
  pendingLight: '#451A03',
  shadow: '#000000',
  onPrimary: '#0F172A',
  placeholder: '#64748B',
  skeleton: '#334155',
  overlay: 'rgba(0, 0, 0, 0.5)',
  videoPlaceholder: '#0B1220',
};

/** @deprecated Use useTheme().colors instead */
export const Colors = lightColors;
