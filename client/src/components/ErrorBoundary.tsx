import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: React.ReactNode;
  fallback?: (error?: Error, resetError?: () => void) => React.ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // This would send to your error tracking service
      console.error('Production error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.handleReset)
      ) : (
        <DefaultErrorFallback 
          error={this.state.error} 
          resetError={this.handleReset}
          context={this.props.context}
        />
      );
    }

    return this.props.children;
  }
}

// Specific error fallbacks for different sections
function DefaultErrorFallback({ 
  error, 
  resetError, 
  context 
}: { 
  error?: Error; 
  resetError: () => void;
  context?: string;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 m-4">
      <div className="flex items-center space-x-3 mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-red-800">
          {context ? `${context} Error` : 'Something went wrong'}
        </h3>
      </div>
      
      <p className="text-red-700 mb-4">
        {error?.message || 'An unexpected error occurred in this section.'}
      </p>
      
      <div className="flex space-x-3">
        <Button onClick={resetError} variant="outline">
          Try Again
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Reload Page
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && error?.stack && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-red-600">
            Error Details (Development)
          </summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

// Specific error boundary components
export function CatalogErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      context="Frame Catalog"
      fallback={(error, reset) => (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-amber-800">Frame Catalog Unavailable</h3>
          </div>
          <p className="text-amber-700 mb-4">
            The frame catalog couldn't load. You can still use manual frame entry or try refreshing.
          </p>
          <div className="flex space-x-3">
            <Button onClick={reset} variant="outline">Retry Catalog</Button>
            <Button onClick={() => window.location.href = '/pos-system?mode=manual'} variant="outline">
              Use Manual Entry
            </Button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function PricingErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      context="Pricing Engine"
      fallback={(error, reset) => (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-800">Pricing Calculation Error</h3>
          </div>
          <p className="text-red-700 mb-4">
            Price calculation failed. Manual pricing entry is available.
          </p>
          <div className="flex space-x-3">
            <Button onClick={reset} variant="outline">Retry Calculation</Button>
            <Button onClick={() => {/* Enable manual pricing mode */}} variant="outline">
              Manual Pricing
            </Button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function InventoryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      context="Inventory System"
      fallback={(error, reset) => (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-800">Inventory System Error</h3>
          </div>
          <p className="text-blue-700 mb-4">
            Inventory tracking is temporarily unavailable. Orders can still be processed.
          </p>
          <div className="flex space-x-3">
            <Button onClick={reset} variant="outline">Retry Inventory</Button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;