// Popover Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, useRef, useEffect, createContext, useContext } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Popover context
interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within a Popover component');
  }
  return context;
};

// Popover props interface
export interface PopoverProps extends StyledProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'click' | 'hover';
  closeOnClickOutside?: boolean;
  children: React.ReactNode;
}

// Popover container
const PopoverContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'PopoverContainer',
    defaultProps: {
      position: 'relative',
      display: 'inline-block',
    },
  }
);

// Popover trigger
export interface PopoverTriggerProps extends StyledProps {
  children: React.ReactElement;
}

// Popover content
export interface PopoverContentProps extends StyledProps {
  children: React.ReactNode;
  arrow?: boolean;
  sideOffset?: number;
}

const PopoverContentBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'PopoverContent',
    defaultProps: {
      position: 'absolute',
      zIndex: 'popover',
      minWidth: 200,
      maxWidth: 400,
      p: 4,
      borderRadius: 'md',
      backgroundColor: 'white',
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
        top: {
          bottom: '100%',
          left: '50%',
          transform: [{ translateX: -0.5 }, { translateY: -8 }],
        },
        bottom: {
          top: '100%',
          left: '50%',
          transform: [{ translateX: -0.5 }, { translateY: 8 }],
        },
        left: {
          right: '100%',
          top: '50%',
          transform: [{ translateX: -8 }, { translateY: -0.5 }],
        },
        right: {
          left: '100%',
          top: '50%',
          transform: [{ translateX: 8 }, { translateY: -0.5 }],
        },
      },
    },
  }
);

// Popover arrow
const PopoverArrow = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'PopoverArrow',
    defaultProps: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
    variants: {
      placement: {
        top: {
          top: '100%',
          left: '50%',
          transform: [{ translateX: -0.5 }],
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderTopWidth: 6,
          borderBottomWidth: 0,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: 'white',
          borderBottomColor: 'transparent',
        },
        bottom: {
          bottom: '100%',
          left: '50%',
          transform: [{ translateX: -0.5 }],
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderTopWidth: 0,
          borderBottomWidth: 6,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: 'transparent',
          borderBottomColor: 'white',
        },
        left: {
          left: '100%',
          top: '50%',
          transform: [{ translateY: -0.5 }],
          borderTopWidth: 6,
          borderBottomWidth: 6,
          borderLeftWidth: 6,
          borderRightWidth: 0,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'white',
          borderRightColor: 'transparent',
        },
        right: {
          right: '100%',
          top: '50%',
          transform: [{ translateY: -0.5 }],
          borderTopWidth: 6,
          borderBottomWidth: 6,
          borderLeftWidth: 0,
          borderRightWidth: 6,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'white',
        },
      },
    },
  }
);

// Main Popover component
export const Popover = forwardRef<any, PopoverProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      placement = 'bottom',
      trigger = 'click',
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

    const contextValue: PopoverContextValue = {
      open,
      setOpen,
      placement,
    };

    return (
      <PopoverContext.Provider value={contextValue}>
        <PopoverContainer
          ref={containerRef}
          {...props}
        >
          {children}
        </PopoverContainer>
      </PopoverContext.Provider>
    );
  }
);

// PopoverTrigger component
export const PopoverTrigger = forwardRef<any, PopoverTriggerProps>(
  ({ children, ...props }, ref) => {
    const { open, setOpen } = usePopoverContext();

    const handleClick = () => {
      setOpen(!open);
    };

    const handleMouseEnter = () => {
      // For hover trigger (if implemented)
    };

    const handleMouseLeave = () => {
      // For hover trigger (if implemented)
    };

    // Clone child element with event handlers
    const childElement = React.cloneElement(children, {
      ref,
      onClick: handleClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      // React Native events
      onPress: !isWeb ? handleClick : undefined,
      ...props,
    });

    return childElement;
  }
);

// PopoverContent component
export const PopoverContent = forwardRef<any, PopoverContentProps>(
  ({ children, arrow = true, sideOffset = 8, ...props }, ref) => {
    const { open, placement } = usePopoverContext();

    if (!open) return null;

    return (
      <PopoverContentBase
        ref={ref}
        placement={placement}
        style={{
          transform: [
            ...(placement === 'top' ? [{ translateY: -sideOffset }] : []),
            ...(placement === 'bottom' ? [{ translateY: sideOffset }] : []),
            ...(placement === 'left' ? [{ translateX: -sideOffset }] : []),
            ...(placement === 'right' ? [{ translateX: sideOffset }] : []),
            { translateX: placement === 'top' || placement === 'bottom' ? -0.5 : placement === 'left' ? -sideOffset : sideOffset },
            { translateY: placement === 'left' || placement === 'right' ? -0.5 : placement === 'top' ? -sideOffset : sideOffset },
          ],
        }}
        {...props}
      >
        {children}
        
        {arrow && (
          <PopoverArrow placement={placement} />
        )}
      </PopoverContentBase>
    );
  }
);

Popover.displayName = "Popover";
PopoverTrigger.displayName = "PopoverTrigger";
PopoverContent.displayName = "PopoverContent";

// Compound component
const PopoverCompound = Object.assign(Popover, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});

export { 
  PopoverCompound as PopoverComponent,
  PopoverTrigger,
  PopoverContent,
};

export default Popover;
