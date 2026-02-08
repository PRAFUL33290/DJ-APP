import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

export const DEVICE_TYPE = {
  isMobile: width < BREAKPOINTS.mobile,
  isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
  isDesktop: width >= BREAKPOINTS.desktop,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
};

export const SHADOWS = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
    web: {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
    web: {
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    android: {
      elevation: 10,
    },
    web: {
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
  }),
};

// Helper function to get responsive value
export const getResponsiveValue = (mobileValue, tabletValue, desktopValue) => {
  if (DEVICE_TYPE.isDesktop) return desktopValue;
  if (DEVICE_TYPE.isTablet) return tabletValue;
  return mobileValue;
};

// Helper function to get button size
export const getButtonSize = () => {
  return getResponsiveValue(140, 120, 140);
};

// Helper function to get container padding
export const getContainerPadding = () => {
  return getResponsiveValue(SPACING.md, SPACING.lg, SPACING.xl);
};
