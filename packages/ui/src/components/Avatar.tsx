// Avatar Component using Cross-Platform Styled System
// Works across Web, React Native, and Electron

import React, { forwardRef, useState } from "react";
import { createStyledComponent } from "../system/createStyledComponent";
import { StyledProps } from "../system/styled";

// Platform detection
const isWeb = typeof window !== 'undefined';

// Avatar props interface
export interface AvatarProps extends StyledProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  showFallback?: boolean;
  loading?: "eager" | "lazy";
  crossOrigin?: "anonymous" | "use-credentials";
  onError?: () => void;
  onLoad?: () => void;
}

// Base styled avatar component
const StyledAvatarBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'Avatar',
    defaultProps: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'full',
      backgroundColor: 'gray200',
      overflow: 'hidden',
      flexShrink: 0,
    },
    variants: {
      size: {
        xs: { width: 24, height: 24 },
        sm: { width: 32, height: 32 },
        md: { width: 40, height: 40 },
        lg: { width: 48, height: 48 },
        xl: { width: 56, height: 56 },
        '2xl': { width: 64, height: 64 },
      },
    },
  }
);

// Avatar image component
const AvatarImage = createStyledComponent(
  isWeb ? 'img' : 'Image',
  {
    name: 'AvatarImage',
    defaultProps: {
      width: '100%',
      height: '100%',
      borderRadius: 'full',
    },
  }
);

// Avatar fallback component
const AvatarFallback = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'AvatarFallback',
    defaultProps: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'gray300',
      color: 'gray700',
      fontWeight: 'medium',
      borderRadius: 'full',
    },
    variants: {
      size: {
        xs: { fontSize: 'xs' },
        sm: { fontSize: 'sm' },
        md: { fontSize: 'base' },
        lg: { fontSize: 'lg' },
        xl: { fontSize: 'xl' },
        '2xl': { fontSize: '2xl' },
      },
    },
  }
);

// Avatar text component
const AvatarText = createStyledComponent(
  isWeb ? 'span' : 'Text',
  {
    name: 'AvatarText',
    defaultProps: {
      fontWeight: 'medium',
      color: 'inherit',
    },
  }
);

// Generate initials from name
const getInitials = (name: string): string => {
  if (!name) return '';
  
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Generate background color from name
const getBackgroundColor = (name: string): string => {
  if (!name) return 'gray300';
  
  const colors = [
    'red400', 'orange400', 'yellow400', 'green400', 'teal400',
    'blue400', 'indigo400', 'purple400', 'pink400', 'gray400'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Main Avatar component
export const Avatar = forwardRef<any, AvatarProps>(
  (
    {
      size = "md",
      src,
      alt,
      name = "",
      fallback,
      showFallback = true,
      loading = "lazy",
      crossOrigin,
      onError,
      onLoad,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Handle image error
    const handleImageError = () => {
      setImageError(true);
      onError?.();
    };

    // Handle image load
    const handleImageLoad = () => {
      setImageLoaded(true);
      onLoad?.();
    };

    // Determine what to show
    const shouldShowImage = src && !imageError;
    const shouldShowFallback = showFallback && (!src || imageError);
    
    // Get fallback content
    const fallbackContent = fallback || getInitials(name) || '?';
    
    // Get background color for fallback
    const fallbackBgColor = name ? getBackgroundColor(name) : 'gray300';

    return (
      <StyledAvatarBase
        ref={ref}
        size={size}
        {...props}
      >
        {shouldShowImage && (
          <AvatarImage
            src={src}
            alt={alt || name}
            loading={loading}
            crossOrigin={crossOrigin}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={isWeb ? {
              objectFit: 'cover',
              objectPosition: 'center',
            } : {
              resizeMode: 'cover',
            }}
          />
        )}
        
        {shouldShowFallback && (
          <AvatarFallback
            size={size}
            backgroundColor={fallbackBgColor}
            color="white"
          >
            <AvatarText>
              {fallbackContent}
            </AvatarText>
          </AvatarFallback>
        )}
      </StyledAvatarBase>
    );
  }
);

Avatar.displayName = "Avatar";

// Avatar Group component for displaying multiple avatars
export interface AvatarGroupProps extends StyledProps {
  max?: number;
  spacing?: number;
  children: React.ReactElement<AvatarProps>[];
}

const AvatarGroupBase = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'AvatarGroup',
    defaultProps: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  }
);

const AvatarGroupItem = createStyledComponent(
  isWeb ? 'div' : 'View',
  {
    name: 'AvatarGroupItem',
    defaultProps: {
      position: 'relative',
      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 'full',
    },
  }
);

export const AvatarGroup = forwardRef<any, AvatarGroupProps>(
  ({ max = 5, spacing = -8, children, ...props }, ref) => {
    const avatars = React.Children.toArray(children) as React.ReactElement<AvatarProps>[];
    const visibleAvatars = avatars.slice(0, max);
    const hiddenCount = Math.max(0, avatars.length - max);

    return (
      <AvatarGroupBase ref={ref} {...props}>
        {visibleAvatars.map((avatar, index) => (
          <AvatarGroupItem
            key={index}
            style={{
              marginLeft: index > 0 ? spacing : 0,
              zIndex: visibleAvatars.length - index,
            }}
          >
            {avatar}
          </AvatarGroupItem>
        ))}
        
        {hiddenCount > 0 && (
          <AvatarGroupItem
            style={{
              marginLeft: spacing,
              zIndex: 0,
            }}
          >
            <Avatar
              size={visibleAvatars[0]?.props.size || 'md'}
              fallback={`+${hiddenCount}`}
              backgroundColor="gray400"
            />
          </AvatarGroupItem>
        )}
      </AvatarGroupBase>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export default Avatar;
