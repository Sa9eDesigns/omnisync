import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { router, Stack } from 'expo-router';
import { LoginForm } from '@boilerplate/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const handleSuccess = () => {
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Sign In',
          headerShown: false,
        }} 
      />
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-12">
            {/* Logo/Brand */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
                <Text className="text-2xl text-primary-foreground font-bold">B</Text>
              </View>
              <Text className="text-xl font-semibold text-foreground">
                Boilerplate
              </Text>
            </View>

            {/* Login Form */}
            <LoginForm
              onSuccess={handleSuccess}
              onForgotPassword={handleForgotPassword}
              onRegister={handleRegister}
              showRememberMe={true}
              showSocialLogin={true}
            />

            {/* Footer */}
            <View className="mt-8 pt-6 border-t border-border">
              <Text className="text-center text-xs text-muted-foreground">
                By signing in, you agree to our{' '}
                <Text className="text-primary">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-primary">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
