import React from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { PostDetailScreen } from '@boilerplate/ui/screens/PostDetailScreen';
import { usePost } from '@boilerplate/store';

export default function PostDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post } = usePost(id!);

  const handleEditPress = (postId: string) => {
    console.log('Edit post:', postId);
  };

  const handleDeletePress = (postId: string) => {
    console.log('Delete post:', postId);
  };

  const handleSharePress = (postId: string) => {
    console.log('Share post:', postId);
  };

  const handleAuthorPress = (authorId: string) => {
    console.log('View author:', authorId);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: post?.title && post.title.length > 30
            ? post.title.substring(0, 30) + '...'
            : post?.title || 'Post Details'
        }}
      />
      <PostDetailScreen
        postId={id!}
        onEditPress={handleEditPress}
        onDeletePress={handleDeletePress}
        onSharePress={handleSharePress}
        onAuthorPress={handleAuthorPress}
      />
    </>
  );
}
