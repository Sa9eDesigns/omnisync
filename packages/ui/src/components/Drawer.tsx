// Drawer Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useEffect, createContext, useContext } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Drawer context
interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement: 'left' | 'right' | 'top' | 'bottom';
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer components must be used within a Drawer component');
  }
  return context;
};

// Drawer props interface
export interface DrawerProps extends StyledProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  overlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

// Drawer overlay
const DrawerOverlay = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DrawerOverlay',
    defaultProps: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 'modal',
      animation: 'fadeIn',
      animationDuration: 'fast',
    },
  }
);

// Drawer content
export interface DrawerContentProps extends StyledProps {
  children: React.ReactNode;
}

const StyledDrawerContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DrawerContent',
    defaultProps: {
      position: 'fixed',
      backgroundColor: 'white',
      shadowColor: 'gray900',
      shadowOpacity: 0.25,
      shadowRadius: 25,
      shadowOffset: { width: 0, height: 0 },
      elevation: 24, // Android shadow
      zIndex: 'modal',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    variants: {
      placement: {
        left: {
          top: 0,
          bottom: 0,
          left: 0,
          animation: 'slideInLeft',
          animationDuration: 'normal',
        },
        right: {
          top: 0,
          bottom: 0,
          right: 0,
          animation: 'slideInRight',
          animationDuration: 'normal',
        },
        top: {
          top: 0,
          left: 0,
          right: 0,
          animation: 'slideInDown',
          animationDuration: 'normal',
        },
        bottom: {
          bottom: 0,
          left: 0,
          right: 0,
          animation: 'slideInUp',
          animationDuration: 'normal',
        },
      },
      size: {
        sm: {},
        md: {},
        lg: {},
        xl: {},
        full: {},
      },
    },
    compoundVariants: [
      // Left/Right sizes
      {
        variants: { placement: 'left', size: 'sm' },
        style: { width: 280 },
      },
      {
        variants: { placement: 'left', size: 'md' },
        style: { width: 320 },
      },
      {
        variants: { placement: 'left', size: 'lg' },
        style: { width: 400 },
      },
      {
        variants: { placement: 'left', size: 'xl' },
        style: { width: 500 },
      },
      {
        variants: { placement: 'left', size: 'full' },
        style: { width: '100vw' },
      },
      {
        variants: { placement: 'right', size: 'sm' },
        style: { width: 280 },
      },
      {
        variants: { placement: 'right', size: 'md' },
        style: { width: 320 },
      },
      {
        variants: { placement: 'right', size: 'lg' },
        style: { width: 400 },
      },
      {
        variants: { placement: 'right', size: 'xl' },
        style: { width: 500 },
      },
      {
        variants: { placement: 'right', size: 'full' },
        style: { width: '100vw' },
      },
      // Top/Bottom sizes
      {
        variants: { placement: 'top', size: 'sm' },
        style: { height: 200 },
      },
      {
        variants: { placement: 'top', size: 'md' },
        style: { height: 300 },
      },
      {
        variants: { placement: 'top', size: 'lg' },
        style: { height: 400 },
      },
      {
        variants: { placement: 'top', size: 'xl' },
        style: { height: 500 },
      },
      {
        variants: { placement: 'top', size: 'full' },
        style: { height: '100vh' },
      },
      {
        variants: { placement: 'bottom', size: 'sm' },
        style: { height: 200 },
      },
      {
        variants: { placement: 'bottom', size: 'md' },
        style: { height: 300 },
      },
      {
        variants: { placement: 'bottom', size: 'lg' },
        style: { height: 400 },
      },
      {
        variants: { placement: 'bottom', size: 'xl' },
        style: { height: 500 },
      },
      {
        variants: { placement: 'bottom', size: 'full' },
        style: { height: '100vh' },
      },
    ],
  }
);

// Drawer header
export interface DrawerHeaderProps extends StyledProps {
  children: React.ReactNode;
}

const DrawerHeader = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DrawerHeader',
    defaultProps: {
      p: 6,
      borderBottomWidth: 1,
      borderBottomColor: 'gray200',
      flexShrink: 0,
    },
  }
);

// Drawer title
export interface DrawerTitleProps extends StyledProps {
  children: React.ReactNode;
}

const DrawerTitle = createStyledComponent(
  isWeb ? 'h2' : 'Text',
  {
    name: 'DrawerTitle',
    defaultProps: {
      fontSize: 'lg',
      fontWeight: 'semibold',
      color: 'gray900',
      lineHeight: 'tight',
    },
  }
);

// Drawer description
export interface DrawerDescriptionProps extends StyledProps {
  children: React.ReactNode;
}

const DrawerDescription = createStyledComponent(
  isWeb ? 'p' : 'Text',
  {
    name: 'DrawerDescription',
    defaultProps: {
      fontSize: 'sm',
      color: 'gray600',
      mt: 1,
    },
  }
);

// Drawer body
export interface DrawerBodyProps extends StyledProps {
  children: React.ReactNode;
}

const DrawerBody = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DrawerBody',
    defaultProps: {
      flex: 1,
      p: 6,
      overflow: 'auto',
    },
  }
);

// Drawer footer
export interface DrawerFooterProps extends StyledProps {
  children: React.ReactNode;
}

const DrawerFooter = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DrawerFooter',
    defaultProps: {
      p: 6,
      borderTopWidth: 1,
      borderTopColor: 'gray200',
      flexShrink: 0,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 3,
    },
  }
);

// Close button
const DrawerCloseButton = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'DrawerCloseButton',
    defaultProps: {
      position: 'absolute',
      top: 4,
      right: 4,
      p: 2,
      borderRadius: 'sm',
      backgroundColor: 'transparent',
      color: 'gray400',
      hoverStyle: {
        backgroundColor: 'gray100',
        color: 'gray600',
      },
      pressStyle: {
        backgroundColor: 'gray200',
      },
    },
  }
);

// Close icon
const CloseIcon = () => {
  if (isWeb) {
    return (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  } else {
    const { Text } = require('react-native');
    return <Text style={{ fontSize: 16, color: 'currentColor' }}>✕</Text>;
  }
};

// Main Drawer component
export const Drawer = forwardRef<any, DrawerProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      placement = 'right',
      size = 'md',
      overlay = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const handleOpenChange = (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    // Handle escape key
    useEffect(() => {
      if (!isWeb || !open || !closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscape]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
      if (!isWeb || !open) return;

      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, [open]);

    if (!open) return null;

    const contextValue: DrawerContextValue = {
      open,
      onOpenChange: handleOpenChange,
      placement,
    };

    // Handle overlay click
    const handleOverlayClick = () => {
      if (closeOnOverlayClick) {
        handleOpenChange(false);
      }
    };

    return (
      <DrawerContext.Provider value={contextValue}>
        {/* Overlay */}
        {overlay && (
          <DrawerOverlay
            onPress={handleOverlayClick}
            onClick={handleOverlayClick}
          />
        )}

        {children}
      </DrawerContext.Provider>
    );
  }
);

// DrawerContent component
export const DrawerContent = forwardRef<any, DrawerContentProps>(
  ({ children, ...props }, ref) => {
    const { onOpenChange, placement } = useDrawerContext();

    // Prevent content click from closing drawer
    const handleContentClick = (event: any) => {
      event.stopPropagation();
    };

    return (
      <StyledDrawerContent
        ref={ref}
        placement={placement}
        size="md"
        onPress={handleContentClick}
        onClick={handleContentClick}
        {...props}
      >
        {children}
        
        {/* Close button */}
        <DrawerCloseButton
          onPress={() => onOpenChange(false)}
          onClick={() => onOpenChange(false)}
        >
          <CloseIcon />
        </DrawerCloseButton>
      </StyledDrawerContent>
    );
  }
);

Drawer.displayName = "Drawer";
DrawerContent.displayName = "DrawerContent";
DrawerHeader.displayName = "DrawerHeader";
DrawerTitle.displayName = "DrawerTitle";
DrawerDescription.displayName = "DrawerDescription";
DrawerBody.displayName = "DrawerBody";
DrawerFooter.displayName = "DrawerFooter";

// Compound component
const DrawerCompound = Object.assign(Drawer, {
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
});

export { 
  DrawerCompound as DrawerComponent,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
};

export default Drawer;
