// Component Showcase - Demonstrates all universal components
// Works across Web, React Native, and Electron

import React, { useState } from 'react';
import {
  // Theme System
  ThemeProvider,
  useTheme,

  // Layout Components
  Stack,
  HStack,
  VStack,
  Container,
  Grid,
  GridItem,
  Box,
  Text,
  Heading,

  // Form Components
  Button,
  Input,
  Checkbox,
  Switch,
  Slider,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  RadioGroup,
  RadioItem,
  Textarea,

  // Feedback Components
  Alert,
  Progress,
  CircularProgress,
  Skeleton,
  Badge,
  Avatar,
  Toast,
  ToastProvider,
  useToast,

  // Layout & Navigation
  Card,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,

  // Overlays
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,

  // Additional Components
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Calendar,

  // High-Priority Components
  DataTable,
  DatePicker,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  Spinner,
  DotsSpinner,
  LoadingOverlay,
} from '../universal';

// Theme toggle component
const ThemeToggle: React.FC = () => {
  const { mode, setMode, isDark } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onPress={() => setMode(isDark ? 'light' : 'dark')}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </Button>
  );
};

// Form showcase
const FormShowcase: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    notifications: true,
    volume: 50,
    terms: false,
    country: '',
    theme: 'light',
    bio: '',
  });

  return (
    <Card>
      <Card.Header>
        <Card.Title>Form Components</Card.Title>
        <Card.Description>
          Interactive form elements with validation
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        <VStack spacing={4}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            type="email"
            fullWidth
          />
          
          <Switch
            label="Enable Notifications"
            description="Receive updates about your account"
            checked={formData.notifications}
            onChange={(checked) => setFormData({ ...formData, notifications: checked })}
          />
          
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Volume: {formData.volume}%
            </Text>
            <Slider
              value={formData.volume}
              onChange={(value) => setFormData({ ...formData, volume: value })}
              min={0}
              max={100}
              step={5}
            />
          </Box>
          
          <Select
            value={formData.country}
            onValueChange={(value) => setFormData({ ...formData, country: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Theme Preference
            </Text>
            <RadioGroup
              value={formData.theme}
              onValueChange={(value) => setFormData({ ...formData, theme: value })}
              orientation="horizontal"
            >
              <RadioItem value="light">Light</RadioItem>
              <RadioItem value="dark">Dark</RadioItem>
              <RadioItem value="system">System</RadioItem>
            </RadioGroup>
          </Box>

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(value) => setFormData({ ...formData, bio: value })}
            rows={3}
            maxLength={200}
            showCount
            helperText="Share a brief description about yourself"
          />

          <Checkbox
            label="I agree to the terms and conditions"
            checked={formData.terms}
            onChange={(checked) => setFormData({ ...formData, terms: checked })}
            required
          />
        </VStack>
      </Card.Content>
      
      <Card.Footer>
        <Button 
          variant="primary" 
          disabled={!formData.terms}
          fullWidth
        >
          Submit Form
        </Button>
      </Card.Footer>
    </Card>
  );
};

// Feedback showcase
const FeedbackShowcase: React.FC = () => {
  const [progress, setProgress] = useState(65);
  const [loading, setLoading] = useState(false);

  const simulateProgress = () => {
    setLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <VStack spacing={6}>
      {/* Alerts */}
      <VStack spacing={3}>
        <Heading size="md">Alerts</Heading>
        <Alert variant="info" title="Information" description="This is an informational message." />
        <Alert variant="success" title="Success" description="Operation completed successfully!" />
        <Alert variant="warning" title="Warning" description="Please review your settings." />
        <Alert variant="error" title="Error" description="Something went wrong." closable />
      </VStack>

      {/* Progress */}
      <VStack spacing={3}>
        <Heading size="md">Progress Indicators</Heading>
        <Box width="100%">
          <Text fontSize="sm" mb={2}>Linear Progress: {progress}%</Text>
          <Progress value={progress} max={100} showLabel />
        </Box>
        
        <HStack spacing={4} alignItems="center">
          <CircularProgress value={progress} max={100} showLabel />
          <Button onPress={simulateProgress} disabled={loading}>
            {loading ? 'Loading...' : 'Start Progress'}
          </Button>
        </HStack>
      </VStack>

      {/* Badges & Avatars */}
      <VStack spacing={3}>
        <Heading size="md">Badges & Avatars</Heading>
        <HStack spacing={3} flexWrap="wrap">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success" count={5} />
          <Badge variant="error" count={99} maxCount={50} />
          <Badge variant="warning">New</Badge>
        </HStack>
        
        <HStack spacing={3}>
          <Avatar name="John Doe" size="sm" />
          <Avatar name="Jane Smith" size="md" />
          <Avatar name="Bob Johnson" size="lg" />
          <Avatar 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
            name="Mike Wilson" 
            size="xl" 
          />
        </HStack>
      </VStack>

      {/* Skeletons */}
      <VStack spacing={3}>
        <Heading size="md">Loading Skeletons</Heading>
        <Skeleton variant="text" lines={3} animation="pulse" />
        <HStack spacing={3}>
          <Skeleton variant="circular" width={40} height={40} />
          <VStack spacing={2} flex={1}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

// Navigation showcase
const NavigationShowcase: React.FC = () => {
  return (
    <VStack spacing={6}>
      {/* Tabs */}
      <Card>
        <Card.Header>
          <Card.Title>Tabs Navigation</Card.Title>
        </Card.Header>
        <Card.Content>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Text>Overview content goes here. This shows general information.</Text>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Text>Analytics data and charts would be displayed here.</Text>
            </TabsContent>
            
            <TabsContent value="settings">
              <Text>Settings and configuration options.</Text>
            </TabsContent>
          </Tabs>
        </Card.Content>
      </Card>

      {/* Accordion */}
      <Card>
        <Card.Header>
          <Card.Title>Accordion</Card.Title>
        </Card.Header>
        <Card.Content>
          <Accordion type="multiple" defaultValue={["item-1"]}>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What is OmniSync?
              </AccordionTrigger>
              <AccordionContent>
                OmniSync is a universal audio streaming platform that works across multiple devices and platforms.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>
                How does cross-platform support work?
              </AccordionTrigger>
              <AccordionContent>
                Our universal UI system ensures consistent experience across Web, React Native, and Electron applications.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What audio formats are supported?
              </AccordionTrigger>
              <AccordionContent>
                We support all major audio formats including MP3, FLAC, WAV, and more with real-time streaming capabilities.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card.Content>
      </Card>
    </VStack>
  );
};

// High-priority components showcase
const HighPriorityComponentsShowcase: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  // Sample data for DataTable
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  ];

  const tableColumns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Role', sortable: false },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : 'warning'}>
          {value}
        </Badge>
      )
    },
  ];

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <VStack spacing={6}>
      <Heading size="md">High-Priority Components</Heading>

      {/* DataTable */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Data Table</Text>
        <DataTable
          columns={tableColumns}
          data={tableData}
          sortable
          selectable
          size="md"
          variant="bordered"
        />
      </VStack>

      {/* DatePicker */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Date Picker</Text>
        <HStack spacing={4}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onValueChange={setSelectedDate}
            placeholder="Choose a date"
          />
          <Text fontSize="sm" color="gray600">
            Selected: {selectedDate?.toLocaleDateString()}
          </Text>
        </HStack>
      </VStack>

      {/* Spinners */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Loading Spinners</Text>
        <HStack spacing={6} alignItems="center">
          <Spinner size="sm" variant="primary" />
          <Spinner size="md" variant="success" label="Loading..." />
          <DotsSpinner size="lg" variant="warning" />
          <Spinner size="xl" variant="error" />
        </HStack>

        <LoadingOverlay loading={loading} text="Processing data...">
          <Card p={6} minHeight={100}>
            <VStack spacing={3}>
              <Text>This content can be overlaid with a loading spinner.</Text>
              <Button onPress={simulateLoading}>
                Start Loading
              </Button>
            </VStack>
          </Card>
        </LoadingOverlay>
      </VStack>

      {/* Menu */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Dropdown Menu</Text>
        <HStack spacing={4}>
          <Menu>
            <MenuTrigger>
              <Button variant="outline">Actions Menu</Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onSelect={() => console.log('Edit')}>
                Edit
              </MenuItem>
              <MenuItem onSelect={() => console.log('Copy')}>
                Copy
              </MenuItem>
              <MenuSeparator />
              <MenuItem destructive onSelect={() => console.log('Delete')}>
                Delete
              </MenuItem>
            </MenuContent>
          </Menu>

          <Menu>
            <MenuTrigger>
              <Button variant="outline">Settings</Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onSelect={() => console.log('Profile')}>
                Profile
              </MenuItem>
              <MenuItem onSelect={() => console.log('Preferences')}>
                Preferences
              </MenuItem>
              <MenuSeparator />
              <MenuItem onSelect={() => console.log('Logout')}>
                Logout
              </MenuItem>
            </MenuContent>
          </Menu>
        </HStack>
      </VStack>

      {/* Drawer */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Drawer/Sidebar</Text>
        <Button onPress={() => setDrawerOpen(true)}>
          Open Drawer
        </Button>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} placement="right">
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Settings</DrawerTitle>
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing={4}>
                <Input label="Name" placeholder="Enter your name" />
                <Switch label="Enable notifications" />
                <Slider defaultValue={50} />
                <Text fontSize="sm" color="gray600">
                  Configure your application settings here.
                </Text>
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" onPress={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onPress={() => setDrawerOpen(false)}>
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </VStack>
    </VStack>
  );
};

// Additional components showcase
const AdditionalComponentsShowcase: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [togglePressed, setTogglePressed] = useState(false);
  const [toggleGroupValue, setToggleGroupValue] = useState<string[]>(['bold']);

  return (
    <VStack spacing={6}>
      <Heading size="md">Additional Components</Heading>

      {/* Breadcrumb */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Breadcrumb Navigation</Text>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Components</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </VStack>

      {/* Toggle and Toggle Group */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Toggle Controls</Text>
        <HStack spacing={4} alignItems="center">
          <Toggle
            pressed={togglePressed}
            onPressedChange={setTogglePressed}
          >
            {togglePressed ? 'On' : 'Off'}
          </Toggle>

          <ToggleGroup
            type="multiple"
            value={toggleGroupValue}
            onValueChange={setToggleGroupValue}
          >
            <ToggleGroupItem value="bold">B</ToggleGroupItem>
            <ToggleGroupItem value="italic">I</ToggleGroupItem>
            <ToggleGroupItem value="underline">U</ToggleGroupItem>
          </ToggleGroup>
        </HStack>
      </VStack>

      {/* Tooltip */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Tooltip</Text>
        <HStack spacing={4}>
          <Tooltip content="This is a helpful tooltip" placement="top">
            <Button variant="outline">Hover me (top)</Button>
          </Tooltip>
          <Tooltip content="Another tooltip here" placement="bottom">
            <Button variant="outline">Hover me (bottom)</Button>
          </Tooltip>
        </HStack>
      </VStack>

      {/* Popover */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Popover</Text>
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button variant="outline">Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <VStack spacing={3}>
              <Text fontWeight="medium">Popover Content</Text>
              <Text fontSize="sm" color="gray600">
                This is a popover with custom content. You can put any components here.
              </Text>
              <Button size="sm" variant="primary">
                Action
              </Button>
            </VStack>
          </PopoverContent>
        </Popover>
      </VStack>

      {/* Calendar */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium">Calendar</Text>
        <Calendar
          value={selectedDate}
          onValueChange={setSelectedDate}
        />
        <Text fontSize="xs" color="gray600">
          Selected: {selectedDate.toLocaleDateString()}
        </Text>
      </VStack>
    </VStack>
  );
};

// Overlays showcase
const OverlaysShowcase: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToast } = useToast();

  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    addToast({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      description: `This is a ${type} toast notification.`,
      duration: 3000,
      action: {
        label: 'Action',
        onClick: () => console.log('Toast action clicked'),
      },
    });
  };

  return (
    <VStack spacing={6}>
      <Heading size="md">Overlays & Notifications</Heading>

      {/* Buttons to trigger overlays */}
      <HStack spacing={3} flexWrap="wrap">
        <Button onPress={() => setDialogOpen(true)}>
          Open Dialog
        </Button>
        <Button onPress={() => setModalOpen(true)}>
          Open Modal
        </Button>
        <Button onPress={() => showToast('success')}>
          Success Toast
        </Button>
        <Button onPress={() => showToast('error')}>
          Error Toast
        </Button>
        <Button onPress={() => showToast('warning')}>
          Warning Toast
        </Button>
        <Button onPress={() => showToast('info')}>
          Info Toast
        </Button>
      </HStack>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to perform this action? This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <Text>
              This is the dialog body content. You can put any content here including forms,
              images, or other components.
            </Text>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onPress={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onPress={() => setDialogOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent size="lg">
          <ModalHeader>
            <ModalTitle>Settings</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <VStack spacing={4}>
              <Input label="Name" placeholder="Enter your name" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
              <Switch label="Enable notifications" />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" onPress={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={() => setModalOpen(false)}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

// Main showcase component
const ComponentShowcase: React.FC = () => {
  return (
    <ThemeProvider defaultMode="system">
      <ToastProvider position="top-right">
        <Container size="xl">
          <VStack spacing={8} py={8}>
            {/* Header */}
            <HStack justifyContent="space-between" alignItems="center" fullWidth>
              <Heading size="2xl">
                OmniSync Component Showcase
              </Heading>
              <ThemeToggle />
            </HStack>

          <Separator label="Interactive Components" />

          {/* Grid layout for components */}
          <Grid columns={{ xs: 1, lg: 2 }} gap={6}>
            <GridItem>
              <FormShowcase />
            </GridItem>
            
            <GridItem>
              <FeedbackShowcase />
            </GridItem>
          </Grid>

          <Separator label="Navigation Components" />

          <NavigationShowcase />

          <Separator label="High-Priority Components" />

          <HighPriorityComponentsShowcase />

          <Separator label="Additional Components" />

          <AdditionalComponentsShowcase />

          <Separator label="Overlays & Notifications" />

          <OverlaysShowcase />

          {/* Button variants showcase */}
          <Card>
            <Card.Header>
              <Card.Title>Button Variants</Card.Title>
              <Card.Description>
                All button styles and sizes
              </Card.Description>
            </Card.Header>
            
            <Card.Content>
              <VStack spacing={4}>
                <HStack spacing={3} flexWrap="wrap">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </HStack>
                
                <HStack spacing={3}>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </HStack>
                
                <HStack spacing={3}>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button leftIcon={<span>🎵</span>}>With Icon</Button>
                </HStack>
              </VStack>
            </Card.Content>
          </Card>
        </VStack>
      </Container>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default ComponentShowcase;
