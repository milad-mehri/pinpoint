'use client';

import { useEffect } from 'react';
import { initSafeDOM } from '../utils/safeDom';

/**
 * Component that applies DOM safety patches at the application level.
 * This should be included once, at the root of your application.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode} - The children wrapped with safety patches
 */
export default function DOMSafetyProvider({ children }) {
  useEffect(() => {
    // Apply all the DOM safety features
    initSafeDOM();
  }, []);

  return children;
} 