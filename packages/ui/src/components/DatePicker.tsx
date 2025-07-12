// DatePicker Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, useRef, useEffect } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";
import Calendar from "./Calendar";

// Platform detection
const isWeb = typeof window !== 'undefined';

// DatePicker props interface
export interface DatePickerProps extends StyledProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | null) => void;
  placeholder?: string;
  format?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed';
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

// DatePicker container
const DatePickerContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DatePickerContainer',
    defaultProps: {
      position: 'relative',
      width: '100%',
    },
  }
);

// DatePicker label
const DatePickerLabel = createStyledComponent(
  isWeb ? 'label' : 'Text',
  {
    name: 'DatePickerLabel',
    defaultProps: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'gray700',
      mb: 1,
      display: 'block',
    },
  }
);

// DatePicker input
const DatePickerInput = createStyledComponent(
  isWeb ? 'input' : 'TouchableOpacity',
  {
    name: 'DatePickerInput',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      borderRadius: 'md',
      borderWidth: 1,
      backgroundColor: 'white',
      color: 'gray900',
      cursor: isWeb ? 'pointer' : undefined,
      transition: 'all 0.2s',
      fontFamily: 'inherit',
      fontSize: 'base',
    },
    variants: {
      size: {
        sm: { px: 2, py: 1, fontSize: 'sm', minHeight: 32 },
        md: { px: 3, py: 2, fontSize: 'base', minHeight: 40 },
        lg: { px: 4, py: 3, fontSize: 'lg', minHeight: 48 },
      },
      variant: {
        outline: {
          borderColor: 'gray300',
          backgroundColor: 'white',
          focusStyle: {
            borderColor: 'primary500',
            shadowColor: 'primary500',
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        },
        filled: {
          borderColor: 'transparent',
          backgroundColor: 'gray100',
          focusStyle: {
            borderColor: 'primary500',
            backgroundColor: 'white',
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
      },
      error: {
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

// DatePicker dropdown
const DatePickerDropdown = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DatePickerDropdown',
    defaultProps: {
      position: 'absolute',
      top: '100%',
      left: 0,
      mt: 1,
      zIndex: 'dropdown',
      backgroundColor: 'white',
      borderRadius: 'lg',
      borderWidth: 1,
      borderColor: 'gray200',
      shadowColor: 'gray900',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8, // Android shadow
      animation: 'slideInDown',
      animationDuration: 'fast',
    },
  }
);

// Input text display
const InputText = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'InputText',
    defaultProps: {
      flex: 1,
      color: 'gray900',
    },
    variants: {
      placeholder: {
        true: { color: 'gray500' },
        false: {},
      },
    },
  }
);

// Helper text
const HelperText = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'DatePickerHelperText',
    defaultProps: {
      fontSize: 'xs',
      color: 'gray500',
      mt: 1,
    },
  }
);

// Error text
const ErrorText = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'DatePickerErrorText',
    defaultProps: {
      fontSize: 'xs',
      color: 'error600',
      mt: 1,
    },
  }
);

// Calendar icon
const CalendarIcon = () => {
  if (isWeb) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'currentColor', flexShrink: 0 }}
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return <Text style={{ fontSize: 16, color: 'currentColor' }}>📅</Text>;
  }
};

// Clear icon
const ClearIcon = () => {
  if (isWeb) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'currentColor', cursor: 'pointer' }}
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return <Text style={{ fontSize: 14, color: 'currentColor' }}>✕</Text>;
  }
};

// Format date function
const formatDate = (date: Date, format: string = 'MM/dd/yyyy', locale: string = 'en-US'): string => {
  if (!date) return '';
  
  // Simple format implementation
  const options: Intl.DateTimeFormatOptions = {};
  
  if (format.includes('yyyy')) {
    options.year = 'numeric';
  } else if (format.includes('yy')) {
    options.year = '2-digit';
  }
  
  if (format.includes('MMMM')) {
    options.month = 'long';
  } else if (format.includes('MMM')) {
    options.month = 'short';
  } else if (format.includes('MM')) {
    options.month = '2-digit';
  } else if (format.includes('M')) {
    options.month = 'numeric';
  }
  
  if (format.includes('dd')) {
    options.day = '2-digit';
  } else if (format.includes('d')) {
    options.day = 'numeric';
  }
  
  return date.toLocaleDateString(locale, options);
};

// Main DatePicker component
export const DatePicker = forwardRef<any, DatePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      placeholder = 'Select date',
      format = 'MM/dd/yyyy',
      disabled = false,
      clearable = true,
      size = 'md',
      variant = 'outline',
      label,
      error,
      helperText,
      required = false,
      minDate,
      maxDate,
      locale = 'en-US',
      weekStartsOn = 0,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<Date | null>(defaultValue || null);
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const containerRef = useRef<any>(null);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Handle value change
    const handleValueChange = (date: Date | null) => {
      if (!isControlled) {
        setInternalValue(date);
      }
      onValueChange?.(date);
      setOpen(false);
    };

    // Handle input click
    const handleInputClick = () => {
      if (!disabled) {
        setOpen(!open);
      }
    };

    // Handle clear
    const handleClear = (e: any) => {
      e.stopPropagation();
      handleValueChange(null);
    };

    // Handle focus events
    const handleFocus = () => {
      setFocused(true);
    };

    const handleBlur = () => {
      setFocused(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      if (!isWeb || !open) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // Handle escape key
    useEffect(() => {
      if (!isWeb || !open) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open]);

    const showError = !!error;
    const displayValue = value ? formatDate(value, format, locale) : '';

    return (
      <DatePickerContainer ref={containerRef} {...props}>
        {/* Label */}
        {label && (
          <DatePickerLabel>
            {label}
            {required && <span style={{ color: 'red' }}>*</span>}
          </DatePickerLabel>
        )}

        {/* Input */}
        <DatePickerInput
          ref={ref}
          size={size}
          variant={variant}
          error={showError}
          disabled={disabled}
          onPress={handleInputClick}
          onClick={handleInputClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            ...(focused ? {
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 0 }
            } : {}),
          }}
          // Web-specific props
          readOnly={isWeb}
          value={isWeb ? displayValue : undefined}
        >
          {!isWeb && (
            <InputText placeholder={!displayValue}>
              {displayValue || placeholder}
            </InputText>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {clearable && value && (
              <div onPress={handleClear} onClick={handleClear}>
                <ClearIcon />
              </div>
            )}
            <CalendarIcon />
          </div>
        </DatePickerInput>

        {/* Dropdown */}
        {open && (
          <DatePickerDropdown>
            <Calendar
              value={value || undefined}
              onValueChange={handleValueChange}
              minDate={minDate}
              maxDate={maxDate}
              locale={locale}
              weekStartsOn={weekStartsOn}
            />
          </DatePickerDropdown>
        )}

        {/* Helper/Error text */}
        {showError && error ? (
          <ErrorText>{error}</ErrorText>
        ) : helperText ? (
          <HelperText>{helperText}</HelperText>
        ) : null}
      </DatePickerContainer>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
