#!/bin/bash

# OmniSync Monorepo Setup Script
# This script sets up the development environment for the OmniSync project

set -e

echo "🚀 Setting up OmniSync Monorepo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PNPM is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing PNPM..."
    npm install -g pnpm@latest
else
    echo "✅ PNPM $(pnpm -v) detected"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build all packages
echo "🔨 Building all packages..."
pnpm build

# Run type checking
echo "🔍 Running type checks..."
pnpm type-check

# Run linting
echo "🧹 Running linting..."
pnpm lint

echo ""
echo "🎉 Setup complete! You can now:"
echo "  • Start development: pnpm dev"
echo "  • Build all packages: pnpm build"
echo "  • Run tests: pnpm test"
echo "  • Format code: pnpm format"
echo ""
echo "📚 See docs/MONOREPO_SETUP.md for more information"
