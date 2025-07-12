// Tabs Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, createContext, useContext } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Tabs context
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'pills' | 'underline' | 'enclosed';
  size: 'sm' | 'md' | 'lg';
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

// Tabs props interface
export interface TabsProps extends StyledProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Base styled tabs container
const StyledTabsBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Tabs',
    defaultProps: {
      width: '100%',
    },
    variants: {
      orientation: {
        horizontal: { flexDirection: 'column' },
        vertical: { flexDirection: 'row' },
      },
    },
  }
);

// Tab list container
export interface TabsListProps extends StyledProps {
  children: React.ReactNode;
}

const StyledTabsList = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'TabsList',
    defaultProps: {
      display: 'flex',
      position: 'relative',
    },
    variants: {
      orientation: {
        horizontal: { 
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: 'gray200',
        },
        vertical: { 
          flexDirection: 'column',
          borderRightWidth: 1,
          borderRightColor: 'gray200',
          minWidth: 200,
        },
      },
      variant: {
        default: {},
        pills: {
          backgroundColor: 'gray100',
          borderRadius: 'lg',
          p: 1,
        },
        underline: {},
        enclosed: {
          borderWidth: 1,
          borderColor: 'gray200',
          borderRadius: 'lg',
        },
      },
    },
  }
);

// Individual tab trigger
export interface TabsTriggerProps extends StyledProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledTabsTrigger = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'TabsTrigger',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'medium',
      transition: 'all 0.2s',
      cursor: isWeb ? 'pointer' : undefined,
      backgroundColor: 'transparent',
      borderWidth: 0,
      outline: 'none',
    },
    variants: {
      size: {
        sm: { px: 3, py: 2, fontSize: 'sm' },
        md: { px: 4, py: 3, fontSize: 'base' },
        lg: { px: 6, py: 4, fontSize: 'lg' },
      },
      variant: {
        default: {
          color: 'gray600',
          hoverStyle: { color: 'gray900' },
        },
        pills: {
          borderRadius: 'md',
          color: 'gray600',
          hoverStyle: { backgroundColor: 'gray200' },
        },
        underline: {
          color: 'gray600',
          borderBottomWidth: 2,
          borderBottomColor: 'transparent',
          hoverStyle: { color: 'gray900' },
        },
        enclosed: {
          color: 'gray600',
          borderRightWidth: 1,
          borderRightColor: 'gray200',
          hoverStyle: { backgroundColor: 'gray50' },
        },
      },
      active: {
        true: {},
        false: {},
      },
      disabled: {
        true: { 
          opacity: 0.5, 
          cursor: isWeb ? 'not-allowed' : undefined,
        },
        false: {},
      },
    },
    compoundVariants: [
      {
        variants: { active: true, variant: 'default' },
        style: { color: 'primary600', borderBottomColor: 'primary600' },
      },
      {
        variants: { active: true, variant: 'pills' },
        style: { backgroundColor: 'white', color: 'primary600', shadowOpacity: 0.1 },
      },
      {
        variants: { active: true, variant: 'underline' },
        style: { color: 'primary600', borderBottomColor: 'primary600' },
      },
      {
        variants: { active: true, variant: 'enclosed' },
        style: { backgroundColor: 'white', color: 'primary600' },
      },
    ],
  }
);

// Tab content container
export interface TabsContentProps extends StyledProps {
  value: string;
  children: React.ReactNode;
}

const StyledTabsContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'TabsContent',
    defaultProps: {
      flex: 1,
      p: 4,
    },
  }
);

// Main Tabs component
export const Tabs = forwardRef<any, TabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange,
      orientation = 'horizontal',
      variant = 'default',
      size = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    const isControlled = controlledValue !== undefined;
    const activeTab = isControlled ? controlledValue : internalValue;

    const setActiveTab = (tab: string) => {
      if (!isControlled) {
        setInternalValue(tab);
      }
      onValueChange?.(tab);
    };

    const contextValue: TabsContextValue = {
      activeTab,
      setActiveTab,
      orientation,
      variant,
      size,
    };

    return (
      <TabsContext.Provider value={contextValue}>
        <StyledTabsBase
          ref={ref}
          orientation={orientation}
          {...props}
        >
          {children}
        </StyledTabsBase>
      </TabsContext.Provider>
    );
  }
);

// TabsList component
export const TabsList = forwardRef<any, TabsListProps>(
  ({ children, ...props }, ref) => {
    const { orientation, variant } = useTabsContext();

    return (
      <StyledTabsList
        ref={ref}
        orientation={orientation}
        variant={variant}
        {...props}
      >
        {children}
      </StyledTabsList>
    );
  }
);

// TabsTrigger component
export const TabsTrigger = forwardRef<any, TabsTriggerProps>(
  ({ value, disabled = false, children, ...props }, ref) => {
    const { activeTab, setActiveTab, variant, size } = useTabsContext();

    const isActive = activeTab === value;

    const handlePress = () => {
      if (!disabled) {
        setActiveTab(value);
      }
    };

    return (
      <StyledTabsTrigger
        ref={ref}
        variant={variant}
        size={size}
        active={isActive}
        disabled={disabled}
        onPress={handlePress}
        onClick={handlePress}
        {...props}
      >
        {children}
      </StyledTabsTrigger>
    );
  }
);

// TabsContent component
export const TabsContent = forwardRef<any, TabsContentProps>(
  ({ value, children, ...props }, ref) => {
    const { activeTab } = useTabsContext();

    if (activeTab !== value) {
      return null;
    }

    return (
      <StyledTabsContent ref={ref} {...props}>
        {children}
      </StyledTabsContent>
    );
  }
);

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

// Compound component
const TabsCompound = Object.assign(Tabs, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { TabsCompound as TabsComponent };
export default Tabs;
