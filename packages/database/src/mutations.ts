import { prisma } from './index';
import type { User, Post, Prisma } from '@prisma/client';

// User mutations
export const userMutations = {
  create: async (data: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({
      data,
    });
  },

  update: async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string): Promise<User> => {
    return prisma.user.delete({
      where: { id },
    });
  },

  upsert: async (
    email: string,
    createData: Prisma.UserCreateInput,
    updateData: Prisma.UserUpdateInput
  ): Promise<User> => {
    return prisma.user.upsert({
      where: { email },
      create: createData,
      update: updateData,
    });
  },
};

// Post mutations
export const postMutations = {
  create: async (data: Prisma.PostCreateInput): Promise<Post> => {
    try {
      return await prisma.post.create({
        data,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Failed to create post:', error);
      throw new Error('Failed to create post');
    }
  },

  update: async (id: string, data: Prisma.PostUpdateInput): Promise<Post> => {
    try {
      return await prisma.post.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Failed to update post:', error);
      throw new Error('Failed to update post');
    }
  },

  delete: async (id: string): Promise<Post> => {
    try {
      return await prisma.post.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw new Error('Failed to delete post');
    }
  },

  publish: async (id: string): Promise<Post> => {
    try {
      return await prisma.post.update({
        where: { id },
        data: {
          published: true,
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Failed to publish post:', error);
      throw new Error('Failed to publish post');
    }
  },

  unpublish: async (id: string): Promise<Post> => {
    try {
      return await prisma.post.update({
        where: { id },
        data: {
          published: false,
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Failed to unpublish post:', error);
      throw new Error('Failed to unpublish post');
    }
  },

  bulkDelete: async (ids: string[]): Promise<{ count: number }> => {
    try {
      return await prisma.post.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (error) {
      console.error('Failed to bulk delete posts:', error);
      throw new Error('Failed to bulk delete posts');
    }
  },

  bulkPublish: async (ids: string[]): Promise<{ count: number }> => {
    try {
      return await prisma.post.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          published: true,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to bulk publish posts:', error);
      throw new Error('Failed to bulk publish posts');
    }
  },

  bulkUnpublish: async (ids: string[]): Promise<{ count: number }> => {
    try {
      return await prisma.post.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          published: false,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to bulk unpublish posts:', error);
      throw new Error('Failed to bulk unpublish posts');
    }
  },
};
