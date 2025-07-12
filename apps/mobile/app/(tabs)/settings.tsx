import React from 'react';
import { ScrollView, View, Text, Switch } from 'react-native';
import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '@boilerplate/ui';
import { useUIStore } from '@boilerplate/store';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, language, setLanguage } = useUIStore();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-foreground font-medium">Dark Mode</Text>
                <Text className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Language & Region</CardTitle>
            <CardDescription>
              Set your preferred language and region
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground">Language</Text>
              <Text className="text-muted-foreground">English</Text>
            </View>
            <Button variant="outline" className="w-full">
              Change Language
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-foreground font-medium">Push Notifications</Text>
                <Text className="text-sm text-muted-foreground">
                  Receive notifications on your device
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor="#ffffff"
              />
            </View>
            
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-foreground font-medium">Email Notifications</Text>
                <Text className="text-sm text-muted-foreground">
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor="#f3f4f6"
              />
            </View>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>
              Manage your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full">
              Terms of Service
            </Button>
            <Button variant="outline" className="w-full">
              Data Export
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>App Information</CardTitle>
            <CardDescription>
              About this application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Version</Text>
              <Text className="text-foreground">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Build</Text>
              <Text className="text-foreground">2024.1.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Platform</Text>
              <Text className="text-foreground">React Native</Text>
            </View>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>
              Get help and provide feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">
              Help Center
            </Button>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
            <Button variant="outline" className="w-full">
              Send Feedback
            </Button>
            <Button variant="outline" className="w-full">
              Rate App
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
