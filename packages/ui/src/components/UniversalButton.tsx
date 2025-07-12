// Universal Button Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";
import { useTokens } from "../theme/ThemeProvider";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Button props interface
export interface UniversalButtonProps extends StyledProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  onClick?: () => void;
  // Web-specific props
  type?: "button" | "submit" | "reset";
  // React Native specific props
  hapticFeedback?: boolean;
  activeOpacity?: number;
}

// Base styled button component
const StyledButtonBase = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'UniversalButton',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'md',
      fontWeight: 'medium',
      fontSize: 'base',
      px: 4,
      py: 2,
      borderWidth: isWeb ? 1 : 0,
      backgroundColor: 'primary500',
      color: 'white',
      // Animation
      animationDuration: 'fast',
      animation: 'easeOut',
    },
    variants: {
      variant: {
        primary: {
          backgroundColor: 'primary500',
          borderColor: 'primary500',
          color: 'white',
          hoverStyle: { 
            backgroundColor: 'primary600', 
            borderColor: 'primary600',
            transform: [{ scale: 1.02 }],
          },
          pressStyle: { 
            backgroundColor: 'primary700', 
            borderColor: 'primary700',
            transform: [{ scale: 0.98 }],
          },
          focusStyle: { 
            shadowColor: 'primary500',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
        },
        secondary: {
          backgroundColor: 'gray100',
          borderColor: 'gray300',
          color: 'gray900',
          hoverStyle: { 
            backgroundColor: 'gray200', 
            borderColor: 'gray400',
            transform: [{ scale: 1.02 }],
          },
          pressStyle: { 
            backgroundColor: 'gray300', 
            borderColor: 'gray500',
            transform: [{ scale: 0.98 }],
          },
          focusStyle: { 
            shadowColor: 'gray500',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: 'primary500',
          color: 'primary600',
          hoverStyle: { 
            backgroundColor: 'primary50', 
            color: 'primary700',
            transform: [{ scale: 1.02 }],
          },
          pressStyle: { 
            backgroundColor: 'primary100', 
            color: 'primary800',
            transform: [{ scale: 0.98 }],
          },
          focusStyle: { 
            shadowColor: 'primary500',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: 'gray700',
          hoverStyle: { 
            backgroundColor: 'gray100', 
            color: 'gray900',
            transform: [{ scale: 1.02 }],
          },
          pressStyle: { 
            backgroundColor: 'gray200', 
            color: 'gray900',
            transform: [{ scale: 0.98 }],
          },
          focusStyle: { 
            shadowColor: 'gray500',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
        },
        destructive: {
          backgroundColor: 'error500',
          borderColor: 'error500',
          color: 'white',
          hoverStyle: { 
            backgroundColor: 'error600', 
            borderColor: 'error600',
            transform: [{ scale: 1.02 }],
          },
          pressStyle: { 
            backgroundColor: 'error700', 
            borderColor: 'error700',
            transform: [{ scale: 0.98 }],
          },
          focusStyle: { 
            shadowColor: 'error500',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
        },
      },
      size: {
        sm: { 
          px: 3, 
          py: 1, 
          fontSize: 'sm',
          borderRadius: 'sm',
        },
        md: { 
          px: 4, 
          py: 2, 
          fontSize: 'base',
          borderRadius: 'md',
        },
        lg: { 
          px: 6, 
          py: 3, 
          fontSize: 'lg',
          borderRadius: 'lg',
        },
      },
    },
    compoundVariants: [
      {
        variants: { variant: 'primary', size: 'lg' },
        style: {
          shadowColor: 'primary500',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4, // Android shadow
        },
      },
      {
        variants: { variant: 'destructive', size: 'lg' },
        style: {
          shadowColor: 'error500',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4, // Android shadow
        },
      },
    ],
  }
);

// Loading spinner component
const LoadingSpinner = () => {
  const tokens = useTokens();
  
  if (isWeb) {
    return (
      <div 
        style={{
          width: 16,
          height: 16,
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'omnisync-spin 1s linear infinite',
          marginRight: tokens.spacing[2],
        }}
      />
    );
  } else {
    // React Native ActivityIndicator
    const { ActivityIndicator } = require('react-native');
    return (
      <ActivityIndicator 
        size="small" 
        color="currentColor" 
        style={{ marginRight: tokens.spacing[2] }}
      />
    );
  }
};

// Main Universal Button component
export const UniversalButton = forwardRef<any, UniversalButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      onPress,
      onClick,
      type = "button",
      hapticFeedback = true,
      activeOpacity = 0.8,
      ...props
    },
    ref
  ) => {
    const tokens = useTokens();
    const isDisabled = disabled || loading;

    // Handle press events
    const handlePress = () => {
      if (isDisabled) return;
      
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

    // Disabled styles
    const disabledStyle = isDisabled ? {
      opacity: 0.6,
      transform: [],
    } : {};

    // Full width style
    const fullWidthStyle = fullWidth ? {
      width: '100%',
    } : {};

    return (
      <StyledButtonBase
        ref={ref}
        variant={variant}
        size={size}
        onPress={handlePress}
        onClick={handlePress}
        disabled={isDisabled}
        type={isWeb ? type : undefined}
        activeOpacity={!isWeb ? activeOpacity : undefined}
        style={[disabledStyle, fullWidthStyle]}
        {...props}
      >
        {loading && <LoadingSpinner />}
        
        {!loading && leftIcon && (
          <div style={{ marginRight: tokens.spacing[2] }}>
            {leftIcon}
          </div>
        )}
        
        {children && (
          <span style={{ opacity: loading ? 0 : 1 }}>
            {children}
          </span>
        )}
        
        {!loading && rightIcon && (
          <div style={{ marginLeft: tokens.spacing[2] }}>
            {rightIcon}
          </div>
        )}
      </StyledButtonBase>
    );
  }
);

UniversalButton.displayName = "UniversalButton";

// Export as default
export default UniversalButton;
