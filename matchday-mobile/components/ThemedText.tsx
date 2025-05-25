import { Text, TextProps, TextStyle } from 'react-native';
import { typography } from '../constants/theme';
import { useTheme } from './theme-provider';

type ThemedTextProps = TextProps & {
  variant?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'destructive';
  size?: keyof typeof typography.fontSize;
  weight?: keyof typeof typography.fontWeight;
};

const fontWeightMap: Record<keyof typeof typography.fontWeight, TextStyle['fontWeight']> = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

export function ThemedText({
  style,
  variant = 'default',
  size = 'base',
  weight = 'normal',
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();

  const color = {
    default: colors.foreground,
    muted: colors.mutedForeground,
    primary: colors.primary,
    secondary: colors.secondaryForeground,
    accent: colors.accentForeground,
    destructive: colors.destructive,
  }[variant];

  return (
    <Text
      style={[
        {
          color,
          fontSize: typography.fontSize[size],
          fontWeight: fontWeightMap[weight],
          fontFamily: typography.fontFamily,
        },
        style,
      ]}
      {...props}
    />
  );
}
