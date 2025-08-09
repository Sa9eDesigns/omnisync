import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@boilerplate/ui-simple';
import { PlatformView, PlatformText, isWeb } from './platform/PlatformView';
import { CrossPlatformFormField } from './platform/CrossPlatformFormField';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas';
import { useResetPassword } from '../hooks/use-reset-password';

export interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
  onBack?: () => void;
  className?: string;
}

export function ResetPasswordForm({
  token,
  onSuccess,
  onBack,
  className,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, isLoading, error, success } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const result = await resetPassword(data);
    if (result.success) {
      onSuccess?.();
    }
  };

  if (success) {
    return (
      <PlatformView className={className}>
        <PlatformView className="text-center space-y-4">
          <PlatformText className="text-6xl mb-4">✅</PlatformText>
          <PlatformText className="text-2xl font-bold text-foreground mb-2">
            Password Reset Successful
          </PlatformText>
          <PlatformText className="text-muted-foreground mb-6">
            Your password has been successfully reset. You can now sign in with your new password.
          </PlatformText>
          <Button onPress={onBack} className="w-full">
            Sign In
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
                Reset Password
              </PlatformText>
              <PlatformText className="text-muted-foreground">
                Enter your new password below.
              </PlatformText>
            </PlatformView>

            {/* Error Message */}
            {error && (
              <PlatformView className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <PlatformText className="text-sm text-destructive">{error}</PlatformText>
              </PlatformView>
            )}

            {/* Password Field */}
            <CrossPlatformFormField
              name="password"
              label="New Password"
              required
            >
              {({ value, onChange, onBlur, error }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your new password"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  error={error}
                />
              )}
            </CrossPlatformFormField>

            {/* Confirm Password Field */}
            <CrossPlatformFormField
              name="confirmPassword"
              label="Confirm New Password"
              required
            >
              {({ value, onChange, onBlur, error }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Confirm your new password"
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordForm;
