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
    return prisma.post.create({
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
  },

  update: async (id: string, data: Prisma.PostUpdateInput): Promise<Post> => {
    return prisma.post.update({
      where: { id },
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
  },

  delete: async (id: string): Promise<Post> => {
    return prisma.post.delete({
      where: { id },
    });
  },

  publish: async (id: string): Promise<Post> => {
    return prisma.post.update({
      where: { id },
      data: { published: true },
    });
  },

  unpublish: async (id: string): Promise<Post> => {
    return prisma.post.update({
      where: { id },
      data: { published: false },
    });
  },
};
