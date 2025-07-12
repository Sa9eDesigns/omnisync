// Skeleton Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Skeleton props interface
export interface SkeletonProps extends StyledProps {
  variant?: "text" | "rectangular" | "circular" | "rounded";
  animation?: "pulse" | "wave" | "none";
  width?: number | string;
  height?: number | string;
  lines?: number;
  spacing?: number;
}

// Skeleton animation keyframes for web
const skeletonKeyframes = `
  @keyframes omnisync-skeleton-pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes omnisync-skeleton-wave {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// Inject keyframes for web
if (isWeb && typeof document !== 'undefined') {
  const styleId = 'omnisync-skeleton-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = skeletonKeyframes;
    document.head.appendChild(style);
  }
}

// Base styled skeleton component
const StyledSkeletonBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Skeleton',
    defaultProps: {
      backgroundColor: 'gray200',
      position: 'relative',
      overflow: 'hidden',
    },
    variants: {
      variant: {
        text: {
          height: 16,
          borderRadius: 'sm',
        },
        rectangular: {
          borderRadius: 'md',
        },
        circular: {
          borderRadius: 'full',
        },
        rounded: {
          borderRadius: 'lg',
        },
      },
      animation: {
        pulse: {},
        wave: {},
        none: {},
      },
    },
  }
);

// Wave animation overlay for web
const SkeletonWave = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SkeletonWave',
    defaultProps: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    },
  }
);

// Skeleton container for multiple lines
const SkeletonContainer = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'SkeletonContainer',
    defaultProps: {
      width: '100%',
    },
  }
);

// Main Skeleton component
export const Skeleton = forwardRef<any, SkeletonProps>(
  (
    {
      variant = "rectangular",
      animation = "pulse",
      width,
      height,
      lines = 1,
      spacing = 8,
      ...props
    },
    ref
  ) => {
    // Animation styles
    const getAnimationStyle = () => {
      if (animation === 'none') return {};
      
      if (isWeb) {
        if (animation === 'pulse') {
          return {
            animation: 'omnisync-skeleton-pulse 1.5s ease-in-out infinite',
          };
        }
        if (animation === 'wave') {
          return {
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'omnisync-skeleton-wave 1.6s linear infinite',
            },
          };
        }
      } else {
        // React Native - simplified animations
        return {
          opacity: animation === 'pulse' ? 0.7 : 1,
        };
      }
      
      return {};
    };

    // Default dimensions based on variant
    const getDefaultDimensions = () => {
      switch (variant) {
        case 'text':
          return { width: '100%', height: 16 };
        case 'circular':
          return { width: 40, height: 40 };
        default:
          return { width: '100%', height: 20 };
      }
    };

    const defaultDimensions = getDefaultDimensions();
    const finalWidth = width ?? defaultDimensions.width;
    const finalHeight = height ?? defaultDimensions.height;

    // Single skeleton
    const renderSkeleton = (key?: number) => (
      <StyledSkeletonBase
        key={key}
        ref={lines === 1 ? ref : undefined}
        variant={variant}
        animation={animation}
        style={{
          width: finalWidth,
          height: finalHeight,
          ...getAnimationStyle(),
          ...(key !== undefined && key > 0 ? { marginTop: spacing } : {}),
        }}
        {...props}
      >
        {/* Wave animation overlay for web */}
        {isWeb && animation === 'wave' && (
          <SkeletonWave
            style={{
              animation: 'omnisync-skeleton-wave 1.6s linear infinite',
            }}
          />
        )}
      </StyledSkeletonBase>
    );

    // Multiple lines
    if (lines > 1) {
      return (
        <SkeletonContainer ref={ref}>
          {Array.from({ length: lines }, (_, index) => {
            // Make last line shorter for text variant
            const lineWidth = variant === 'text' && index === lines - 1 
              ? typeof finalWidth === 'string' ? '75%' : finalWidth * 0.75
              : finalWidth;
            
            return (
              <StyledSkeletonBase
                key={index}
                variant={variant}
                animation={animation}
                style={{
                  width: lineWidth,
                  height: finalHeight,
                  ...getAnimationStyle(),
                  ...(index > 0 ? { marginTop: spacing } : {}),
                }}
              >
                {/* Wave animation overlay for web */}
                {isWeb && animation === 'wave' && (
                  <SkeletonWave
                    style={{
                      animation: 'omnisync-skeleton-wave 1.6s linear infinite',
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                )}
              </StyledSkeletonBase>
            );
          })}
        </SkeletonContainer>
      );
    }

    return renderSkeleton();
  }
);

Skeleton.displayName = "Skeleton";

// Skeleton presets for common use cases
export const SkeletonText = forwardRef<any, Omit<SkeletonProps, 'variant'>>((props, ref) => (
  <Skeleton ref={ref} variant="text" {...props} />
));

export const SkeletonCircle = forwardRef<any, Omit<SkeletonProps, 'variant'>>((props, ref) => (
  <Skeleton ref={ref} variant="circular" {...props} />
));

export const SkeletonRectangle = forwardRef<any, Omit<SkeletonProps, 'variant'>>((props, ref) => (
  <Skeleton ref={ref} variant="rectangular" {...props} />
));

// Skeleton card preset
export interface SkeletonCardProps extends StyledProps {
  showAvatar?: boolean;
  avatarSize?: number;
  lines?: number;
  animation?: "pulse" | "wave" | "none";
}

export const SkeletonCard = forwardRef<any, SkeletonCardProps>(
  ({ showAvatar = true, avatarSize = 40, lines = 3, animation = "pulse", ...props }, ref) => {
    return (
      <SkeletonContainer ref={ref} {...props}>
        {/* Header with avatar and title */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          {showAvatar && (
            <SkeletonCircle
              width={avatarSize}
              height={avatarSize}
              animation={animation}
              style={{ marginRight: 12 }}
            />
          )}
          <div style={{ flex: 1 }}>
            <SkeletonText
              width="60%"
              height={16}
              animation={animation}
              style={{ marginBottom: 8 }}
            />
            <SkeletonText
              width="40%"
              height={12}
              animation={animation}
            />
          </div>
        </div>

        {/* Content lines */}
        <SkeletonText
          lines={lines}
          animation={animation}
          spacing={8}
        />

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <SkeletonRectangle
            width={80}
            height={32}
            animation={animation}
          />
          <SkeletonRectangle
            width={60}
            height={32}
            animation={animation}
          />
        </div>
      </SkeletonContainer>
    );
  }
);

SkeletonText.displayName = "SkeletonText";
SkeletonCircle.displayName = "SkeletonCircle";
SkeletonRectangle.displayName = "SkeletonRectangle";
SkeletonCard.displayName = "SkeletonCard";

export default Skeleton;
