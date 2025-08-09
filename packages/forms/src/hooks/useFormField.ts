import { useFormContext, useController } from 'react-hook-form';

export interface UseFormFieldOptions {
  name: string;
  rules?: any;
  defaultValue?: any;
}

export function useFormField({ name, rules, defaultValue }: UseFormFieldOptions) {
  const form = useFormContext();
  
  if (!form) {
    throw new Error('useFormField must be used within a FormProvider');
  }

  const {
    field,
    fieldState: { error, isDirty, isTouched },
    formState: { isSubmitting },
  } = useController({
    name,
    rules,
    defaultValue,
  });

  return {
    ...field,
    error: error?.message,
    isDirty,
    isTouched,
    isSubmitting,
    formState: form.formState,
  };
}

export default useFormField;
