import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input, Button } from '@boilerplate/ui';
import { FormField } from './FormField';

export interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  showStrengthIndicator?: boolean;
  className?: string;
}

export function PasswordInput({
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  autoComplete = 'current-password',
  showStrengthIndicator = false,
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (password: string): {
    score: number;
    label: string;
    color: string;
  } => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'text-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'text-yellow-500' };
    if (score <= 5) return { score, label: 'Good', color: 'text-blue-500' };
    return { score, label: 'Strong', color: 'text-green-500' };
  };

  return (
    <FormField
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      {({ value, onChange, onBlur, error, disabled: fieldDisabled }) => {
        const strength = showStrengthIndicator ? calculateStrength(value || '') : null;
        
        return (
          <View>
            <View className="relative">
              <Input
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                autoComplete={autoComplete}
                autoCapitalize="none"
                disabled={disabled || fieldDisabled}
                error={error}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Text className="text-sm text-muted-foreground">
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </Pressable>
            </View>

            {showStrengthIndicator && value && strength && (
              <View className="mt-2">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs text-muted-foreground">
                    Password strength
                  </Text>
                  <Text className={`text-xs font-medium ${strength.color}`}>
                    {strength.label}
                  </Text>
                </View>
                <View className="flex-row space-x-1">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <View
                      key={level}
                      className={`flex-1 h-1 rounded-full ${
                        level <= strength.score
                          ? strength.score <= 2
                            ? 'bg-red-500'
                            : strength.score <= 4
                            ? 'bg-yellow-500'
                            : strength.score <= 5
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        );
      }}
    </FormField>
  );
}

export default PasswordInput;
