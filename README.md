# Cross-Platform Boilerplate

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

A modern, production-ready cross-platform monorepo boilerplate for building applications that run on web, mobile, and desktop platforms with shared code and consistent tooling.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd cross-platform-boilerplate

# Install dependencies
pnpm install

# Start development (all apps)
pnpm dev

# Or start individual apps
pnpm dev --filter @boilerplate/desktop
pnpm dev --filter @boilerplate/mobile
pnpm dev --filter @boilerplate/backend
```

## 📁 Monorepo Structure

This project uses a modern monorepo architecture with PNPM workspaces and Turborepo:

```
cross-platform-boilerplate/
├── apps/
│   ├── desktop/            # Electron desktop app template
│   ├── mobile/             # React Native/Expo mobile app template
│   └── backend/            # Node.js/Express API server template
├── packages/
│   ├── shared/             # Common types & utilities
│   ├── ui/                 # Shared UI components (web + native)
│   └── config/             # Configuration management
└── tools/                  # Development tools & configs
    ├── eslint-config/      # Shared ESLint rules
    └── tsconfig/           # Shared TypeScript configurations
```

## 🛠️ Technology Stack

- **Frontend**: React, React Native, Electron
- **Backend**: Node.js, Express
- **UI**: Universal component system (web + native)
- **Build**: Turborepo, TypeScript, Vite
- **Package Management**: PNPM Workspaces
- **Code Quality**: ESLint, Prettier, Changesets
- **Testing**: Vitest, Jest (React Native)

## 📱 Applications

### Desktop App (Electron)
- Cross-platform desktop application template
- React-based UI with native system integration
- Ready for Windows, macOS, and Linux deployment

### Mobile App (React Native/Expo)
- Universal mobile application template
- Expo-managed workflow for easy development
- iOS and Android support with shared codebase

### Backend API (Node.js/Express)
- RESTful API server template
- Express.js with TypeScript
- Ready for database integration and deployment

## 🎯 Key Features

- **Cross-Platform**: Single codebase for web, mobile, and desktop
- **Type Safety**: Full TypeScript support across all platforms
- **Shared Components**: Universal UI components for web and native
- **Modern Tooling**: Turborepo, PNPM workspaces, and hot reloading
- **Production Ready**: ESLint, Prettier, testing, and build optimization
- **Scalable Architecture**: Monorepo structure for easy maintenance

## 🏗️ Architecture Overview

This boilerplate follows a **monorepo architecture** with shared packages and platform-specific applications. The structure promotes code reuse while maintaining platform-specific optimizations:

- **Shared Packages**: Common utilities, types, and UI components
- **Platform Apps**: Specialized applications for desktop, mobile, and backend
- **Universal Components**: UI components that work across web and React Native
- **Type Safety**: End-to-end TypeScript with shared type definitions
- **Build System**: Turborepo for efficient builds and caching

## 📦 Package Structure

### `@boilerplate/shared`
Common utilities, types, and constants used across all applications:
- Type definitions and interfaces
- Utility functions and helpers
- Validation schemas (Zod)
- Constants and enums

### `@boilerplate/ui`
Universal UI component library that works on both web and React Native:
- Cross-platform components (Button, Input, Card, etc.)
- Platform-specific implementations
- Consistent design system
- Responsive utilities

### `@boilerplate/config`
Centralized configuration management:
- Environment variables
- Build configurations
- Feature flags
- API endpoints

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PNPM 8+
- For mobile development: Expo CLI
- For desktop development: Electron dependencies

### Development Workflow

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build shared packages:**
   ```bash
   pnpm build --filter @boilerplate/shared
   pnpm build --filter @boilerplate/config
   pnpm build --filter @boilerplate/ui
   ```

3. **Start development servers:**
   ```bash
   # All apps
   pnpm dev
   
   # Individual apps
   pnpm dev --filter @boilerplate/desktop
   pnpm dev --filter @boilerplate/mobile
   pnpm dev --filter @boilerplate/backend
   ```

## 🧪 Testing

Run tests across all packages:
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm test --filter @boilerplate/shared
```

## 🏗️ Building

Build all packages and applications:
```bash
# Build all
pnpm build

# Build specific package
pnpm build --filter @boilerplate/desktop
```

## 📝 Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Fix linting issues
- `pnpm type-check` - Type check all packages
- `pnpm test` - Run tests across all packages
- `pnpm clean` - Clean all build artifacts
- `pnpm format` - Format code with Prettier

## 🔧 Customization

### Adding New Packages
1. Create package directory in `packages/` or `apps/`
2. Add `package.json` with proper naming (`@boilerplate/package-name`)
3. Add TypeScript configuration extending from `@boilerplate/tsconfig`
4. Add ESLint configuration extending from `@boilerplate/eslint-config`

### Renaming the Boilerplate
1. Update package names in all `package.json` files
2. Update import paths in TypeScript files
3. Update workspace references
4. Update documentation

## 📚 Documentation

- [Monorepo Setup Guide](./docs/MONOREPO_SETUP.md)
- [UI Component Library](./packages/ui/README.md)
- [Development Workflow](./docs/DEVELOPMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Turborepo](https://turbo.build/) for the monorepo build system
- [PNPM](https://pnpm.io/) for efficient package management
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [React](https://reactjs.org/) and [React Native](https://reactnative.dev/) for UI frameworks
- [Electron](https://www.electronjs.org/) for desktop applications
