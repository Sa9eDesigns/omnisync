// Progress Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Progress props interface
export interface ProgressProps extends StyledProps {
  value?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "error";
  indeterminate?: boolean;
  showLabel?: boolean;
  label?: string;
  formatLabel?: (value: number, max: number) => string;
  striped?: boolean;
  animated?: boolean;
}

// Base styled progress container
const ProgressContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ProgressContainer',
    defaultProps: {
      width: '100%',
    },
  }
);

// Progress track (background)
const ProgressTrack = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ProgressTrack',
    defaultProps: {
      width: '100%',
      backgroundColor: 'gray200',
      borderRadius: 'full',
      overflow: 'hidden',
      position: 'relative',
    },
    variants: {
      size: {
        sm: { height: 4 },
        md: { height: 8 },
        lg: { height: 12 },
      },
    },
  }
);

// Progress bar (filled portion)
const ProgressBar = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'ProgressBar',
    defaultProps: {
      height: '100%',
      borderRadius: 'full',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    variants: {
      variant: {
        default: { backgroundColor: 'primary500' },
        primary: { backgroundColor: 'primary500' },
        success: { backgroundColor: 'success500' },
        warning: { backgroundColor: 'warning500' },
        error: { backgroundColor: 'error500' },
      },
    },
  }
);

// Progress label
const ProgressLabel = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'ProgressLabel',
    defaultProps: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'gray700',
      mb: 2,
      textAlign: 'center',
    },
  }
);

// Indeterminate animation styles for web
const indeterminateKeyframes = `
  @keyframes omnisync-progress-indeterminate {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// Striped pattern styles for web
const stripedKeyframes = `
  @keyframes omnisync-progress-striped {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 40px 0;
    }
  }
`;

// Inject keyframes for web
if (isWeb && typeof document !== 'undefined') {
  const styleId = 'omnisync-progress-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = indeterminateKeyframes + stripedKeyframes;
    document.head.appendChild(style);
  }
}

// Indeterminate progress bar
const IndeterminateBar = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'IndeterminateBar',
    defaultProps: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      borderRadius: 'full',
    },
    variants: {
      variant: {
        default: { backgroundColor: 'primary500' },
        primary: { backgroundColor: 'primary500' },
        success: { backgroundColor: 'success500' },
        warning: { backgroundColor: 'warning500' },
        error: { backgroundColor: 'error500' },
      },
    },
  }
);

// Main Progress component
export const Progress = forwardRef<any, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = "md",
      variant = "default",
      indeterminate = false,
      showLabel = false,
      label,
      formatLabel,
      striped = false,
      animated = false,
      ...props
    },
    ref
  ) => {
    // Calculate percentage
    const percentage = indeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);

    // Format label
    const getLabel = () => {
      if (label) return label;
      if (formatLabel) return formatLabel(value, max);
      return `${Math.round(percentage)}%`;
    };

    // Striped background style
    const stripedStyle = striped ? {
      backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
      backgroundSize: '40px 40px',
      ...(animated && isWeb ? {
        animation: 'omnisync-progress-striped 1s linear infinite',
      } : {}),
    } : {};

    // Indeterminate animation style
    const indeterminateStyle = indeterminate && isWeb ? {
      animation: 'omnisync-progress-indeterminate 1.5s ease-in-out infinite',
    } : {};

    return (
      <ProgressContainer ref={ref} {...props}>
        {/* Label */}
        {showLabel && (
          <ProgressLabel>
            {getLabel()}
          </ProgressLabel>
        )}

        {/* Progress Track */}
        <ProgressTrack size={size}>
          {indeterminate ? (
            // Indeterminate progress
            <IndeterminateBar
              variant={variant}
              style={{
                ...indeterminateStyle,
                ...stripedStyle,
              }}
            />
          ) : (
            // Determinate progress
            <ProgressBar
              variant={variant}
              style={{
                width: `${percentage}%`,
                ...stripedStyle,
              }}
            />
          )}
        </ProgressTrack>
      </ProgressContainer>
    );
  }
);

Progress.displayName = "Progress";

// Circular Progress component
export interface CircularProgressProps extends StyledProps {
  value?: number;
  max?: number;
  size?: number;
  thickness?: number;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  indeterminate?: boolean;
  showLabel?: boolean;
  label?: string;
  formatLabel?: (value: number, max: number) => string;
}

const CircularProgressContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'CircularProgressContainer',
    defaultProps: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
);

const CircularProgressLabel = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'CircularProgressLabel',
    defaultProps: {
      position: 'absolute',
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'gray700',
      textAlign: 'center',
    },
  }
);

export const CircularProgress = forwardRef<any, CircularProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 40,
      thickness = 4,
      variant = "default",
      indeterminate = false,
      showLabel = false,
      label,
      formatLabel,
      ...props
    },
    ref
  ) => {
    const percentage = indeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getLabel = () => {
      if (label) return label;
      if (formatLabel) return formatLabel(value, max);
      return `${Math.round(percentage)}%`;
    };

    const colorMap = {
      default: '#3b82f6',
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    };

    if (isWeb) {
      return (
        <CircularProgressContainer
          ref={ref}
          style={{ width: size, height: size }}
          {...props}
        >
          <svg
            width={size}
            height={size}
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={thickness}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colorMap[variant]}
              strokeWidth={thickness}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={indeterminate ? 0 : strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.3s ease',
                ...(indeterminate ? {
                  animation: 'omnisync-progress-indeterminate 1.5s ease-in-out infinite',
                } : {}),
              }}
            />
          </svg>
          
          {showLabel && (
            <CircularProgressLabel>
              {getLabel()}
            </CircularProgressLabel>
          )}
        </CircularProgressContainer>
      );
    } else {
      // React Native implementation would need react-native-svg
      // For now, return a simple circular view
      const { View, Text } = require('react-native');
      return (
        <View
          ref={ref}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness,
            borderColor: '#e5e7eb',
            alignItems: 'center',
            justifyContent: 'center',
            ...props.style,
          }}
        >
          {showLabel && (
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151' }}>
              {getLabel()}
            </Text>
          )}
        </View>
      );
    }
  }
);

CircularProgress.displayName = "CircularProgress";

export default Progress;
