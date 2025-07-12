// RadioGroup Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, createContext, useContext } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// RadioGroup context
interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio components must be used within a RadioGroup component');
  }
  return context;
};

// RadioGroup props interface
export interface RadioGroupProps extends StyledProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

// Base styled radio group container
const StyledRadioGroupBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'RadioGroup',
    defaultProps: {
      display: 'flex',
      gap: 3,
    },
    variants: {
      orientation: {
        horizontal: { flexDirection: 'row', flexWrap: 'wrap' },
        vertical: { flexDirection: 'column' },
      },
      disabled: {
        true: { opacity: 0.6 },
        false: {},
      },
    },
  }
);

// Radio item container
export interface RadioItemProps extends StyledProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const RadioItemContainer = createStyledComponent(
  isWeb ? 'label' : 'View',
  {
    name: 'RadioItemContainer',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      cursor: isWeb ? 'pointer' : undefined,
    },
    variants: {
      disabled: {
        true: { 
          opacity: 0.6, 
          cursor: isWeb ? 'not-allowed' : undefined,
        },
        false: {},
      },
    },
  }
);

// Radio button (the circular part)
const StyledRadioButton = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'RadioButton',
    defaultProps: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'full',
      borderWidth: 2,
      backgroundColor: 'white',
      transition: 'all 0.2s',
      flexShrink: 0,
    },
    variants: {
      size: {
        sm: { width: 16, height: 16 },
        md: { width: 20, height: 20 },
        lg: { width: 24, height: 24 },
      },
      variant: {
        default: {
          borderColor: 'gray300',
          focusStyle: { 
            borderColor: 'primary500',
            shadowColor: 'primary500',
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
        },
        primary: {
          borderColor: 'gray300',
          focusStyle: { 
            borderColor: 'primary500',
            shadowColor: 'primary500',
            shadowOpacity: 0.2,
          },
        },
        success: {
          borderColor: 'gray300',
          focusStyle: { 
            borderColor: 'success500',
            shadowColor: 'success500',
            shadowOpacity: 0.2,
          },
        },
        warning: {
          borderColor: 'gray300',
          focusStyle: { 
            borderColor: 'warning500',
            shadowColor: 'warning500',
            shadowOpacity: 0.2,
          },
        },
        error: {
          borderColor: 'gray300',
          focusStyle: { 
            borderColor: 'error500',
            shadowColor: 'error500',
            shadowOpacity: 0.2,
          },
        },
      },
      checked: {
        true: {},
        false: {},
      },
    },
    compoundVariants: [
      {
        variants: { checked: true, variant: 'default' },
        style: { borderColor: 'primary500' },
      },
      {
        variants: { checked: true, variant: 'primary' },
        style: { borderColor: 'primary500' },
      },
      {
        variants: { checked: true, variant: 'success' },
        style: { borderColor: 'success500' },
      },
      {
        variants: { checked: true, variant: 'warning' },
        style: { borderColor: 'warning500' },
      },
      {
        variants: { checked: true, variant: 'error' },
        style: { borderColor: 'error500' },
      },
    ],
  }
);

// Radio indicator (the inner dot)
const RadioIndicator = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'RadioIndicator',
    defaultProps: {
      borderRadius: 'full',
      transition: 'all 0.2s',
    },
    variants: {
      size: {
        sm: { width: 6, height: 6 },
        md: { width: 8, height: 8 },
        lg: { width: 10, height: 10 },
      },
      variant: {
        default: { backgroundColor: 'primary500' },
        primary: { backgroundColor: 'primary500' },
        success: { backgroundColor: 'success500' },
        warning: { backgroundColor: 'warning500' },
        error: { backgroundColor: 'error500' },
      },
    },
  }
);

// Hidden input for web accessibility
const HiddenInput = isWeb ? createStyledComponent('input', {
  name: 'RadioInput',
  defaultProps: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    cursor: 'pointer',
  },
}) : null;

// Radio label
const RadioLabel = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'RadioLabel',
    defaultProps: {
      ml: 3,
      fontSize: 'base',
      fontWeight: 'medium',
      color: 'gray900',
      lineHeight: 'normal',
    },
  }
);

// Main RadioGroup component
export const RadioGroup = forwardRef<any, RadioGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      name,
      disabled = false,
      size = 'md',
      variant = 'default',
      orientation = 'vertical',
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: RadioGroupContextValue = {
      value,
      onValueChange: handleValueChange,
      name,
      disabled,
      size,
      variant,
    };

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <StyledRadioGroupBase
          ref={ref}
          orientation={orientation}
          disabled={disabled}
          role={isWeb ? 'radiogroup' : undefined}
          {...props}
        >
          {children}
        </StyledRadioGroupBase>
      </RadioGroupContext.Provider>
    );
  }
);

// RadioItem component
export const RadioItem = forwardRef<any, RadioItemProps>(
  ({ value: itemValue, disabled: itemDisabled, children, ...props }, ref) => {
    const { 
      value, 
      onValueChange, 
      name, 
      disabled: groupDisabled, 
      size, 
      variant 
    } = useRadioGroupContext();

    const [focused, setFocused] = React.useState(false);

    const isDisabled = groupDisabled || itemDisabled;
    const isChecked = value === itemValue;

    const handlePress = () => {
      if (!isDisabled) {
        onValueChange(itemValue);
      }
    };

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    return (
      <RadioItemContainer
        ref={ref}
        disabled={isDisabled}
        onPress={!isWeb ? handlePress : undefined}
        {...props}
      >
        <StyledRadioButton
          size={size}
          variant={variant}
          checked={isChecked}
          style={focused ? { 
            shadowRadius: 4, 
            shadowOffset: { width: 0, height: 0 } 
          } : {}}
        >
          {/* Hidden input for web accessibility */}
          {isWeb && HiddenInput && (
            <HiddenInput
              type="radio"
              name={name}
              value={itemValue}
              checked={isChecked}
              disabled={isDisabled}
              onChange={() => handlePress()}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}

          {/* Radio indicator */}
          {isChecked && (
            <RadioIndicator
              size={size}
              variant={variant}
            />
          )}
        </StyledRadioButton>

        {/* Label */}
        {children && (
          <RadioLabel>
            {children}
          </RadioLabel>
        )}
      </RadioItemContainer>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
RadioItem.displayName = "RadioItem";

// Compound component
const RadioGroupCompound = Object.assign(RadioGroup, {
  Item: RadioItem,
});

export { RadioGroupCompound as RadioGroupComponent };
export default RadioGroup;
