import React from 'react';

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
const isWeb = typeof window !== 'undefined' && !isReactNative;

interface PlatformViewProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

export function PlatformView({ children, className, style }: PlatformViewProps) {
  if (isReactNative) {
    // React Native View
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  }
  
  // Web/Desktop div
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

interface PlatformTextProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
  onPress?: () => void;
}

export function PlatformText({ children, className, style, onPress }: PlatformTextProps) {
  if (isReactNative) {
    // React Native Text
    const { Text } = require('react-native');
    return (
      <Text style={style} onPress={onPress}>
        {children}
      </Text>
    );
  }
  
  // Web/Desktop span or button
  if (onPress) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={onPress}
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

interface PlatformScrollViewProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
  contentContainerStyle?: any;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

export function PlatformScrollView({ 
  children, 
  className, 
  style, 
  contentContainerStyle,
  keyboardShouldPersistTaps 
}: PlatformScrollViewProps) {
  if (isReactNative) {
    // React Native ScrollView
    const { ScrollView } = require('react-native');
    return (
      <ScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {children}
      </ScrollView>
    );
  }
  
  // Web/Desktop scrollable div
  return (
    <div 
      className={className} 
      style={{ 
        ...style, 
        overflow: 'auto',
        ...contentContainerStyle 
      }}
    >
      {children}
    </div>
  );
}

export { isReactNative, isWeb };
