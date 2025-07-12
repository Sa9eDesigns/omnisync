import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button } from '@boilerplate/ui-simple';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  prevResetKeys: Array<string | number>;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      prevResetKeys: props.resetKeys || [],
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    const { resetKeys = [] } = props;
    const { prevResetKeys } = state;

    // Reset error state if resetKeys have changed
    if (
      state.hasError &&
      resetKeys.length > 0 &&
      (resetKeys.length !== prevResetKeys.length ||
        resetKeys.some((key, index) => key !== prevResetKeys[index]))
    ) {
      return {
        hasError: false,
        error: null,
        errorInfo: null,
        prevResetKeys: resetKeys,
      };
    }

    if (resetKeys !== prevResetKeys) {
      return {
        prevResetKeys: resetKeys,
      };
    }

    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View className="flex-1 justify-center items-center p-6 bg-background">
          <View className="max-w-md w-full text-center">
            <Text className="text-6xl mb-4">😵</Text>
            <Text className="text-2xl font-bold text-foreground mb-2">
              Oops! Something went wrong
            </Text>
            <Text className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Please try again.
            </Text>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <View className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <Text className="text-sm font-mono text-destructive mb-2">
                  {this.state.error.name}: {this.state.error.message}
                </Text>
                {this.state.error.stack && (
                  <Text className="text-xs font-mono text-destructive/80">
                    {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                  </Text>
                )}
              </View>
            )}

            <View className="space-y-3">
              <Button onPress={this.handleReset} className="w-full">
                Try Again
              </Button>
              <Button
                variant="outline"
                onPress={() => {
                  // Reload the page/app
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                className="w-full"
              >
                Reload App
              </Button>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error);
    if (errorInfo) {
      console.error('Error info:', errorInfo);
    }

    // In production, send to error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  };
}

export default ErrorBoundary;
