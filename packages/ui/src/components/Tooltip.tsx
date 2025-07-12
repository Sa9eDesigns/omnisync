// Tooltip Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, useRef, useEffect } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Tooltip props interface
export interface TooltipProps extends StyledProps {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  children: React.ReactElement;
}

// Tooltip container
const TooltipContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'TooltipContainer',
    defaultProps: {
      position: 'relative',
      display: 'inline-block',
    },
  }
);

// Tooltip content
const TooltipContent = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'TooltipContent',
    defaultProps: {
      position: 'absolute',
      zIndex: 'tooltip',
      px: 2,
      py: 1,
      borderRadius: 'sm',
      backgroundColor: 'gray900',
      color: 'white',
      fontSize: 'xs',
      fontWeight: 'medium',
      whiteSpace: 'nowrap',
      maxWidth: 200,
      animation: 'fadeIn',
      animationDuration: 'fast',
      shadowColor: 'gray900',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4, // Android shadow
    },
    variants: {
      placement: {
        top: {
          bottom: '100%',
          left: '50%',
          transform: [{ translateX: -0.5 }, { translateY: -4 }],
        },
        bottom: {
          top: '100%',
          left: '50%',
          transform: [{ translateX: -0.5 }, { translateY: 4 }],
        },
        left: {
          right: '100%',
          top: '50%',
          transform: [{ translateX: -4 }, { translateY: -0.5 }],
        },
        right: {
          left: '100%',
          top: '50%',
          transform: [{ translateX: 4 }, { translateY: -0.5 }],
        },
      },
    },
  }
);

// Tooltip arrow
const TooltipArrow = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'TooltipArrow',
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
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderTopWidth: 4,
          borderBottomWidth: 0,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: 'gray900',
          borderBottomColor: 'transparent',
        },
        bottom: {
          bottom: '100%',
          left: '50%',
          transform: [{ translateX: -0.5 }],
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderTopWidth: 0,
          borderBottomWidth: 4,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: 'transparent',
          borderBottomColor: 'gray900',
        },
        left: {
          left: '100%',
          top: '50%',
          transform: [{ translateY: -0.5 }],
          borderTopWidth: 4,
          borderBottomWidth: 4,
          borderLeftWidth: 4,
          borderRightWidth: 0,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'gray900',
          borderRightColor: 'transparent',
        },
        right: {
          right: '100%',
          top: '50%',
          transform: [{ translateY: -0.5 }],
          borderTopWidth: 4,
          borderBottomWidth: 4,
          borderLeftWidth: 0,
          borderRightWidth: 4,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'gray900',
        },
      },
    },
  }
);

// Main Tooltip component
export const Tooltip = forwardRef<any, TooltipProps>(
  (
    {
      content,
      placement = 'top',
      trigger = 'hover',
      delay = 500,
      disabled = false,
      arrow = true,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [actualPlacement, setActualPlacement] = useState(placement);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const containerRef = useRef<any>(null);

    // Clear timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    // Calculate optimal placement (web only)
    const calculatePlacement = () => {
      if (!isWeb || !containerRef.current) return placement;

      const rect = containerRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let optimalPlacement = placement;

      // Check if tooltip would go outside viewport and adjust
      switch (placement) {
        case 'top':
          if (rect.top < 50) optimalPlacement = 'bottom';
          break;
        case 'bottom':
          if (rect.bottom > viewport.height - 50) optimalPlacement = 'top';
          break;
        case 'left':
          if (rect.left < 200) optimalPlacement = 'right';
          break;
        case 'right':
          if (rect.right > viewport.width - 200) optimalPlacement = 'left';
          break;
      }

      setActualPlacement(optimalPlacement);
    };

    // Show tooltip
    const showTooltip = () => {
      if (disabled) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        calculatePlacement();
        setVisible(true);
      }, delay);
    };

    // Hide tooltip
    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setVisible(false);
    };

    // Handle mouse events
    const handleMouseEnter = () => {
      if (trigger === 'hover') {
        showTooltip();
      }
    };

    const handleMouseLeave = () => {
      if (trigger === 'hover') {
        hideTooltip();
      }
    };

    // Handle click events
    const handleClick = () => {
      if (trigger === 'click') {
        if (visible) {
          hideTooltip();
        } else {
          showTooltip();
        }
      }
    };

    // Handle focus events
    const handleFocus = () => {
      if (trigger === 'focus') {
        showTooltip();
      }
    };

    const handleBlur = () => {
      if (trigger === 'focus') {
        hideTooltip();
      }
    };

    // Clone child element with event handlers
    const childElement = React.cloneElement(children, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      onFocus: handleFocus,
      onBlur: handleBlur,
      // React Native events
      onPressIn: !isWeb ? handleMouseEnter : undefined,
      onPressOut: !isWeb ? handleMouseLeave : undefined,
      onPress: !isWeb && trigger === 'click' ? handleClick : undefined,
    });

    return (
      <TooltipContainer
        ref={containerRef}
        {...props}
      >
        {childElement}
        
        {visible && (
          <TooltipContent
            placement={actualPlacement}
            style={{
              pointerEvents: 'none',
            }}
          >
            {content}
            
            {arrow && (
              <TooltipArrow placement={actualPlacement} />
            )}
          </TooltipContent>
        )}
      </TooltipContainer>
    );
  }
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
