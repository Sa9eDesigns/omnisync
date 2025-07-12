import type { User, Post } from '@prisma/client';

// Extended types with relations
export type UserWithPosts = User & {
  posts: Post[];
};

export type PostWithAuthor = Post & {
  author: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
};

// Input types for API
export interface CreateUserInput {
  email: string;
  name?: string;
  avatar?: string;
}

export interface UpdateUserInput {
  name?: string;
  avatar?: string;
}

export interface CreatePostInput {
  title: string;
  content?: string;
  authorId: string;
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
}

// Query options
export interface PaginationOptions {
  skip?: number;
  take?: number;
}

export interface SearchOptions extends PaginationOptions {
  query: string;
}

// Database connection options
export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  connectionTimeout?: number;
}
