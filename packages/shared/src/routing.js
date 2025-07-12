// Common routing utilities and types for cross-platform navigation
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
};
// Route parameter builders
export const buildRoute = {
    postDetail: (id) => `/posts/${id}`,
    userProfile: (id) => `/profile/${id}`,
};
// Platform-specific navigation implementations
export class WebNavigationService {
    getWindow() {
        return typeof window !== 'undefined' ? window : null;
    }
    navigate(route, params, options) {
        const win = this.getWindow();
        if (win) {
            const url = this.buildUrl(route, params);
            if (options?.replace) {
                win.history.replaceState(options.state, '', url);
            }
            else {
                win.history.pushState(options?.state, '', url);
            }
        }
    }
    goBack() {
        const win = this.getWindow();
        if (win) {
            win.history.back();
        }
    }
    replace(route, params) {
        const win = this.getWindow();
        if (win) {
            const url = this.buildUrl(route, params);
            win.history.replaceState(null, '', url);
        }
    }
    reset(route, params) {
        const win = this.getWindow();
        if (win) {
            const url = this.buildUrl(route, params);
            win.history.replaceState(null, '', url);
        }
    }
    canGoBack() {
        const win = this.getWindow();
        return win ? win.history.length > 1 : false;
    }
    getCurrentRoute() {
        const win = this.getWindow();
        return win ? win.location.pathname : '/';
    }
    buildUrl(route, params) {
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
export function isValidRoute(route) {
    const allRoutes = Object.values(ROUTES).flat();
    return allRoutes.includes(route);
}
export function extractRouteParams(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    const params = {};
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
export function createDeepLink(route, params) {
    let link = route;
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            link = link.replace(`:${key}`, value || '');
        });
    }
    return link;
}
export const createAuthGuard = (isAuthenticated) => {
    return (route) => {
        const protectedRoutes = [ROUTES.PROFILE, ROUTES.SETTINGS];
        if (protectedRoutes.includes(route)) {
            return isAuthenticated();
        }
        return true;
    };
};
// Platform detection for routing
export function getPlatform() {
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
export class DefaultRouteAnalytics {
    trackPageView(route, params) {
        console.log('Page view:', route, params);
    }
    trackNavigation(from, to) {
        console.log('Navigation:', from, '->', to);
    }
}
//# sourceMappingURL=routing.js.map