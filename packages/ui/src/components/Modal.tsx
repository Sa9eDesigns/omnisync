// Modal Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, createContext, useContext, useEffect } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Modal context
interface ModalContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within a Modal component');
  }
  return context;
};

// Modal props interface
export interface ModalProps extends StyledProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

// Modal overlay
const ModalOverlay = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ModalOverlay',
    defaultProps: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 'modal',
      animation: 'fadeIn',
      animationDuration: 'fast',
    },
  }
);

// Modal content container
export interface ModalContentProps extends StyledProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const StyledModalContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ModalContent',
    defaultProps: {
      backgroundColor: 'white',
      borderRadius: 'lg',
      shadowColor: 'gray900',
      shadowOpacity: 0.25,
      shadowRadius: 25,
      shadowOffset: { width: 0, height: 10 },
      elevation: 24, // Android shadow
      maxHeight: '90vh',
      overflow: 'hidden',
      animation: 'scaleIn',
      animationDuration: 'fast',
    },
    variants: {
      size: {
        sm: { width: 320, maxWidth: '90vw' },
        md: { width: 480, maxWidth: '90vw' },
        lg: { width: 640, maxWidth: '90vw' },
        xl: { width: 800, maxWidth: '90vw' },
        full: { width: '95vw', height: '95vh', maxWidth: 'none', maxHeight: 'none' },
      },
    },
  }
);

// Modal header
export interface ModalHeaderProps extends StyledProps {
  children: React.ReactNode;
}

const ModalHeader = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ModalHeader',
    defaultProps: {
      p: 6,
      pb: 0,
      borderBottomWidth: 1,
      borderBottomColor: 'gray200',
      mb: 4,
    },
  }
);

// Modal title
export interface ModalTitleProps extends StyledProps {
  children: React.ReactNode;
}

const ModalTitle = createStyledComponent(
  isWeb ? 'h2' : 'Text',
  {
    name: 'ModalTitle',
    defaultProps: {
      fontSize: 'lg',
      fontWeight: 'semibold',
      color: 'gray900',
      lineHeight: 'tight',
    },
  }
);

// Modal body
export interface ModalBodyProps extends StyledProps {
  children: React.ReactNode;
}

const ModalBody = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ModalBody',
    defaultProps: {
      px: 6,
      flex: 1,
      overflow: 'auto',
    },
  }
);

// Modal footer
export interface ModalFooterProps extends StyledProps {
  children: React.ReactNode;
}

const ModalFooter = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ModalFooter',
    defaultProps: {
      p: 6,
      pt: 4,
      borderTopWidth: 1,
      borderTopColor: 'gray200',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 3,
    },
  }
);

// Close button
const ModalCloseButton = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'ModalCloseButton',
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

// Main Modal component
export const Modal = forwardRef<any, ModalProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
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

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (!isWeb || !open) return;

      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, [open]);

    if (!open) return null;

    const contextValue: ModalContextValue = {
      open,
      onOpenChange: handleOpenChange,
    };

    // Handle overlay click
    const handleOverlayClick = (event: any) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        handleOpenChange(false);
      }
    };

    return (
      <ModalContext.Provider value={contextValue}>
        <ModalOverlay
          ref={ref}
          onPress={handleOverlayClick}
          onClick={handleOverlayClick}
          {...props}
        >
          {children}
        </ModalOverlay>
      </ModalContext.Provider>
    );
  }
);

// ModalContent component
export const ModalContent = forwardRef<any, ModalContentProps>(
  ({ size = 'md', children, ...props }, ref) => {
    const { onOpenChange } = useModalContext();

    // Prevent content click from closing modal
    const handleContentClick = (event: any) => {
      event.stopPropagation();
    };

    return (
      <StyledModalContent
        ref={ref}
        size={size}
        onPress={handleContentClick}
        onClick={handleContentClick}
        {...props}
      >
        {children}
        
        {/* Close button */}
        <ModalCloseButton
          onPress={() => onOpenChange(false)}
          onClick={() => onOpenChange(false)}
        >
          <CloseIcon />
        </ModalCloseButton>
      </StyledModalContent>
    );
  }
);

Modal.displayName = "Modal";
ModalContent.displayName = "ModalContent";
ModalHeader.displayName = "ModalHeader";
ModalTitle.displayName = "ModalTitle";
ModalBody.displayName = "ModalBody";
ModalFooter.displayName = "ModalFooter";

// Compound component
const ModalCompound = Object.assign(Modal, {
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
});

export { 
  ModalCompound as ModalComponent,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
};

export default Modal;
