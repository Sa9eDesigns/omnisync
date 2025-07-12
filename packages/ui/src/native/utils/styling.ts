import { Platform, Dimensions } from "react-native";

// Platform detection utilities
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isWeb = Platform.OS === "web";

// Screen dimensions
export const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Responsive breakpoints for React Native
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Check if screen size matches breakpoint
export const useBreakpoint = () => {
  const width = screenWidth;
  
  return {
    isSm: width >= breakpoints.sm,
    isMd: width >= breakpoints.md,
    isLg: width >= breakpoints.lg,
    isXl: width >= breakpoints.xl,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isMobile: width < breakpoints.md,
    width,
    height: screenHeight,
  };
};

// Responsive value helper
export const responsive = <T>(values: {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}): T => {
  const { isSm, isMd, isLg, isXl } = useBreakpoint();
  
  if (isXl && values.xl !== undefined) return values.xl;
  if (isLg && values.lg !== undefined) return values.lg;
  if (isMd && values.md !== undefined) return values.md;
  if (isSm && values.sm !== undefined) return values.sm;
  
  return values.base;
};

// Safe area helpers
export const getSafeAreaPadding = () => {
  if (isIOS) {
    return {
      paddingTop: 44, // Status bar height
      paddingBottom: 34, // Home indicator
    };
  }
  
  if (isAndroid) {
    return {
      paddingTop: 24, // Status bar height
      paddingBottom: 0,
    };
  }
  
  return {
    paddingTop: 0,
    paddingBottom: 0,
  };
};

// Color system for React Native
export const colors = {
  // Primary colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  
  // Gray colors
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },
  
  // Semantic colors
  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  
  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  
  error: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
  
  info: {
    50: "#f0f9ff",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
  },
};

// Typography scale
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    "2xl": 32,
    "3xl": 36,
    "4xl": 40,
  },
  
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
};

// Spacing scale
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  full: 9999,
};

// Shadow presets for React Native
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 8,
  },
};

// Helper to create consistent component styles
export const createComponentStyle = (baseStyle: any, variants: Record<string, any> = {}) => {
  return (variant: string = "default") => ({
    ...baseStyle,
    ...variants[variant],
  });
};
