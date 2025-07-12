// Universal Theme Provider for Cross-Platform UI System
// Works across Web, React Native, and Electron

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { DesignTokens, defaultTokens } from '../tokens';

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
}

// Create theme context
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Theme provider props
export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  tokens?: Partial<DesignTokens>;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

// Dark theme token overrides
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

// Utility to detect system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'system',
  tokens: customTokens,
  storageKey = 'omnisync-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
}) => {
  // State for theme mode
  const [mode, setModeState] = React.useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    
    try {
      const stored = localStorage.getItem(storageKey);
      return (stored as ThemeMode) || defaultMode;
    } catch {
      return defaultMode;
    }
  });

  // System theme detection
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(() => getSystemTheme());

  // Listen for system theme changes
  React.useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystem]);

  // Resolve actual theme mode
  const resolvedMode = mode === 'system' ? systemTheme : mode;
  const isDark = resolvedMode === 'dark';

  // Set theme mode with persistence
  const setMode = React.useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    
    try {
      localStorage.setItem(storageKey, newMode);
    } catch {
      // Ignore localStorage errors
    }
  }, [storageKey]);

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

  // Apply theme to document
  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(resolvedMode);
    
    // Set CSS custom properties for tokens
    const setCustomProperty = (name: string, value: string | number) => {
      root.style.setProperty(`--omnisync-${name}`, String(value));
    };

    // Set color tokens
    Object.entries(resolvedTokens.colors).forEach(([key, value]) => {
      setCustomProperty(`color-${key}`, value);
    });

    // Set spacing tokens
    Object.entries(resolvedTokens.spacing).forEach(([key, value]) => {
      setCustomProperty(`spacing-${key}`, `${value}px`);
    });

    // Set typography tokens
    setCustomProperty('font-family-sans', resolvedTokens.typography.fontFamily.sans.join(', '));
    setCustomProperty('font-family-mono', resolvedTokens.typography.fontFamily.mono.join(', '));
    
    Object.entries(resolvedTokens.typography.fontSize).forEach(([key, value]) => {
      setCustomProperty(`font-size-${key}`, `${value}px`);
    });

    Object.entries(resolvedTokens.typography.fontWeight).forEach(([key, value]) => {
      setCustomProperty(`font-weight-${key}`, String(value));
    });

    // Set border radius tokens
    Object.entries(resolvedTokens.borderRadius).forEach(([key, value]) => {
      setCustomProperty(`border-radius-${key}`, `${value}px`);
    });

    // Set shadow tokens
    Object.entries(resolvedTokens.shadows).forEach(([key, value]) => {
      setCustomProperty(`shadow-${key}`, value);
    });

    // Set z-index tokens
    Object.entries(resolvedTokens.zIndex).forEach(([key, value]) => {
      setCustomProperty(`z-index-${key}`, String(value));
    });

    // Handle transitions
    if (!disableTransitionOnChange) {
      root.style.setProperty('--omnisync-transition-theme', 'color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease');
    }
  }, [resolvedTokens, resolvedMode, disableTransitionOnChange]);

  // Context value
  const contextValue: ThemeContextValue = useMemo(() => ({
    mode,
    tokens: defaultTokens,
    isDark,
    setMode,
    resolvedTokens,
  }), [mode, isDark, setMode, resolvedTokens]);

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

// Hook for responsive values
export function useResponsiveValue<T>(values: Partial<Record<keyof DesignTokens['breakpoints'], T>>): T | undefined {
  const { resolvedTokens } = useTheme();
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<keyof DesignTokens['breakpoints'] | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const breakpoints = resolvedTokens.breakpoints;
      
      if (width >= breakpoints['2xl']) setCurrentBreakpoint('2xl');
      else if (width >= breakpoints.xl) setCurrentBreakpoint('xl');
      else if (width >= breakpoints.lg) setCurrentBreakpoint('lg');
      else if (width >= breakpoints.md) setCurrentBreakpoint('md');
      else if (width >= breakpoints.sm) setCurrentBreakpoint('sm');
      else setCurrentBreakpoint('xs');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [resolvedTokens.breakpoints]);

  if (!currentBreakpoint) return undefined;

  // Find the appropriate value for current breakpoint
  const breakpointOrder: (keyof DesignTokens['breakpoints'])[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }

  return undefined;
}
