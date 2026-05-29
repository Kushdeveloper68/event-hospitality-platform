import React from 'react';
import ErrorBoundary from './ErrorBoundary';

// Wrapper that gives a page-level error message
export default function PageErrorBoundary({ children, pageName }) {
  return (
    <ErrorBoundary
      message={`Failed to load ${pageName || 'this page'}. Please try again or contact support if the issue persists.`}
    >
      {children}
    </ErrorBoundary>
  );
}