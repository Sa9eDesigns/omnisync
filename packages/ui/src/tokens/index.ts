// Universal Design Tokens System for OmniSync
// Inspired by Tamagui's universal design approach
// Works across Web, React Native, and Electron

export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
  breakpoints: BreakpointTokens;
  animations: AnimationTokens;
  zIndex: ZIndexTokens;
}

// Color System - HSL based for better manipulation
export interface ColorTokens {
  // Base colors
  white: string;
  black: string;
  transparent: string;
  
  // Gray scale
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;
  gray950: string;
  
  // Primary brand colors
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;
  primary950: string;
  
  // Semantic colors
  success50: string;
  success500: string;
  success600: string;
  success700: string;
  
  warning50: string;
  warning500: string;
  warning600: string;
  warning700: string;
  
  error50: string;
  error500: string;
  error600: string;
  error700: string;
  
  info50: string;
  info500: string;
  info600: string;
  info700: string;
  
  // Audio-specific colors
  audio50: string;
  audio500: string;
  audio600: string;
  audio700: string;
}

// Spacing System - Based on 4px grid
export interface SpacingTokens {
  0: number;
  1: number;    // 4px
  2: number;    // 8px
  3: number;    // 12px
  4: number;    // 16px
  5: number;    // 20px
  6: number;    // 24px
  8: number;    // 32px
  10: number;   // 40px
  12: number;   // 48px
  16: number;   // 64px
  20: number;   // 80px
  24: number;   // 96px
  32: number;   // 128px
  40: number;   // 160px
  48: number;   // 192px
  56: number;   // 224px
  64: number;   // 256px
}

// Typography System
export interface TypographyTokens {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
  };
  fontWeight: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: number;
    tight: number;
    normal: number;
    wide: number;
    wider: number;
    widest: number;
  };
}

// Border Radius System
export interface BorderRadiusTokens {
  none: number;
  sm: number;
  base: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  full: number;
}

// Shadow System
export interface ShadowTokens {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

// Breakpoint System
export interface BreakpointTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

// Animation System
export interface AnimationTokens {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
    spring: string;
  };
}

// Z-Index System
export interface ZIndexTokens {
  hide: number;
  auto: number;
  base: number;
  docked: number;
  dropdown: number;
  sticky: number;
  banner: number;
  overlay: number;
  modal: number;
  popover: number;
  skipLink: number;
  toast: number;
  tooltip: number;
}

// Default token values
export const defaultTokens: DesignTokens = {
  colors: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
    
    // Gray scale
    gray50: 'hsl(210, 40%, 98%)',
    gray100: 'hsl(210, 40%, 96%)',
    gray200: 'hsl(214, 32%, 91%)',
    gray300: 'hsl(213, 27%, 84%)',
    gray400: 'hsl(215, 20%, 65%)',
    gray500: 'hsl(215, 16%, 47%)',
    gray600: 'hsl(215, 19%, 35%)',
    gray700: 'hsl(215, 25%, 27%)',
    gray800: 'hsl(217, 33%, 17%)',
    gray900: 'hsl(222, 84%, 5%)',
    gray950: 'hsl(229, 84%, 5%)',
    
    // Primary brand colors (Blue)
    primary50: 'hsl(214, 100%, 97%)',
    primary100: 'hsl(214, 95%, 93%)',
    primary200: 'hsl(213, 97%, 87%)',
    primary300: 'hsl(212, 96%, 78%)',
    primary400: 'hsl(213, 94%, 68%)',
    primary500: 'hsl(217, 91%, 60%)',
    primary600: 'hsl(221, 83%, 53%)',
    primary700: 'hsl(224, 76%, 48%)',
    primary800: 'hsl(226, 71%, 40%)',
    primary900: 'hsl(224, 64%, 33%)',
    primary950: 'hsl(226, 55%, 21%)',
    
    // Semantic colors
    success50: 'hsl(138, 76%, 97%)',
    success500: 'hsl(142, 71%, 45%)',
    success600: 'hsl(142, 76%, 36%)',
    success700: 'hsl(142, 72%, 29%)',
    
    warning50: 'hsl(48, 100%, 96%)',
    warning500: 'hsl(38, 92%, 50%)',
    warning600: 'hsl(32, 95%, 44%)',
    warning700: 'hsl(26, 90%, 37%)',
    
    error50: 'hsl(0, 86%, 97%)',
    error500: 'hsl(0, 84%, 60%)',
    error600: 'hsl(0, 72%, 51%)',
    error700: 'hsl(0, 74%, 42%)',
    
    info50: 'hsl(204, 100%, 97%)',
    info500: 'hsl(204, 94%, 94%)',
    info600: 'hsl(204, 91%, 53%)',
    info700: 'hsl(204, 80%, 44%)',
    
    // Audio-specific colors
    audio50: 'hsl(280, 100%, 97%)',
    audio500: 'hsl(280, 100%, 70%)',
    audio600: 'hsl(280, 100%, 60%)',
    audio700: 'hsl(280, 100%, 50%)',
  },
  
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
    40: 160,
    48: 192,
    56: 224,
    64: 256,
  },
  
  typography: {
    fontFamily: {
      sans: [
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
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
      '6xl': 60,
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: -0.05,
      tight: -0.025,
      normal: 0,
      wide: 0.025,
      wider: 0.05,
      widest: 0.1,
    },
  },
  
  borderRadius: {
    none: 0,
    sm: 2,
    base: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  breakpoints: {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  
  zIndex: {
    hide: -1,
    auto: 0,
    base: 1,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};
