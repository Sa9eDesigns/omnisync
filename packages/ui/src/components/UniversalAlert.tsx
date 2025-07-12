// Universal Alert Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";
import { useTokens } from "../theme/ThemeProvider";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Alert props interface
export interface UniversalAlertProps extends StyledProps {
  variant?: "info" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

// Base styled alert component
const StyledAlertBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'UniversalAlert',
    defaultProps: {
      borderRadius: 'md',
      borderWidth: 1,
      p: 4,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    variants: {
      variant: {
        info: {
          backgroundColor: 'info50',
          borderColor: 'info200',
          color: 'info800',
        },
        success: {
          backgroundColor: 'success50',
          borderColor: 'success200',
          color: 'success800',
        },
        warning: {
          backgroundColor: 'warning50',
          borderColor: 'warning200',
          color: 'warning800',
        },
        error: {
          backgroundColor: 'error50',
          borderColor: 'error200',
          color: 'error800',
        },
      },
      size: {
        sm: { p: 3, fontSize: 'sm' },
        md: { p: 4, fontSize: 'base' },
        lg: { p: 5, fontSize: 'lg' },
      },
    },
  }
);

// Alert icon component
const AlertIcon = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'AlertIcon',
    defaultProps: {
      mr: 3,
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
);

// Alert content component
const AlertContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'AlertContent',
    defaultProps: {
      flex: 1,
    },
  }
);

// Alert title component
const AlertTitle = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'AlertTitle',
    defaultProps: {
      fontWeight: 'semibold',
      mb: 1,
    },
  }
);

// Alert description component
const AlertDescription = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'AlertDescription',
    defaultProps: {
      fontSize: 'sm',
      opacity: 0.9,
    },
  }
);

// Close button component
const CloseButton = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'AlertCloseButton',
    defaultProps: {
      ml: 3,
      p: 1,
      borderRadius: 'sm',
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      hoverStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
      pressStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
    },
  }
);

// Default icons for each variant
const getDefaultIcon = (variant: string, tokens: any) => {
  const iconProps = {
    width: 20,
    height: 20,
    style: { color: 'currentColor' },
  };

  if (isWeb) {
    switch (variant) {
      case 'info':
        return (
          <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  } else {
    // React Native icons - using simple text for now
    // In a real app, you'd use react-native-vector-icons or similar
    switch (variant) {
      case 'info':
        return <div style={{ fontSize: 16, color: 'currentColor' }}>ℹ️</div>;
      case 'success':
        return <div style={{ fontSize: 16, color: 'currentColor' }}>✅</div>;
      case 'warning':
        return <div style={{ fontSize: 16, color: 'currentColor' }}>⚠️</div>;
      case 'error':
        return <div style={{ fontSize: 16, color: 'currentColor' }}>❌</div>;
      default:
        return null;
    }
  }
};

// Close icon
const CloseIcon = () => {
  if (isWeb) {
    return (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  } else {
    return <div style={{ fontSize: 14, color: 'currentColor' }}>✕</div>;
  }
};

// Main Universal Alert component
export const UniversalAlert = forwardRef<any, UniversalAlertProps>(
  (
    {
      variant = "info",
      size = "md",
      title,
      description,
      icon,
      closable = false,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const tokens = useTokens();

    // Handle close
    const handleClose = () => {
      onClose?.();
    };

    // Determine icon to show
    const iconToShow = icon !== undefined ? icon : getDefaultIcon(variant, tokens);

    return (
      <StyledAlertBase
        ref={ref}
        variant={variant}
        size={size}
        {...props}
      >
        {/* Icon */}
        {iconToShow && (
          <AlertIcon>
            {iconToShow}
          </AlertIcon>
        )}

        {/* Content */}
        <AlertContent>
          {title && (
            <AlertTitle>
              {title}
            </AlertTitle>
          )}
          
          {description && (
            <AlertDescription>
              {description}
            </AlertDescription>
          )}
          
          {children}
        </AlertContent>

        {/* Close button */}
        {closable && (
          <CloseButton
            onPress={handleClose}
            onClick={handleClose}
          >
            <CloseIcon />
          </CloseButton>
        )}
      </StyledAlertBase>
    );
  }
);

UniversalAlert.displayName = "UniversalAlert";

// Export as default
export default UniversalAlert;
