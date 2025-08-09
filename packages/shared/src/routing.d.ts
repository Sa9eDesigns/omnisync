export interface RouteParams {
    [key: string]: string | undefined;
}
export interface NavigationOptions {
    replace?: boolean;
    state?: any;
}
export declare const ROUTES: {
    readonly HOME: "/";
    readonly POSTS: "/posts";
    readonly POST_DETAIL: "/posts/:id";
    readonly PROFILE: "/profile";
    readonly SETTINGS: "/settings";
    readonly ABOUT: "/about";
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly FORGOT_PASSWORD: "/auth/forgot-password";
    };
    readonly MODAL: "/modal";
};
export declare const buildRoute: {
    readonly postDetail: (id: string) => string;
    readonly userProfile: (id: string) => string;
};
export interface NavigationService {
    navigate: (route: string, params?: RouteParams, options?: NavigationOptions) => void;
    goBack: () => void;
    replace: (route: string, params?: RouteParams) => void;
    reset: (route: string, params?: RouteParams) => void;
    canGoBack: () => boolean;
    getCurrentRoute: () => string;
}
export declare class WebNavigationService implements NavigationService {
    private getWindow;
    navigate(route: string, params?: RouteParams, options?: NavigationOptions): void;
    goBack(): void;
    replace(route: string, params?: RouteParams): void;
    reset(route: string, params?: RouteParams): void;
    canGoBack(): boolean;
    getCurrentRoute(): string;
    private buildUrl;
}
export declare function isValidRoute(route: string): boolean;
export declare function extractRouteParams(pattern: string, path: string): RouteParams;
export declare function createDeepLink(route: string, params?: RouteParams): string;
export type RouteGuard = (route: string, params?: RouteParams) => boolean | Promise<boolean>;
export declare const createAuthGuard: (isAuthenticated: () => boolean) => RouteGuard;
export declare function getPlatform(): 'web' | 'mobile' | 'desktop';
export interface RouteAnalytics {
    trackPageView: (route: string, params?: RouteParams) => void;
    trackNavigation: (from: string, to: string) => void;
}
export declare class DefaultRouteAnalytics implements RouteAnalytics {
    trackPageView(route: string, params?: RouteParams): void;
    trackNavigation(from: string, to: string): void;
}
//# sourceMappingURL=routing.d.ts.map