import React from 'react';
import { clsx } from 'clsx';

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

export interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  secureTextEntry?: boolean;
  maxLength?: number;
  className?: string;
  testID?: string;
}

export function Input({
  value = '',
  onChangeText,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  error,
  type = 'text',
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  secureTextEntry = false,
  maxLength,
  className,
  testID,
}: InputProps) {
  const handleChange = (text: string) => {
    onChangeText?.(text);
  };

  const handleWebChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onChangeText?.(event.target.value);
  };

  const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const errorClasses = error ? 'border-destructive focus-visible:ring-destructive' : '';

  if (isReactNative) {
    // React Native implementation
    const { TextInput, View, Text } = require('react-native');
    
    return (
      <View>
        <TextInput
          value={value}
          onChangeText={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          editable={!disabled}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          testID={testID}
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: error ? '#ef4444' : '#d1d5db',
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 16,
            backgroundColor: disabled ? '#f3f4f6' : 'white',
            color: disabled ? '#9ca3af' : 'black',
          }}
          placeholderTextColor="#9ca3af"
        />
        {error && (
          <Text
            style={{
              color: '#ef4444',
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }

  // Web implementation
  return (
    <div>
      <input
        type={secureTextEntry ? 'password' : type}
        value={value}
        onChange={handleWebChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={clsx(baseClasses, errorClasses, className)}
        data-testid={testID}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
