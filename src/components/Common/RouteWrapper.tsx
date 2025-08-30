/**
 * Route wrapper component that handles lazy loading of translation namespaces
 * and provides error boundaries for translation failures
 */

import React, { useEffect, useState, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyRouteNamespaces } from '../../lib/i18n';

interface RouteWrapperProps {
  children: React.ReactNode;
}

interface TranslationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary specifically for translation failures
 */
class TranslationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  TranslationErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TranslationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Translation error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Translation Error
            </h2>
            <p className="text-gray-600 mb-4">
              There was an error loading the translations for this page. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Loading component for namespace loading
 */
const NamespaceLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { ready } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const verifyNamespaces = () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // Since all namespaces are loaded synchronously, just verify they're available
        const isVerified = verifyRouteNamespaces(location.pathname);
        
        if (!isVerified) {
          console.warn(`Some namespaces for route ${location.pathname} may not be loaded`);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to verify route namespaces:', error);
        setLoadError(error instanceof Error ? error.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    verifyNamespaces();
  }, [location.pathname]);

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Error
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load translations: {loadError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading translations...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Main route wrapper component
 */
const RouteWrapper: React.FC<RouteWrapperProps> = ({ children }) => {
  return (
    <TranslationErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <NamespaceLoader>
          {children}
        </NamespaceLoader>
      </Suspense>
    </TranslationErrorBoundary>
  );
};

export default RouteWrapper;