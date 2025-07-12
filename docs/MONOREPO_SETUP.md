# OmniSync Monorepo Setup

This document describes the monorepo structure and setup for the OmniSync project.

## Architecture Overview

OmniSync uses a modern monorepo architecture with the following tools:

- **PNPM Workspaces**: Package management and dependency resolution
- **Turborepo**: Build orchestration, caching, and task running
- **TypeScript**: Type safety across all packages
- **ESLint + Prettier**: Code quality and formatting
- **Changesets**: Version management and changelog generation

## Project Structure

```
omnisync/
├── apps/                    # Applications
│   ├── desktop/            # Electron desktop app
│   ├── mobile/             # React Native/Expo mobile app
│   ├── signaling-server/   # WebSocket signaling server
│   └── web/                # Optional web interface
├── packages/               # Shared packages
│   ├── shared/             # Common types, utilities, constants
│   ├── webrtc-core/        # WebRTC functionality
│   ├── ui/                 # Shared UI components
│   └── config/             # Configuration management
├── tools/                  # Development tools
│   ├── eslint-config/      # Shared ESLint configuration
│   └── tsconfig/           # Shared TypeScript configurations
└── docs/                   # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PNPM 8+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd omnisync
```

2. Install dependencies:
```bash
pnpm install
```

3. Build all packages:
```bash
pnpm build
```

4. Start development:
```bash
pnpm dev
```

## Available Scripts

### Root Level Scripts

- `pnpm build` - Build all packages and apps
- `pnpm dev` - Start all apps in development mode
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Fix linting issues
- `pnpm type-check` - Type check all packages
- `pnpm test` - Run tests across all packages
- `pnpm clean` - Clean all build artifacts
- `pnpm format` - Format code with Prettier

### Package-Specific Scripts

Run scripts in specific packages using the `--filter` flag:

```bash
# Build only the desktop app
pnpm build --filter @omnisync/desktop

# Start only the signaling server
pnpm dev --filter @omnisync/signaling-server

# Test only the shared package
pnpm test --filter @omnisync/shared
```

## Package Dependencies

### Internal Dependencies

- `@omnisync/shared` - Core types and utilities (used by all packages)
- `@omnisync/webrtc-core` - WebRTC functionality (used by apps)
- `@omnisync/ui` - UI components (used by desktop and web apps)
- `@omnisync/config` - Configuration (used by all apps)

### Development Tools

- `@omnisync/eslint-config` - Shared ESLint rules
- `@omnisync/tsconfig` - Shared TypeScript configurations

## TypeScript Configuration

The monorepo uses TypeScript project references for efficient builds:

- `tools/tsconfig/base.json` - Base configuration
- `tools/tsconfig/node.json` - Node.js specific config
- `tools/tsconfig/react.json` - React specific config
- `tools/tsconfig/react-native.json` - React Native specific config

## Build System

Turborepo orchestrates builds with intelligent caching:

- Builds are cached based on input files
- Only changed packages are rebuilt
- Parallel execution where possible
- Remote caching support (can be configured)

## Code Quality

### ESLint Configuration

- Base rules in `@omnisync/eslint-config`
- React-specific rules for UI packages
- React Native rules for mobile app
- TypeScript integration

### Prettier Configuration

- Consistent formatting across all files
- Integrated with ESLint
- Pre-commit hooks (can be added)

## Version Management

Uses Changesets for version management:

1. Create a changeset:
```bash
pnpm changeset
```

2. Version packages:
```bash
pnpm version-packages
```

3. Publish (if public):
```bash
pnpm release
```

## Development Workflow

1. **Make changes** in any package
2. **Run tests** to ensure nothing breaks
3. **Create changeset** if making breaking changes
4. **Build** to verify everything compiles
5. **Commit** changes

## Troubleshooting

### Common Issues

1. **Build failures**: Run `pnpm clean` and `pnpm install`
2. **Type errors**: Ensure all packages are built (`pnpm build`)
3. **Dependency issues**: Check `pnpm-lock.yaml` is up to date

### Cache Issues

Clear Turborepo cache:
```bash
pnpm turbo clean
```

### Dependency Issues

Reinstall all dependencies:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Adding New Packages

1. Create package directory in `packages/` or `apps/`
2. Add `package.json` with proper naming (`@omnisync/package-name`)
3. Add TypeScript configuration extending from `@omnisync/tsconfig`
4. Add ESLint configuration extending from `@omnisync/eslint-config`
5. Update root `tsconfig.json` references
6. Add to workspace in `pnpm-workspace.yaml` (if not using wildcards)

## Performance Tips

- Use `--filter` to work on specific packages
- Leverage Turborepo's caching
- Use TypeScript project references for faster builds
- Keep dependencies minimal and well-organized
