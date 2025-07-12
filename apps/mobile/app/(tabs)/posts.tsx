import React from 'react';
import { router } from 'expo-router';
import { PostListScreen } from '@boilerplate/ui/screens/PostListScreen';

export default function PostsScreen() {
  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleCreatePress = () => {
    // Navigate to create post screen
    console.log('Create post pressed');
  };

  return (
    <PostListScreen
      onPostPress={handlePostPress}
      onCreatePress={handleCreatePress}
      title="Posts"
      description="Discover articles and updates"
    />
  );
}
