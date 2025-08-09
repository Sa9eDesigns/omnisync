import React from 'react';
import { Input } from '@boilerplate/ui';
import { FormField } from './FormField';

export interface TextInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  maxLength?: number;
  className?: string;
}

export function TextInput({
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  autoCapitalize = 'sentences',
  autoComplete,
  maxLength,
  className,
}: TextInputProps) {
  return (
    <FormField
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      {({ value, onChange, onBlur, error, disabled: fieldDisabled }) => (
        <Input
          value={value || ''}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled || fieldDisabled}
          error={error}
        />
      )}
    </FormField>
  );
}

export default TextInput;
