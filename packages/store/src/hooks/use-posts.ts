import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query-client';
import { postQueries, postMutations } from '@boilerplate/database';
import type { CreatePostInput, UpdatePostInput } from '@boilerplate/database';

export const usePosts = (skip = 0, take = 10, published = true) => {
  return useQuery({
    queryKey: queryKeys.posts(),
    queryFn: () => postQueries.findMany(skip, take, published),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: queryKeys.post(id),
    queryFn: () => postQueries.findById(id),
    enabled: !!id,
  });
};

export const usePostsByAuthor = (authorId: string, skip = 0, take = 10) => {
  return useQuery({
    queryKey: queryKeys.postsByAuthor(authorId),
    queryFn: () => postQueries.findByAuthor(authorId, skip, take),
    enabled: !!authorId,
  });
};

export const useSearchPosts = (query: string, skip = 0, take = 10) => {
  return useQuery({
    queryKey: queryKeys.postsSearch(query),
    queryFn: () => postQueries.search(query, skip, take),
    enabled: !!query && query.length > 2,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostInput) => postMutations.create(data),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) =>
      postMutations.update(id, data),
    onSuccess: (updatedPost) => {
      // Update the specific post in cache
      queryClient.setQueryData(queryKeys.post(updatedPost.id), updatedPost);
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postMutations.delete(id),
    onSuccess: (deletedPost) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.post(deletedPost.id) });
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postMutations.publish(id),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(queryKeys.post(updatedPost.id), updatedPost);
      queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    },
  });
};

export const useUnpublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postMutations.unpublish(id),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(queryKeys.post(updatedPost.id), updatedPost);
      queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    },
  });
};
