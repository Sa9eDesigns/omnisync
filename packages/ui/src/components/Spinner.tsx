// Spinner Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Spinner props interface
export interface SpinnerProps extends StyledProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  speed?: 'slow' | 'normal' | 'fast';
  thickness?: number;
  label?: string;
  emptyColor?: string;
}

// Base spinner container
const SpinnerContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SpinnerContainer',
    defaultProps: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
  }
);

// Spinner element
const SpinnerElement = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Spinner',
    defaultProps: {
      borderRadius: 'full',
      borderStyle: 'solid',
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      animation: 'spin',
    },
    variants: {
      size: {
        xs: {
          width: 12,
          height: 12,
          borderWidth: 1,
        },
        sm: {
          width: 16,
          height: 16,
          borderWidth: 2,
        },
        md: {
          width: 24,
          height: 24,
          borderWidth: 2,
        },
        lg: {
          width: 32,
          height: 32,
          borderWidth: 3,
        },
        xl: {
          width: 40,
          height: 40,
          borderWidth: 4,
        },
      },
      variant: {
        default: {
          borderLeftColor: 'gray400',
        },
        primary: {
          borderLeftColor: 'primary500',
        },
        secondary: {
          borderLeftColor: 'gray600',
        },
        success: {
          borderLeftColor: 'success500',
        },
        warning: {
          borderLeftColor: 'warning500',
        },
        error: {
          borderLeftColor: 'error500',
        },
      },
      speed: {
        slow: {
          animationDuration: '2s',
        },
        normal: {
          animationDuration: '1s',
        },
        fast: {
          animationDuration: '0.5s',
        },
      },
    },
  }
);

// Spinner label
const SpinnerLabel = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'SpinnerLabel',
    defaultProps: {
      ml: 2,
      fontSize: 'sm',
      color: 'gray600',
    },
  }
);

// Dots spinner variant
const DotsSpinner = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'DotsSpinner',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
  }
);

const Dot = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SpinnerDot',
    defaultProps: {
      borderRadius: 'full',
      backgroundColor: 'primary500',
      animation: 'pulse',
    },
    variants: {
      size: {
        xs: { width: 2, height: 2 },
        sm: { width: 3, height: 3 },
        md: { width: 4, height: 4 },
        lg: { width: 5, height: 5 },
        xl: { width: 6, height: 6 },
      },
    },
  }
);

// Pulse spinner variant
const PulseSpinner = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'PulseSpinner',
    defaultProps: {
      borderRadius: 'full',
      backgroundColor: 'primary500',
      animation: 'pulse',
    },
    variants: {
      size: {
        xs: { width: 12, height: 12 },
        sm: { width: 16, height: 16 },
        md: { width: 24, height: 24 },
        lg: { width: 32, height: 32 },
        xl: { width: 40, height: 40 },
      },
    },
  }
);

// Grid spinner variant
const GridSpinner = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'GridSpinner',
    defaultProps: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
    },
  }
);

const GridDot = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'GridDot',
    defaultProps: {
      backgroundColor: 'primary500',
      animation: 'pulse',
    },
    variants: {
      size: {
        xs: { width: 2, height: 2 },
        sm: { width: 3, height: 3 },
        md: { width: 4, height: 4 },
        lg: { width: 5, height: 5 },
        xl: { width: 6, height: 6 },
      },
    },
  }
);

// Main Spinner component
export const Spinner = forwardRef<any, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'default',
      speed = 'normal',
      thickness,
      label,
      emptyColor,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...(thickness && { borderWidth: thickness }),
      ...(emptyColor && {
        borderTopColor: emptyColor,
        borderRightColor: emptyColor,
        borderBottomColor: emptyColor,
      }),
    };

    return (
      <SpinnerContainer
        ref={ref}
        role={isWeb ? 'status' : undefined}
        aria-label={isWeb ? (label || 'Loading') : undefined}
        {...props}
      >
        <SpinnerElement
          size={size}
          variant={variant}
          speed={speed}
          style={customStyle}
        />
        {label && <SpinnerLabel>{label}</SpinnerLabel>}
      </SpinnerContainer>
    );
  }
);

// Dots spinner component
export interface DotsSpinnerProps extends Omit<SpinnerProps, 'thickness' | 'emptyColor'> {
  count?: number;
}

export const DotsSpinnerComponent = forwardRef<any, DotsSpinnerProps>(
  ({ size = 'md', variant = 'primary', count = 3, label, ...props }, ref) => {
    const dots = Array.from({ length: count }, (_, index) => (
      <Dot
        key={index}
        size={size}
        style={{
          animationDelay: `${index * 0.2}s`,
          backgroundColor: variant === 'default' ? 'gray400' : `${variant}500`,
        }}
      />
    ));

    return (
      <SpinnerContainer
        ref={ref}
        role={isWeb ? 'status' : undefined}
        aria-label={isWeb ? (label || 'Loading') : undefined}
        {...props}
      >
        <DotsSpinner>{dots}</DotsSpinner>
        {label && <SpinnerLabel>{label}</SpinnerLabel>}
      </SpinnerContainer>
    );
  }
);

// Pulse spinner component
export const PulseSpinnerComponent = forwardRef<any, Omit<SpinnerProps, 'thickness' | 'emptyColor'>>(
  ({ size = 'md', variant = 'primary', label, ...props }, ref) => {
    return (
      <SpinnerContainer
        ref={ref}
        role={isWeb ? 'status' : undefined}
        aria-label={isWeb ? (label || 'Loading') : undefined}
        {...props}
      >
        <PulseSpinner
          size={size}
          style={{
            backgroundColor: variant === 'default' ? 'gray400' : `${variant}500`,
          }}
        />
        {label && <SpinnerLabel>{label}</SpinnerLabel>}
      </SpinnerContainer>
    );
  }
);

// Grid spinner component
export const GridSpinnerComponent = forwardRef<any, Omit<SpinnerProps, 'thickness' | 'emptyColor'>>(
  ({ size = 'md', variant = 'primary', label, ...props }, ref) => {
    const dots = Array.from({ length: 9 }, (_, index) => (
      <GridDot
        key={index}
        size={size}
        style={{
          animationDelay: `${(index % 3) * 0.1 + Math.floor(index / 3) * 0.1}s`,
          backgroundColor: variant === 'default' ? 'gray400' : `${variant}500`,
        }}
      />
    ));

    return (
      <SpinnerContainer
        ref={ref}
        role={isWeb ? 'status' : undefined}
        aria-label={isWeb ? (label || 'Loading') : undefined}
        {...props}
      >
        <GridSpinner>{dots}</GridSpinner>
        {label && <SpinnerLabel>{label}</SpinnerLabel>}
      </SpinnerContainer>
    );
  }
);

// Loading overlay component
export interface LoadingOverlayProps extends StyledProps {
  loading: boolean;
  spinner?: React.ReactNode;
  text?: string;
  children: React.ReactNode;
}

const OverlayContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'LoadingOverlayContainer',
    defaultProps: {
      position: 'relative',
    },
  }
);

const Overlay = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'LoadingOverlay',
    defaultProps: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      gap: 3,
    },
  }
);

const OverlayText = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'LoadingOverlayText',
    defaultProps: {
      fontSize: 'sm',
      color: 'gray600',
      textAlign: 'center',
    },
  }
);

export const LoadingOverlay = forwardRef<any, LoadingOverlayProps>(
  ({ loading, spinner, text, children, ...props }, ref) => {
    return (
      <OverlayContainer ref={ref} {...props}>
        {children}
        {loading && (
          <Overlay>
            {spinner || <Spinner size="lg" />}
            {text && <OverlayText>{text}</OverlayText>}
          </Overlay>
        )}
      </OverlayContainer>
    );
  }
);

Spinner.displayName = "Spinner";
DotsSpinnerComponent.displayName = "DotsSpinner";
PulseSpinnerComponent.displayName = "PulseSpinner";
GridSpinnerComponent.displayName = "GridSpinner";
LoadingOverlay.displayName = "LoadingOverlay";

// Compound component
const SpinnerCompound = Object.assign(Spinner, {
  Dots: DotsSpinnerComponent,
  Pulse: PulseSpinnerComponent,
  Grid: GridSpinnerComponent,
  Overlay: LoadingOverlay,
});

export { 
  SpinnerCompound as SpinnerComponent,
  DotsSpinnerComponent as DotsSpinner,
  PulseSpinnerComponent as PulseSpinner,
  GridSpinnerComponent as GridSpinner,
};

export default Spinner;
