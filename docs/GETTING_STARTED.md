# Getting Started

This guide will help you get up and running with the Cross-Platform Boilerplate.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PNPM** (v8 or higher)
- **Git**

For mobile development:
- **Expo CLI** (`npm install -g @expo/cli`)

For desktop development:
- Platform-specific build tools (see Electron documentation)

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd cross-platform-boilerplate
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Initialize the database:**
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. **Start development servers:**
   ```bash
   # Start all apps
   pnpm dev

   # Or start individual apps
   pnpm dev --filter @boilerplate/web
   pnpm dev --filter @boilerplate/mobile
   pnpm dev --filter @boilerplate/desktop
   pnpm dev --filter @boilerplate/backend
   ```

## Project Structure

```
cross-platform-boilerplate/
├── apps/
│   ├── web/                # Next.js web application
│   ├── mobile/             # React Native/Expo mobile app
│   ├── desktop/            # Electron desktop application
│   └── backend/            # Node.js/Express API server
├── packages/
│   ├── shared/             # Shared utilities and types
│   ├── ui/                 # Universal UI components
│   ├── config/             # Configuration management
│   ├── database/           # Database layer with Prisma
│   └── store/              # State management
├── tools/
│   ├── eslint-config/      # Shared ESLint configuration
│   └── tsconfig/           # Shared TypeScript configurations
├── docs/                   # Documentation
└── test/                   # Test configuration
```

## Development Workflow

### Building Packages

Build all packages:
```bash
pnpm build
```

Build specific packages:
```bash
pnpm build --filter @boilerplate/shared
pnpm build --filter @boilerplate/ui
```

### Running Tests

Run all tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run tests with UI:
```bash
pnpm test:ui
```

### Linting and Formatting

Lint all packages:
```bash
pnpm lint
```

Fix linting issues:
```bash
pnpm lint:fix
```

Format code:
```bash
pnpm format
```

### Type Checking

Check types across all packages:
```bash
pnpm type-check
```

## Database Management

The boilerplate uses Prisma as the ORM. Here are common database commands:

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes to database
pnpm db:push

# Create and run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed the database
pnpm db:seed
```

## Environment Configuration

Create environment files for each app:

### Web App (.env.local)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
PORT=3001
```

### Mobile App (.env)
```env
EXPO_PUBLIC_API_URL="http://localhost:3001"
```

## Customization

### Renaming the Boilerplate

1. Update package names in all `package.json` files
2. Update import paths in TypeScript files
3. Update workspace references in `pnpm-workspace.yaml`
4. Update documentation and README files

### Adding New Packages

1. Create a new directory in `packages/` or `apps/`
2. Add a `package.json` with proper naming convention
3. Add TypeScript configuration extending from shared configs
4. Add ESLint configuration
5. Update workspace references

### Styling and Theming

The UI package uses Tailwind CSS with a custom design system. To customize:

1. Edit `packages/ui/tailwind.config.js`
2. Modify CSS variables in `packages/ui/src/styles/globals.css`
3. Update theme constants in `packages/shared/src/constants.ts`

## Deployment

### Web App (Vercel)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Desktop App

Build for all platforms:
```bash
pnpm build --filter @boilerplate/desktop
pnpm package --filter @boilerplate/desktop
```

### Mobile App

Build for Expo:
```bash
cd apps/mobile
expo build:android
expo build:ios
```

### Backend API

Deploy to your preferred platform (Railway, Render, etc.):
```bash
pnpm build --filter @boilerplate/backend
```

## Troubleshooting

### Common Issues

1. **PNPM installation fails:**
   - Clear PNPM cache: `pnpm store prune`
   - Delete `node_modules` and reinstall

2. **TypeScript errors:**
   - Ensure all packages are built: `pnpm build`
   - Check TypeScript configuration inheritance

3. **Database connection issues:**
   - Verify DATABASE_URL in environment files
   - Run `pnpm db:generate` after schema changes

4. **Mobile app not starting:**
   - Ensure Expo CLI is installed globally
   - Clear Expo cache: `expo start -c`

### Getting Help

- Check the [documentation](./README.md)
- Review [examples](./examples/)
- Open an issue on GitHub
- Join our Discord community

## Next Steps

- Read the [Architecture Guide](./ARCHITECTURE.md)
- Explore [UI Components](../packages/ui/README.md)
- Learn about [State Management](../packages/store/README.md)
- Check out [Deployment Guide](./DEPLOYMENT.md)
