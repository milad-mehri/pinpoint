'use client';

import { useRef, useEffect } from 'react';

/**
 * A hook for safely managing DOM operations (append/remove) even during route changes.
 * Ensures proper cleanup when component unmounts.
 */
export default function useSafeDOM() {
  // Keep track of all elements we've added to the DOM
  const elementsRef = useRef(new Set());
  // Track active timeouts
  const timeoutsRef = useRef(new Set());

  /**
   * Safely append an element to a parent node (defaults to document.body)
   * @param {HTMLElement} element - The element to append
   * @param {HTMLElement} parent - Parent element (defaults to document.body)
   * @returns {HTMLElement} - The appended element
   */
  const appendChild = (element, parent = document.body) => {
    if (!element || !parent) return null;
    
    parent.appendChild(element);
    elementsRef.current.add({ element, parent });
    
    return element;
  };

  /**
   * Safely remove an element from its parent
   * @param {HTMLElement} element - The element to remove
   * @param {HTMLElement} parent - Parent element (defaults to document.body)
   * @returns {boolean} - Whether the removal was successful
   */
  const removeChild = (element, parent = document.body) => {
    if (!element) return false;
    
    // Use the specific parent if provided, otherwise check if element has a parent
    const actualParent = parent || element.parentNode;
    
    if (element && actualParent && actualParent.contains(element)) {
      actualParent.removeChild(element);
      elementsRef.current.delete({ element, parent: actualParent });
      return true;
    }
    
    return false;
  };

  /**
   * Creates a timeout that is automatically cleared on component unmount
   * @param {Function} callback - The function to execute
   * @param {number} delay - Delay in milliseconds
   * @returns {number} - Timeout ID
   */
  const setTimeout = (callback, delay) => {
    if (typeof callback !== 'function') return null;
    
    const timeoutId = window.setTimeout(() => {
      callback();
      timeoutsRef.current.delete(timeoutId);
    }, delay);
    
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  };

  /**
   * Clears a timeout and removes it from tracking
   * @param {number} timeoutId - The timeout ID to clear
   */
  const clearTimeout = (timeoutId) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(timeoutId);
    }
  };

  /**
   * Create a temp DOM element for copy/paste or other transient needs
   * @param {string} tagName - The HTML tag to create
   * @param {Object} props - Element properties
   * @returns {HTMLElement} - The created element
   */
  const createTempElement = (tagName = 'div', props = {}) => {
    const element = document.createElement(tagName);
    
    // Apply properties to the element
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key === 'className') {
        element.className = value;
      } else {
        element[key] = value;
      }
    });
    
    return element;
  };

  /**
   * Copy text to clipboard with fallback for browsers without clipboard API
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} - Whether copy was successful
   */
  const copyToClipboard = async (text) => {
    // Try to use the Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("Clipboard API failed:", err);
        // Fall back to manual method
      }
    }
    
    // Fallback method
    try {
      const textArea = createTempElement('textarea', {
        value: text,
        style: {
          position: 'fixed',
          left: '-9999px',
          top: '0'
        }
      });
      
      appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      removeChild(textArea);
      
      return successful;
    } catch (err) {
      console.error("Fallback clipboard method failed:", err);
      return false;
    }
  };

  // Clean up all elements and timeouts when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any elements left in the DOM
      elementsRef.current.forEach(({ element, parent }) => {
        if (element && parent && parent.contains(element)) {
          parent.removeChild(element);
        }
      });
      
      // Clear all tracked timeouts
      timeoutsRef.current.forEach(id => {
        window.clearTimeout(id);
      });
    };
  }, []);

  return {
    appendChild,
    removeChild,
    setTimeout,
    clearTimeout,
    createTempElement,
    copyToClipboard
  };
} 