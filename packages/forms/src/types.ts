import { ReactNode } from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';

// Base form types
export interface FormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface FormFieldProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  children: (props: FormFieldRenderProps) => ReactNode;
  className?: string;
}

export interface FormFieldRenderProps {
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}

// Input component types
export interface BaseInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface TextInputProps extends BaseInputProps {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
}

export interface PasswordInputProps extends BaseInputProps {
  autoComplete?: string;
  showStrengthIndicator?: boolean;
  minLength?: number;
}

export interface EmailInputProps extends BaseInputProps {
  autoComplete?: string;
  validateDomain?: boolean;
}

export interface NumberInputProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  allowNegative?: boolean;
  allowDecimal?: boolean;
}

export interface SelectProps extends BaseInputProps {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  placeholder?: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

export interface CheckboxProps extends BaseInputProps {
  indeterminate?: boolean;
}

export interface RadioGroupProps extends BaseInputProps {
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
}

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
}

export interface SwitchProps extends BaseInputProps {
  size?: 'sm' | 'md' | 'lg';
}

export interface DatePickerProps extends BaseInputProps {
  mode?: 'date' | 'time' | 'datetime';
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
}

export interface FileUploadProps extends BaseInputProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
  uploadUrl?: string;
}

// Validation types
export interface ValidationRule {
  required?: boolean | string;
  min?: number | string;
  max?: number | string;
  minLength?: number | string;
  maxLength?: number | string;
  pattern?: RegExp | string;
  validate?: (value: any) => boolean | string;
}

export interface FormValidationSchema {
  [key: string]: ValidationRule;
}

// Form state types
export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Form context types
export interface FormContextValue {
  state: FormState;
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
  reset: () => void;
  submit: () => void;
}

// Utility types
export type FormFieldValue = string | number | boolean | Date | File | File[] | null | undefined;

export interface FormFieldError {
  type: string;
  message: string;
}

export interface FormSubmissionResult {
  success: boolean;
  data?: any;
  errors?: Record<string, string>;
  message?: string;
}
