// Checkbox Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Checkbox props interface
export interface CheckboxProps extends StyledProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "error";
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
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

// Base styled checkbox container
const CheckboxContainer = createStyledComponent(
  isWeb ? 'label' : 'View',
  {
    name: 'CheckboxContainer',
    defaultProps: {
      display: 'flex',
      alignItems: 'flex-start',
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

// Checkbox input wrapper
const CheckboxWrapper = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'CheckboxWrapper',
    defaultProps: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
  }
);

// Base styled checkbox
const StyledCheckboxBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Checkbox',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderRadius: 'sm',
      backgroundColor: 'white',
      borderColor: 'gray300',
      transition: 'all 0.2s',
    },
    variants: {
      size: {
        sm: { width: 16, height: 16 },
        md: { width: 20, height: 20 },
        lg: { width: 24, height: 24 },
      },
      variant: {
        default: {
          focusStyle: { borderColor: 'primary500', shadowColor: 'primary500', shadowOpacity: 0.2 },
        },
        primary: {
          focusStyle: { borderColor: 'primary500', shadowColor: 'primary500', shadowOpacity: 0.2 },
        },
        success: {
          focusStyle: { borderColor: 'success500', shadowColor: 'success500', shadowOpacity: 0.2 },
        },
        warning: {
          focusStyle: { borderColor: 'warning500', shadowColor: 'warning500', shadowOpacity: 0.2 },
        },
        error: {
          focusStyle: { borderColor: 'error500', shadowColor: 'error500', shadowOpacity: 0.2 },
        },
      },
      checked: {
        true: {},
        false: {},
      },
      invalid: {
        true: { borderColor: 'error500' },
        false: {},
      },
    },
    compoundVariants: [
      {
        variants: { checked: true, variant: 'default' },
        style: { backgroundColor: 'primary500', borderColor: 'primary500' },
      },
      {
        variants: { checked: true, variant: 'primary' },
        style: { backgroundColor: 'primary500', borderColor: 'primary500' },
      },
      {
        variants: { checked: true, variant: 'success' },
        style: { backgroundColor: 'success500', borderColor: 'success500' },
      },
      {
        variants: { checked: true, variant: 'warning' },
        style: { backgroundColor: 'warning500', borderColor: 'warning500' },
      },
      {
        variants: { checked: true, variant: 'error' },
        style: { backgroundColor: 'error500', borderColor: 'error500' },
      },
    ],
  }
);

// Hidden input for web accessibility
const HiddenInput = isWeb ? createStyledComponent('input', {
  name: 'CheckboxInput',
  defaultProps: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: 'pointer',
  },
}) : null;

// Checkbox content (label, description, etc.)
const CheckboxContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'CheckboxContent',
    defaultProps: {
      ml: 3,
      flex: 1,
    },
  }
);

// Checkbox label
const CheckboxLabel = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'CheckboxLabel',
    defaultProps: {
      fontSize: 'base',
      fontWeight: 'medium',
      color: 'gray900',
      lineHeight: 'normal',
    },
  }
);

// Checkbox description
const CheckboxDescription = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'CheckboxDescription',
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
    name: 'CheckboxError',
    defaultProps: {
      fontSize: 'sm',
      color: 'error600',
      mt: 1,
    },
  }
);

// Check icon
const CheckIcon = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
  
  if (isWeb) {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'white' }}
      >
        <polyline points="20,6 9,17 4,12" />
      </svg>
    );
  } else {
    // React Native - using text for simplicity
    const { Text } = require('react-native');
    return (
      <Text style={{ color: 'white', fontSize: iconSize, fontWeight: 'bold' }}>
        ✓
      </Text>
    );
  }
};

// Indeterminate icon
const IndeterminateIcon = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const iconSize = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;
  
  if (isWeb) {
    return (
      <div
        style={{
          width: iconSize,
          height: 2,
          backgroundColor: 'white',
          borderRadius: 1,
        }}
      />
    );
  } else {
    const { View } = require('react-native');
    return (
      <View
        style={{
          width: iconSize,
          height: 2,
          backgroundColor: 'white',
          borderRadius: 1,
        }}
      />
    );
  }
};

// Main Checkbox component
export const Checkbox = forwardRef<any, CheckboxProps>(
  (
    {
      size = "md",
      variant = "default",
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
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
      <CheckboxContainer
        ref={ref}
        disabled={disabled}
        onPress={!isWeb ? handlePress : undefined}
        {...props}
      >
        <CheckboxWrapper>
          <StyledCheckboxBase
            size={size}
            variant={variant}
            checked={checked || indeterminate}
            invalid={showError}
            style={focused ? { shadowRadius: 4, shadowOffset: { width: 0, height: 0 } } : {}}
          >
            {/* Hidden input for web accessibility */}
            {isWeb && HiddenInput && (
              <HiddenInput
                type="checkbox"
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

            {/* Check/Indeterminate icon */}
            {indeterminate ? (
              <IndeterminateIcon size={size} />
            ) : checked ? (
              <CheckIcon size={size} />
            ) : null}
          </StyledCheckboxBase>
        </CheckboxWrapper>

        {/* Content */}
        {(label || description || children) && (
          <CheckboxContent>
            {label && (
              <CheckboxLabel>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
              </CheckboxLabel>
            )}
            
            {description && (
              <CheckboxDescription>
                {description}
              </CheckboxDescription>
            )}
            
            {children}
            
            {showError && error && (
              <ErrorText>
                {error}
              </ErrorText>
            )}
          </CheckboxContent>
        )}
      </CheckboxContainer>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
