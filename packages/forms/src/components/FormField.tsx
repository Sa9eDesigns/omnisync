import React from 'react';
import { View, Text } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { clsx } from 'clsx';

export interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  children: (props: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: string;
    disabled?: boolean;
  }) => React.ReactNode;
  className?: string;
}

export function FormField({
  name,
  label,
  description,
  required = false,
  children,
  className,
}: FormFieldProps) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <View className={clsx('space-y-2', className)}>
      {label && (
        <Text className="text-sm font-medium text-foreground">
          {label}
          {required && <Text className="text-destructive ml-1">*</Text>}
        </Text>
      )}
      
      {description && (
        <Text className="text-sm text-muted-foreground">
          {description}
        </Text>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, onBlur } }) =>
          children({
            value,
            onChange,
            onBlur,
            error,
            disabled: isSubmitting,
          })
        }
      />

      {error && (
        <Text className="text-sm text-destructive">
          {error}
        </Text>
      )}
    </View>
  );
}

export default FormField;
