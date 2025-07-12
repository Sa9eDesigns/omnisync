import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@boilerplate/ui';
import { Form, FormField } from '@boilerplate/forms';
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

  return (
    <View className={className}>
      <Form form={form} onSubmit={onSubmit}>
        <View className="space-y-4">
          {/* Header */}
          <View className="text-center mb-6">
            <Text className="text-2xl font-bold text-foreground mb-2">
              Create Account
            </Text>
            <Text className="text-muted-foreground">
              Join us and start your journey today
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          )}

          {/* Name Field */}
          <FormField
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
          </FormField>

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
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                error={error}
              />
            )}
          </FormField>

          {/* Confirm Password Field */}
          <FormField
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
          </FormField>

          {/* Terms and Conditions */}
          <FormField name="acceptTerms" required>
            {({ value, onChange, error }) => (
              <View>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => onChange(!value)}
                  className="p-0 h-auto justify-start"
                >
                  <View className="flex-row items-start">
                    <View className={`w-4 h-4 border rounded mr-3 mt-0.5 ${
                      value ? 'bg-primary border-primary' : 'border-input'
                    }`}>
                      {value && (
                        <Text className="text-primary-foreground text-xs text-center">
                          ✓
                        </Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-foreground text-left">
                        I agree to the{' '}
                        <Text className="text-primary">Terms of Service</Text>
                        {' '}and{' '}
                        <Text className="text-primary">Privacy Policy</Text>
                      </Text>
                    </View>
                  </View>
                </Button>
                {error && (
                  <Text className="text-sm text-destructive mt-1">{error}</Text>
                )}
              </View>
            )}
          </FormField>

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

          {/* Login Link */}
          <View className="text-center">
            <Text className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Text
                className="text-primary font-medium"
                onPress={onLogin}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </View>
      </Form>
    </View>
  );
}

export default RegisterForm;
