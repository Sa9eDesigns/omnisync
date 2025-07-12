// Select Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, createContext, useContext } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Select context
interface SelectContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled: boolean;
}

const SelectContext = createContext<SelectContextValue | null>(null);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select component');
  }
  return context;
};

// Select props interface
export interface SelectProps extends StyledProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed';
  children: React.ReactNode;
}

// Base styled select container
const StyledSelectBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Select',
    defaultProps: {
      position: 'relative',
      width: '100%',
    },
  }
);

// Select trigger (the clickable part)
export interface SelectTriggerProps extends StyledProps {
  children: React.ReactNode;
}

const StyledSelectTrigger = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'SelectTrigger',
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
    },
    variants: {
      size: {
        sm: { px: 3, py: 2, fontSize: 'sm', minHeight: 32 },
        md: { px: 3, py: 2, fontSize: 'base', minHeight: 40 },
        lg: { px: 4, py: 3, fontSize: 'lg', minHeight: 48 },
      },
      variant: {
        outline: {
          borderColor: 'gray300',
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
      disabled: {
        true: { 
          opacity: 0.6, 
          cursor: isWeb ? 'not-allowed' : undefined,
        },
        false: {},
      },
      open: {
        true: {},
        false: {},
      },
    },
  }
);

// Select content (dropdown)
export interface SelectContentProps extends StyledProps {
  children: React.ReactNode;
}

const StyledSelectContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SelectContent',
    defaultProps: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      mt: 1,
      backgroundColor: 'white',
      borderRadius: 'md',
      borderWidth: 1,
      borderColor: 'gray200',
      shadowColor: 'gray900',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8, // Android shadow
      zIndex: 'dropdown',
      maxHeight: 200,
      overflow: 'auto',
      animation: 'slideInDown',
      animationDuration: 'fast',
    },
  }
);

// Select item
export interface SelectItemProps extends StyledProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledSelectItem = createStyledComponent(
  isWeb ? 'div' : 'TouchableOpacity',
  {
    name: 'SelectItem',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      px: 3,
      py: 2,
      cursor: isWeb ? 'pointer' : undefined,
      transition: 'all 0.2s',
      fontSize: 'sm',
      color: 'gray900',
    },
    variants: {
      selected: {
        true: { 
          backgroundColor: 'primary50',
          color: 'primary600',
          fontWeight: 'medium',
        },
        false: {
          hoverStyle: { backgroundColor: 'gray50' },
        },
      },
      disabled: {
        true: { 
          opacity: 0.5, 
          cursor: isWeb ? 'not-allowed' : undefined,
        },
        false: {},
      },
    },
  }
);

// Select value display
const SelectValue = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'SelectValue',
    defaultProps: {
      flex: 1,
      textAlign: 'left',
    },
  }
);

// Select placeholder
const SelectPlaceholder = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'SelectPlaceholder',
    defaultProps: {
      flex: 1,
      textAlign: 'left',
      color: 'gray500',
    },
  }
);

// Chevron icon
const ChevronIcon = ({ open }: { open: boolean }) => {
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
        style={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          color: 'currentColor',
        }}
      >
        <polyline points="6,9 12,15 18,9" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return (
      <Text
        style={{
          fontSize: 16,
          transform: [{ rotate: open ? '180deg' : '0deg' }],
          color: 'currentColor',
        }}
      >
        ▼
      </Text>
    );
  }
};

// Check icon for selected items
const CheckIcon = () => {
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
        style={{ marginLeft: 8, color: 'currentColor' }}
      >
        <polyline points="20,6 9,17 4,12" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return (
      <Text style={{ marginLeft: 8, fontSize: 14, color: 'currentColor' }}>
        ✓
      </Text>
    );
  }
};

// Main Select component
export const Select = forwardRef<any, SelectProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      placeholder = 'Select an option...',
      disabled = false,
      size = 'md',
      variant = 'outline',
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
      setOpen(false);
    };

    const contextValue: SelectContextValue = {
      open,
      setOpen,
      value,
      onValueChange: handleValueChange,
      placeholder,
      disabled,
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      if (!isWeb || !open) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('[data-select-container]')) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
      <SelectContext.Provider value={contextValue}>
        <StyledSelectBase
          ref={ref}
          data-select-container=""
          {...props}
        >
          {children}
        </StyledSelectBase>
      </SelectContext.Provider>
    );
  }
);

// SelectTrigger component
export const SelectTrigger = forwardRef<any, SelectTriggerProps>(
  ({ children, ...props }, ref) => {
    const { open, setOpen, disabled } = useSelectContext();

    const handlePress = () => {
      if (!disabled) {
        setOpen(!open);
      }
    };

    return (
      <StyledSelectTrigger
        ref={ref}
        size="md"
        variant="outline"
        disabled={disabled}
        open={open}
        onPress={handlePress}
        onClick={handlePress}
        {...props}
      >
        {children}
        <ChevronIcon open={open} />
      </StyledSelectTrigger>
    );
  }
);

// SelectValue component
export const SelectValueComponent = forwardRef<any, { placeholder?: string }>(
  ({ placeholder: customPlaceholder, ...props }, ref) => {
    const { value, placeholder } = useSelectContext();

    if (!value) {
      return (
        <SelectPlaceholder ref={ref} {...props}>
          {customPlaceholder || placeholder}
        </SelectPlaceholder>
      );
    }

    return (
      <SelectValue ref={ref} {...props}>
        {value}
      </SelectValue>
    );
  }
);

// SelectContent component
export const SelectContent = forwardRef<any, SelectContentProps>(
  ({ children, ...props }, ref) => {
    const { open } = useSelectContext();

    if (!open) return null;

    return (
      <StyledSelectContent ref={ref} {...props}>
        {children}
      </StyledSelectContent>
    );
  }
);

// SelectItem component
export const SelectItem = forwardRef<any, SelectItemProps>(
  ({ value: itemValue, disabled = false, children, ...props }, ref) => {
    const { value, onValueChange } = useSelectContext();

    const isSelected = value === itemValue;

    const handlePress = () => {
      if (!disabled) {
        onValueChange(itemValue);
      }
    };

    return (
      <StyledSelectItem
        ref={ref}
        selected={isSelected}
        disabled={disabled}
        onPress={handlePress}
        onClick={handlePress}
        {...props}
      >
        {children}
        {isSelected && <CheckIcon />}
      </StyledSelectItem>
    );
  }
);

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectValueComponent.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";

// Compound component
const SelectCompound = Object.assign(Select, {
  Trigger: SelectTrigger,
  Value: SelectValueComponent,
  Content: SelectContent,
  Item: SelectItem,
});

export { 
  SelectCompound as SelectComponent,
  SelectTrigger,
  SelectValueComponent as SelectValue,
  SelectContent,
  SelectItem,
};

export default Select;
