import React, { forwardRef } from 'react';
import { TextInput, View, Text } from 'react-native';
import { clsx } from 'clsx';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  className?: string;
  testID?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      onBlur,
      onFocus,
      error,
      disabled = false,
      multiline = false,
      numberOfLines = 1,
      secureTextEntry = false,
      keyboardType = 'default',
      autoCapitalize = 'none',
      autoComplete,
      className,
      testID,
    },
    ref
  ) => {
    return (
      <View className="w-full">
        {label && (
          <Text className="text-sm font-medium text-foreground mb-2">
            {label}
          </Text>
        )}
        
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          testID={testID}
          className={clsx(
            'input',
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2',
            'text-sm ring-offset-background',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            multiline && 'min-h-[80px] py-2',
            className
          )}
          placeholderTextColor="hsl(var(--muted-foreground))"
        />
        
        {error && (
          <Text className="text-sm text-destructive mt-1">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;
