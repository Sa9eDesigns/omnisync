import { useForm as useReactHookForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export interface UseFormOptions<T> extends Omit<UseFormProps<T>, 'resolver'> {
  schema?: z.ZodSchema<T>;
  onSubmit?: (data: T) => void | Promise<void>;
  onError?: (errors: any) => void;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T> = {}
): UseFormReturn<T> & {
  submitForm: () => Promise<void>;
} {
  const { schema, onSubmit, onError, ...formOptions } = options;

  const form = useReactHookForm<T>({
    ...formOptions,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const submitForm = async () => {
    try {
      if (onSubmit) {
        await form.handleSubmit(onSubmit, onError)();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  return {
    ...form,
    submitForm,
  };
}

export default useForm;
