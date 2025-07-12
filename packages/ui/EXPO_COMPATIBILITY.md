# Expo/React Native Compatibility Guide

The @omnisync/ui package provides **dual compatibility** for both web and React Native/Expo applications through separate component implementations.

## 🎯 Compatibility Overview

### ✅ Web Components (Default Export)
- Built with Base UI and CSS
- Optimized for web browsers
- Full responsive design with CSS Grid/Flexbox
- Import from main package: `import { Button } from "@omnisync/ui"`

### ✅ React Native Components (Native Export)
- Built with React Native primitives
- Compatible with Expo and bare React Native
- Platform-specific optimizations (iOS/Android)
- Import from native subpath: `import { Button } from "@omnisync/ui/native"`

## 📱 React Native/Expo Setup

### Prerequisites

```bash
# Required peer dependencies
npm install react-native-gesture-handler react-native-safe-area-context

# For Expo projects
expo install react-native-gesture-handler react-native-safe-area-context

# Optional but recommended
expo install expo-haptics expo-screen-orientation @react-native-community/netinfo
```

### Installation

```bash
# Install the UI package
pnpm add @omnisync/ui

# Or with npm
npm install @omnisync/ui
```

### Basic Usage

```tsx
// App.tsx - Expo/React Native
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import from native subpath
import { 
  Screen, 
  Container, 
  Stack, 
  Button, 
  Card,
  Modal 
} from '@omnisync/ui/native';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Screen scrollable backgroundColor="#f9fafb">
          <Container>
            <Stack gap="lg">
              <Card>
                <Card.Header>
                  <Card.Title>Welcome to OmniSync</Card.Title>
                  <Card.Description>
                    React Native UI components
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <Button variant="primary" fullWidth>
                    Get Started
                  </Button>
                </Card.Content>
              </Card>
            </Stack>
          </Container>
        </Screen>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

## 🔧 Available Native Components

### Core Components
```tsx
import { 
  Button, 
  IconButton,
  Input, 
  PasswordInput, 
  SearchInput,
  Textarea 
} from '@omnisync/ui/native';

// Button with haptic feedback
<Button 
  variant="primary" 
  size="lg" 
  loading={false}
  hapticFeedback={true}
  leftIcon={<Icon />}
  onPress={() => console.log('Pressed!')}
>
  Native Button
</Button>

// Input with platform-specific styling
<Input
  label="Email"
  placeholder="Enter your email"
  variant="filled"
  leftIcon={<EmailIcon />}
  error="Email is required"
/>
```

### Layout Components
```tsx
import { 
  Layout, 
  Screen, 
  Container, 
  Stack, 
  Inline, 
  Grid,
  Section 
} from '@omnisync/ui/native';

// Responsive layout
<Screen scrollable edges={['top', 'bottom']}>
  <Container size="lg" padding>
    <Stack gap="lg">
      <Section title="Dashboard" subtitle="Overview">
        <Grid cols={2} gap="md">
          <Card>Item 1</Card>
          <Card>Item 2</Card>
        </Grid>
      </Section>
    </Stack>
  </Container>
</Screen>
```

### Modal & Sheets
```tsx
import { 
  Modal, 
  BottomSheet, 
  ModalHeader, 
  ModalContent 
} from '@omnisync/ui/native';

// Native modal with gestures
<Modal
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  position="bottom"
  size="lg"
  dismissible
>
  <ModalHeader 
    title="Settings" 
    onClose={() => setIsVisible(false)} 
  />
  <ModalContent scrollable>
    <Text>Modal content here</Text>
  </ModalContent>
</Modal>

// Bottom sheet with pan gestures
<BottomSheet
  visible={isSheetVisible}
  onClose={() => setIsSheetVisible(false)}
  enablePanDownToClose
  snapPoints={['50%', '80%']}
>
  <Text>Swipe down to close</Text>
</BottomSheet>
```

### Cards & Data Display
```tsx
import { 
  Card, 
  StatsCard, 
  Badge 
} from '@omnisync/ui/native';

// Interactive card with haptics
<Card 
  variant="default" 
  interactive 
  onPress={() => console.log('Card pressed')}
>
  <Card.Header>
    <Card.Title>Audio Device</Card.Title>
    <Card.Description>Connected via Bluetooth</Card.Description>
  </Card.Header>
  <Card.Content>
    <Badge variant="success">Online</Badge>
  </Card.Content>
</Card>

// Stats card with trend
<StatsCard
  title="Active Devices"
  value="12"
  description="Connected audio devices"
  trend={{ value: 8.2, isPositive: true }}
  icon={<DeviceIcon />}
/>
```

## 🎨 Styling System

### Colors & Typography
```tsx
import { colors, typography, spacing } from '@omnisync/ui/native/utils/styling';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[500],
    padding: spacing[4],
    borderRadius: 8,
  },
  text: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray[900],
  },
});
```

### Responsive Design
```tsx
import { useResponsive } from '@omnisync/ui/native';

const MyComponent = () => {
  const { isMobile, isTablet, select } = useResponsive();
  
  const fontSize = select({
    mobile: 14,
    tablet: 16,
    desktop: 18,
  });
  
  return (
    <Text style={{ fontSize }}>
      Responsive text
    </Text>
  );
};
```

### Platform Utilities
```tsx
import { platform, haptics, safeArea } from '@omnisync/ui/native/utils/platform';

// Platform detection
if (platform.isIOS) {
  // iOS specific code
  haptics.success();
}

// Safe area handling
const styles = StyleSheet.create({
  container: {
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
  },
});
```

## 🔄 Cross-Platform Development

### Shared Logic
```tsx
// hooks/useAudioStream.ts - Works on both platforms
import { useAudioStream } from '@omnisync/ui/hooks/useAudioStream';

const MyComponent = () => {
  const {
    stream,
    isStreaming,
    startStream,
    stopStream,
    error
  } = useAudioStream({
    onStreamStart: (stream) => console.log('Started'),
    onError: (error) => console.error(error)
  });
  
  // Same logic works on web and native
};
```

### Platform-Specific UI
```tsx
// components/AudioControls.tsx
import { Platform } from 'react-native';

// Web version
import { AudioControls as WebAudioControls } from '@omnisync/ui';

// Native version  
import { AudioControls as NativeAudioControls } from '@omnisync/ui/native';

export const AudioControls = Platform.OS === 'web' 
  ? WebAudioControls 
  : NativeAudioControls;
```

## 📋 Migration Guide

### From Web to Native
```tsx
// Before (Web)
import { Button, Card } from '@omnisync/ui';

// After (Native)
import { Button, Card } from '@omnisync/ui/native';

// API remains the same!
<Button variant="primary">Click me</Button>
```

### Styling Differences
```tsx
// Web (CSS classes)
<div className="flex items-center gap-4">
  <Button>Web Button</Button>
</div>

// Native (StyleSheet)
<View style={styles.container}>
  <Button>Native Button</Button>
</View>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
```

## 🚀 Performance Optimizations

### Native Optimizations
- **Haptic Feedback**: iOS/Android haptic responses
- **Platform Styling**: iOS/Android specific designs
- **Gesture Handling**: Native pan/swipe gestures
- **Safe Areas**: Automatic safe area handling
- **Memory Management**: Optimized for mobile devices

### Best Practices
1. **Use Native Components**: Always import from `/native` for React Native
2. **Leverage Platform Utils**: Use platform detection for specific features
3. **Optimize Images**: Use appropriate image formats for mobile
4. **Handle Gestures**: Implement swipe and pan gestures where appropriate
5. **Test on Device**: Always test on physical devices

## 🐛 Troubleshooting

### Common Issues

1. **Gesture Handler Not Working**
   ```tsx
   // Wrap your app with GestureHandlerRootView
   import { GestureHandlerRootView } from 'react-native-gesture-handler';
   
   export default function App() {
     return (
       <GestureHandlerRootView style={{ flex: 1 }}>
         <YourApp />
       </GestureHandlerRootView>
     );
   }
   ```

2. **Safe Area Issues**
   ```tsx
   // Use SafeAreaProvider
   import { SafeAreaProvider } from 'react-native-safe-area-context';
   
   export default function App() {
     return (
       <SafeAreaProvider>
         <YourApp />
       </SafeAreaProvider>
     );
   }
   ```

3. **Import Errors**
   ```tsx
   // ❌ Wrong - imports web components
   import { Button } from '@omnisync/ui';
   
   // ✅ Correct - imports native components
   import { Button } from '@omnisync/ui/native';
   ```

## 📚 Examples

See the `/examples` directory for complete Expo and React Native examples demonstrating:
- Audio streaming interface
- Device management screens
- Settings and configuration
- Real-time metrics display

The native components provide the same API as web components while being optimized for mobile platforms!
