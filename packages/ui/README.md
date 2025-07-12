# @omnisync/ui

Comprehensive, cross-platform UI components for OmniSync with **Universal UI System** inspired by Tamagui.

## 🌟 New: Universal UI System

A production-grade, cross-platform UI system that works seamlessly across **Web**, **React Native/Expo**, and **Electron** applications with a single API.

### Universal Features

- 🌐 **Cross-Platform** - Single API works on Web, React Native, and Electron
- 🎨 **Design Tokens** - Consistent design system with universal tokens
- 📱 **Responsive** - Adaptive layouts with breakpoint-based styling
- 🎭 **Theming** - Light/dark mode with automatic system detection
- ⚡ **Performance** - Platform-optimized rendering and animations
- ♿ **Accessibility** - WCAG 2.1 AA compliant components
- 🔧 **TypeScript** - Full type safety with intelligent IntelliSense
- 🎪 **Variants** - Powerful variant system for component customization

## Legacy Features

- 🎨 **Unstyled Foundation** - Built with Base UI for maximum customization
- 📱 **Mobile-First Design** - Responsive components that work beautifully on all devices
- 🎯 **Audio-Focused** - Specialized components for audio streaming applications
- 🚀 **Performance** - Optimized for mobile devices and low-latency interactions
- 📐 **Flexible Layout** - Comprehensive layout system with responsive utilities

## Installation

This package is part of the OmniSync monorepo and uses workspace dependencies:

```bash
pnpm install
```

### Universal UI System (Recommended)

```tsx
// Single import works across all platforms
import {
  ThemeProvider,
  Button,
  Card,
  Input,
  Stack,
  Heading,
} from "@omnisync/ui/universal";

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

### Platform-Specific Usage (Legacy)

#### Web Applications
```tsx
// Import web-optimized components
import { Button, Card, Layout } from "@omnisync/ui";
import "@omnisync/ui/src/styles/base.css";
```

#### React Native/Expo Applications
```tsx
// Import native-optimized components
import { Button, Card, Layout } from "@omnisync/ui/native";

// Required peer dependencies for React Native
// pnpm add react-native-gesture-handler react-native-safe-area-context
```

> 📱 **Expo Compatibility**: See [EXPO_COMPATIBILITY.md](./EXPO_COMPATIBILITY.md) for complete React Native/Expo setup guide.
> 🌐 **Universal System**: See [UNIVERSAL_UI_SYSTEM.md](./UNIVERSAL_UI_SYSTEM.md) for comprehensive universal system documentation.

## Usage

### Basic Setup

Import the base styles in your app:

```tsx
import "@omnisync/ui/src/styles/base.css";
```

### Core Components

#### Button
```tsx
import { Button } from "@omnisync/ui";

<Button variant="primary" size="md" loading={false} fullWidth>
  Click me
</Button>
```

#### Input Components
```tsx
import { InputComponent, PasswordInput, SearchInput } from "@omnisync/ui";

<InputComponent
  label="Username"
  placeholder="Enter username"
  error="Username is required"
  fullWidth
/>

<PasswordInput
  label="Password"
  showToggle={true}
/>

<SearchInput
  placeholder="Search..."
  onClear={() => setValue("")}
/>
```

#### Card Components
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatsCard
} from "@omnisync/ui";

<Card variant="default" size="md" interactive>
  <CardHeader>
    <CardTitle>Audio Settings</CardTitle>
    <CardDescription>Configure your audio preferences</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>

<StatsCard
  title="Active Devices"
  value="12"
  description="Connected audio devices"
  trend={{ value: 8.2, isPositive: true }}
  icon={<Headphones />}
/>
```

#### Badge Components
```tsx
import { Badge, StatusBadge, NotificationBadge, TagBadge } from "@omnisync/ui";

<Badge variant="success" size="md" removable onRemove={() => {}}>
  Connected
</Badge>

<StatusBadge status="online" />

<NotificationBadge count={5} max={99} />

<TagBadge color="#3b82f6" textColor="white">
  Custom Tag
</TagBadge>
```

#### Sheet/Drawer Components (Mobile-Responsive)
```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@omnisync/ui";

<Sheet open={isOpen} onOpenChange={setIsOpen} side="right" size="md">
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
    </SheetHeader>
    <p>Sheet content automatically adapts to mobile</p>
  </SheetContent>
</Sheet>
```

#### Table Component (Mobile Card View)
```tsx
import { Table } from "@omnisync/ui";

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", mobileLabel: "Status" },
  { key: "latency", header: "Latency", hideOnMobile: false },
];

<Table
  data={devices}
  columns={columns}
  searchable
  mobileCardView={true}
  onRowClick={(item) => console.log(item)}
  rowActions={(item) => <Button size="sm">Edit</Button>}
/>
```

#### Tabs Component (Scrollable on Mobile)
```tsx
import { SimpleTabs, Tabs, TabsList, TabsTrigger, TabsContent } from "@omnisync/ui";

<SimpleTabs
  tabs={[
    {
      value: "overview",
      label: "Overview",
      icon: <Home />,
      content: <div>Overview content</div>
    },
    {
      value: "settings",
      label: "Settings",
      badge: "3",
      content: <div>Settings content</div>
    }
  ]}
  variant="underline"
  scrollable
  fullWidth
/>
```

#### Dialog
```tsx
import { Dialog, ConfirmDialog, AlertDialog } from "@omnisync/ui";

<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Settings"
  size="lg"
>
  <p>Dialog content here</p>
</Dialog>
```

### Layout Components (Mobile-First)

#### Responsive Layout System
```tsx
import {
  Layout,
  Header,
  Main,
  Container,
  Grid,
  Stack,
  Inline,
  PageLayout,
  useBreakpoint
} from "@omnisync/ui";

// Complete page layout
<PageLayout
  title="Dashboard"
  subtitle="Audio streaming overview"
  actions={<Button>Settings</Button>}
  containerSize="lg"
>
  <Grid cols={1} responsive={{ md: 2, lg: 4 }} gap="md">
    <Card>Content 1</Card>
    <Card>Content 2</Card>
    <Card>Content 3</Card>
    <Card>Content 4</Card>
  </Grid>
</PageLayout>

// Responsive utilities
const { breakpoint, isMobile, isDesktop } = useBreakpoint();
```

#### Sidebar Navigation (Responsive)
```tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarLayout
} from "@omnisync/ui";

<SidebarProvider>
  <div className="flex h-screen">
    <Sidebar collapsible>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem icon={<Home />} active>
            Dashboard
          </SidebarMenuItem>
          <SidebarMenuItem icon={<Settings />} badge="3">
            Settings
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>

    <SidebarLayout>
      <Header
        title="App Title"
        actions={<SidebarTrigger />}
      />
      <Main>
        <Container>
          Your content here
        </Container>
      </Main>
    </SidebarLayout>
  </div>
</SidebarProvider>
```

#### Toast Notifications
```tsx
import { ToastProvider, useToast } from "@omnisync/ui";

// Wrap your app
<ToastProvider>
  <App />
</ToastProvider>

// Use in components
const { addToast } = useToast();

addToast({
  type: "success",
  title: "Success!",
  description: "Operation completed successfully",
  duration: 5000,
});
```

### Audio Components

#### AudioControls
```tsx
import { AudioControls } from "@omnisync/ui";

<AudioControls
  isMuted={false}
  volume={0.8}
  inputLevel={0.5}
  onMuteToggle={(muted) => setMuted(muted)}
  onVolumeChange={(volume) => setVolume(volume)}
  onStartStream={startStream}
  onStopStream={stopStream}
  isStreaming={true}
  showAdvanced={true}
  noiseSuppression={true}
  echoCancellation={true}
  autoGainControl={true}
/>
```

#### ConnectionStatus
```tsx
import { ConnectionStatus } from "@omnisync/ui";

<ConnectionStatus
  connectionState={{
    status: "connected",
    quality: "excellent",
    latency: 45
  }}
  showDetails={true}
/>
```

#### DeviceSelector
```tsx
import { DeviceSelector } from "@omnisync/ui";

<DeviceSelector
  devices={audioDevices}
  selectedDeviceId={selectedId}
  onDeviceChange={handleDeviceChange}
  type="input"
  placeholder="Select microphone..."
/>
```

#### MetricsDisplay
```tsx
import { MetricsDisplay } from "@omnisync/ui";

<MetricsDisplay
  metrics={{
    inputLevel: 0.7,
    outputLevel: 0.5,
    packetsLost: 0,
    jitter: 12,
    roundTripTime: 45
  }}
  compact={false}
/>
```

#### AudioControlPanel (Complete Example)
```tsx
import { AudioControlPanel, ToastProvider } from "@omnisync/ui";

<ToastProvider>
  <AudioControlPanel
    connectionState={connectionState}
    metrics={audioMetrics}
    onStreamStart={handleStreamStart}
    onStreamStop={handleStreamStop}
  />
</ToastProvider>
```

### Hooks

#### useAudioStream
```tsx
import { useAudioStream } from "@omnisync/ui";

const {
  stream,
  isStreaming,
  isMuted,
  inputLevel,
  devices,
  selectedDeviceId,
  startStream,
  stopStream,
  toggleMute,
  switchDevice,
  error,
} = useAudioStream({
  config: {
    sampleRate: 48000,
    channels: 2,
    bitrate: 128000,
  },
  onStreamStart: (stream) => console.log("Stream started"),
  onStreamStop: () => console.log("Stream stopped"),
  onError: (error) => console.error("Stream error:", error),
});
```

#### useWebRTC
```tsx
import { useWebRTC } from "@omnisync/ui";

const {
  connectionState,
  metrics,
  isConnected,
  connect,
  disconnect,
  sendOffer,
  sendAnswer,
  addIceCandidate,
  error,
} = useWebRTC({
  deviceInfo: {
    id: "device-123",
    name: "My Device",
    type: "mobile",
    platform: "ios",
    version: "1.0.0",
  },
  onRemoteStream: (stream) => console.log("Remote stream received"),
  onConnectionStateChange: (state) => console.log("Connection state:", state),
});
```

## Mobile-First Responsive Design

### Breakpoints
```css
/* Mobile First Breakpoints */
--breakpoint-sm: 640px;   /* Small devices (landscape phones) */
--breakpoint-md: 768px;   /* Medium devices (tablets) */
--breakpoint-lg: 1024px;  /* Large devices (laptops) */
--breakpoint-xl: 1280px;  /* Extra large devices (desktops) */
--breakpoint-2xl: 1536px; /* 2X large devices (large desktops) */
```

### Responsive Utilities
```tsx
// Built-in responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card>Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols</Card>
</div>

// Responsive hooks
const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();

// Conditional rendering
{isMobile ? <MobileComponent /> : <DesktopComponent />}
```

### Mobile-Specific Features
- **Automatic Sheet Conversion**: Dialogs become bottom sheets on mobile
- **Touch-Friendly Sizing**: Minimum 44px touch targets
- **Swipe Gestures**: Sheet components support swipe-to-dismiss
- **Responsive Tables**: Automatically switch to card view on mobile
- **Collapsible Sidebar**: Becomes overlay drawer on mobile
- **Scrollable Tabs**: Horizontal scroll with navigation buttons

## Theming

Modern HSL-based color system with CSS custom properties:

```css
:root {
  /* Primary colors */
  --color-primary: hsl(221.2 83.2% 53.3%);
  --color-primary-hover: hsl(221.2 83.2% 48%);
  --color-primary-foreground: hsl(210 40% 98%);

  /* Background colors */
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(222.2 84% 4.9%);

  /* Border and input */
  --border: hsl(214.3 31.8% 91.4%);
  --input: hsl(214.3 31.8% 91.4%);
  --ring: hsl(221.2 83.2% 53.3%);
}

.dark {
  --background: hsl(222.2 84% 4.9%);
  --foreground: hsl(210 40% 98%);
  --card: hsl(222.2 84% 4.9%);
  --card-foreground: hsl(210 40% 98%);
  /* ... dark theme overrides */
}
```

## Component Props

All components accept standard HTML attributes plus their specific props. See TypeScript definitions for complete prop lists.

## Accessibility

All components follow WCAG 2.1 AA guidelines:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This package is part of the OmniSync monorepo. See the main README for contribution guidelines.
