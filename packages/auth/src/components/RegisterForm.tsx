import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@boilerplate/ui';
import { PlatformView, PlatformText, isWeb } from './platform/PlatformView';
import { CrossPlatformFormField } from './platform/CrossPlatformFormField';
import { registerSchema, type RegisterFormData } from '../schemas';
import { useRegister } from '../hooks/use-register';

export interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
  showSocialLogin?: boolean;
  className?: string;
}

export function RegisterForm({
  onSuccess,
  onLogin,
  showSocialLogin = true,
  className,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading, error } = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await register(data);
    if (result.success) {
      onSuccess?.();
    }
  };

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
                Create Account
              </PlatformText>
              <PlatformText className="text-muted-foreground">
                Join us and start your journey today
              </PlatformText>
            </PlatformView>

          {/* Error Message */}
          {error && (
            <PlatformView className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <PlatformText className="text-sm text-destructive">{error}</PlatformText>
            </PlatformView>
          )}

          {/* Name Field */}
          <CrossPlatformFormField
            name="name"
            label="Full Name"
            required
          >
            {({ value, onChange, onBlur, error }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your full name"
                autoCapitalize="words"
                autoComplete="name"
                error={error}
              />
            )}
          </CrossPlatformFormField>

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

          {/* Password Field */}
          <CrossPlatformFormField
            name="password"
            label="Password"
            required
          >
            {({ value, onChange, onBlur, error }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                error={error}
              />
            )}
          </CrossPlatformFormField>

          {/* Confirm Password Field */}
          <CrossPlatformFormField
            name="confirmPassword"
            label="Confirm Password"
            required
          >
            {({ value, onChange, onBlur, error }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                error={error}
              />
            )}
          </CrossPlatformFormField>

          {/* Terms and Conditions */}
          <CrossPlatformFormField name="acceptTerms" required>
            {({ value, onChange, error }) => (
              <PlatformView>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => onChange(!value)}
                  className="p-0 h-auto justify-start"
                >
                  <PlatformView className="flex-row items-start">
                    <PlatformView className={`w-4 h-4 border rounded mr-3 mt-0.5 ${
                      value ? 'bg-primary border-primary' : 'border-input'
                    }`}>
                      {value && (
                        <PlatformText className="text-primary-foreground text-xs text-center">
                          ✓
                        </PlatformText>
                      )}
                    </PlatformView>
                    <PlatformView className="flex-1">
                      <PlatformText className="text-sm text-foreground text-left">
                        I agree to the{' '}
                        <PlatformText className="text-primary">Terms of Service</PlatformText>
                        {' '}and{' '}
                        <PlatformText className="text-primary">Privacy Policy</PlatformText>
                      </PlatformText>
                    </PlatformView>
                  </PlatformView>
                </Button>
                {error && (
                  <PlatformText className="text-sm text-destructive mt-1">{error}</PlatformText>
                )}
              </PlatformView>
            )}
          </CrossPlatformFormField>

          {/* Submit Button */}
          <Button
            onPress={form.handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Social Login */}
          {showSocialLogin && (
            <PlatformView className="space-y-3">
              <PlatformView className="flex-row items-center">
                <PlatformView className="flex-1 h-px bg-border" />
                <PlatformText className="px-3 text-sm text-muted-foreground">Or continue with</PlatformText>
                <PlatformView className="flex-1 h-px bg-border" />
              </PlatformView>

              <PlatformView className="flex-row space-x-3">
                <Button variant="outline" className="flex-1">
                  <PlatformText>Google</PlatformText>
                </Button>
                <Button variant="outline" className="flex-1">
                  <PlatformText>GitHub</PlatformText>
                </Button>
              </PlatformView>
            </PlatformView>
          )}

          {/* Login Link */}
          <PlatformView className="text-center">
            <PlatformText className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <PlatformText
                className="text-primary font-medium"
                onPress={onLogin}
              >
                Sign in
              </PlatformText>
            </PlatformText>
          </PlatformView>
          </PlatformView>
        </FormWrapper>
      </FormProvider>
    </PlatformView>
  );
}

export default RegisterForm;
