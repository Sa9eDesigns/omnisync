import React from 'react';
import { clsx } from 'clsx';

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

export interface TextProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  style?: any;
}

export function Text({ children, className, onPress, style }: TextProps) {
  if (isReactNative) {
    // React Native implementation
    const { Text: RNText } = require('react-native');
    
    return (
      <RNText onPress={onPress} style={style}>
        {children}
      </RNText>
    );
  }

  // Web implementation
  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        className={clsx('text-left', className)}
        style={style}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
}

export default Text;
