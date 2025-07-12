// Textarea Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Textarea props interface
export interface TextareaProps extends StyledProps {
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
  invalid?: boolean;
  resize?: "none" | "both" | "horizontal" | "vertical";
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  children?: React.ReactNode;
  // Web-specific
  name?: string;
  form?: string;
  autoComplete?: string;
  // React Native specific
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}

// Base styled textarea container
const TextareaContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'TextareaContainer',
    defaultProps: {
      width: '100%',
    },
  }
);

// Textarea label
const TextareaLabel = createStyledComponent(
  isWeb ? 'label' : 'Text',
  {
    name: 'TextareaLabel',
    defaultProps: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'gray700',
      mb: 1,
      display: 'block',
    },
  }
);

// Base styled textarea
const StyledTextareaBase = createStyledComponent(
  isWeb ? 'textarea' : 'TextInput',
  {
    name: 'Textarea',
    defaultProps: {
      borderRadius: 'md',
      fontSize: 'base',
      px: 3,
      py: 2,
      borderWidth: 1,
      backgroundColor: 'white',
      color: 'gray900',
      fontFamily: 'inherit',
      lineHeight: 'normal',
      transition: 'all 0.2s',
      resize: isWeb ? 'vertical' : undefined,
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
      invalid: {
        true: { borderColor: 'error500' },
        false: {},
      },
      disabled: {
        true: { 
          opacity: 0.6, 
          backgroundColor: 'gray50',
          cursor: isWeb ? 'not-allowed' : undefined,
        },
        false: {},
      },
    },
  }
);

// Helper text component
const HelperText = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'TextareaHelperText',
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
    name: 'TextareaErrorText',
    defaultProps: {
      fontSize: 'xs',
      color: 'error600',
      mt: 1,
    },
  }
);

// Character count component
const CharacterCount = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'TextareaCharacterCount',
    defaultProps: {
      fontSize: 'xs',
      color: 'gray500',
      mt: 1,
      textAlign: 'right',
    },
  }
);

// Footer container for helper text and count
const TextareaFooter = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'TextareaFooter',
    defaultProps: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
  }
);

// Main Textarea component
export const Textarea = forwardRef<any, TextareaProps>(
  (
    {
      variant = "outline",
      size = "md",
      label,
      placeholder,
      value: controlledValue,
      defaultValue = '',
      error,
      helperText,
      disabled = false,
      required = false,
      invalid = false,
      resize = "vertical",
      rows = 4,
      maxLength,
      showCount = false,
      onChange,
      onFocus,
      onBlur,
      children,
      name,
      form,
      autoComplete,
      autoCapitalize = "sentences",
      autoCorrect = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [focused, setFocused] = useState(false);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Handle value changes
    const handleChange = (newValue: string) => {
      // Respect maxLength
      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    // Handle focus events
    const handleFocus = () => {
      setFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setFocused(false);
      onBlur?.();
    };

    const showError = invalid || !!error;
    const characterCount = value.length;
    const isOverLimit = maxLength ? characterCount > maxLength : false;

    return (
      <TextareaContainer {...props}>
        {/* Label */}
        {label && (
          <TextareaLabel>
            {label}
            {required && <span style={{ color: 'red' }}>*</span>}
          </TextareaLabel>
        )}

        {/* Textarea */}
        <StyledTextareaBase
          ref={ref}
          variant={variant}
          size={size}
          invalid={showError}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          rows={rows}
          maxLength={isWeb ? maxLength : undefined}
          name={name}
          form={form}
          autoComplete={autoComplete}
          required={required}
          style={{
            resize: isWeb ? resize : undefined,
            ...(focused ? { 
              shadowRadius: 4, 
              shadowOffset: { width: 0, height: 0 } 
            } : {}),
          }}
          // Web events
          onChange={isWeb ? (e: any) => handleChange(e.target.value) : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          // React Native events
          onChangeText={!isWeb ? handleChange : undefined}
          multiline={!isWeb}
          numberOfLines={!isWeb ? rows : undefined}
          autoCapitalize={!isWeb ? autoCapitalize : undefined}
          autoCorrect={!isWeb ? autoCorrect : undefined}
          textAlignVertical={!isWeb ? 'top' : undefined}
        />

        {/* Footer with helper text and character count */}
        {(showError || helperText || showCount) && (
          <TextareaFooter>
            <div style={{ flex: 1 }}>
              {showError && error ? (
                <ErrorText>{error}</ErrorText>
              ) : helperText ? (
                <HelperText>{helperText}</HelperText>
              ) : null}
            </div>
            
            {showCount && (
              <CharacterCount
                style={{
                  color: isOverLimit ? 'red' : undefined,
                }}
              >
                {characterCount}{maxLength ? `/${maxLength}` : ''}
              </CharacterCount>
            )}
          </TextareaFooter>
        )}

        {/* Custom children */}
        {children}
      </TextareaContainer>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
