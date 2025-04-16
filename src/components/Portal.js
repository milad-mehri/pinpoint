'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { safeAppendChild, safeRemoveChild } from '../utils/safeDom';

/**
 * A component for safely rendering children to a DOM node outside the React tree.
 * This is the React way to append elements to document.body or other containers.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render in the portal
 * @param {string} props.container - CSS selector for container (defaults to 'body')
 * @param {string} props.className - Optional class name for the portal's wrapper div
 * @returns {React.ReactPortal | null} - A React portal or null during SSR
 */
export default function Portal({ 
  children, 
  container = 'body',
  className = ''
}) {
  // For Next.js SSR compatibility
  const [mounted, setMounted] = useState(false);
  
  // Create a div element that will be used as the portal's container
  const [portalNode, setPortalNode] = useState(null);
  
  // Set up the portal after component mounts (for SSR compatibility)
  useEffect(() => {
    // Find the container element where the portal will be rendered
    const targetContainer = document.querySelector(container) || document.body;
    
    // Create the portal's wrapper element
    const node = document.createElement('div');
    if (className) {
      node.className = className;
    }
    
    // Add the wrapper to the container using our safe method
    safeAppendChild(targetContainer, node);
    setPortalNode(node);
    setMounted(true);
    
    // Clean up the portal when the component unmounts
    return () => {
      if (node && targetContainer) {
        safeRemoveChild(targetContainer, node);
      }
    };
  }, [container, className]);
  
  // Only render the portal on the client-side after mounting
  if (!mounted || !portalNode) {
    return null;
  }
  
  // Create the actual React portal with our children
  return createPortal(children, portalNode);
} 