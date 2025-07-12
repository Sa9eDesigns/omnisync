// Common routing utilities and types for cross-platform navigation

export interface RouteParams {
  [key: string]: string | undefined;
}

export interface NavigationOptions {
  replace?: boolean;
  state?: any;
}

// Common route definitions
export const ROUTES = {
  HOME: '/',
  POSTS: '/posts',
  POST_DETAIL: '/posts/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ABOUT: '/about',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  MODAL: '/modal',
} as const;

// Route parameter builders
export const buildRoute = {
  postDetail: (id: string) => `/posts/${id}`,
  userProfile: (id: string) => `/profile/${id}`,
} as const;

// Navigation interface for cross-platform compatibility
export interface NavigationService {
  navigate: (route: string, params?: RouteParams, options?: NavigationOptions) => void;
  goBack: () => void;
  replace: (route: string, params?: RouteParams) => void;
  reset: (route: string, params?: RouteParams) => void;
  canGoBack: () => boolean;
  getCurrentRoute: () => string;
}

// Platform-specific navigation implementations
export class WebNavigationService implements NavigationService {
  private getWindow(): Window | null {
    return typeof window !== 'undefined' ? window : null;
  }

  navigate(route: string, params?: RouteParams, options?: NavigationOptions): void {
    const win = this.getWindow();
    if (win) {
      const url = this.buildUrl(route, params);
      if (options?.replace) {
        win.history.replaceState(options.state, '', url);
      } else {
        win.history.pushState(options?.state, '', url);
      }
    }
  }

  goBack(): void {
    const win = this.getWindow();
    if (win) {
      win.history.back();
    }
  }

  replace(route: string, params?: RouteParams): void {
    const win = this.getWindow();
    if (win) {
      const url = this.buildUrl(route, params);
      win.history.replaceState(null, '', url);
    }
  }

  reset(route: string, params?: RouteParams): void {
    const win = this.getWindow();
    if (win) {
      const url = this.buildUrl(route, params);
      win.history.replaceState(null, '', url);
    }
  }

  canGoBack(): boolean {
    const win = this.getWindow();
    return win ? win.history.length > 1 : false;
  }

  getCurrentRoute(): string {
    const win = this.getWindow();
    return win ? win.location.pathname : '/';
  }

  private buildUrl(route: string, params?: RouteParams): string {
    let url = route;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value || '');
      });
    }
    return url;
  }
}

// Route validation utilities
export function isValidRoute(route: string): boolean {
  const allRoutes = Object.values(ROUTES).flat();
  return allRoutes.includes(route as any);
}

export function extractRouteParams(pattern: string, path: string): RouteParams {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  const params: RouteParams = {};

  if (patternParts.length !== pathParts.length) {
    return params;
  }

  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[index];
    }
  });

  return params;
}

// Deep linking utilities
export function createDeepLink(route: string, params?: RouteParams): string {
  let link = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      link = link.replace(`:${key}`, value || '');
    });
  }
  return link;
}

// Route guards
export type RouteGuard = (route: string, params?: RouteParams) => boolean | Promise<boolean>;

export const createAuthGuard = (isAuthenticated: () => boolean): RouteGuard => {
  return (route: string) => {
    const protectedRoutes = [ROUTES.PROFILE, ROUTES.SETTINGS];
    if (protectedRoutes.includes(route as any)) {
      return isAuthenticated();
    }
    return true;
  };
};

// Platform detection for routing
export function getPlatform(): 'web' | 'mobile' | 'desktop' {
  if (typeof window !== 'undefined') {
    // Check if running in Electron
    if ('electronAPI' in window) {
      return 'desktop';
    }
    // Check if running in React Native WebView or mobile browser
    if (typeof navigator !== 'undefined' && (navigator.userAgent.includes('Mobile') || navigator.userAgent.includes('Android'))) {
      return 'mobile';
    }
    return 'web';
  }
  return 'web';
}

// Route analytics
export interface RouteAnalytics {
  trackPageView: (route: string, params?: RouteParams) => void;
  trackNavigation: (from: string, to: string) => void;
}

export class DefaultRouteAnalytics implements RouteAnalytics {
  trackPageView(route: string, params?: RouteParams): void {
    console.log('Page view:', route, params);
  }

  trackNavigation(from: string, to: string): void {
    console.log('Navigation:', from, '->', to);
  }
}
