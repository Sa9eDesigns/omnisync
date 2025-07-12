import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@boilerplate/ui';
import { Form, FormField } from '@boilerplate/forms';
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

  return (
    <View className={className}>
      <Form form={form} onSubmit={onSubmit}>
        <View className="space-y-4">
          {/* Header */}
          <View className="text-center mb-6">
            <Text className="text-2xl font-bold text-foreground mb-2">
              Welcome Back
            </Text>
            <Text className="text-muted-foreground">
              Sign in to your account to continue
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          )}

          {/* Email Field */}
          <FormField
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
          </FormField>

          {/* Password Field */}
          <FormField
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
          </FormField>

          {/* Remember Me & Forgot Password */}
          <View className="flex-row justify-between items-center">
            {showRememberMe && (
              <FormField name="rememberMe">
                {({ value, onChange }) => (
                  <View className="flex-row items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => onChange(!value)}
                      className="p-0 h-auto"
                    >
                      <View className="flex-row items-center">
                        <View className={`w-4 h-4 border rounded mr-2 ${
                          value ? 'bg-primary border-primary' : 'border-input'
                        }`}>
                          {value && (
                            <Text className="text-primary-foreground text-xs text-center">
                              ✓
                            </Text>
                          )}
                        </View>
                        <Text className="text-sm text-foreground">Remember me</Text>
                      </View>
                    </Button>
                  </View>
                )}
              </FormField>
            )}

            <Button
              variant="ghost"
              size="sm"
              onPress={onForgotPassword}
              className="p-0 h-auto"
            >
              <Text className="text-sm text-primary">Forgot password?</Text>
            </Button>
          </View>

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
            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="flex-1 h-px bg-border" />
                <Text className="px-3 text-sm text-muted-foreground">Or continue with</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              <View className="flex-row space-x-3">
                <Button variant="outline" className="flex-1">
                  <Text>Google</Text>
                </Button>
                <Button variant="outline" className="flex-1">
                  <Text>GitHub</Text>
                </Button>
              </View>
            </View>
          )}

          {/* Register Link */}
          <View className="text-center">
            <Text className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Text
                className="text-primary font-medium"
                onPress={onRegister}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </Form>
    </View>
  );
}

export default LoginForm;
