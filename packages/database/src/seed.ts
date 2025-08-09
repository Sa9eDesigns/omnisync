import { prisma } from './index';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      },
    }),
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        name: 'John Doe',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        role: 'MODERATOR',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create demo posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { id: 'post-1' },
      update: {},
      create: {
        id: 'post-1',
        title: 'Welcome to the Cross-Platform Boilerplate',
        content: `# Welcome!

This is a demo post to showcase the capabilities of our cross-platform boilerplate.

## Features

- 🚀 **Fast Development**: Hot reloading across all platforms
- 🎨 **Modern UI**: Tailwind CSS with universal components
- 📊 **State Management**: Zustand + React Query
- 🗄️ **Database**: Prisma ORM with type safety
- 🧪 **Testing**: Comprehensive test setup
- 🔐 **Authentication**: Built-in auth system

## Getting Started

1. Clone the repository
2. Install dependencies with \`pnpm install\`
3. Start development with \`pnpm dev\`

Happy coding! 🎉`,
        published: true,
        authorId: users[0].id,
      },
    }),
    prisma.post.upsert({
      where: { id: 'post-2' },
      update: {},
      create: {
        id: 'post-2',
        title: 'Building Cross-Platform Apps',
        content: `# Cross-Platform Development

Learn how to build applications that work seamlessly across web, mobile, and desktop platforms.

## Key Benefits

- **Code Reuse**: Share business logic and components
- **Consistent UX**: Unified design system
- **Faster Development**: Single codebase, multiple platforms
- **Easier Maintenance**: One place to fix bugs and add features

## Best Practices

1. Design with mobile-first approach
2. Use responsive layouts
3. Test on all target platforms
4. Optimize for performance
5. Consider platform-specific features

Start building amazing cross-platform apps today!`,
        published: true,
        authorId: users[1].id,
      },
    }),
    prisma.post.upsert({
      where: { id: 'post-3' },
      update: {},
      create: {
        id: 'post-3',
        title: 'Draft: Advanced State Management',
        content: `# Advanced State Management Patterns

This is a draft post about advanced state management techniques...

## Topics to Cover

- Global state vs local state
- Optimistic updates
- Caching strategies
- Real-time synchronization

*This post is still being written...*`,
        published: false,
        authorId: users[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
