// Switch Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Switch props interface
export interface SwitchProps extends StyledProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "error";
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  label?: string;
  description?: string;
  error?: string;
  onChange?: (checked: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  children?: React.ReactNode;
  // Web-specific
  name?: string;
  value?: string;
  form?: string;
  // React Native specific
  hapticFeedback?: boolean;
}

// Base styled switch container
const SwitchContainer = createStyledComponent(
  isWeb ? 'label' : 'View',
  {
    name: 'SwitchContainer',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      cursor: isWeb ? 'pointer' : undefined,
      opacity: 1,
    },
    variants: {
      disabled: {
        true: { opacity: 0.6, cursor: isWeb ? 'not-allowed' : undefined },
        false: {},
      },
    },
  }
);

// Switch track (background)
const SwitchTrack = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SwitchTrack',
    defaultProps: {
      position: 'relative',
      borderRadius: 'full',
      backgroundColor: 'gray300',
      transition: 'all 0.2s',
      cursor: isWeb ? 'pointer' : undefined,
    },
    variants: {
      size: {
        sm: { width: 32, height: 18 },
        md: { width: 44, height: 24 },
        lg: { width: 56, height: 32 },
      },
      variant: {
        default: {
          focusStyle: { shadowColor: 'primary500', shadowOpacity: 0.3, shadowRadius: 4 },
        },
        primary: {
          focusStyle: { shadowColor: 'primary500', shadowOpacity: 0.3, shadowRadius: 4 },
        },
        success: {
          focusStyle: { shadowColor: 'success500', shadowOpacity: 0.3, shadowRadius: 4 },
        },
        warning: {
          focusStyle: { shadowColor: 'warning500', shadowOpacity: 0.3, shadowRadius: 4 },
        },
        error: {
          focusStyle: { shadowColor: 'error500', shadowOpacity: 0.3, shadowRadius: 4 },
        },
      },
      checked: {
        true: {},
        false: { backgroundColor: 'gray300' },
      },
      invalid: {
        true: { backgroundColor: 'error200' },
        false: {},
      },
    },
    compoundVariants: [
      {
        variants: { checked: true, variant: 'default' },
        style: { backgroundColor: 'primary500' },
      },
      {
        variants: { checked: true, variant: 'primary' },
        style: { backgroundColor: 'primary500' },
      },
      {
        variants: { checked: true, variant: 'success' },
        style: { backgroundColor: 'success500' },
      },
      {
        variants: { checked: true, variant: 'warning' },
        style: { backgroundColor: 'warning500' },
      },
      {
        variants: { checked: true, variant: 'error' },
        style: { backgroundColor: 'error500' },
      },
    ],
  }
);

// Switch thumb (the moving circle)
const SwitchThumb = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SwitchThumb',
    defaultProps: {
      position: 'absolute',
      borderRadius: 'full',
      backgroundColor: 'white',
      transition: 'all 0.2s',
      shadowColor: 'gray900',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2, // Android shadow
    },
    variants: {
      size: {
        sm: { 
          width: 14, 
          height: 14, 
          top: 2, 
          left: 2,
        },
        md: { 
          width: 20, 
          height: 20, 
          top: 2, 
          left: 2,
        },
        lg: { 
          width: 28, 
          height: 28, 
          top: 2, 
          left: 2,
        },
      },
      checked: {
        true: {},
        false: {},
      },
    },
    compoundVariants: [
      {
        variants: { checked: true, size: 'sm' },
        style: { left: 16 }, // 32 - 14 - 2
      },
      {
        variants: { checked: true, size: 'md' },
        style: { left: 22 }, // 44 - 20 - 2
      },
      {
        variants: { checked: true, size: 'lg' },
        style: { left: 26 }, // 56 - 28 - 2
      },
    ],
  }
);

// Hidden input for web accessibility
const HiddenInput = isWeb ? createStyledComponent('input', {
  name: 'SwitchInput',
  defaultProps: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: 'pointer',
  },
}) : null;

// Switch content (label, description, etc.)
const SwitchContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SwitchContent',
    defaultProps: {
      ml: 3,
      flex: 1,
    },
  }
);

// Switch label
const SwitchLabel = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'SwitchLabel',
    defaultProps: {
      fontSize: 'base',
      fontWeight: 'medium',
      color: 'gray900',
      lineHeight: 'normal',
    },
  }
);

// Switch description
const SwitchDescription = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'SwitchDescription',
    defaultProps: {
      fontSize: 'sm',
      color: 'gray600',
      mt: 1,
    },
  }
);

// Error text
const ErrorText = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'SwitchError',
    defaultProps: {
      fontSize: 'sm',
      color: 'error600',
      mt: 1,
    },
  }
);

// Main Switch component
export const Switch = forwardRef<any, SwitchProps>(
  (
    {
      size = "md",
      variant = "default",
      checked: controlledChecked,
      defaultChecked = false,
      disabled = false,
      required = false,
      invalid = false,
      label,
      description,
      error,
      onChange,
      onFocus,
      onBlur,
      children,
      name,
      value,
      form,
      hapticFeedback = true,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [focused, setFocused] = useState(false);

    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    // Handle change
    const handleChange = (newChecked: boolean) => {
      if (disabled) return;

      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      // Haptic feedback for React Native
      if (!isWeb && hapticFeedback) {
        try {
          const { HapticFeedback } = require('expo-haptics');
          HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
        } catch (error) {
          // Haptic feedback not available
        }
      }

      onChange?.(newChecked);
    };

    // Handle press
    const handlePress = () => {
      handleChange(!checked);
    };

    // Handle focus
    const handleFocus = () => {
      setFocused(true);
      onFocus?.();
    };

    // Handle blur
    const handleBlur = () => {
      setFocused(false);
      onBlur?.();
    };

    const showError = invalid || !!error;

    return (
      <SwitchContainer
        ref={ref}
        disabled={disabled}
        onPress={!isWeb ? handlePress : undefined}
        {...props}
      >
        <SwitchTrack
          size={size}
          variant={variant}
          checked={checked}
          invalid={showError}
          style={focused ? { shadowRadius: 6, shadowOffset: { width: 0, height: 0 } } : {}}
        >
          {/* Hidden input for web accessibility */}
          {isWeb && HiddenInput && (
            <HiddenInput
              type="checkbox"
              role="switch"
              checked={checked}
              disabled={disabled}
              required={required}
              name={name}
              value={value}
              form={form}
              onChange={(e: any) => handleChange(e.target.checked)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}

          {/* Switch thumb */}
          <SwitchThumb
            size={size}
            checked={checked}
          />
        </SwitchTrack>

        {/* Content */}
        {(label || description || children) && (
          <SwitchContent>
            {label && (
              <SwitchLabel>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
              </SwitchLabel>
            )}
            
            {description && (
              <SwitchDescription>
                {description}
              </SwitchDescription>
            )}
            
            {children}
            
            {showError && error && (
              <ErrorText>
                {error}
              </ErrorText>
            )}
          </SwitchContent>
        )}
      </SwitchContainer>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
