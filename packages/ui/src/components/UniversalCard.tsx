// Universal Card Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Card props interface
export interface UniversalCardProps extends StyledProps {
  variant?: "default" | "elevated" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  onClick?: () => void;
  // React Native specific props
  hapticFeedback?: boolean;
  activeOpacity?: number;
}

// Base styled card component
const StyledCardBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'UniversalCard',
    defaultProps: {
      borderRadius: 'lg',
      backgroundColor: 'white',
      borderWidth: isWeb ? 1 : 0,
      borderColor: 'gray200',
      // Animation
      animationDuration: 'fast',
      animation: 'easeOut',
    },
    variants: {
      variant: {
        default: {
          backgroundColor: 'white',
          borderColor: 'gray200',
          shadowColor: 'gray900',
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2, // Android shadow
        },
        elevated: {
          backgroundColor: 'white',
          borderColor: 'transparent',
          shadowColor: 'gray900',
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8, // Android shadow
        },
        outlined: {
          backgroundColor: 'white',
          borderColor: 'gray300',
          borderWidth: 1,
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
        filled: {
          backgroundColor: 'gray50',
          borderColor: 'transparent',
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
      },
      size: {
        sm: { 
          p: 3,
          borderRadius: 'md',
        },
        md: { 
          p: 4,
          borderRadius: 'lg',
        },
        lg: { 
          p: 6,
          borderRadius: 'xl',
        },
      },
    },
    compoundVariants: [
      {
        variants: { variant: 'elevated', size: 'lg' },
        style: {
          shadowOpacity: 0.2,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        },
      },
    ],
  }
);

// Interactive card wrapper
const InteractiveCardWrapper = createStyledComponent(
  isWeb ? 'div' : 'TouchableOpacity',
  {
    name: 'InteractiveCardWrapper',
    defaultProps: {
      borderRadius: 'lg',
      hoverStyle: {
        transform: [{ scale: 1.02 }],
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      pressStyle: {
        transform: [{ scale: 0.98 }],
      },
    },
  }
);

// Card Header component
export const CardHeader = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'CardHeader',
    defaultProps: {
      pb: 3,
      borderBottomWidth: 1,
      borderBottomColor: 'gray100',
      mb: 4,
    },
  }
);

// Card Title component
export const CardTitle = createStyledComponent(
  isWeb ? 'h3' : 'Text',
  {
    name: 'CardTitle',
    defaultProps: {
      fontSize: 'lg',
      fontWeight: 'semibold',
      color: 'gray900',
      lineHeight: 'tight',
      mb: 1,
    },
    variants: {
      size: {
        sm: { fontSize: 'base' },
        md: { fontSize: 'lg' },
        lg: { fontSize: 'xl' },
      },
    },
  }
);

// Card Description component
export const CardDescription = createStyledComponent(
  isWeb ? 'p' : 'Text',
  {
    name: 'CardDescription',
    defaultProps: {
      fontSize: 'sm',
      color: 'gray600',
      lineHeight: 'normal',
    },
  }
);

// Card Content component
export const CardContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'CardContent',
    defaultProps: {
      flex: 1,
    },
  }
);

// Card Footer component
export const CardFooter = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'CardFooter',
    defaultProps: {
      pt: 4,
      mt: 4,
      borderTopWidth: 1,
      borderTopColor: 'gray100',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }
);

// Main Universal Card component
export const UniversalCard = forwardRef<any, UniversalCardProps>(
  (
    {
      variant = "default",
      size = "md",
      interactive = false,
      loading = false,
      children,
      onPress,
      onClick,
      hapticFeedback = true,
      activeOpacity = 0.95,
      ...props
    },
    ref
  ) => {
    // Handle press events
    const handlePress = () => {
      // Haptic feedback for React Native
      if (!isWeb && hapticFeedback) {
        try {
          const { HapticFeedback } = require('expo-haptics');
          HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
        } catch (error) {
          // Haptic feedback not available
        }
      }
      
      onPress?.();
      onClick?.();
    };

    // Loading overlay styles
    const loadingOverlay = loading ? {
      opacity: 0.6,
      position: 'relative' as const,
    } : {};

    // If interactive, wrap in touchable component
    if (interactive && (onPress || onClick)) {
      return (
        <InteractiveCardWrapper
          ref={ref}
          onPress={handlePress}
          onClick={handlePress}
          activeOpacity={!isWeb ? activeOpacity : undefined}
          style={loadingOverlay}
          {...props}
        >
          <StyledCardBase
            variant={variant}
            size={size}
          >
            {children}
            {loading && <LoadingOverlay />}
          </StyledCardBase>
        </InteractiveCardWrapper>
      );
    }

    return (
      <StyledCardBase
        ref={ref}
        variant={variant}
        size={size}
        style={loadingOverlay}
        {...props}
      >
        {children}
        {loading && <LoadingOverlay />}
      </StyledCardBase>
    );
  }
);

// Loading overlay component
const LoadingOverlay = () => {
  if (isWeb) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 'inherit',
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'omnisync-spin 1s linear infinite',
          }}
        />
      </div>
    );
  } else {
    // React Native loading overlay
    const { View, ActivityIndicator } = require('react-native');
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 12,
        }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }
};

UniversalCard.displayName = "UniversalCard";

// Compound component pattern
const Card = Object.assign(UniversalCard, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export { Card };
export default Card;
