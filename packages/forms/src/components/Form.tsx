import React from 'react';
import { View } from 'react-native';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { clsx } from 'clsx';

export interface FormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Form({
  form,
  onSubmit,
  children,
  className,
  disabled = false,
}: FormProps) {
  const handleSubmit = form.handleSubmit(async (data) => {
    if (disabled) return;
    await onSubmit(data);
  });

  return (
    <FormProvider {...form}>
      <View className={clsx('space-y-4', className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === 'form') {
            return React.cloneElement(child, {
              onSubmit: handleSubmit,
              ...child.props,
            });
          }
          return child;
        })}
      </View>
    </FormProvider>
  );
}

// Web-specific form wrapper
export function WebForm({
  form,
  onSubmit,
  children,
  className,
  disabled = false,
}: FormProps) {
  const handleSubmit = form.handleSubmit(async (data) => {
    if (disabled) return;
    await onSubmit(data);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={clsx('space-y-4', className)}>
        {children}
      </form>
    </FormProvider>
  );
}

export default Form;
