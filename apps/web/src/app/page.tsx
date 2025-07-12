'use client';

import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '@boilerplate/ui';
import { useState } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cross-Platform Boilerplate
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern, production-ready foundation for building applications that run on web, mobile, and desktop platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚀 <span>Fast Development</span>
              </CardTitle>
              <CardDescription>
                Hot reloading, TypeScript, and modern tooling for rapid development.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 <span>Modern UI</span>
              </CardTitle>
              <CardDescription>
                Tailwind CSS with universal components that work across platforms.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 <span>State Management</span>
              </CardTitle>
              <CardDescription>
                Zustand and React Query for optimal data flow and caching.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🗄️ <span>Database Ready</span>
              </CardTitle>
              <CardDescription>
                Prisma ORM with type-safe queries and migrations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧪 <span>Testing</span>
              </CardTitle>
              <CardDescription>
                Comprehensive testing setup with Vitest and Testing Library.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔐 <span>Authentication</span>
              </CardTitle>
              <CardDescription>
                Built-in authentication system with JWT and OAuth support.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Try out the UI components and state management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold mb-4">Count: {count}</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCount(count - 1)}
                  disabled={count <= 0}
                >
                  -
                </Button>
                <Button onClick={() => setCount(count + 1)}>
                  +
                </Button>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => setCount(0)}
            >
              Reset
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-muted-foreground">
            Built with ❤️ using React, Next.js, React Native, and Electron
          </p>
        </div>
      </div>
    </div>
  );
}
