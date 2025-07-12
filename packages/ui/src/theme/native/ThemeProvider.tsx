// Universal Theme Provider for React Native/Expo
// Cross-platform theme system that works with React Native

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { DesignTokens, defaultTokens } from '../../tokens';

// Theme modes
export type ThemeMode = 'light' | 'dark' | 'system';

// Theme configuration
export interface ThemeConfig {
  mode: ThemeMode;
  tokens: DesignTokens;
  customTokens?: Partial<DesignTokens>;
}

// Theme context
export interface ThemeContextValue {
  mode: ThemeMode;
  tokens: DesignTokens;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  resolvedTokens: DesignTokens;
  colorScheme: ColorSchemeName;
}

// Create theme context
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Theme provider props
export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  tokens?: Partial<DesignTokens>;
  enableSystem?: boolean;
}

// Dark theme token overrides for React Native
const darkThemeOverrides: Partial<DesignTokens> = {
  colors: {
    ...defaultTokens.colors,
    
    // Invert gray scale for dark mode
    gray50: 'hsl(229, 84%, 5%)',
    gray100: 'hsl(222, 84%, 5%)',
    gray200: 'hsl(217, 33%, 17%)',
    gray300: 'hsl(215, 25%, 27%)',
    gray400: 'hsl(215, 19%, 35%)',
    gray500: 'hsl(215, 16%, 47%)',
    gray600: 'hsl(215, 20%, 65%)',
    gray700: 'hsl(213, 27%, 84%)',
    gray800: 'hsl(214, 32%, 91%)',
    gray900: 'hsl(210, 40%, 96%)',
    gray950: 'hsl(210, 40%, 98%)',
    
    // Adjust primary colors for dark mode
    primary50: 'hsl(226, 55%, 21%)',
    primary100: 'hsl(224, 64%, 33%)',
    primary200: 'hsl(226, 71%, 40%)',
    primary300: 'hsl(224, 76%, 48%)',
    primary400: 'hsl(221, 83%, 53%)',
    primary500: 'hsl(217, 91%, 60%)',
    primary600: 'hsl(213, 94%, 68%)',
    primary700: 'hsl(212, 96%, 78%)',
    primary800: 'hsl(213, 97%, 87%)',
    primary900: 'hsl(214, 95%, 93%)',
    primary950: 'hsl(214, 100%, 97%)',
  },
};

// Utility to merge tokens
const mergeTokens = (base: DesignTokens, overrides: Partial<DesignTokens>): DesignTokens => {
  return {
    ...base,
    colors: { ...base.colors, ...overrides.colors },
    spacing: { ...base.spacing, ...overrides.spacing },
    typography: {
      ...base.typography,
      ...overrides.typography,
      fontFamily: { ...base.typography.fontFamily, ...overrides.typography?.fontFamily },
      fontSize: { ...base.typography.fontSize, ...overrides.typography?.fontSize },
      fontWeight: { ...base.typography.fontWeight, ...overrides.typography?.fontWeight },
      lineHeight: { ...base.typography.lineHeight, ...overrides.typography?.lineHeight },
      letterSpacing: { ...base.typography.letterSpacing, ...overrides.typography?.letterSpacing },
    },
    borderRadius: { ...base.borderRadius, ...overrides.borderRadius },
    shadows: { ...base.shadows, ...overrides.shadows },
    breakpoints: { ...base.breakpoints, ...overrides.breakpoints },
    animations: {
      ...base.animations,
      ...overrides.animations,
      duration: { ...base.animations.duration, ...overrides.animations?.duration },
      easing: { ...base.animations.easing, ...overrides.animations?.easing },
    },
    zIndex: { ...base.zIndex, ...overrides.zIndex },
  };
};

// Theme provider component for React Native
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'system',
  tokens: customTokens,
  enableSystem = true,
}) => {
  // State for theme mode
  const [mode, setModeState] = React.useState<ThemeMode>(defaultMode);

  // System theme detection using React Native Appearance API
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(() => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light';
  });

  // Listen for system theme changes
  React.useEffect(() => {
    if (!enableSystem) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => subscription?.remove();
  }, [enableSystem]);

  // Resolve actual theme mode
  const resolvedMode = mode === 'system' ? systemTheme : mode;
  const isDark = resolvedMode === 'dark';
  const colorScheme = Appearance.getColorScheme();

  // Set theme mode
  const setMode = React.useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  // Resolve final tokens
  const resolvedTokens = useMemo(() => {
    let baseTokens = defaultTokens;
    
    // Apply custom tokens
    if (customTokens) {
      baseTokens = mergeTokens(baseTokens, customTokens);
    }
    
    // Apply dark theme overrides
    if (isDark) {
      baseTokens = mergeTokens(baseTokens, darkThemeOverrides);
    }
    
    return baseTokens;
  }, [customTokens, isDark]);

  // Context value
  const contextValue: ThemeContextValue = useMemo(() => ({
    mode,
    tokens: defaultTokens,
    isDark,
    setMode,
    resolvedTokens,
    colorScheme,
  }), [mode, isDark, setMode, resolvedTokens, colorScheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Hook to use tokens directly
export const useTokens = (): DesignTokens => {
  const { resolvedTokens } = useTheme();
  return resolvedTokens;
};

// Hook for responsive values (React Native version)
export const useResponsiveValue = <T>(values: Partial<Record<keyof DesignTokens['breakpoints'], T>>): T | undefined => {
  const { resolvedTokens } = useTheme();
  const [screenWidth, setScreenWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const { Dimensions } = require('react-native');
    
    const updateDimensions = ({ window }: { window: { width: number } }) => {
      setScreenWidth(window.width);
    };

    // Get initial dimensions
    const { width } = Dimensions.get('window');
    setScreenWidth(width);

    // Listen for dimension changes
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    
    return () => subscription?.remove();
  }, []);

  if (!screenWidth) return undefined;

  // Find the appropriate value for current screen width
  const breakpoints = resolvedTokens.breakpoints;
  const breakpointOrder: (keyof DesignTokens['breakpoints'])[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  let currentBreakpoint: keyof DesignTokens['breakpoints'] = 'xs';
  
  if (screenWidth >= breakpoints['2xl']) currentBreakpoint = '2xl';
  else if (screenWidth >= breakpoints.xl) currentBreakpoint = 'xl';
  else if (screenWidth >= breakpoints.lg) currentBreakpoint = 'lg';
  else if (screenWidth >= breakpoints.md) currentBreakpoint = 'md';
  else if (screenWidth >= breakpoints.sm) currentBreakpoint = 'sm';
  else currentBreakpoint = 'xs';

  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }

  return undefined;
};

// Hook to get current screen dimensions
export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = React.useState(() => {
    const { Dimensions } = require('react-native');
    return Dimensions.get('window');
  });

  React.useEffect(() => {
    const { Dimensions } = require('react-native');
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// Hook to check if device is in dark mode
export const useColorScheme = (): ColorSchemeName => {
  const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(() => 
    Appearance.getColorScheme()
  );

  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  return colorScheme;
};

// Utility to create platform-specific styles
export const createThemedStyles = <T extends Record<string, any>>(
  stylesFn: (tokens: DesignTokens, isDark: boolean) => T
) => {
  return (): T => {
    const { resolvedTokens, isDark } = useTheme();
    return stylesFn(resolvedTokens, isDark);
  };
};
