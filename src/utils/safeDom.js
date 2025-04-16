'use client';

/**
 * Comprehensive utility for safe DOM operations in Next.js and React applications.
 * Prevents "Failed to execute 'removeChild' on 'Node'" errors during route transitions.
 */

/**
 * Apply all DOM safety patches when the app initializes
 * This function monkeypatches native DOM methods to make them safe
 */
export function applyDOMSafetyPatches() {
  if (typeof window === 'undefined') return false; // SSR check
  
  // Flag to track if patches have been applied
  if (window.__DOM_PATCHES_APPLIED__) return true;
  
  try {
    // Keep track of nodes we know have been detached
    const detachedNodes = new WeakSet();
    
    // Store original DOM methods
    const originalRemoveChild = Node.prototype.removeChild;
    const originalAppendChild = Node.prototype.appendChild;
    const originalRemove = Element.prototype.remove;
    
    // Make removeChild safe
    Node.prototype.removeChild = function(child) {
      if (!child) return null;
      
      // If the child is already detached, just return it
      if (detachedNodes.has(child)) {
        return child;
      }
      
      // Only proceed if the child is actually a child of this node
      if (this.contains && this.contains(child)) {
        try {
          const result = originalRemoveChild.call(this, child);
          detachedNodes.add(child);
          return result;
        } catch (e) {
          console.warn('Safe removeChild caught error:', e.message);
          detachedNodes.add(child);
          return child;
        }
      } else {
        // Not a child, just return it
        return child;
      }
    };
    
    // Make appendChild safe
    Node.prototype.appendChild = function(child) {
      if (!child) return null;
      
      try {
        // If the child was detached, remove it from our tracking
        if (detachedNodes.has(child)) {
          detachedNodes.delete(child);
        }
        
        return originalAppendChild.call(this, child);
      } catch (e) {
        console.warn('Safe appendChild caught error:', e.message);
        return child;
      }
    };
    
    // Make Element.remove() safe
    Element.prototype.remove = function() {
      try {
        if (this.parentNode) {
          detachedNodes.add(this);
          return originalRemove.call(this);
        }
      } catch (e) {
        console.warn('Safe remove() caught error:', e.message);
      }
      return undefined;
    };
    
    // Track and clean up timeouts
    const originalSetTimeout = window.setTimeout;
    const activeTimeouts = new Set();
    
    window.setTimeout = function(fn, delay, ...args) {
      const timeoutId = originalSetTimeout(() => {
        activeTimeouts.delete(timeoutId);
        if (typeof fn === 'function') {
          fn(...args);
        } else if (typeof fn === 'string') {
          eval(fn);
        }
      }, delay);
      
      activeTimeouts.add(timeoutId);
      return timeoutId;
    };
    
    // Make clearTimeout safe
    const originalClearTimeout = window.clearTimeout;
    window.clearTimeout = function(id) {
      if (id) {
        activeTimeouts.delete(id);
        return originalClearTimeout(id);
      }
    };
    
    // Clean up on route changes
    const cleanupTimeouts = () => {
      activeTimeouts.forEach(id => {
        originalClearTimeout(id);
      });
      activeTimeouts.clear();
    };
    
    // Listen for navigation events
    window.addEventListener('beforeunload', cleanupTimeouts);
    
    // For Next.js specific events
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          cleanupTimeouts();
        }
      });
    }
    
    // For Next.js App Router
    if (window.navigation) {
      window.navigation.addEventListener('navigate', cleanupTimeouts);
    }
    
    // Add a specific event listener for Nextjs route changes
    if (typeof window !== 'undefined') {
      // Listen for any click on a elements - potential route changes
      document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          // Could be a route change, clean up as a precaution
          cleanupTimeouts();
        }
      });
    }
    
    // Mark as applied
    window.__DOM_PATCHES_APPLIED__ = true;
    
    console.log('DOM safety patches applied successfully');
    return true;
  } catch (e) {
    console.error('Failed to apply DOM safety patches:', e);
    return false;
  }
}

/**
 * Check if a node is safe to manipulate
 */
export function isNodeSafe(node) {
  if (!node) return false;
  
  try {
    return !!(node && node.parentNode && document.contains(node.parentNode));
  } catch (e) {
    return false;
  }
}

/**
 * Safely remove a child with proper checks
 */
export function safeRemoveChild(parent, child) {
  if (!parent || !child) return null;
  
  try {
    if (parent.contains && parent.contains(child)) {
      return parent.removeChild(child);
    }
  } catch (e) {
    console.warn('safeRemoveChild failed:', e.message);
  }
  
  return child;
}

/**
 * Safely append a child with error handling
 */
export function safeAppendChild(parent, child) {
  if (!parent || !child) return null;
  
  try {
    return parent.appendChild(child);
  } catch (e) {
    console.warn('safeAppendChild failed:', e.message);
    return child;
  }
}

/**
 * Initialize all DOM safety features
 */
export function initSafeDOM() {
  if (typeof window === 'undefined') return;
  
  applyDOMSafetyPatches();
  
  console.log('DOM safety initialized');
} 