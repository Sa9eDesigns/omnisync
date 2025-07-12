import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components';
import { usePosts } from '@boilerplate/store';

interface PostListScreenProps {
  onPostPress?: (postId: string) => void;
  onCreatePress?: () => void;
  showCreateButton?: boolean;
  title?: string;
  description?: string;
}

export function PostListScreen({
  onPostPress,
  onCreatePress,
  showCreateButton = true,
  title = 'Posts',
  description = 'Discover articles and updates',
}: PostListScreenProps) {
  const { data: posts, isLoading, error, refetch } = usePosts();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-muted-foreground">Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-destructive text-lg font-semibold mb-4">
          Failed to load posts
        </Text>
        <Text className="text-muted-foreground text-center mb-6">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </Text>
        <Button onPress={() => refetch()}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">
            {title}
          </Text>
          <Text className="text-muted-foreground">
            {description}
          </Text>
        </View>

        {/* Create Post Button */}
        {showCreateButton && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Button className="w-full" onPress={onCreatePress}>
                Create New Post
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <View className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Pressable
                key={post.id}
                onPress={() => onPostPress?.(post.id)}
              >
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {post.title}
                    </CardTitle>
                    <CardDescription>
                      {post.content 
                        ? post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')
                        : 'No content available'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm text-muted-foreground">
                        {post.author?.name || 'Unknown Author'}
                      </Text>
                      <View className="flex-row items-center">
                        <View className={`w-2 h-2 rounded-full mr-2 ${
                          post.published ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <Text className="text-sm text-muted-foreground">
                          {post.published ? 'Published' : 'Draft'}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs text-muted-foreground mt-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Text>
                  </CardContent>
                </Card>
              </Pressable>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Text className="text-muted-foreground text-lg mb-4">
                  No posts found
                </Text>
                <Text className="text-muted-foreground mb-6">
                  Be the first to create a post!
                </Text>
                {showCreateButton && (
                  <Button onPress={onCreatePress}>
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </View>

        {/* Load More */}
        {posts && posts.length > 0 && (
          <View className="mt-6">
            <Button variant="outline" className="w-full">
              Load More Posts
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
