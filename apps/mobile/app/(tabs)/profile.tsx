import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '@boilerplate/ui';
import { useAuth } from '@boilerplate/store';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-xl font-semibold mb-4">Not signed in</Text>
        <Text className="text-muted-foreground text-center mb-6">
          Please sign in to view your profile
        </Text>
        <Button>
          Sign In
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            {user.avatar ? (
              <Image 
                source={{ uri: user.avatar }}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                <Text className="text-2xl">👤</Text>
              </View>
            )}
            <Text className="text-2xl font-bold text-foreground mb-2">
              {user.name || 'User'}
            </Text>
            <Text className="text-muted-foreground mb-4">
              {user.email}
            </Text>
            <View className="flex-row justify-center">
              <View className={`px-3 py-1 rounded-full ${
                user.role === 'ADMIN' ? 'bg-red-100 border border-red-300' :
                user.role === 'MODERATOR' ? 'bg-blue-100 border border-blue-300' :
                'bg-green-100 border border-green-300'
              }`}>
                <Text className={`text-xs font-medium ${
                  user.role === 'ADMIN' ? 'text-red-800' :
                  user.role === 'MODERATOR' ? 'text-blue-800' :
                  'text-green-800'
                }`}>
                  {user.role}
                </Text>
              </View>
            </div>
          </CardContent>
        </Card>

        {/* Profile Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Actions</CardTitle>
            <CardDescription>
              Manage your account and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Privacy Settings
            </Button>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>
              Your activity overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="grid grid-cols-2 gap-4">
              <View className="text-center">
                <Text className="text-2xl font-bold text-foreground">0</Text>
                <Text className="text-sm text-muted-foreground">Posts</Text>
              </View>
              <View className="text-center">
                <Text className="text-2xl font-bold text-foreground">0</Text>
                <Text className="text-sm text-muted-foreground">Comments</Text>
              </View>
              <View className="text-center">
                <Text className="text-2xl font-bold text-foreground">0</Text>
                <Text className="text-sm text-muted-foreground">Likes</Text>
              </View>
              <View className="text-center">
                <Text className="text-2xl font-bold text-foreground">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </Text>
                <Text className="text-sm text-muted-foreground">Days</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Member since</Text>
              <Text className="text-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Last updated</Text>
              <Text className="text-foreground">
                {new Date(user.updatedAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Account ID</Text>
              <Text className="text-foreground font-mono text-xs">
                {user.id.substring(0, 8)}...
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onPress={logout}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
