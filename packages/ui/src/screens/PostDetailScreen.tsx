import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components';
import { usePost } from '@boilerplate/store';

interface PostDetailScreenProps {
  postId: string;
  onEditPress?: (postId: string) => void;
  onDeletePress?: (postId: string) => void;
  onSharePress?: (postId: string) => void;
  onAuthorPress?: (authorId: string) => void;
  showActions?: boolean;
}

export function PostDetailScreen({
  postId,
  onEditPress,
  onDeletePress,
  onSharePress,
  onAuthorPress,
  showActions = true,
}: PostDetailScreenProps) {
  const { data: post, isLoading, error } = usePost(postId);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-muted-foreground">Loading post...</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-destructive text-lg font-semibold mb-4">
          Post not found
        </Text>
        <Text className="text-muted-foreground text-center">
          The post you're looking for doesn't exist or has been removed.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Post Header */}
        <Card className="mb-6">
          <CardHeader>
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {post.title}
                </CardTitle>
                <CardDescription>
                  By {post.author?.name || 'Unknown Author'}
                </CardDescription>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                post.published 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-yellow-100 border border-yellow-300'
              }`}>
                <Text className={`text-xs font-medium ${
                  post.published ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </Text>
              </View>
            </View>
            
            <View className="flex-row justify-between items-center mt-4">
              <Text className="text-sm text-muted-foreground">
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Updated: {new Date(post.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </CardHeader>
        </Card>

        {/* Post Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {post.content ? (
              <Text className="text-foreground leading-6 text-base">
                {post.content}
              </Text>
            ) : (
              <Text className="text-muted-foreground italic">
                No content available for this post.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Author Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Author</CardTitle>
            <CardDescription>
              About the author
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center space-x-4 mb-4">
              {post.author?.avatar && (
                <View className="w-12 h-12 rounded-full bg-gray-200" />
              )}
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  {post.author?.name || 'Unknown Author'}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {post.author?.email}
                </Text>
              </View>
            </View>
            <Button 
              variant="outline" 
              className="w-full"
              onPress={() => post.author?.id && onAuthorPress?.(post.author.id)}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        {showActions && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                What would you like to do with this post?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full"
                onPress={() => onEditPress?.(post.id)}
              >
                Edit Post
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onPress={() => onSharePress?.(post.id)}
              >
                Share Post
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onPress={() => onDeletePress?.(post.id)}
              >
                Delete Post
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Related Posts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>More from {post.author?.name}</CardTitle>
            <CardDescription>
              Other posts by this author
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text className="text-muted-foreground">
              Related posts feature coming soon...
            </Text>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
