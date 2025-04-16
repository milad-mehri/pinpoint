'use client';

import { Component } from 'react';

/**
 * Error boundary component specifically designed to catch and handle DOM-related errors
 * such as 'Failed to execute removeChild on Node'
 */
export default class DOMErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    
    // Globally handle removeChild errors
    this.handleGlobalErrors();
  }
  
  handleGlobalErrors() {
    if (typeof window !== 'undefined') {
      // Store original console.error
      const originalConsoleError = console.error;
      
      // Override console.error to catch and handle DOM errors
      console.error = (...args) => {
        // Check if this is a DOM-related error we want to catch
        const errorMessage = args.join(' ');
        if (
          errorMessage.includes('removeChild') ||
          errorMessage.includes('appendChild') ||
          errorMessage.includes('The node to be removed is not a child')
        ) {
          // Prevent the error from propagating
          console.warn('DOM operation error caught and handled:', errorMessage);
          return;
        }
        
        // Pass other errors to the original console.error
        originalConsoleError.apply(console, args);
      };
      
      // Also intercept unhandled promise rejections related to DOM
      window.addEventListener('unhandledrejection', (event) => {
        if (
          event.reason && 
          typeof event.reason.message === 'string' && 
          (
            event.reason.message.includes('removeChild') ||
            event.reason.message.includes('appendChild') ||
            event.reason.message.includes('The node to be removed is not a child')
          )
        ) {
          event.preventDefault();
          console.warn('Unhandled Promise rejection (DOM error) caught:', event.reason);
        }
      });
    }
  }

  static getDerivedStateFromError(error) {
    // Only handle DOM-related errors, let others propagate
    if (
      error && 
      typeof error.message === 'string' && 
      (
        error.message.includes('removeChild') ||
        error.message.includes('appendChild') ||
        error.message.includes('The node to be removed is not a child')
      )
    ) {
      return { hasError: true, error };
    }
    
    // Rethrow other errors
    throw error;
  }

  componentDidCatch(error, errorInfo) {
    // Only log DOM-related errors
    if (
      error && 
      typeof error.message === 'string' && 
      (
        error.message.includes('removeChild') ||
        error.message.includes('appendChild') ||
        error.message.includes('The node to be removed is not a child')
      )
    ) {
      console.warn('DOM error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // For DOM errors, just render the children anyway as the error is usually non-fatal
      return this.props.children;
    }

    return this.props.children;
  }
} 