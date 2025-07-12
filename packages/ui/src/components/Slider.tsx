// Slider Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState, useRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Slider props interface
export interface SliderProps extends StyledProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "error";
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  showValue?: boolean;
  showMarks?: boolean;
  marks?: Array<{ value: number; label?: string }>;
  formatValue?: (value: number) => string;
  onChange?: (value: number) => void;
  onChangeStart?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  // React Native specific
  hapticFeedback?: boolean;
}

// Base styled slider container
const SliderContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SliderContainer',
    defaultProps: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    variants: {
      orientation: {
        horizontal: { flexDirection: 'row', width: '100%' },
        vertical: { flexDirection: 'column', height: 200, width: 'auto' },
      },
      disabled: {
        true: { opacity: 0.6 },
        false: {},
      },
    },
  }
);

// Slider track (background)
const SliderTrack = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SliderTrack',
    defaultProps: {
      position: 'relative',
      backgroundColor: 'gray200',
      borderRadius: 'full',
      cursor: isWeb ? 'pointer' : undefined,
    },
    variants: {
      size: {
        sm: { height: 4 },
        md: { height: 6 },
        lg: { height: 8 },
      },
      orientation: {
        horizontal: { width: '100%' },
        vertical: { height: '100%', width: 6 },
      },
    },
  }
);

// Slider filled track
const SliderFilledTrack = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SliderFilledTrack',
    defaultProps: {
      height: '100%',
      borderRadius: 'full',
      transition: 'all 0.2s',
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

// Slider thumb (handle)
const SliderThumb = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SliderThumb',
    defaultProps: {
      position: 'absolute',
      borderRadius: 'full',
      backgroundColor: 'white',
      borderWidth: 2,
      cursor: isWeb ? 'grab' : undefined,
      transition: 'all 0.2s',
      shadowColor: 'gray900',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4, // Android shadow
    },
    variants: {
      size: {
        sm: { width: 16, height: 16 },
        md: { width: 20, height: 20 },
        lg: { width: 24, height: 24 },
      },
      variant: {
        default: { borderColor: 'primary500' },
        primary: { borderColor: 'primary500' },
        success: { borderColor: 'success500' },
        warning: { borderColor: 'warning500' },
        error: { borderColor: 'error500' },
      },
      dragging: {
        true: { 
          cursor: isWeb ? 'grabbing' : undefined,
          transform: [{ scale: 1.1 }],
          shadowOpacity: 0.3,
        },
        false: {},
      },
    },
  }
);

// Slider value label
const SliderValueLabel = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'SliderValueLabel',
    defaultProps: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'gray700',
      mb: 2,
    },
  }
);

// Slider marks
const SliderMark = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SliderMark',
    defaultProps: {
      position: 'absolute',
      width: 2,
      height: 2,
      borderRadius: 'full',
      backgroundColor: 'gray400',
    },
  }
);

const SliderMarkLabel = createStyledComponent(
  isWeb ? 'div' : 'Text',
  {
    name: 'SliderMarkLabel',
    defaultProps: {
      position: 'absolute',
      fontSize: 'xs',
      color: 'gray600',
      mt: 1,
      transform: [{ translateX: -0.5 }],
    },
  }
);

// Main Slider component
export const Slider = forwardRef<any, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      size = "md",
      variant = "default",
      disabled = false,
      orientation = "horizontal",
      showValue = false,
      showMarks = false,
      marks = [],
      formatValue,
      onChange,
      onChangeStart,
      onChangeEnd,
      hapticFeedback = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<any>(null);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Calculate percentage
    const percentage = ((value - min) / (max - min)) * 100;

    // Handle value change
    const handleValueChange = (newValue: number) => {
      const clampedValue = Math.min(Math.max(newValue, min), max);
      const steppedValue = Math.round(clampedValue / step) * step;

      if (!isControlled) {
        setInternalValue(steppedValue);
      }

      // Haptic feedback for React Native
      if (!isWeb && hapticFeedback) {
        try {
          const { HapticFeedback } = require('expo-haptics');
          HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
        } catch (error) {
          // Haptic feedback not available
        }
      }

      onChange?.(steppedValue);
    };

    // Handle mouse/touch events for web
    const handlePointerDown = (event: any) => {
      if (disabled) return;

      setIsDragging(true);
      onChangeStart?.(value);

      const handlePointerMove = (moveEvent: any) => {
        if (!trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const isHorizontal = orientation === 'horizontal';
        
        const clientPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
        const trackStart = isHorizontal ? rect.left : rect.top;
        const trackSize = isHorizontal ? rect.width : rect.height;
        
        let percentage = (clientPos - trackStart) / trackSize;
        if (orientation === 'vertical') {
          percentage = 1 - percentage; // Invert for vertical
        }
        
        const newValue = min + percentage * (max - min);
        handleValueChange(newValue);
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        onChangeEnd?.(value);
        document.removeEventListener('mousemove', handlePointerMove);
        document.removeEventListener('mouseup', handlePointerUp);
        document.removeEventListener('touchmove', handlePointerMove);
        document.removeEventListener('touchend', handlePointerUp);
      };

      document.addEventListener('mousemove', handlePointerMove);
      document.addEventListener('mouseup', handlePointerUp);
      document.addEventListener('touchmove', handlePointerMove);
      document.addEventListener('touchend', handlePointerUp);

      // Handle initial click/touch
      handlePointerMove(event);
    };

    // Format value for display
    const getFormattedValue = () => {
      if (formatValue) return formatValue(value);
      return value.toString();
    };

    // Calculate thumb position
    const getThumbPosition = () => {
      if (orientation === 'horizontal') {
        return {
          left: `${percentage}%`,
          top: '50%',
          transform: [{ translateX: -0.5 }, { translateY: -0.5 }],
        };
      } else {
        return {
          bottom: `${percentage}%`,
          left: '50%',
          transform: [{ translateX: -0.5 }, { translateY: 0.5 }],
        };
      }
    };

    // Calculate filled track size
    const getFilledTrackStyle = () => {
      if (orientation === 'horizontal') {
        return { width: `${percentage}%` };
      } else {
        return { height: `${percentage}%`, position: 'absolute', bottom: 0 };
      }
    };

    return (
      <SliderContainer
        ref={ref}
        orientation={orientation}
        disabled={disabled}
        {...props}
      >
        {/* Value label */}
        {showValue && (
          <SliderValueLabel>
            {getFormattedValue()}
          </SliderValueLabel>
        )}

        {/* Track */}
        <SliderTrack
          ref={trackRef}
          size={size}
          orientation={orientation}
          onMouseDown={isWeb ? handlePointerDown : undefined}
          onTouchStart={isWeb ? handlePointerDown : undefined}
        >
          {/* Filled track */}
          <SliderFilledTrack
            variant={variant}
            style={getFilledTrackStyle()}
          />

          {/* Marks */}
          {showMarks && marks.map((mark, index) => {
            const markPercentage = ((mark.value - min) / (max - min)) * 100;
            const markPosition = orientation === 'horizontal' 
              ? { left: `${markPercentage}%` }
              : { bottom: `${markPercentage}%` };

            return (
              <React.Fragment key={index}>
                <SliderMark style={markPosition} />
                {mark.label && (
                  <SliderMarkLabel style={markPosition}>
                    {mark.label}
                  </SliderMarkLabel>
                )}
              </React.Fragment>
            );
          })}

          {/* Thumb */}
          <SliderThumb
            size={size}
            variant={variant}
            dragging={isDragging}
            style={getThumbPosition()}
          />
        </SliderTrack>
      </SliderContainer>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
