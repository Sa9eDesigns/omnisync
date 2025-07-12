import React from 'react';
import { View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@boilerplate/ui';
import { Form, FormField } from '@boilerplate/forms';
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
      <View className={className}>
        <View className="text-center space-y-4">
          <Text className="text-6xl mb-4">📧</Text>
          <Text className="text-2xl font-bold text-foreground mb-2">
            Check Your Email
          </Text>
          <Text className="text-muted-foreground mb-6">
            We've sent a password reset link to your email address. 
            Please check your inbox and follow the instructions.
          </Text>
          <Button onPress={onBack} variant="outline" className="w-full">
            Back to Sign In
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className={className}>
      <Form form={form} onSubmit={onSubmit}>
        <View className="space-y-4">
          {/* Header */}
          <View className="text-center mb-6">
            <Text className="text-2xl font-bold text-foreground mb-2">
              Forgot Password?
            </Text>
            <Text className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
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
        </View>
      </Form>
    </View>
  );
}

export default ForgotPasswordForm;
