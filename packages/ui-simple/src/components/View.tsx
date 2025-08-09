import React from 'react';
import { clsx } from 'clsx';

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

export interface ViewProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

export function View({ children, className, style }: ViewProps) {
  if (isReactNative) {
    // React Native implementation
    const { View: RNView } = require('react-native');
    
    return (
      <RNView style={style}>
        {children}
      </RNView>
    );
  }

  // Web implementation
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export default View;
