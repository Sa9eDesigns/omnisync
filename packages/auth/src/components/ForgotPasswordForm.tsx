import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@boilerplate/ui-simple';
import { PlatformView, PlatformText, isWeb } from './platform/PlatformView';
import { CrossPlatformFormField } from './platform/CrossPlatformFormField';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas';
import { useForgotPassword } from '../hooks/use-forgot-password';

export interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
  className?: string;
}

export function ForgotPasswordForm({
  onSuccess,
  onBack,
  className,
}: ForgotPasswordFormProps) {
  const { forgotPassword, isLoading, error, success } = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await forgotPassword(data);
    if (result.success) {
      onSuccess?.();
    }
  };

  if (success) {
    return (
      <PlatformView className={className}>
        <PlatformView className="text-center space-y-4">
          <PlatformText className="text-6xl mb-4">📧</PlatformText>
          <PlatformText className="text-2xl font-bold text-foreground mb-2">
            Check Your Email
          </PlatformText>
          <PlatformText className="text-muted-foreground mb-6">
            We've sent a password reset link to your email address.
            Please check your inbox and follow the instructions.
          </PlatformText>
          <Button onPress={onBack} variant="outline" className="w-full">
            Back to Sign In
          </Button>
        </PlatformView>
      </PlatformView>
    );
  }

  // Create platform-specific form wrapper
  const FormWrapper = isWeb ? 'form' : PlatformView;
  const formProps = isWeb
    ? { onSubmit: form.handleSubmit(onSubmit), className }
    : { className };

  return (
    <PlatformView className={className}>
      <FormProvider {...form}>
        <FormWrapper {...formProps}>
          <PlatformView className="space-y-4">
            {/* Header */}
            <PlatformView className="text-center mb-6">
              <PlatformText className="text-2xl font-bold text-foreground mb-2">
                Forgot Password?
              </PlatformText>
              <PlatformText className="text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </PlatformText>
            </PlatformView>

            {/* Error Message */}
            {error && (
              <PlatformView className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <PlatformText className="text-sm text-destructive">{error}</PlatformText>
              </PlatformView>
            )}

            {/* Email Field */}
            <CrossPlatformFormField
              name="email"
              label="Email"
              required
            >
              {({ value, onChange, onBlur, error }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={error}
                />
              )}
            </CrossPlatformFormField>

            {/* Submit Button */}
            <Button
              onPress={form.handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            {/* Back Button */}
            <Button
              onPress={onBack}
              variant="ghost"
              className="w-full"
            >
              Back to Sign In
            </Button>
          </PlatformView>
        </FormWrapper>
      </FormProvider>
    </PlatformView>
  );
}

export default ForgotPasswordForm;
