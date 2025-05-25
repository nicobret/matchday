import { View, ViewProps } from 'react-native';
import { useTheme } from './theme-provider';

type ThemedViewProps = ViewProps & {
  variant?: 'default' | 'card' | 'popover' | 'muted' | 'accent';
};

export function ThemedView({ style, variant = 'default', ...props }: ThemedViewProps) {
  const { colors } = useTheme();

  const backgroundColor = {
    default: colors.background,
    card: colors.card,
    popover: colors.popover,
    muted: colors.muted,
    accent: colors.accent,
  }[variant];

  return <View style={[{ backgroundColor }, style]} {...props} />;
}
