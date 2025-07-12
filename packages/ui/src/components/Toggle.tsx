// Toggle Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Toggle props interface
export interface ToggleProps extends StyledProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  children?: React.ReactNode;
  // Web-specific
  type?: 'button' | 'submit' | 'reset';
  // React Native specific
  hapticFeedback?: boolean;
}

// Base styled toggle component
const StyledToggleBase = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'Toggle',
    defaultProps: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'md',
      fontWeight: 'medium',
      transition: 'all 0.2s',
      cursor: isWeb ? 'pointer' : undefined,
      borderWidth: 1,
      backgroundColor: 'transparent',
      color: 'gray700',
      borderColor: 'gray300',
    },
    variants: {
      size: {
        sm: {
          px: 2,
          py: 1,
          fontSize: 'xs',
          minHeight: 28,
        },
        md: {
          px: 3,
          py: 2,
          fontSize: 'sm',
          minHeight: 36,
        },
        lg: {
          px: 4,
          py: 3,
          fontSize: 'base',
          minHeight: 44,
        },
      },
      variant: {
        default: {
          hoverStyle: {
            backgroundColor: 'gray100',
          },
          pressStyle: {
            backgroundColor: 'gray200',
          },
        },
        outline: {
          borderWidth: 1,
          borderColor: 'gray300',
          hoverStyle: {
            backgroundColor: 'gray50',
            borderColor: 'gray400',
          },
          pressStyle: {
            backgroundColor: 'gray100',
          },
        },
      },
      pressed: {
        true: {},
        false: {},
      },
      disabled: {
        true: {
          opacity: 0.6,
          cursor: isWeb ? 'not-allowed' : undefined,
        },
        false: {},
      },
    },
    compoundVariants: [
      // Default variant pressed states
      {
        variants: { variant: 'default', pressed: true },
        style: {
          backgroundColor: 'gray900',
          color: 'white',
          hoverStyle: {
            backgroundColor: 'gray800',
          },
        },
      },
      // Outline variant pressed states
      {
        variants: { variant: 'outline', pressed: true },
        style: {
          backgroundColor: 'gray900',
          borderColor: 'gray900',
          color: 'white',
          hoverStyle: {
            backgroundColor: 'gray800',
            borderColor: 'gray800',
          },
        },
      },
    ],
  }
);

// Toggle content wrapper
const ToggleContent = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'ToggleContent',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    },
  }
);

// Main Toggle component
export const Toggle = forwardRef<any, ToggleProps>(
  (
    {
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      disabled = false,
      size = 'md',
      variant = 'default',
      children,
      type = 'button',
      hapticFeedback = true,
      ...props
    },
    ref
  ) => {
    const [internalPressed, setInternalPressed] = useState(defaultPressed);

    const isControlled = controlledPressed !== undefined;
    const pressed = isControlled ? controlledPressed : internalPressed;

    // Handle press
    const handlePress = () => {
      if (disabled) return;

      const newPressed = !pressed;

      if (!isControlled) {
        setInternalPressed(newPressed);
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

      onPressedChange?.(newPressed);
    };

    return (
      <StyledToggleBase
        ref={ref}
        size={size}
        variant={variant}
        pressed={pressed}
        disabled={disabled}
        type={isWeb ? type : undefined}
        onPress={handlePress}
        onClick={handlePress}
        aria-pressed={isWeb ? pressed : undefined}
        {...props}
      >
        <ToggleContent>
          {children}
        </ToggleContent>
      </StyledToggleBase>
    );
  }
);

Toggle.displayName = "Toggle";

// Toggle Group component for managing multiple toggles
export interface ToggleGroupProps extends StyledProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

const ToggleGroupContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ToggleGroup',
    defaultProps: {
      display: 'flex',
      borderRadius: 'md',
      overflow: 'hidden',
    },
    variants: {
      orientation: {
        horizontal: {
          flexDirection: 'row',
        },
        vertical: {
          flexDirection: 'column',
        },
      },
      variant: {
        default: {},
        outline: {
          borderWidth: 1,
          borderColor: 'gray300',
        },
      },
    },
  }
);

const ToggleGroupContext = React.createContext<{
  value: string | string[];
  onValueChange: (value: string) => void;
  type: 'single' | 'multiple';
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'outline';
} | null>(null);

export const ToggleGroup = forwardRef<any, ToggleGroupProps>(
  (
    {
      type = 'single',
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled = false,
      size = 'md',
      variant = 'default',
      orientation = 'horizontal',
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      defaultValue || (type === 'multiple' ? [] : '')
    );

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleValueChange = (itemValue: string) => {
      let newValue: string | string[];

      if (type === 'multiple') {
        const currentArray = Array.isArray(value) ? value : [];
        if (currentArray.includes(itemValue)) {
          newValue = currentArray.filter(v => v !== itemValue);
        } else {
          newValue = [...currentArray, itemValue];
        }
      } else {
        newValue = value === itemValue ? '' : itemValue;
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onValueChange?.(newValue);
    };

    const contextValue = {
      value,
      onValueChange: handleValueChange,
      type,
      disabled,
      size,
      variant,
    };

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <ToggleGroupContainer
          ref={ref}
          orientation={orientation}
          variant={variant}
          {...props}
        >
          {children}
        </ToggleGroupContainer>
      </ToggleGroupContext.Provider>
    );
  }
);

// Toggle Group Item component
export interface ToggleGroupItemProps extends Omit<ToggleProps, 'pressed' | 'onPressedChange'> {
  value: string;
}

export const ToggleGroupItem = forwardRef<any, ToggleGroupItemProps>(
  ({ value: itemValue, children, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    
    if (!context) {
      throw new Error('ToggleGroupItem must be used within a ToggleGroup');
    }

    const { value, onValueChange, type, disabled, size, variant } = context;

    const isPressed = type === 'multiple' 
      ? Array.isArray(value) && value.includes(itemValue)
      : value === itemValue;

    return (
      <Toggle
        ref={ref}
        pressed={isPressed}
        onPressedChange={() => onValueChange(itemValue)}
        disabled={disabled}
        size={size}
        variant={variant}
        style={{
          borderRadius: 0,
          borderRightWidth: 0,
          '&:last-child': {
            borderRightWidth: variant === 'outline' ? 1 : 0,
          },
        }}
        {...props}
      >
        {children}
      </Toggle>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";
ToggleGroupItem.displayName = "ToggleGroupItem";

// Compound component
const ToggleCompound = Object.assign(Toggle, {
  Group: ToggleGroup,
  GroupItem: ToggleGroupItem,
});

export { ToggleCompound as ToggleComponent };
export default Toggle;
