import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryProvider } from '@boilerplate/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal',
              title: 'Modal Screen'
            }} 
          />
          <Stack.Screen 
            name="post/[id]" 
            options={{ 
              title: 'Post Details',
              headerBackTitle: 'Back'
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
