import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardContent, CardTitle, CardDescription } from '@boilerplate/ui';
import { useAuth } from '@boilerplate/store';

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome{isAuthenticated && user ? `, ${user.name}` : ''}! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Cross-Platform Desktop Application
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link to="/posts">
              <Button className="w-full h-12">
                📝 View Posts
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full h-12">
                👤 Profile
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" className="w-full h-12">
                ⚙️ Settings
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="w-full h-12">
                ℹ️ About
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
              <p className="text-3xl font-bold mb-4">Count: {count}</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCount(count - 1)}
                  disabled={count <= 0}
                  className="w-12 h-12"
                >
                  -
                </Button>
                <Button 
                  onClick={() => setCount(count + 1)}
                  className="w-12 h-12"
                >
                  +
                </Button>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => setCount(0)}
            >
              Reset Counter
            </Button>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Desktop application details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Platform:</span> {window.electronAPI?.getPlatform() || 'Unknown'}
              </div>
              <div>
                <span className="font-medium">Version:</span> 1.0.0
              </div>
              <div>
                <span className="font-medium">Environment:</span> Development
              </div>
              <div>
                <span className="font-medium">Renderer:</span> React + Electron
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
