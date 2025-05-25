import { Platform } from 'react-native';

export const colors = {
  light: {
    background: '#FFFFFF',
    foreground: '#0A0A0A',
    card: '#FFFFFF',
    cardForeground: '#0A0A0A',
    popover: '#FFFFFF',
    popoverForeground: '#0A0A0A',
    primary: '#22C55E',
    primaryForeground: '#F8FAFC',
    secondary: '#F1F5F9',
    secondaryForeground: '#1E293B',
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    accent: '#F1F5F9',
    accentForeground: '#1E293B',
    destructive: '#EF4444',
    destructiveForeground: '#F8FAFC',
    border: '#E2E8F0',
    input: '#E2E8F0',
    ring: '#22C55E',
  },
  dark: {
    background: '#0A0A0A',
    foreground: '#CCCCCC',
    card: '#1A1A1A',
    cardForeground: '#D9D9D9',
    popover: '#171717',
    popoverForeground: '#F2F2F2',
    primary: '#4ADE80',
    primaryForeground: '#1A1A1A',
    secondary: '#262626',
    secondaryForeground: '#FAFAFA',
    muted: '#262626',
    mutedForeground: '#A3A3A3',
    accent: '#262626',
    accentForeground: '#FAFAFA',
    destructive: '#7F1D1D',
    destructiveForeground: '#F8FAFC',
    border: '#262626',
    input: '#262626',
    ring: '#4ADE80',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

export const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
}; 