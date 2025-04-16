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
    
    // Add unhandled rejection listener without overriding console.error
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
  }
  
  handleUnhandledRejection = (event) => {
    if (
      event.reason && 
      typeof event.reason.message === 'string' && 
      (
        event.reason.message.includes('removeChild') ||
        event.reason.message.includes('appendChild') ||
        event.reason.message.includes('The node to be removed is not a child')
      )
    ) {
      // Prevent the unhandled rejection from propagating
      event.preventDefault();
      console.warn('DOM-related unhandled rejection suppressed:', event.reason.message);
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
      console.warn('DOM error caught by boundary:', error.message);
    }
  }
  
  componentWillUnmount() {
    // Clean up event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
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