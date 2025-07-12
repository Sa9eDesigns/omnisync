import React, { useEffect } from 'react';
import { PlatformView, PlatformText } from './platform/PlatformView';
import { Button } from '@boilerplate/ui-simple';
import { useAuth } from '../hooks/use-auth';

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireRoles?: string[];
  onUnauthorized?: () => void;
  loading?: React.ReactNode;
}

export function AuthGuard({
  children,
  fallback,
  redirectTo,
  requireRoles = [],
  onUnauthorized,
  loading,
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && onUnauthorized) {
      onUnauthorized();
    }
  }, [isLoading, isAuthenticated, onUnauthorized]);

  // Show loading state
  if (isLoading) {
    if (loading) {
      return <>{loading}</>;
    }
    
    return (
      <PlatformView className="flex-1 justify-center items-center p-4">
        <PlatformText className="text-muted-foreground">Loading...</PlatformText>
      </PlatformView>
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <PlatformView className="flex-1 justify-center items-center p-6">
        <PlatformView className="max-w-md w-full text-center">
          <PlatformText className="text-6xl mb-4">🔒</PlatformText>
          <PlatformText className="text-2xl font-bold text-foreground mb-2">
            Authentication Required
          </PlatformText>
          <PlatformText className="text-muted-foreground mb-6">
            You need to sign in to access this content.
          </PlatformText>
          <Button className="w-full" onPress={() => {
            if (redirectTo) {
              // Handle navigation based on platform
              if (typeof window !== 'undefined') {
                window.location.href = redirectTo;
              }
            }
          }}>
            Sign In
          </Button>
        </PlatformView>
      </PlatformView>
    );
  }

  // Check role-based authorization
  if (requireRoles.length > 0 && !requireRoles.includes(user.role)) {
    return (
      <PlatformView className="flex-1 justify-center items-center p-6">
        <PlatformView className="max-w-md w-full text-center">
          <PlatformText className="text-6xl mb-4">⛔</PlatformText>
          <PlatformText className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </PlatformText>
          <PlatformText className="text-muted-foreground mb-6">
            You don't have permission to access this content.
          </PlatformText>
          <Button variant="outline" className="w-full" onPress={() => {
            // Navigate back or to home
            if (typeof window !== 'undefined') {
              window.history.back();
            }
          }}>
            Go Back
          </Button>
        </PlatformView>
      </PlatformView>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
}

// Higher-order component version
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...guardProps}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hook for conditional rendering based on auth state
export function useAuthGuard(requireRoles?: string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAuthorized = isAuthenticated && 
    (!requireRoles || requireRoles.length === 0 || 
     (user && requireRoles.includes(user.role)));

  return {
    isAuthenticated,
    isAuthorized,
    isLoading,
    user,
    canAccess: (roles?: string[]) => {
      if (!isAuthenticated || !user) return false;
      if (!roles || roles.length === 0) return true;
      return roles.includes(user.role);
    },
  };
}

export default AuthGuard;
