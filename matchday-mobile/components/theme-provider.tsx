import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../constants/theme';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  value?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: typeof colors.light;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  colors: colors.light,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  value = 'system',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(value);
  const systemTheme = useColorScheme();

  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const themeColors = effectiveTheme === 'dark' ? colors.dark : colors.light;

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, colors: themeColors }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
}; 