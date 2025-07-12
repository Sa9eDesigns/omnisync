# Universal UI System for OmniSync

A production-grade, cross-platform UI system inspired by Tamagui that works seamlessly across **Web**, **React Native/Expo**, and **Electron** applications.

## 🎯 Overview

The Universal UI System provides a unified API for building user interfaces that work consistently across all platforms while leveraging platform-specific optimizations.

### Key Features

- 🌐 **Cross-Platform**: Single API works on Web, React Native, and Electron
- 🎨 **Design Tokens**: Consistent design system with universal tokens
- 📱 **Responsive**: Adaptive layouts with breakpoint-based styling
- 🎭 **Theming**: Light/dark mode with automatic system detection
- ⚡ **Performance**: Platform-optimized rendering and animations
- ♿ **Accessibility**: WCAG 2.1 AA compliant components
- 🔧 **TypeScript**: Full type safety with intelligent IntelliSense
- 🎪 **Variants**: Powerful variant system for component customization

## 🚀 Quick Start

### Installation

```bash
# Install the UI package
pnpm add @omnisync/ui

# For React Native/Expo projects, install peer dependencies
pnpm add react-native-gesture-handler react-native-safe-area-context
```

### Basic Usage

```tsx
import React from 'react';
import {
  ThemeProvider,
  Button,
  Card,
  Input,
  Stack,
  Heading,
} from '@omnisync/ui/universal';

function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Stack spacing={4} p={6}>
        <Heading size="xl">Welcome to OmniSync</Heading>
        
        <Card>
          <Card.Header>
            <Card.Title>Universal Components</Card.Title>
            <Card.Description>
              Components that work everywhere
            </Card.Description>
          </Card.Header>
          
          <Card.Content>
            <Stack spacing={3}>
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                fullWidth
              />
              
              <Button variant="primary" fullWidth>
                Get Started
              </Button>
            </Stack>
          </Card.Content>
        </Card>
      </Stack>
    </ThemeProvider>
  );
}
```

## 🏗️ Architecture

### Design Tokens

The system is built on a comprehensive design token system that ensures consistency across platforms:

```tsx
import { useTokens } from '@omnisync/ui/universal';

function MyComponent() {
  const tokens = useTokens();
  
  return (
    <div style={{
      padding: tokens.spacing[4],
      backgroundColor: tokens.colors.primary500,
      borderRadius: tokens.borderRadius.md,
    }}>
      Styled with design tokens
    </div>
  );
}
```

### Styled System

Create custom components using the universal styled system:

```tsx
import { createComponent } from '@omnisync/ui/universal';

const CustomButton = createComponent(
  'button', // or 'TouchableOpacity' for React Native
  {
    // Default props
    px: 4,
    py: 2,
    borderRadius: 'md',
    backgroundColor: 'primary500',
    color: 'white',
  },
  {
    // Variants
    variant: {
      solid: { backgroundColor: 'primary500' },
      outline: { backgroundColor: 'transparent', borderWidth: 1 },
    },
    size: {
      sm: { px: 3, py: 1, fontSize: 'sm' },
      lg: { px: 6, py: 3, fontSize: 'lg' },
    },
  }
);
```

### Platform Detection

The system automatically detects the platform and optimizes accordingly:

```tsx
import { Platform } from '@omnisync/ui/universal';

const styles = Platform.select({
  web: { cursor: 'pointer' },
  native: { elevation: 4 },
  electron: { WebkitAppRegion: 'drag' },
  default: { opacity: 1 },
});
```

## 🎨 Theming

### Theme Provider

Wrap your app with the ThemeProvider to enable theming:

```tsx
import { ThemeProvider } from '@omnisync/ui/universal';

function App() {
  return (
    <ThemeProvider
      defaultMode="system" // 'light' | 'dark' | 'system'
      enableSystem={true}
      storageKey="omnisync-theme"
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### Custom Themes

Create custom themes by extending the default tokens:

```tsx
import { createTheme } from '@omnisync/ui/universal';

const customTheme = createTheme({
  colors: {
    primary500: '#ff6b6b',
    primary600: '#ee5a52',
    // ... other custom colors
  },
  spacing: {
    // Custom spacing values
  },
});

function App() {
  return (
    <ThemeProvider tokens={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Theme Hooks

Access theme values in your components:

```tsx
import { useTheme, useTokens } from '@omnisync/ui/universal';

function ThemedComponent() {
  const { mode, isDark, setMode } = useTheme();
  const tokens = useTokens();
  
  return (
    <div style={{ color: tokens.colors.gray900 }}>
      Current theme: {mode}
      <button onClick={() => setMode(isDark ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## 📱 Responsive Design

### Breakpoint System

The system includes a comprehensive breakpoint system:

```tsx
import { useBreakpoint } from '@omnisync/ui/universal';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();
  
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 2, md: 4 }}
    >
      <Box flex={{ xs: 1, md: 2 }}>Content</Box>
      <Box flex={1}>Sidebar</Box>
    </Stack>
  );
}
```

### Responsive Props

Most components support responsive props:

```tsx
<Button
  size={{ xs: 'sm', md: 'md', lg: 'lg' }}
  fullWidth={{ xs: true, md: false }}
>
  Responsive Button
</Button>
```

## 🧩 Components

### Universal Button

```tsx
<Button
  variant="primary" // primary | secondary | outline | ghost | destructive
  size="md" // sm | md | lg
  loading={false}
  disabled={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  fullWidth={false}
  onPress={() => console.log('Pressed!')}
>
  Click Me
</Button>
```

### Universal Card

```tsx
<Card
  variant="elevated" // default | elevated | outlined | filled
  size="md" // sm | md | lg
  interactive={true}
  onPress={() => console.log('Card pressed!')}
>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description</Card.Description>
  </Card.Header>
  
  <Card.Content>
    Card content goes here
  </Card.Content>
  
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Universal Input

```tsx
<Input
  variant="outline" // outline | filled | flushed | unstyled
  size="md" // sm | md | lg
  label="Email Address"
  placeholder="Enter your email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  helperText="We'll never share your email"
  leftIcon={<EmailIcon />}
  rightElement={<Button size="sm">Send</Button>}
  required
  fullWidth
/>
```

## 🎭 Layout Components

### Stack Components

```tsx
// Vertical stack
<VStack spacing={4} align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</VStack>

// Horizontal stack
<HStack spacing={3} justify="space-between">
  <Text>Left</Text>
  <Text>Right</Text>
</HStack>
```

### Grid System

```tsx
<Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap={4}>
  <GridItem span={{ xs: 1, lg: 2 }}>
    <Card>Main Content</Card>
  </GridItem>
  <GridItem>
    <Card>Sidebar</Card>
  </GridItem>
</Grid>
```

### Container

```tsx
<Container size="xl" centerContent>
  <Heading>Centered Content</Heading>
</Container>
```

## 🎬 Animations

### Built-in Animations

```tsx
import { useAnimation } from '@omnisync/ui/universal';

function AnimatedComponent() {
  const { animate } = useAnimation();
  
  const handleClick = () => {
    animate(elementRef.current, 'fadeIn', {
      duration: 'normal',
      easing: 'easeOut',
    });
  };
  
  return <Button onPress={handleClick}>Animate</Button>;
}
```

### Animation Props

```tsx
<Button
  enterStyle={{ opacity: 0, scale: 0.9 }}
  exitStyle={{ opacity: 0, scale: 0.9 }}
  animation="bouncy"
  hoverStyle={{ scale: 1.05 }}
  pressStyle={{ scale: 0.95 }}
>
  Animated Button
</Button>
```

## 🔧 Platform-Specific Features

### Web-Specific

```tsx
// CSS classes and web-specific props
<Button className="custom-button" type="submit">
  Submit Form
</Button>
```

### React Native-Specific

```tsx
// React Native specific props
<Button
  hapticFeedback={true}
  activeOpacity={0.8}
  onPress={() => console.log('Native press')}
>
  Native Button
</Button>
```

### Electron-Specific

```tsx
// Electron window controls
<Box
  style={{ WebkitAppRegion: 'drag' }}
  height={30}
  backgroundColor="gray100"
>
  <Text>Draggable Title Bar</Text>
</Box>
```

## 🎯 Best Practices

### 1. Use Design Tokens

Always use design tokens instead of hardcoded values:

```tsx
// ✅ Good
<Box p={4} bg="primary500" borderRadius="md" />

// ❌ Bad
<Box style={{ padding: 16, backgroundColor: '#3b82f6', borderRadius: 6 }} />
```

### 2. Leverage Responsive Props

Use responsive props for adaptive layouts:

```tsx
// ✅ Good
<Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 4 }}>

// ❌ Bad - not responsive
<Stack direction="row" spacing={4}>
```

### 3. Use Semantic Components

Choose semantic components over generic ones:

```tsx
// ✅ Good
<Heading size="xl">Page Title</Heading>

// ❌ Bad
<Text fontSize="2xl" fontWeight="bold">Page Title</Text>
```

### 4. Platform-Specific Optimizations

Use platform detection for optimizations:

```tsx
const buttonProps = Platform.select({
  web: { type: 'submit' },
  native: { hapticFeedback: true },
});

<Button {...buttonProps}>Submit</Button>
```

## 📚 Examples

See the complete example in `src/examples/UniversalExample.tsx` for a comprehensive demonstration of all features.

## 🤝 Contributing

1. Follow the existing component patterns
2. Ensure cross-platform compatibility
3. Add comprehensive TypeScript types
4. Include responsive and accessibility features
5. Write tests for all platforms

## 📄 License

MIT License - see LICENSE file for details.
