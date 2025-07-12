// Toast Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, createContext, useContext, useState, useEffect } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Toast types
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

// Toast context
interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast provider props
export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

// Toast container
const ToastContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ToastContainer',
    defaultProps: {
      position: 'fixed',
      zIndex: 'toast',
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      pointerEvents: 'none',
    },
    variants: {
      position: {
        'top-left': { top: 0, left: 0 },
        'top-right': { top: 0, right: 0 },
        'top-center': { top: 0, left: '50%', transform: [{ translateX: -0.5 }] },
        'bottom-left': { bottom: 0, left: 0 },
        'bottom-right': { bottom: 0, right: 0 },
        'bottom-center': { bottom: 0, left: '50%', transform: [{ translateX: -0.5 }] },
      },
    },
  }
);

// Individual toast
export interface ToastProps extends StyledProps {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

const StyledToastBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Toast',
    defaultProps: {
      display: 'flex',
      alignItems: 'flex-start',
      p: 4,
      borderRadius: 'lg',
      borderWidth: 1,
      shadowColor: 'gray900',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8, // Android shadow
      minWidth: 300,
      maxWidth: 400,
      pointerEvents: 'auto',
      animation: 'slideInRight',
      animationDuration: 'fast',
    },
    variants: {
      type: {
        default: {
          backgroundColor: 'white',
          borderColor: 'gray200',
        },
        success: {
          backgroundColor: 'success50',
          borderColor: 'success200',
        },
        error: {
          backgroundColor: 'error50',
          borderColor: 'error200',
        },
        warning: {
          backgroundColor: 'warning50',
          borderColor: 'warning200',
        },
        info: {
          backgroundColor: 'info50',
          borderColor: 'info200',
        },
      },
    },
  }
);

// Toast icon
const ToastIcon = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ToastIcon',
    defaultProps: {
      mr: 3,
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
);

// Toast content
const ToastContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ToastContent',
    defaultProps: {
      flex: 1,
    },
  }
);

// Toast title
const ToastTitle = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'ToastTitle',
    defaultProps: {
      fontSize: 'sm',
      fontWeight: 'semibold',
      color: 'gray900',
      mb: 1,
    },
  }
);

// Toast description
const ToastDescription = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'ToastDescription',
    defaultProps: {
      fontSize: 'sm',
      color: 'gray600',
      lineHeight: 'normal',
    },
  }
);

// Toast actions
const ToastActions = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ToastActions',
    defaultProps: {
      ml: 3,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
  }
);

// Toast action button
const ToastActionButton = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'ToastActionButton',
    defaultProps: {
      px: 3,
      py: 1,
      borderRadius: 'sm',
      fontSize: 'xs',
      fontWeight: 'medium',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'gray300',
      color: 'gray700',
      hoverStyle: {
        backgroundColor: 'gray50',
      },
      pressStyle: {
        backgroundColor: 'gray100',
      },
    },
  }
);

// Close button
const ToastCloseButton = createStyledComponent(
  isWeb ? 'button' : 'TouchableOpacity',
  {
    name: 'ToastCloseButton',
    defaultProps: {
      p: 1,
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

// Get icon for toast type
const getToastIcon = (type: ToastType) => {
  const iconProps = {
    width: 20,
    height: 20,
    style: { color: 'currentColor' },
  };

  if (isWeb) {
    switch (type) {
      case 'success':
        return (
          <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20" style={{ color: '#10b981' }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20" style={{ color: '#ef4444' }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20" style={{ color: '#f59e0b' }}>
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20" style={{ color: '#3b82f6' }}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  } else {
    // React Native - using emojis
    const { Text } = require('react-native');
    switch (type) {
      case 'success':
        return <Text style={{ fontSize: 20 }}>✅</Text>;
      case 'error':
        return <Text style={{ fontSize: 20 }}>❌</Text>;
      case 'warning':
        return <Text style={{ fontSize: 20 }}>⚠️</Text>;
      case 'info':
        return <Text style={{ fontSize: 20 }}>ℹ️</Text>;
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
    const { Text } = require('react-native');
    return <Text style={{ fontSize: 14, color: 'currentColor' }}>✕</Text>;
  }
};

// Individual Toast component
export const Toast = forwardRef<any, ToastProps>(
  (
    {
      id,
      title,
      description,
      type = 'default',
      action,
      onClose,
      ...props
    },
    ref
  ) => {
    const icon = getToastIcon(type);

    return (
      <StyledToastBase
        ref={ref}
        type={type}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <ToastIcon>
            {icon}
          </ToastIcon>
        )}

        {/* Content */}
        <ToastContent>
          {title && (
            <ToastTitle>
              {title}
            </ToastTitle>
          )}
          
          {description && (
            <ToastDescription>
              {description}
            </ToastDescription>
          )}
        </ToastContent>

        {/* Actions */}
        <ToastActions>
          {action && (
            <ToastActionButton
              onPress={action.onClick}
              onClick={action.onClick}
            >
              {action.label}
            </ToastActionButton>
          )}
          
          <ToastCloseButton
            onPress={onClose}
            onClick={onClose}
          >
            <CloseIcon />
          </ToastCloseButton>
        </ToastActions>
      </StyledToastBase>
    );
  }
);

// Toast Provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  const contextValue: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      {toasts.length > 0 && (
        <ToastContainer position={position}>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              title={toast.title}
              description={toast.description}
              type={toast.type}
              action={toast.action}
              onClose={() => {
                removeToast(toast.id);
                toast.onClose?.();
              }}
            />
          ))}
        </ToastContainer>
      )}
    </ToastContext.Provider>
  );
};

Toast.displayName = "Toast";
ToastProvider.displayName = "ToastProvider";

export default Toast;
