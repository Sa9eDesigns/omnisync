// Separator Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Separator props interface
export interface SeparatorProps extends StyledProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  size?: "sm" | "md" | "lg";
  color?: string;
  label?: string;
  labelPosition?: "left" | "center" | "right";
}

// Base styled separator component
const StyledSeparatorBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Separator',
    defaultProps: {
      backgroundColor: 'gray200',
      flexShrink: 0,
    },
    variants: {
      orientation: {
        horizontal: {
          width: '100%',
          height: 1,
        },
        vertical: {
          width: 1,
          height: '100%',
        },
      },
      size: {
        sm: {},
        md: {},
        lg: {},
      },
      variant: {
        solid: {},
        dashed: {},
        dotted: {},
      },
    },
    compoundVariants: [
      // Horizontal sizes
      {
        variants: { orientation: 'horizontal', size: 'sm' },
        style: { height: 1 },
      },
      {
        variants: { orientation: 'horizontal', size: 'md' },
        style: { height: 1 },
      },
      {
        variants: { orientation: 'horizontal', size: 'lg' },
        style: { height: 2 },
      },
      // Vertical sizes
      {
        variants: { orientation: 'vertical', size: 'sm' },
        style: { width: 1 },
      },
      {
        variants: { orientation: 'vertical', size: 'md' },
        style: { width: 1 },
      },
      {
        variants: { orientation: 'vertical', size: 'lg' },
        style: { width: 2 },
      },
    ],
  }
);

// Separator with label container
const SeparatorWithLabelContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SeparatorWithLabelContainer',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
  }
);

// Separator label
const SeparatorLabel = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'SeparatorLabel',
    defaultProps: {
      fontSize: 'sm',
      color: 'gray500',
      fontWeight: 'medium',
      px: 3,
      backgroundColor: 'white',
      flexShrink: 0,
    },
  }
);

// Separator line (for labeled separators)
const SeparatorLine = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SeparatorLine',
    defaultProps: {
      flex: 1,
      height: 1,
      backgroundColor: 'gray200',
    },
  }
);

// Main Separator component
export const Separator = forwardRef<any, SeparatorProps>(
  (
    {
      orientation = "horizontal",
      variant = "solid",
      size = "md",
      color,
      label,
      labelPosition = "center",
      ...props
    },
    ref
  ) => {
    // Get border style for web
    const getBorderStyle = () => {
      if (!isWeb) return {};
      
      const borderColor = color || 'currentColor';
      
      switch (variant) {
        case 'dashed':
          return {
            borderStyle: 'dashed',
            backgroundColor: 'transparent',
            ...(orientation === 'horizontal' 
              ? { borderTopWidth: 1, borderTopColor: borderColor }
              : { borderLeftWidth: 1, borderLeftColor: borderColor }
            ),
          };
        case 'dotted':
          return {
            borderStyle: 'dotted',
            backgroundColor: 'transparent',
            ...(orientation === 'horizontal' 
              ? { borderTopWidth: 1, borderTopColor: borderColor }
              : { borderLeftWidth: 1, borderLeftColor: borderColor }
            ),
          };
        default:
          return color ? { backgroundColor: color } : {};
      }
    };

    // If there's a label, render labeled separator
    if (label && orientation === 'horizontal') {
      return (
        <SeparatorWithLabelContainer ref={ref} {...props}>
          {/* Left line (or hidden if label is on left) */}
          {labelPosition !== 'left' && (
            <SeparatorLine
              style={{
                ...getBorderStyle(),
                ...(color ? { backgroundColor: color } : {}),
              }}
            />
          )}
          
          {/* Label */}
          <SeparatorLabel>
            {label}
          </SeparatorLabel>
          
          {/* Right line (or hidden if label is on right) */}
          {labelPosition !== 'right' && (
            <SeparatorLine
              style={{
                ...getBorderStyle(),
                ...(color ? { backgroundColor: color } : {}),
              }}
            />
          )}
        </SeparatorWithLabelContainer>
      );
    }

    // Regular separator without label
    return (
      <StyledSeparatorBase
        ref={ref}
        orientation={orientation}
        variant={variant}
        size={size}
        style={{
          ...getBorderStyle(),
          ...(color ? { backgroundColor: color } : {}),
        }}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export default Separator;
