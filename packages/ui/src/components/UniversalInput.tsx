// Universal Input Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";
import { useTokens } from "../theme/ThemeProvider";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Input props interface
export interface UniversalInputProps extends StyledProps {
  variant?: "outline" | "filled" | "flushed" | "unstyled";
  size?: "sm" | "md" | "lg";
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  fullWidth?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  // Event handlers
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
  // Web-specific props
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  autoComplete?: string;
  // React Native specific props
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad" | "url";
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}

// Base styled input component
const StyledInputBase = createStyledComponent(
  isWeb ? 'input' : 'TextInput',
  {
    name: 'UniversalInput',
    defaultProps: {
      borderRadius: 'md',
      fontSize: 'base',
      px: 3,
      py: 2,
      borderWidth: 1,
      backgroundColor: 'white',
      color: 'gray900',
      // Animation
      animationDuration: 'fast',
      animation: 'easeOut',
    },
    variants: {
      variant: {
        outline: {
          borderColor: 'gray300',
          backgroundColor: 'white',
          focusStyle: { 
            borderColor: 'primary500',
            shadowColor: 'primary500',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 0 },
          },
        },
        filled: {
          borderColor: 'transparent',
          backgroundColor: 'gray100',
          focusStyle: { 
            borderColor: 'primary500',
            backgroundColor: 'white',
            shadowColor: 'primary500',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 0 },
          },
        },
        flushed: {
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 'none',
          px: 0,
          backgroundColor: 'transparent',
          borderBottomColor: 'gray300',
          focusStyle: { 
            borderBottomColor: 'primary500',
          },
        },
        unstyled: {
          borderWidth: 0,
          backgroundColor: 'transparent',
          px: 0,
          py: 0,
        },
      },
      size: {
        sm: { 
          px: 2, 
          py: 1, 
          fontSize: 'sm',
          borderRadius: 'sm',
        },
        md: { 
          px: 3, 
          py: 2, 
          fontSize: 'base',
          borderRadius: 'md',
        },
        lg: { 
          px: 4, 
          py: 3, 
          fontSize: 'lg',
          borderRadius: 'lg',
        },
      },
    },
  }
);

// Input container component
const InputContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'InputContainer',
    defaultProps: {
      width: '100%',
    },
  }
);

// Input wrapper component (for icons and elements)
const InputWrapper = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'InputWrapper',
    defaultProps: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
  }
);

// Label component
const InputLabel = createStyledComponent(
  isWeb ? 'label' : 'Text',
  {
    name: 'InputLabel',
    defaultProps: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'gray700',
      mb: 1,
      display: 'block',
    },
  }
);

// Helper text component
const HelperText = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'HelperText',
    defaultProps: {
      fontSize: 'xs',
      color: 'gray500',
      mt: 1,
    },
  }
);

// Error text component
const ErrorText = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'ErrorText',
    defaultProps: {
      fontSize: 'xs',
      color: 'error600',
      mt: 1,
    },
  }
);

// Icon wrapper component
const IconWrapper = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'IconWrapper',
    defaultProps: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
  }
);

// Main Universal Input component
export const UniversalInput = forwardRef<any, UniversalInputProps>(
  (
    {
      variant = "outline",
      size = "md",
      label,
      placeholder,
      value,
      defaultValue,
      error,
      helperText,
      disabled = false,
      required = false,
      leftIcon,
      rightIcon,
      leftElement,
      rightElement,
      fullWidth = false,
      multiline = false,
      numberOfLines = 1,
      maxLength,
      onChange,
      onFocus,
      onBlur,
      onSubmit,
      type = "text",
      autoComplete,
      keyboardType = "default",
      returnKeyType = "done",
      secureTextEntry = false,
      autoCapitalize = "sentences",
      autoCorrect = true,
      ...props
    },
    ref
  ) => {
    const tokens = useTokens();
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    // Handle value changes
    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    // Handle focus events
    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    // Handle submit events
    const handleSubmit = () => {
      onSubmit?.();
    };

    // Determine current value
    const currentValue = value !== undefined ? value : internalValue;

    // Calculate padding for icons/elements
    const leftPadding = (leftIcon || leftElement) ? tokens.spacing[8] : undefined;
    const rightPadding = (rightIcon || rightElement) ? tokens.spacing[8] : undefined;

    // Error styles
    const errorStyle = error ? {
      borderColor: 'error500',
      focusStyle: {
        borderColor: 'error500',
        shadowColor: 'error500',
      },
    } : {};

    // Disabled styles
    const disabledStyle = disabled ? {
      opacity: 0.6,
      backgroundColor: 'gray50',
      color: 'gray400',
    } : {};

    // Full width style
    const fullWidthStyle = fullWidth ? {
      width: '100%',
    } : {};

    // Multiline props for React Native
    const multilineProps = !isWeb && multiline ? {
      multiline: true,
      numberOfLines,
      textAlignVertical: 'top' as const,
    } : {};

    return (
      <InputContainer style={fullWidthStyle}>
        {label && (
          <InputLabel>
            {label}
            {required && <span style={{ color: tokens.colors.error500 }}>*</span>}
          </InputLabel>
        )}
        
        <InputWrapper>
          {/* Left Icon/Element */}
          {(leftIcon || leftElement) && (
            <IconWrapper
              style={{
                left: tokens.spacing[3],
                ...(leftElement ? {} : { pointerEvents: 'none' }),
              }}
            >
              {leftElement || leftIcon}
            </IconWrapper>
          )}
          
          {/* Input Field */}
          <StyledInputBase
            ref={ref}
            variant={variant}
            size={size}
            placeholder={placeholder}
            value={currentValue}
            disabled={disabled}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={isWeb ? (e: any) => handleChange(e.target.value) : handleChange}
            onChangeText={!isWeb ? handleChange : undefined}
            onSubmitEditing={!isWeb ? handleSubmit : undefined}
            onKeyPress={isWeb ? (e: any) => e.key === 'Enter' && handleSubmit() : undefined}
            // Web-specific props
            type={isWeb ? type : undefined}
            autoComplete={isWeb ? autoComplete : undefined}
            // React Native specific props
            keyboardType={!isWeb ? keyboardType : undefined}
            returnKeyType={!isWeb ? returnKeyType : undefined}
            secureTextEntry={!isWeb ? secureTextEntry : undefined}
            autoCapitalize={!isWeb ? autoCapitalize : undefined}
            autoCorrect={!isWeb ? autoCorrect : undefined}
            {...multilineProps}
            style={[
              {
                paddingLeft: leftPadding,
                paddingRight: rightPadding,
              },
              errorStyle,
              disabledStyle,
            ]}
            {...props}
          />
          
          {/* Right Icon/Element */}
          {(rightIcon || rightElement) && (
            <IconWrapper
              style={{
                right: tokens.spacing[3],
                ...(rightElement ? {} : { pointerEvents: 'none' }),
              }}
            >
              {rightElement || rightIcon}
            </IconWrapper>
          )}
        </InputWrapper>
        
        {/* Helper/Error Text */}
        {error ? (
          <ErrorText>{error}</ErrorText>
        ) : helperText ? (
          <HelperText>{helperText}</HelperText>
        ) : null}
      </InputContainer>
    );
  }
);

UniversalInput.displayName = "UniversalInput";

// Export as default
export default UniversalInput;
