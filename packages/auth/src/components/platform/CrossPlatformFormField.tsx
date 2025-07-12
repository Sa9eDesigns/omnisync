import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { PlatformView, PlatformText } from './PlatformView';

export interface CrossPlatformFormFieldProps {
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

export function CrossPlatformFormField({
  name,
  label,
  description,
  required = false,
  children,
  className,
}: CrossPlatformFormFieldProps) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <PlatformView className={className}>
      {label && (
        <PlatformText className="text-sm font-medium text-foreground mb-2">
          {label}
          {required && <PlatformText className="text-destructive ml-1">*</PlatformText>}
        </PlatformText>
      )}
      
      {description && (
        <PlatformText className="text-sm text-muted-foreground mb-2">
          {description}
        </PlatformText>
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
        <PlatformText className="text-sm text-destructive mt-1">
          {error}
        </PlatformText>
      )}
    </PlatformView>
  );
}

export default CrossPlatformFormField;
