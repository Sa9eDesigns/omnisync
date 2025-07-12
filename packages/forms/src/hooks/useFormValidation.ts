import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation<T>({
  schema,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const validateField = useCallback(
    (name: string, value: any) => {
      try {
        // Extract the field schema
        const fieldSchema = schema.shape?.[name];
        if (fieldSchema) {
          fieldSchema.parse(value);
          // Clear error if validation passes
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors[0]?.message || 'Invalid value';
          setErrors(prev => ({
            ...prev,
            [name]: fieldError,
          }));
        }
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (data: T) => {
      try {
        schema.parse(data);
        setErrors({});
        setIsValid(true);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formErrors: Record<string, string> = {};
          error.errors.forEach(err => {
            if (err.path.length > 0) {
              formErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(formErrors);
          setIsValid(false);
        }
        return false;
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
    setIsValid(false);
  }, []);

  return {
    errors,
    isValid,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setFieldError,
  };
}

export default useFormValidation;
