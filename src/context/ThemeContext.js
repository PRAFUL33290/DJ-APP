import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Deezer-inspired color palettes
const lightTheme = {
  mode: 'light',
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#F8F9FA',
  primary: '#A238FF',
  primaryDark: '#7C1AD1',
  primaryLight: '#C07BFF',
  secondary: '#00D9FF',
  accent: '#A200FF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  success: '#00C853',
  error: '#FF3B30',
  warning: '#B04CFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  card: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  star: '#FFD700',
  starEmpty: '#E0E0E0',
  gradient1: '#8E2BFF',
  gradient2: '#C07BFF',
};

const darkTheme = {
  mode: 'dark',
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  surface: '#1E1E1E',
  surfaceElevated: '#2C2C2C',
  primary: '#A238FF',
  primaryDark: '#7C1AD1',
  primaryLight: '#C07BFF',
  secondary: '#00D9FF',
  accent: '#A200FF',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#808080',
  border: '#333333',
  borderLight: '#2A2A2A',
  success: '#00E676',
  error: '#FF5252',
  warning: '#B04CFF',
  overlay: 'rgba(0, 0, 0, 0.7)',
  card: '#1E1E1E',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  star: '#FFD700',
  starEmpty: '#4A4A4A',
  gradient1: '#8E2BFF',
  gradient2: '#C07BFF',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto'); // 'light', 'dark', 'auto'

  const getActiveTheme = () => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getActiveTheme();

  const toggleTheme = (mode) => {
    setThemeMode(mode);
  };

  const value = {
    theme,
    themeMode,
    toggleTheme,
    isDark: theme.mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
