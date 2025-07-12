import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  testID?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, testID }) => {
  return (
    <View
      testID={testID}
      className={clsx(
        'card',
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <View className={clsx('card-header', 'flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </View>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <View className={clsx('card-content', 'p-6 pt-0', className)}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <View className={clsx('card-footer', 'flex items-center p-6 pt-0', className)}>
      {children}
    </View>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <Text className={clsx('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return (
    <Text className={clsx('text-sm text-muted-foreground', className)}>
      {children}
    </Text>
  );
};

export default Card;
