import { prisma } from './index';
import type { User, Post } from '@prisma/client';

// User queries
export const userQueries = {
  findById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findMany: async (skip = 0, take = 10) => {
    return prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  },

  count: async (): Promise<number> => {
    return prisma.user.count();
  },
};

// Post queries
export const postQueries = {
  findById: async (id: string): Promise<Post | null> => {
    return prisma.post.findUnique({
      where: { id },
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

  findMany: async (skip = 0, take = 10, published = true) => {
    return prisma.post.findMany({
      where: { published },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
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

  findByAuthor: async (authorId: string, skip = 0, take = 10) => {
    return prisma.post.findMany({
      where: { authorId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  },

  count: async (published = true): Promise<number> => {
    return prisma.post.count({
      where: { published },
    });
  },

  search: async (query: string, skip = 0, take = 10) => {
    return prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
        published: true,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
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
};
