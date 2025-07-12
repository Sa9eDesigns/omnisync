import React from 'react';
import { clsx } from 'clsx';

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  if (isReactNative) {
    // React Native implementation
    const { View } = require('react-native');
    
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {children}
      </View>
    );
  }

  // Web implementation
  return (
    <div className={clsx('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  if (isReactNative) {
    const { View } = require('react-native');
    return (
      <View style={{ marginBottom: 12 }}>
        {children}
      </View>
    );
  }

  return (
    <div className={clsx('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  if (isReactNative) {
    const { View } = require('react-native');
    return <View>{children}</View>;
  }

  return (
    <div className={clsx('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  if (isReactNative) {
    const { Text } = require('react-native');
    return (
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: 'black',
          marginBottom: 4,
        }}
      >
        {children}
      </Text>
    );
  }

  return (
    <h3 className={clsx('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  if (isReactNative) {
    const { Text } = require('react-native');
    return (
      <Text
        style={{
          fontSize: 14,
          color: '#6b7280',
        }}
      >
        {children}
      </Text>
    );
  }

  return (
    <p className={clsx('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}
