import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@boilerplate/ui-simple';
import { PlatformView, PlatformText, isWeb } from './platform/PlatformView';
import { CrossPlatformFormField } from './platform/CrossPlatformFormField';
import { loginSchema, type LoginFormData } from '../schemas';
import { useLogin } from '../hooks/use-login';

export interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  showRememberMe?: boolean;
  showSocialLogin?: boolean;
  className?: string;
}

export function LoginForm({
  onSuccess,
  onForgotPassword,
  onRegister,
  showRememberMe = true,
  showSocialLogin = true,
  className,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data);
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
                Welcome Back
              </PlatformText>
              <PlatformText className="text-muted-foreground">
                Sign in to your account to continue
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
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoComplete="current-password"
                error={error}
              />
            )}
          </CrossPlatformFormField>

          {/* Remember Me & Forgot Password */}
          <PlatformView className="flex-row justify-between items-center">
            {showRememberMe && (
              <CrossPlatformFormField name="rememberMe">
                {({ value, onChange }) => (
                  <PlatformView className="flex-row items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => onChange(!value)}
                      className="p-0 h-auto"
                    >
                      <PlatformView className="flex-row items-center">
                        <PlatformView className={`w-4 h-4 border rounded mr-2 ${
                          value ? 'bg-primary border-primary' : 'border-input'
                        }`}>
                          {value && (
                            <PlatformText className="text-primary-foreground text-xs text-center">
                              ✓
                            </PlatformText>
                          )}
                        </PlatformView>
                        <PlatformText className="text-sm text-foreground">Remember me</PlatformText>
                      </PlatformView>
                    </Button>
                  </PlatformView>
                )}
              </CrossPlatformFormField>
            )}

            <Button
              variant="ghost"
              size="sm"
              onPress={onForgotPassword}
              className="p-0 h-auto"
            >
              <PlatformText className="text-sm text-primary">Forgot password?</PlatformText>
            </Button>
          </PlatformView>

          {/* Submit Button */}
          <Button
            onPress={form.handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
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

          {/* Register Link */}
          <PlatformView className="text-center">
            <PlatformText className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <PlatformText
                className="text-primary font-medium"
                onPress={onRegister}
              >
                Sign up
              </PlatformText>
            </PlatformText>
          </PlatformView>
          </PlatformView>
        </FormWrapper>
      </FormProvider>
    </PlatformView>
  );
}

export default LoginForm;
