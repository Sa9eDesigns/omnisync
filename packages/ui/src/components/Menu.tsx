// Menu Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, useRef, useEffect, createContext, useContext } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Menu context
interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeOnSelect: boolean;
}

const MenuContext = createContext<MenuContextValue | null>(null);

const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within a Menu component');
  }
  return context;
};

// Menu props interface
export interface MenuProps extends StyledProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'left' | 'right';
  closeOnSelect?: boolean;
  closeOnClickOutside?: boolean;
  children: React.ReactNode;
}

// Menu container
const MenuContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'MenuContainer',
    defaultProps: {
      position: 'relative',
      display: 'inline-block',
    },
  }
);

// Menu trigger
export interface MenuTriggerProps extends StyledProps {
  children: React.ReactElement;
}

// Menu content
export interface MenuContentProps extends StyledProps {
  children: React.ReactNode;
  minWidth?: number;
}

const MenuContentBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'MenuContent',
    defaultProps: {
      position: 'absolute',
      zIndex: 'dropdown',
      minWidth: 180,
      py: 1,
      backgroundColor: 'white',
      borderRadius: 'md',
      borderWidth: 1,
      borderColor: 'gray200',
      shadowColor: 'gray900',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8, // Android shadow
      animation: 'scaleIn',
      animationDuration: 'fast',
    },
    variants: {
      placement: {
        'bottom-start': {
          top: '100%',
          left: 0,
          mt: 1,
        },
        'bottom-end': {
          top: '100%',
          right: 0,
          mt: 1,
        },
        'top-start': {
          bottom: '100%',
          left: 0,
          mb: 1,
        },
        'top-end': {
          bottom: '100%',
          right: 0,
          mb: 1,
        },
        left: {
          right: '100%',
          top: 0,
          mr: 1,
        },
        right: {
          left: '100%',
          top: 0,
          ml: 1,
        },
      },
    },
  }
);

// Menu item
export interface MenuItemProps extends StyledProps {
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}

const MenuItemBase = createStyledComponent(
  isWeb ? 'div' : 'TouchableOpacity',
  {
    name: 'MenuItem',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      px: 3,
      py: 2,
      fontSize: 'sm',
      color: 'gray900',
      cursor: isWeb ? 'pointer' : undefined,
      transition: 'all 0.2s',
      userSelect: 'none',
    },
    variants: {
      disabled: {
        true: {
          opacity: 0.5,
          cursor: isWeb ? 'not-allowed' : undefined,
          pointerEvents: 'none',
        },
        false: {
          hoverStyle: { backgroundColor: 'gray100' },
          pressStyle: { backgroundColor: 'gray200' },
        },
      },
      destructive: {
        true: {
          color: 'error600',
          hoverStyle: { backgroundColor: 'error50' },
        },
        false: {},
      },
    },
  }
);

// Menu separator
export interface MenuSeparatorProps extends StyledProps {}

const MenuSeparator = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'MenuSeparator',
    defaultProps: {
      height: 1,
      backgroundColor: 'gray200',
      my: 1,
      mx: 0,
    },
  }
);

// Menu label
export interface MenuLabelProps extends StyledProps {
  children: React.ReactNode;
}

const MenuLabel = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'MenuLabel',
    defaultProps: {
      px: 3,
      py: 2,
      fontSize: 'xs',
      fontWeight: 'semibold',
      color: 'gray500',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
    },
  }
);

// Menu group
export interface MenuGroupProps extends StyledProps {
  children: React.ReactNode;
}

const MenuGroup = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'MenuGroup',
    defaultProps: {},
  }
);

// Main Menu component
export const Menu = forwardRef<any, MenuProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      placement = 'bottom-start',
      closeOnSelect = true,
      closeOnClickOutside = true,
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const containerRef = useRef<any>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    // Handle click outside
    useEffect(() => {
      if (!isWeb || !open || !closeOnClickOutside) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, closeOnClickOutside]);

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

    const contextValue: MenuContextValue = {
      open,
      setOpen,
      closeOnSelect,
    };

    return (
      <MenuContext.Provider value={contextValue}>
        <MenuContainer
          ref={containerRef}
          {...props}
        >
          {children}
        </MenuContainer>
      </MenuContext.Provider>
    );
  }
);

// MenuTrigger component
export const MenuTrigger = forwardRef<any, MenuTriggerProps>(
  ({ children, ...props }, ref) => {
    const { open, setOpen } = useMenuContext();

    const handleClick = () => {
      setOpen(!open);
    };

    // Clone child element with event handlers
    const childElement = React.cloneElement(children, {
      ref,
      onClick: handleClick,
      onPress: !isWeb ? handleClick : undefined,
      'aria-expanded': isWeb ? open : undefined,
      'aria-haspopup': isWeb ? 'menu' : undefined,
      ...props,
    });

    return childElement;
  }
);

// MenuContent component
export const MenuContent = forwardRef<any, MenuContentProps>(
  ({ children, minWidth, ...props }, ref) => {
    const { open } = useMenuContext();

    if (!open) return null;

    return (
      <MenuContentBase
        ref={ref}
        placement="bottom-start"
        style={{ minWidth }}
        role={isWeb ? 'menu' : undefined}
        {...props}
      >
        {children}
      </MenuContentBase>
    );
  }
);

// MenuItem component
export const MenuItem = forwardRef<any, MenuItemProps>(
  ({ disabled = false, destructive = false, onSelect, children, ...props }, ref) => {
    const { setOpen, closeOnSelect } = useMenuContext();

    const handleSelect = () => {
      if (disabled) return;

      onSelect?.();
      
      if (closeOnSelect) {
        setOpen(false);
      }
    };

    return (
      <MenuItemBase
        ref={ref}
        disabled={disabled}
        destructive={destructive}
        onPress={handleSelect}
        onClick={handleSelect}
        role={isWeb ? 'menuitem' : undefined}
        {...props}
      >
        {children}
      </MenuItemBase>
    );
  }
);

// MenuCheckboxItem component
export interface MenuCheckboxItemProps extends Omit<MenuItemProps, 'onSelect'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const MenuCheckboxItem = forwardRef<any, MenuCheckboxItemProps>(
  ({ checked = false, onCheckedChange, children, ...props }, ref) => {
    const { setOpen, closeOnSelect } = useMenuContext();

    const handleSelect = () => {
      const newChecked = !checked;
      onCheckedChange?.(newChecked);
      
      if (closeOnSelect) {
        setOpen(false);
      }
    };

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
            style={{ marginRight: 8 }}
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
        );
      } else {
        const { Text } = require('react-native');
        return <Text style={{ marginRight: 8, fontSize: 14 }}>✓</Text>;
      }
    };

    return (
      <MenuItem
        ref={ref}
        onSelect={handleSelect}
        {...props}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ width: 20, display: 'flex', justifyContent: 'center' }}>
            {checked && <CheckIcon />}
          </div>
          {children}
        </div>
      </MenuItem>
    );
  }
);

// MenuRadioGroup component
export interface MenuRadioGroupProps extends StyledProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const MenuRadioContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

export const MenuRadioGroup = forwardRef<any, MenuRadioGroupProps>(
  ({ value, onValueChange, children, ...props }, ref) => {
    const contextValue = { value, onValueChange };

    return (
      <MenuRadioContext.Provider value={contextValue}>
        <MenuGroup ref={ref} {...props}>
          {children}
        </MenuGroup>
      </MenuRadioContext.Provider>
    );
  }
);

// MenuRadioItem component
export interface MenuRadioItemProps extends Omit<MenuItemProps, 'onSelect'> {
  value: string;
}

export const MenuRadioItem = forwardRef<any, MenuRadioItemProps>(
  ({ value, children, ...props }, ref) => {
    const radioContext = useContext(MenuRadioContext);
    const { setOpen, closeOnSelect } = useMenuContext();

    const isSelected = radioContext?.value === value;

    const handleSelect = () => {
      radioContext?.onValueChange?.(value);
      
      if (closeOnSelect) {
        setOpen(false);
      }
    };

    const RadioIcon = () => {
      if (isWeb) {
        return (
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: '2px solid currentColor',
              marginRight: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isSelected && (
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: 'currentColor',
                }}
              />
            )}
          </div>
        );
      } else {
        const { Text } = require('react-native');
        return <Text style={{ marginRight: 8, fontSize: 14 }}>{isSelected ? '●' : '○'}</Text>;
      }
    };

    return (
      <MenuItem
        ref={ref}
        onSelect={handleSelect}
        {...props}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <RadioIcon />
          {children}
        </div>
      </MenuItem>
    );
  }
);

Menu.displayName = "Menu";
MenuTrigger.displayName = "MenuTrigger";
MenuContent.displayName = "MenuContent";
MenuItem.displayName = "MenuItem";
MenuCheckboxItem.displayName = "MenuCheckboxItem";
MenuRadioGroup.displayName = "MenuRadioGroup";
MenuRadioItem.displayName = "MenuRadioItem";
MenuSeparator.displayName = "MenuSeparator";
MenuLabel.displayName = "MenuLabel";
MenuGroup.displayName = "MenuGroup";

// Compound component
const MenuCompound = Object.assign(Menu, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
  Group: MenuGroup,
});

export { 
  MenuCompound as MenuComponent,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup,
};

export default Menu;
