import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '@boilerplate/ui';
import { useAuth } from '@boilerplate/store';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Welcome{isAuthenticated && user ? `, ${user.name}` : ''}! 👋
          </Text>
          <Text className="text-lg text-muted-foreground">
            Cross-Platform Mobile App
          </Text>
        </View>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/posts" asChild>
              <Button className="w-full">
                View All Posts
              </Button>
            </Link>
            <Link href="/modal" asChild>
              <Button variant="outline" className="w-full">
                Open Modal
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/auth/login" asChild>
                <Button variant="secondary" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <View className="space-y-4">
          <Text className="text-xl font-semibold text-foreground">
            Features
          </Text>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex-row items-center">
                🚀 <Text className="ml-2">Fast Development</Text>
              </CardTitle>
              <CardDescription>
                Hot reloading and modern tooling for rapid development.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex-row items-center">
                🎨 <Text className="ml-2">Universal UI</Text>
              </CardTitle>
              <CardDescription>
                Components that work across web, mobile, and desktop.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex-row items-center">
                📊 <Text className="ml-2">State Management</Text>
              </CardTitle>
              <CardDescription>
                Zustand and React Query for optimal data flow.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex-row items-center">
                🗄️ <Text className="ml-2">Database Ready</Text>
              </CardTitle>
              <CardDescription>
                Prisma ORM with type-safe queries and migrations.
              </CardDescription>
            </CardHeader>
          </Card>
        </View>

        {/* Navigation Demo */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Navigation Demo</CardTitle>
            <CardDescription>
              Test different navigation patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/post/1" asChild>
              <Pressable className="p-3 bg-secondary rounded-md">
                <Text className="text-secondary-foreground font-medium">
                  View Post #1 (Stack Navigation)
                </Text>
              </Pressable>
            </Link>
            <Link href="/post/2" asChild>
              <Pressable className="p-3 bg-secondary rounded-md">
                <Text className="text-secondary-foreground font-medium">
                  View Post #2 (Stack Navigation)
                </Text>
              </Pressable>
            </Link>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
