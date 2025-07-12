import React from 'react';
import { clsx } from 'clsx';

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  testID?: string;
}

export function Button({
  children,
  onPress,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className,
  testID,
}: ButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    onPress?.();
    onClick?.();
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizeClasses = {
    sm: 'h-9 rounded-md px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 rounded-md px-8',
  };

  if (isReactNative) {
    // React Native implementation
    const { Pressable, Text } = require('react-native');
    
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        testID={testID}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
          backgroundColor: variant === 'primary' ? '#007AFF' : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variant === 'outline' ? '#007AFF' : 'transparent',
          paddingHorizontal: size === 'sm' ? 12 : size === 'lg' ? 32 : 16,
          paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 12 : 10,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Text
          style={{
            color: variant === 'primary' ? 'white' : '#007AFF',
            fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
            fontWeight: '600',
          }}
        >
          {loading ? 'Loading...' : children}
        </Text>
      </Pressable>
    );
  }

  // Web implementation
  return (
    <button
      type="button"
      onClick={handlePress}
      disabled={disabled || loading}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      data-testid={testID}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

export default Button;
