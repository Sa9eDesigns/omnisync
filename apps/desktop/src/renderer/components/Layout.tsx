import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@boilerplate/ui';
import { useAuth } from '@boilerplate/store';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Posts', href: '/posts', icon: '📝' },
  { name: 'Profile', href: '/profile', icon: '👤' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
  { name: 'About', href: '/about', icon: 'ℹ️' },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">
            Cross-Platform App
          </h1>
          <p className="text-sm text-muted-foreground">Desktop Edition</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {user.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User'} 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={logout}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button size="sm" className="w-full">
                Sign In
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Title Bar */}
        <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4 drag-region">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2 no-drag">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {navigation.find(item => item.href === location.pathname)?.name || 'Cross-Platform App'}
          </div>
          <div className="w-16"></div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
