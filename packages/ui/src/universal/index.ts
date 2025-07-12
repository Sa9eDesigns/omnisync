// Universal Cross-Platform UI Components
// Works seamlessly across Web, React Native, and Electron
// Inspired by Tamagui's universal design approach

// Design Tokens & Theme System
export * from '../tokens';
export * from '../theme/ThemeProvider';

// Styled System
export * from '../system/styled';
export * from '../system/createStyledComponent';
export * from '../system/animations';

// Universal Components
export { UniversalButton as Button } from '../components/UniversalButton';
export { Card, UniversalCard } from '../components/UniversalCard';
export { UniversalInput as Input } from '../components/UniversalInput';

// New Universal Components
export { Alert, AlertTitle, AlertDescription } from '../components/Alert';
export { Badge } from '../components/NewBadge';
export { Avatar, AvatarGroup } from '../components/Avatar';
export { Checkbox } from '../components/Checkbox';
export { Switch } from '../components/Switch';
export { Progress, CircularProgress } from '../components/Progress';
export { Slider } from '../components/Slider';
export { Skeleton, SkeletonText, SkeletonCircle, SkeletonRectangle, SkeletonCard } from '../components/Skeleton';
export { Separator } from '../components/Separator';
export { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/NewTabs';
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/Accordion';

// Additional Components
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter
} from '../components/Dialog';
export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from '../components/Modal';
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../components/Select';
export { RadioGroup, RadioItem } from '../components/RadioGroup';
export { Textarea } from '../components/Textarea';
export { Toast, ToastProvider, useToast } from '../components/NewToast';

// Additional UI Components
export { Tooltip } from '../components/Tooltip';
export {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '../components/Popover';
export { Toggle, ToggleGroup, ToggleGroupItem } from '../components/Toggle';
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '../components/Breadcrumb';
export { Calendar } from '../components/Calendar';

// High-Priority Missing Components
export { DataTable } from '../components/DataTable';
export { DatePicker } from '../components/DatePicker';
export {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter
} from '../components/Drawer';
export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup
} from '../components/Menu';
export {
  Spinner,
  DotsSpinner,
  PulseSpinner,
  GridSpinner,
  LoadingOverlay
} from '../components/Spinner';

// Re-export compound components
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/UniversalCard';

// Pre-built styled primitives
export {
  Box,
  Text,
  Heading,
  Button as StyledButton,
  Input as StyledInput,
} from '../system/createStyledComponent';

// Platform-specific theme providers
export { ThemeProvider as WebThemeProvider } from '../theme/ThemeProvider';

// Conditional export for React Native theme provider
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

if (isReactNative) {
  export { ThemeProvider as NativeThemeProvider } from '../theme/native/ThemeProvider';
}

// Utility functions
export const createUniversalComponent = (baseComponent: any, config: any) => {
  const { createStyledComponent } = require('../system/createStyledComponent');
  return createStyledComponent(baseComponent, config);
};

// Platform detection utilities
export const Platform = {
  isWeb: typeof window !== 'undefined',
  isReactNative: typeof navigator !== 'undefined' && navigator.product === 'ReactNative',
  isElectron: typeof window !== 'undefined' && window.process?.type === 'renderer',
  
  select: <T>(platforms: {
    web?: T;
    native?: T;
    electron?: T;
    default?: T;
  }): T | undefined => {
    if (Platform.isElectron && platforms.electron) return platforms.electron;
    if (Platform.isWeb && platforms.web) return platforms.web;
    if (Platform.isReactNative && platforms.native) return platforms.native;
    return platforms.default;
  },
};

// Animation utilities
export { 
  useAnimation,
  predefinedAnimations,
  injectAnimationStyles,
} from '../system/animations';

// Responsive utilities
export const useBreakpoint = () => {
  const { useResponsiveValue } = require('../theme/ThemeProvider');
  return useResponsiveValue({
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
  });
};

// Theme utilities
export const createTheme = (customTokens: any) => {
  const { defaultTokens } = require('../tokens');
  return {
    ...defaultTokens,
    ...customTokens,
    colors: { ...defaultTokens.colors, ...customTokens.colors },
    spacing: { ...defaultTokens.spacing, ...customTokens.spacing },
    typography: {
      ...defaultTokens.typography,
      ...customTokens.typography,
      fontFamily: { ...defaultTokens.typography.fontFamily, ...customTokens.typography?.fontFamily },
      fontSize: { ...defaultTokens.typography.fontSize, ...customTokens.typography?.fontSize },
      fontWeight: { ...defaultTokens.typography.fontWeight, ...customTokens.typography?.fontWeight },
    },
  };
};

// CSS-in-JS utilities for web
export const css = (styles: any) => {
  if (Platform.isWeb) {
    return styles;
  }
  return styles;
};

// Style utilities
export const styled = {
  // Create styled components with variants
  create: createUniversalComponent,
  
  // Style composition utilities
  compose: (...styles: any[]) => {
    return styles.reduce((acc, style) => ({ ...acc, ...style }), {});
  },
  
  // Responsive style helper
  responsive: (values: Record<string, any>) => {
    return Object.entries(values).reduce((acc, [breakpoint, value]) => {
      acc[breakpoint] = value;
      return acc;
    }, {} as any);
  },
};

// Component factory
export const createComponent = (
  baseComponent: any,
  defaultProps: any = {},
  variants: any = {}
) => {
  return createStyledComponent(baseComponent, {
    defaultProps,
    variants,
  });
};

// Layout components
export const Stack = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {
    display: 'flex',
    flexDirection: 'column',
  }
);

export const HStack = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
);

export const VStack = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {
    display: 'flex',
    flexDirection: 'column',
  }
);

export const Center = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
);

export const Spacer = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {
    flex: 1,
  }
);

// Grid system
export const Grid = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {
    display: Platform.isWeb ? 'grid' : 'flex',
    flexWrap: Platform.isWeb ? undefined : 'wrap',
  },
  {
    columns: Platform.isWeb ? {
      1: { gridTemplateColumns: 'repeat(1, 1fr)' },
      2: { gridTemplateColumns: 'repeat(2, 1fr)' },
      3: { gridTemplateColumns: 'repeat(3, 1fr)' },
      4: { gridTemplateColumns: 'repeat(4, 1fr)' },
      6: { gridTemplateColumns: 'repeat(6, 1fr)' },
      12: { gridTemplateColumns: 'repeat(12, 1fr)' },
    } : {
      1: { width: '100%' },
      2: { width: '50%' },
      3: { width: '33.333%' },
      4: { width: '25%' },
      6: { width: '16.666%' },
      12: { width: '8.333%' },
    },
  }
);

export const GridItem = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {},
  {
    span: Platform.isWeb ? {
      1: { gridColumn: 'span 1' },
      2: { gridColumn: 'span 2' },
      3: { gridColumn: 'span 3' },
      4: { gridColumn: 'span 4' },
      6: { gridColumn: 'span 6' },
      12: { gridColumn: 'span 12' },
    } : {
      1: { flex: 1 },
      2: { flex: 2 },
      3: { flex: 3 },
      4: { flex: 4 },
      6: { flex: 6 },
      12: { flex: 12 },
    },
  }
);

// Container component
export const Container = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {
    width: '100%',
    mx: 'auto',
    px: 4,
  },
  {
    size: {
      sm: { maxWidth: 640 },
      md: { maxWidth: 768 },
      lg: { maxWidth: 1024 },
      xl: { maxWidth: 1280 },
      '2xl': { maxWidth: 1536 },
    },
  }
);

// Export everything as a namespace as well
export const OmniUI = {
  // Components
  Button: UniversalButton,
  Card,
  Input: UniversalInput,
  
  // Layout
  Stack,
  HStack,
  VStack,
  Center,
  Spacer,
  Grid,
  GridItem,
  Container,
  
  // Primitives
  Box,
  Text,
  Heading,
  
  // Utilities
  Platform,
  styled,
  createComponent,
  createTheme,
  useBreakpoint,
  
  // Theme
  ThemeProvider: Platform.isReactNative 
    ? require('../theme/native/ThemeProvider').ThemeProvider
    : require('../theme/ThemeProvider').ThemeProvider,
};
