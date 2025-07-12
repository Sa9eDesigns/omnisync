// Universal UI System Example
// Demonstrates cross-platform components working across Web, React Native, and Electron

import React, { useState } from 'react';
import {
  // Theme System
  ThemeProvider,
  useTheme,
  useTokens,
  
  // Universal Components
  Button,
  Card,
  Input,
  
  // Layout Components
  Stack,
  HStack,
  VStack,
  Center,
  Container,
  Grid,
  GridItem,
  
  // Primitives
  Box,
  Text,
  Heading,
  
  // Utilities
  Platform,
  styled,
  createComponent,
} from '../universal';

// Custom styled component example
const CustomCard = createComponent(
  Platform.isWeb ? 'div' : 'View',
  {
    p: 4,
    borderRadius: 'lg',
    backgroundColor: 'white',
    shadowColor: 'gray900',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  {
    variant: {
      primary: { backgroundColor: 'primary50', borderColor: 'primary200' },
      success: { backgroundColor: 'success50', borderColor: 'success200' },
      warning: { backgroundColor: 'warning50', borderColor: 'warning200' },
      error: { backgroundColor: 'error50', borderColor: 'error200' },
    },
  }
);

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

// Audio control example (specific to OmniSync)
const AudioControlExample: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [volume, setVolume] = useState('50');
  
  return (
    <Card variant="elevated" size="lg">
      <Card.Header>
        <Card.Title>Audio Controls</Card.Title>
        <Card.Description>
          Cross-platform audio streaming controls
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        <VStack spacing={4}>
          {/* Connection Status */}
          <HStack spacing={3} alignItems="center">
            <Box
              width={12}
              height={12}
              borderRadius="full"
              backgroundColor={isConnected ? 'success500' : 'error500'}
            />
            <Text color={isConnected ? 'success600' : 'error600'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </HStack>
          
          {/* Volume Control */}
          <VStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium">
              Volume: {volume}%
            </Text>
            <Input
              type="range"
              value={volume}
              onChange={setVolume}
              min="0"
              max="100"
              fullWidth
            />
          </VStack>
          
          {/* Control Buttons */}
          <HStack spacing={3}>
            <Button
              variant={isConnected ? 'secondary' : 'primary'}
              onPress={() => setIsConnected(!isConnected)}
              flex={1}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
            
            <Button
              variant={isStreaming ? 'destructive' : 'success'}
              disabled={!isConnected}
              onPress={() => setIsStreaming(!isStreaming)}
              flex={1}
            >
              {isStreaming ? 'Stop Stream' : 'Start Stream'}
            </Button>
          </HStack>
        </VStack>
      </Card.Content>
    </Card>
  );
};

// Responsive grid example
const ResponsiveGridExample: React.FC = () => {
  const tokens = useTokens();
  
  const features = [
    { title: 'Cross-Platform', description: 'Works on Web, React Native, and Electron', icon: '🌐' },
    { title: 'Design Tokens', description: 'Consistent design system across platforms', icon: '🎨' },
    { title: 'Responsive', description: 'Adaptive layouts for all screen sizes', icon: '📱' },
    { title: 'Accessible', description: 'WCAG compliant components', icon: '♿' },
    { title: 'Performant', description: 'Optimized for mobile and desktop', icon: '⚡' },
    { title: 'Themeable', description: 'Light and dark mode support', icon: '🌓' },
  ];
  
  return (
    <VStack spacing={6}>
      <Heading size="xl" textAlign="center">
        Universal UI System Features
      </Heading>
      
      <Grid
        columns={{ xs: 1, sm: 2, lg: 3 }}
        gap={4}
      >
        {features.map((feature, index) => (
          <GridItem key={index}>
            <CustomCard variant="primary">
              <VStack spacing={3} alignItems="center" textAlign="center">
                <Text fontSize="2xl">{feature.icon}</Text>
                <Heading size="md">{feature.title}</Heading>
                <Text fontSize="sm" color="gray600">
                  {feature.description}
                </Text>
              </VStack>
            </CustomCard>
          </GridItem>
        ))}
      </Grid>
    </VStack>
  );
};

// Form example
const FormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.message) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };
  
  return (
    <Card>
      <Card.Header>
        <Card.Title>Contact Form</Card.Title>
        <Card.Description>
          Universal form components example
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        <VStack spacing={4}>
          <Input
            label="Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
            required
            fullWidth
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
            required
            fullWidth
          />
          
          <Input
            label="Message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={(value) => setFormData({ ...formData, message: value })}
            error={errors.message}
            multiline
            numberOfLines={4}
            required
            fullWidth
          />
        </VStack>
      </Card.Content>
      
      <Card.Footer>
        <HStack spacing={3} justifyContent="flex-end">
          <Button
            variant="outline"
            onPress={() => setFormData({ name: '', email: '', message: '' })}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit}
          >
            Submit
          </Button>
        </HStack>
      </Card.Footer>
    </Card>
  );
};

// Main example component
const UniversalExample: React.FC = () => {
  return (
    <ThemeProvider defaultMode="system">
      <Container size="xl">
        <VStack spacing={8} py={8}>
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center" fullWidth>
            <Heading size="2xl">
              OmniSync Universal UI
            </Heading>
            <ThemeToggle />
          </HStack>
          
          {/* Platform Info */}
          <CustomCard>
            <VStack spacing={2}>
              <Text fontWeight="medium">Platform Information:</Text>
              <Text fontSize="sm">
                Web: {Platform.isWeb ? '✅' : '❌'}
              </Text>
              <Text fontSize="sm">
                React Native: {Platform.isReactNative ? '✅' : '❌'}
              </Text>
              <Text fontSize="sm">
                Electron: {Platform.isElectron ? '✅' : '❌'}
              </Text>
            </VStack>
          </CustomCard>
          
          {/* Audio Controls */}
          <AudioControlExample />
          
          {/* Features Grid */}
          <ResponsiveGridExample />
          
          {/* Form Example */}
          <FormExample />
          
          {/* Component Showcase */}
          <Card>
            <Card.Header>
              <Card.Title>Component Variants</Card.Title>
              <Card.Description>
                Different styles and sizes of universal components
              </Card.Description>
            </Card.Header>
            
            <Card.Content>
              <VStack spacing={6}>
                {/* Button Variants */}
                <VStack spacing={3}>
                  <Heading size="md">Buttons</Heading>
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
                </VStack>
                
                {/* Card Variants */}
                <VStack spacing={3}>
                  <Heading size="md">Cards</Heading>
                  <Grid columns={{ xs: 1, sm: 2 }} gap={4}>
                    <Card variant="default">
                      <Card.Content>
                        <Text>Default Card</Text>
                      </Card.Content>
                    </Card>
                    <Card variant="elevated">
                      <Card.Content>
                        <Text>Elevated Card</Text>
                      </Card.Content>
                    </Card>
                    <Card variant="outlined">
                      <Card.Content>
                        <Text>Outlined Card</Text>
                      </Card.Content>
                    </Card>
                    <Card variant="filled">
                      <Card.Content>
                        <Text>Filled Card</Text>
                      </Card.Content>
                    </Card>
                  </Grid>
                </VStack>
              </VStack>
            </Card.Content>
          </Card>
        </VStack>
      </Container>
    </ThemeProvider>
  );
};

export default UniversalExample;
