# Components Reference

Complete reference for all OmniSync UI components with cross-platform support.

## 🎯 Overview

All components work seamlessly across **Web**, **React Native/Expo**, and **Electron** with a unified API.

## 📋 Component Categories

### Form Components
- [Button](#button) - Interactive buttons with variants and states
- [Input](#input) - Text input fields with validation
- [Textarea](#textarea) - Multi-line text input areas
- [Checkbox](#checkbox) - Checkboxes with labels and validation
- [Switch](#switch) - Toggle switches for boolean values
- [RadioGroup](#radiogroup) - Radio button groups for single selection
- [Select](#select) - Dropdown selection menus
- [Slider](#slider) - Range sliders for numeric input

### Feedback Components
- [Alert](#alert) - Contextual alerts and notifications
- [Toast](#toast) - Temporary notification messages
- [Progress](#progress) - Progress bars and circular indicators
- [Skeleton](#skeleton) - Loading placeholders
- [Badge](#badge) - Status indicators and counters

### Data Display
- [Avatar](#avatar) - User profile pictures and initials
- [Card](#card) - Content containers with headers and footers
- [Separator](#separator) - Visual dividers

### Navigation
- [Tabs](#tabs) - Tab navigation with content panels
- [Accordion](#accordion) - Collapsible content sections

### Overlays
- [Dialog](#dialog) - Modal dialogs for confirmations
- [Modal](#modal) - Full-featured modal windows

### Layout
- [Stack](#stack) - Flexible layout containers
- [Grid](#grid) - Responsive grid system
- [Container](#container) - Centered content containers

---

## 📚 Component Documentation

### Button

Interactive button component with multiple variants and states.

```tsx
import { Button } from '@omnisync/ui/universal';

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

**Props:**
- `variant` - Visual style variant
- `size` - Button size
- `loading` - Shows loading spinner
- `disabled` - Disables interaction
- `leftIcon/rightIcon` - Icon elements
- `fullWidth` - Expands to full width
- `onPress/onClick` - Press handler

### Input

Text input field with labels, validation, and icons.

```tsx
import { Input } from '@omnisync/ui/universal';

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

**Props:**
- `variant` - Input style variant
- `label` - Input label text
- `placeholder` - Placeholder text
- `type` - Input type (web) / keyboardType (native)
- `error` - Error message
- `helperText` - Helper text below input
- `leftIcon/rightIcon` - Icon elements
- `multiline` - Multi-line text area

### Checkbox

Checkbox input with labels and validation.

```tsx
import { Checkbox } from '@omnisync/ui/universal';

<Checkbox
  variant="primary" // default | primary | success | warning | error
  size="md" // sm | md | lg
  checked={isChecked}
  onChange={setIsChecked}
  label="I agree to the terms"
  description="By checking this, you accept our terms"
  error={validationError}
  indeterminate={false}
  disabled={false}
  required
/>
```

**Props:**
- `variant` - Color variant
- `checked` - Checked state
- `label` - Checkbox label
- `description` - Additional description
- `indeterminate` - Indeterminate state
- `error` - Error message

### Switch

Toggle switch for boolean values.

```tsx
import { Switch } from '@omnisync/ui/universal';

<Switch
  variant="primary" // default | primary | success | warning | error
  size="md" // sm | md | lg
  checked={isEnabled}
  onChange={setIsEnabled}
  label="Enable notifications"
  description="Receive email updates"
  disabled={false}
/>
```

**Props:**
- `variant` - Color variant
- `checked` - Switch state
- `label` - Switch label
- `description` - Additional description

### Slider

Range slider for numeric input.

```tsx
import { Slider } from '@omnisync/ui/universal';

<Slider
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  step={5}
  size="md" // sm | md | lg
  variant="primary" // default | primary | success | warning | error
  orientation="horizontal" // horizontal | vertical
  showValue={true}
  showMarks={true}
  marks={[
    { value: 0, label: 'Min' },
    { value: 50, label: 'Mid' },
    { value: 100, label: 'Max' }
  ]}
  formatValue={(value) => `${value}%`}
/>
```

**Props:**
- `value` - Current value
- `min/max` - Value range
- `step` - Step increment
- `orientation` - Horizontal or vertical
- `showValue` - Display current value
- `marks` - Value markers

### Alert

Contextual alerts and notifications.

```tsx
import { Alert } from '@omnisync/ui/universal';

<Alert
  variant="info" // info | success | warning | error
  size="md" // sm | md | lg
  title="Alert Title"
  description="Alert description text"
  icon={<CustomIcon />}
  closable={true}
  onClose={() => console.log('Closed')}
>
  Custom alert content
</Alert>
```

**Props:**
- `variant` - Alert type and color
- `title` - Alert title
- `description` - Alert description
- `icon` - Custom icon (overrides default)
- `closable` - Show close button

### Progress

Progress indicators for loading states.

```tsx
import { Progress, CircularProgress } from '@omnisync/ui/universal';

// Linear Progress
<Progress
  value={65}
  max={100}
  size="md" // sm | md | lg
  variant="primary" // default | primary | success | warning | error
  showLabel={true}
  indeterminate={false}
  striped={false}
  animated={false}
/>

// Circular Progress
<CircularProgress
  value={75}
  max={100}
  size={40}
  thickness={4}
  variant="primary"
  showLabel={true}
  indeterminate={false}
/>
```

**Props:**
- `value` - Current progress value
- `max` - Maximum value
- `indeterminate` - Indeterminate animation
- `showLabel` - Display percentage
- `striped/animated` - Visual effects

### Skeleton

Loading placeholders with animations.

```tsx
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonCircle, 
  SkeletonCard 
} from '@omnisync/ui/universal';

<Skeleton
  variant="rectangular" // text | rectangular | circular | rounded
  animation="pulse" // pulse | wave | none
  width={200}
  height={20}
  lines={3} // For text variant
/>

<SkeletonCard
  showAvatar={true}
  avatarSize={40}
  lines={3}
  animation="wave"
/>
```

**Props:**
- `variant` - Skeleton shape
- `animation` - Animation type
- `width/height` - Dimensions
- `lines` - Number of text lines

### Badge

Status indicators and counters.

```tsx
import { Badge } from '@omnisync/ui/universal';

<Badge
  variant="primary" // default | primary | secondary | success | warning | error | outline
  size="md" // sm | md | lg
  count={5}
  maxCount={99}
  showZero={false}
>
  Badge Text
</Badge>
```

**Props:**
- `variant` - Badge style
- `count` - Numeric counter
- `maxCount` - Maximum count display
- `showZero` - Show when count is 0

### Avatar

User profile pictures and initials.

```tsx
import { Avatar, AvatarGroup } from '@omnisync/ui/universal';

<Avatar
  size="md" // xs | sm | md | lg | xl | 2xl
  src="https://example.com/avatar.jpg"
  alt="User Avatar"
  name="John Doe"
  fallback="JD"
  loading="lazy"
  onError={() => console.log('Image failed')}
/>

<AvatarGroup max={3} spacing={-8}>
  <Avatar name="User 1" />
  <Avatar name="User 2" />
  <Avatar name="User 3" />
  <Avatar name="User 4" />
</AvatarGroup>
```

**Props:**
- `size` - Avatar size
- `src` - Image URL
- `name` - User name (for initials)
- `fallback` - Custom fallback text
- `loading` - Image loading strategy

### Card

Content containers with headers and footers.

```tsx
import { Card } from '@omnisync/ui/universal';

<Card
  variant="elevated" // default | elevated | outlined | filled
  size="md" // sm | md | lg
  interactive={true}
  onPress={() => console.log('Card pressed')}
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

**Props:**
- `variant` - Card style
- `interactive` - Enable press handling
- `loading` - Show loading overlay

### Separator

Visual dividers with optional labels.

```tsx
import { Separator } from '@omnisync/ui/universal';

<Separator
  orientation="horizontal" // horizontal | vertical
  variant="solid" // solid | dashed | dotted
  size="md" // sm | md | lg
  color="gray300"
  label="Section Divider"
  labelPosition="center" // left | center | right
/>
```

**Props:**
- `orientation` - Horizontal or vertical
- `variant` - Line style
- `label` - Optional label text
- `labelPosition` - Label alignment

### Tabs

Tab navigation with content panels.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@omnisync/ui/universal';

<Tabs
  defaultValue="tab1"
  orientation="horizontal" // horizontal | vertical
  variant="underline" // default | pills | underline | enclosed
  size="md" // sm | md | lg
  onValueChange={(value) => console.log(value)}
>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3" disabled>Tab 3</TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    Content for tab 1
  </TabsContent>
  
  <TabsContent value="tab2">
    Content for tab 2
  </TabsContent>
</Tabs>
```

**Props:**
- `variant` - Tab style
- `orientation` - Layout direction
- `defaultValue` - Initial active tab
- `onValueChange` - Tab change handler

### Accordion

Collapsible content sections.

```tsx
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@omnisync/ui/universal';

<Accordion
  type="multiple" // single | multiple
  collapsible={true}
  defaultValue={["item-1"]}
  onValueChange={(value) => console.log(value)}
>
  <AccordionItem value="item-1">
    <AccordionTrigger>
      Section 1 Title
    </AccordionTrigger>
    <AccordionContent>
      Section 1 content goes here
    </AccordionContent>
  </AccordionItem>
  
  <AccordionItem value="item-2" disabled>
    <AccordionTrigger>
      Section 2 Title
    </AccordionTrigger>
    <AccordionContent>
      Section 2 content
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Props:**
- `type` - Single or multiple open items
- `collapsible` - Allow closing all items
- `defaultValue` - Initially open items

## 🎨 Styling System

All components support the universal styling system:

```tsx
<Button
  // Spacing
  p={4} px={6} py={2} m={2} mx="auto"
  
  // Colors
  bg="primary500" color="white"
  
  // Layout
  width="100%" height={40} flex={1}
  
  // Responsive
  size={{ xs: 'sm', md: 'lg' }}
  fullWidth={{ xs: true, md: false }}
  
  // Hover/Press states
  hoverStyle={{ bg: 'primary600' }}
  pressStyle={{ transform: [{ scale: 0.95 }] }}
/>
```

## 🔧 Platform-Specific Features

### Web-Specific
```tsx
<Button
  type="submit"
  className="custom-class"
  onClick={handleClick}
/>
```

### React Native-Specific
```tsx
<Button
  hapticFeedback={true}
  activeOpacity={0.8}
  onPress={handlePress}
/>
```

## 📱 Responsive Design

Use responsive props for adaptive layouts:

```tsx
<Grid
  columns={{ xs: 1, sm: 2, lg: 3 }}
  gap={{ xs: 2, md: 4 }}
>
  <GridItem span={{ xs: 1, lg: 2 }}>
    Main content
  </GridItem>
  <GridItem>
    Sidebar
  </GridItem>
</Grid>
```

## 🎭 Theming

All components respect the theme system:

```tsx
<ThemeProvider defaultMode="system">
  <YourApp />
</ThemeProvider>
```

Components automatically adapt to light/dark themes and use design tokens for consistent styling.

## 📖 Examples

See `src/examples/ComponentShowcase.tsx` for comprehensive examples of all components in action.
