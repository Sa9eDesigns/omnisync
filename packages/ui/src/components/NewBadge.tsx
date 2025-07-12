// Badge Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Badge props interface
export interface BadgeProps extends StyledProps {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  dot?: boolean;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  offset?: [number, number];
}

// Base styled badge component
const StyledBadgeBase = createStyledComponent(
  isWeb ? 'span' : 'View',
  {
    name: 'Badge',
    defaultProps: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'full',
      fontWeight: 'medium',
      fontSize: 'xs',
      px: 2,
      py: 1,
      minWidth: 20,
      minHeight: 20,
    },
    variants: {
      variant: {
        default: {
          backgroundColor: 'gray100',
          color: 'gray800',
        },
        primary: {
          backgroundColor: 'primary500',
          color: 'white',
        },
        secondary: {
          backgroundColor: 'gray600',
          color: 'white',
        },
        success: {
          backgroundColor: 'success500',
          color: 'white',
        },
        warning: {
          backgroundColor: 'warning500',
          color: 'white',
        },
        error: {
          backgroundColor: 'error500',
          color: 'white',
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: 'gray300',
          color: 'gray700',
        },
      },
      size: {
        sm: {
          fontSize: 'xs',
          px: 1,
          py: 0,
          minWidth: 16,
          minHeight: 16,
        },
        md: {
          fontSize: 'xs',
          px: 2,
          py: 1,
          minWidth: 20,
          minHeight: 20,
        },
        lg: {
          fontSize: 'sm',
          px: 3,
          py: 1,
          minWidth: 24,
          minHeight: 24,
        },
      },
    },
  }
);

// Badge text component
const BadgeText = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'BadgeText',
    defaultProps: {
      fontSize: 'xs',
      fontWeight: 'medium',
      lineHeight: 'none',
    },
  }
);

// Main Badge component
export const Badge = forwardRef<any, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      children,
      count,
      maxCount = 99,
      showZero = false,
      ...props
    },
    ref
  ) => {
    // Handle count display
    const getCountDisplay = () => {
      if (count === undefined) return null;
      if (count === 0 && !showZero) return null;
      if (count > maxCount) return `${maxCount}+`;
      return count.toString();
    };

    const countDisplay = getCountDisplay();

    return (
      <StyledBadgeBase
        ref={ref}
        variant={variant}
        size={size}
        {...props}
      >
        {countDisplay ? (
          <BadgeText>{countDisplay}</BadgeText>
        ) : (
          children
        )}
      </StyledBadgeBase>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
