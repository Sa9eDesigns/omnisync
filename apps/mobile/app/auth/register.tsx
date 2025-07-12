import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { router, Stack } from 'expo-router';
import { RegisterForm } from '@boilerplate/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const handleSuccess = () => {
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Sign Up',
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
                Join Boilerplate
              </Text>
              <Text className="text-sm text-muted-foreground mt-2 text-center">
                Create your account to get started
              </Text>
            </View>

            {/* Register Form */}
            <RegisterForm
              onSuccess={handleSuccess}
              onLogin={handleLogin}
              showSocialLogin={true}
            />

            {/* Footer */}
            <View className="mt-8 pt-6 border-t border-border">
              <Text className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
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
