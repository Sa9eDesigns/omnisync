// Accordion Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, createContext, useContext } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Accordion context
interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component');
  }
  return context;
};

// Accordion props interface
export interface AccordionProps extends StyledProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
}

// Base styled accordion container
const StyledAccordionBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Accordion',
    defaultProps: {
      width: '100%',
    },
  }
);

// Accordion item container
export interface AccordionItemProps extends StyledProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledAccordionItem = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'AccordionItem',
    defaultProps: {
      borderBottomWidth: 1,
      borderBottomColor: 'gray200',
    },
    variants: {
      disabled: {
        true: { opacity: 0.6 },
        false: {},
      },
    },
  }
);

// Accordion trigger (header)
export interface AccordionTriggerProps extends StyledProps {
  children: React.ReactNode;
}

const StyledAccordionTrigger = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'AccordionTrigger',
    defaultProps: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      py: 4,
      px: 0,
      backgroundColor: 'transparent',
      borderWidth: 0,
      cursor: isWeb ? 'pointer' : undefined,
      fontSize: 'base',
      fontWeight: 'medium',
      color: 'gray900',
      textAlign: 'left',
      hoverStyle: {
        color: 'primary600',
      },
    },
    variants: {
      disabled: {
        true: { 
          cursor: isWeb ? 'not-allowed' : undefined,
          opacity: 0.6,
        },
        false: {},
      },
    },
  }
);

// Accordion content container
export interface AccordionContentProps extends StyledProps {
  children: React.ReactNode;
}

const StyledAccordionContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'AccordionContent',
    defaultProps: {
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
  }
);

const AccordionContentInner = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'AccordionContentInner',
    defaultProps: {
      pb: 4,
      color: 'gray700',
      fontSize: 'sm',
      lineHeight: 'relaxed',
    },
  }
);

// Chevron icon for accordion trigger
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => {
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
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}
      >
        <polyline points="6,9 12,15 18,9" />
      </svg>
    );
  } else {
    // React Native - using text for simplicity
    const { Text } = require('react-native');
    return (
      <Text
        style={{
          fontSize: 16,
          transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
          color: 'currentColor',
        }}
      >
        ▼
      </Text>
    );
  }
};

// Individual accordion item context
interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within an AccordionItem');
  }
  return context;
};

// Main Accordion component
export const Accordion = forwardRef<any, AccordionProps>(
  (
    {
      type = 'single',
      collapsible = false,
      defaultValue,
      value: controlledValue,
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    // Initialize internal state based on type
    const getInitialValue = () => {
      if (defaultValue) {
        return type === 'multiple' 
          ? Array.isArray(defaultValue) ? defaultValue : [defaultValue]
          : Array.isArray(defaultValue) ? defaultValue[0] || '' : defaultValue;
      }
      return type === 'multiple' ? [] : '';
    };

    const [internalValue, setInternalValue] = useState(getInitialValue);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Convert to array for easier handling
    const openItems = type === 'multiple' 
      ? Array.isArray(currentValue) ? currentValue : [currentValue].filter(Boolean)
      : Array.isArray(currentValue) ? currentValue : currentValue ? [currentValue] : [];

    const toggleItem = (value: string) => {
      let newValue: string | string[];

      if (type === 'multiple') {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        if (currentArray.includes(value)) {
          newValue = currentArray.filter(item => item !== value);
        } else {
          newValue = [...currentArray, value];
        }
      } else {
        // Single type
        if (openItems.includes(value)) {
          newValue = collapsible ? '' : value; // Don't close if not collapsible
        } else {
          newValue = value;
        }
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue: AccordionContextValue = {
      openItems,
      toggleItem,
      type,
      collapsible,
    };

    return (
      <AccordionContext.Provider value={contextValue}>
        <StyledAccordionBase ref={ref} {...props}>
          {children}
        </StyledAccordionBase>
      </AccordionContext.Provider>
    );
  }
);

// AccordionItem component
export const AccordionItem = forwardRef<any, AccordionItemProps>(
  ({ value, disabled = false, children, ...props }, ref) => {
    const { openItems } = useAccordionContext();
    const isOpen = openItems.includes(value);

    const itemContextValue: AccordionItemContextValue = {
      value,
      isOpen,
      disabled,
    };

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <StyledAccordionItem
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {children}
        </StyledAccordionItem>
      </AccordionItemContext.Provider>
    );
  }
);

// AccordionTrigger component
export const AccordionTrigger = forwardRef<any, AccordionTriggerProps>(
  ({ children, ...props }, ref) => {
    const { toggleItem } = useAccordionContext();
    const { value, isOpen, disabled } = useAccordionItemContext();

    const handlePress = () => {
      if (!disabled) {
        toggleItem(value);
      }
    };

    return (
      <StyledAccordionTrigger
        ref={ref}
        disabled={disabled}
        onPress={handlePress}
        onClick={handlePress}
        {...props}
      >
        <span style={{ flex: 1 }}>{children}</span>
        <ChevronIcon isOpen={isOpen} />
      </StyledAccordionTrigger>
    );
  }
);

// AccordionContent component
export const AccordionContent = forwardRef<any, AccordionContentProps>(
  ({ children, ...props }, ref) => {
    const { isOpen } = useAccordionItemContext();

    return (
      <StyledAccordionContent
        ref={ref}
        style={{
          maxHeight: isOpen ? 1000 : 0, // Use a large number for max height
          opacity: isOpen ? 1 : 0,
          ...(isWeb ? {
            transition: 'max-height 0.3s ease, opacity 0.3s ease',
          } : {}),
        }}
        {...props}
      >
        {isOpen && (
          <AccordionContentInner>
            {children}
          </AccordionContentInner>
        )}
      </StyledAccordionContent>
    );
  }
);

Accordion.displayName = "Accordion";
AccordionItem.displayName = "AccordionItem";
AccordionTrigger.displayName = "AccordionTrigger";
AccordionContent.displayName = "AccordionContent";

// Compound component
const AccordionCompound = Object.assign(Accordion, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export { AccordionCompound as AccordionComponent };
export default Accordion;
