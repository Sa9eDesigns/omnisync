# Migration Guide: Universal UI System

This guide helps you migrate from the legacy UI components to the new Universal UI System.

## 🎯 Why Migrate?

The Universal UI System provides:

- **Single API** across Web, React Native, and Electron
- **Better Performance** with platform-optimized rendering
- **Consistent Design** with universal design tokens
- **Enhanced Developer Experience** with better TypeScript support
- **Future-Proof** architecture inspired by modern UI libraries

## 🚀 Quick Migration

### Before (Legacy)

```tsx
// Web
import { Button, Card, InputComponent } from "@omnisync/ui";
import "@omnisync/ui/src/styles/base.css";

// React Native
import { Button, Card, Input } from "@omnisync/ui/native";

function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Legacy Component</Card.Title>
      </Card.Header>
      <Card.Content>
        <InputComponent
          label="Email"
          placeholder="Enter email"
          fullWidth
        />
        <Button variant="primary">Submit</Button>
      </Card.Content>
    </Card>
  );
}
```

### After (Universal)

```tsx
// Single import for all platforms
import {
  ThemeProvider,
  Button,
  Card,
  Input,
  Stack,
} from "@omnisync/ui/universal";

function MyComponent() {
  return (
    <ThemeProvider>
      <Card>
        <Card.Header>
          <Card.Title>Universal Component</Card.Title>
        </Card.Header>
        <Card.Content>
          <Stack spacing={3}>
            <Input
              label="Email"
              placeholder="Enter email"
              fullWidth
            />
            <Button variant="primary">Submit</Button>
          </Stack>
        </Card.Content>
      </Card>
    </ThemeProvider>
  );
}
```

## 📋 Component Migration Map

### Core Components

| Legacy | Universal | Changes |
|--------|-----------|---------|
| `Button` | `Button` | ✅ Same API, enhanced with universal props |
| `InputComponent` | `Input` | ✅ Simplified name, same functionality |
| `Card` | `Card` | ✅ Same compound component pattern |
| `Badge` | `Badge` | ✅ Same API |

### Layout Components

| Legacy | Universal | Changes |
|--------|-----------|---------|
| `Layout` | `Stack`, `VStack`, `HStack` | 🔄 More semantic components |
| Custom divs | `Box` | ✅ Universal container component |
| - | `Container` | 🆕 New responsive container |
| - | `Grid`, `GridItem` | 🆕 New grid system |

### New Universal Components

| Component | Description |
|-----------|-------------|
| `ThemeProvider` | Universal theme system |
| `Heading` | Semantic heading component |
| `Text` | Universal text component |
| `Center` | Centering layout component |
| `Spacer` | Flexible spacer component |

## 🔧 Step-by-Step Migration

### Step 1: Install Dependencies

No additional dependencies needed - the universal system is included in `@omnisync/ui`.

### Step 2: Update Imports

```tsx
// Before
import { Button, Card } from "@omnisync/ui";
// or
import { Button, Card } from "@omnisync/ui/native";

// After
import { Button, Card } from "@omnisync/ui/universal";
```

### Step 3: Add Theme Provider

Wrap your app with the ThemeProvider:

```tsx
import { ThemeProvider } from "@omnisync/ui/universal";

function App() {
  return (
    <ThemeProvider defaultMode="system">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Step 4: Update Component Usage

Most components have the same API, but some have enhancements:

#### Button Migration

```tsx
// Before
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>

// After (same API + universal props)
<Button 
  variant="primary" 
  size="md" 
  loading={false}
  // New universal props
  fullWidth={{ xs: true, md: false }}
  hoverStyle={{ transform: [{ scale: 1.05 }] }}
>
  Click me
</Button>
```

#### Input Migration

```tsx
// Before
<InputComponent
  label="Email"
  placeholder="Enter email"
  error="Email is required"
  fullWidth
/>

// After (simplified name)
<Input
  label="Email"
  placeholder="Enter email"
  error="Email is required"
  fullWidth
/>
```

#### Layout Migration

```tsx
// Before (custom layout)
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// After (semantic components)
<Stack spacing={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>
```

### Step 5: Leverage New Features

Take advantage of universal system features:

#### Design Tokens

```tsx
// Before (hardcoded values)
<div style={{ padding: 16, backgroundColor: '#3b82f6' }}>

// After (design tokens)
<Box p={4} bg="primary500">
```

#### Responsive Props

```tsx
// Before (media queries)
<Button className="w-full md:w-auto">

// After (responsive props)
<Button fullWidth={{ xs: true, md: false }}>
```

#### Theme Integration

```tsx
import { useTheme, useTokens } from "@omnisync/ui/universal";

function ThemedComponent() {
  const { isDark, setMode } = useTheme();
  const tokens = useTokens();
  
  return (
    <Box bg={isDark ? 'gray800' : 'white'}>
      <Button onPress={() => setMode(isDark ? 'light' : 'dark')}>
        Toggle Theme
      </Button>
    </Box>
  );
}
```

## 🔄 Gradual Migration Strategy

You can migrate gradually by using both systems side by side:

### Option 1: Aliased Imports

```tsx
// Keep legacy components with different names
import { 
  Button as LegacyButton,
  Card as LegacyCard 
} from "@omnisync/ui";

import { 
  Button as UniversalButton,
  Card as UniversalCard 
} from "@omnisync/ui/universal";

// Use both in the same component
function MixedComponent() {
  return (
    <div>
      <LegacyCard>Legacy card</LegacyCard>
      <UniversalCard>Universal card</UniversalCard>
    </div>
  );
}
```

### Option 2: Feature-by-Feature Migration

Migrate one feature/page at a time:

```tsx
// pages/legacy-page.tsx
import { Button, Card } from "@omnisync/ui";

// pages/new-page.tsx
import { Button, Card } from "@omnisync/ui/universal";
```

## ⚠️ Breaking Changes

### Removed Components

These legacy components are not available in the universal system:

- `ComponentShowcase` - Use individual components instead
- `AudioControlPanel` - Rebuild using universal components
- Platform-specific utilities - Use `Platform.select()` instead

### Changed APIs

#### InputComponent → Input

```tsx
// Before
<InputComponent />

// After
<Input />
```

#### Layout → Stack/Box

```tsx
// Before
<Layout direction="column" gap={4}>

// After
<Stack spacing={4}>
```

### Styling Changes

#### CSS Classes → Styled Props

```tsx
// Before
<Button className="w-full bg-blue-500">

// After
<Button fullWidth bg="primary500">
```

## 🧪 Testing Migration

### Unit Tests

Update your tests to use universal components:

```tsx
// Before
import { Button } from "@omnisync/ui";
import { render, fireEvent } from "@testing-library/react";

// After
import { Button, ThemeProvider } from "@omnisync/ui/universal";
import { render, fireEvent } from "@testing-library/react";

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

test('button click', () => {
  const { getByText } = renderWithTheme(
    <Button onPress={mockFn}>Click me</Button>
  );
  // ... test logic
});
```

### Visual Regression Tests

The universal components should look identical to legacy components, but verify with visual tests.

## 🚀 Advanced Features

After migration, explore advanced universal system features:

### Custom Components

```tsx
import { createComponent } from "@omnisync/ui/universal";

const CustomButton = createComponent(
  'button',
  {
    px: 4,
    py: 2,
    borderRadius: 'md',
    backgroundColor: 'primary500',
  },
  {
    variant: {
      solid: { backgroundColor: 'primary500' },
      outline: { backgroundColor: 'transparent', borderWidth: 1 },
    },
  }
);
```

### Animation System

```tsx
import { useAnimation } from "@omnisync/ui/universal";

function AnimatedComponent() {
  const { animate } = useAnimation();
  
  return (
    <Button
      enterStyle={{ opacity: 0, scale: 0.9 }}
      exitStyle={{ opacity: 0, scale: 0.9 }}
      hoverStyle={{ scale: 1.05 }}
      pressStyle={{ scale: 0.95 }}
    >
      Animated Button
    </Button>
  );
}
```

## 🆘 Troubleshooting

### Common Issues

#### Theme Provider Missing

```
Error: useTheme must be used within a ThemeProvider
```

**Solution**: Wrap your app with ThemeProvider:

```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

#### Platform Detection Issues

If components don't render correctly on a specific platform:

```tsx
import { Platform } from "@omnisync/ui/universal";

console.log('Platform:', {
  isWeb: Platform.isWeb,
  isReactNative: Platform.isReactNative,
  isElectron: Platform.isElectron,
});
```

#### TypeScript Errors

Update your TypeScript configuration to include the new types:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## 📞 Support

- 📖 **Documentation**: [UNIVERSAL_UI_SYSTEM.md](./UNIVERSAL_UI_SYSTEM.md)
- 🧪 **Examples**: `src/examples/UniversalExample.tsx`
- 🐛 **Issues**: Create an issue in the repository
- 💬 **Discussions**: Use GitHub Discussions for questions

## 🎉 Benefits After Migration

After migrating to the universal system, you'll enjoy:

- **Reduced Bundle Size** - Single implementation across platforms
- **Better Performance** - Platform-optimized rendering
- **Consistent Design** - Universal design tokens
- **Enhanced DX** - Better TypeScript support and IntelliSense
- **Future-Proof** - Modern architecture that scales
- **Easier Maintenance** - Single codebase for all platforms

Happy migrating! 🚀
