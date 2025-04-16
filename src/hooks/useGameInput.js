'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export default function useGameInput() {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const focusAttemptsRef = useRef(0);
  const timeoutsRef = useRef([]);
  const touchInitiatedRef = useRef(false);
  const visibilityTimeoutRef = useRef(null);
  
  // Detect iOS - use isBrowser check to prevent hydration issues
  const isIOSRef = useRef(false);
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Only detect iOS after component is mounted in browser
  useEffect(() => {
    if (!isBrowser) return;
    
    // Comprehensive iOS detection
    isIOSRef.current = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  }, [isBrowser]);

  // Very aggressive focus function
  const forceFocus = useCallback(() => {
    if (!isBrowser || !inputRef.current) return;
    
    const input = inputRef.current;
    
    // Regular focus
    input.focus();
    
    // For iOS, simulate user interaction first
    if (isIOSRef.current) {
      // Create and dispatch touch events to simulate user interaction
      try {
        // Simulate touch start
        const touchStartEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        input.dispatchEvent(touchStartEvent);
        
        // Simulate touch end
        const touchEndEvent = new TouchEvent('touchend', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        input.dispatchEvent(touchEndEvent);
        
        // Simulate click
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        input.dispatchEvent(clickEvent);
        
        // Focus again after events
        input.focus();
        
        // iOS may need a brief moment after interaction
        setTimeout(() => {
          input.focus();
          // Try clicking on the input's parent too
          if (input.parentElement) {
            input.parentElement.click();
          }
        }, 50);
      } catch (e) {
        console.log('Touch event simulation failed, trying alternative methods');
        // Fallback to regular focus if event creation fails
        input.focus();
        input.click();
      }
    }
    
    // Increment attempts counter
    focusAttemptsRef.current++;
  }, [isBrowser]);

  // Setup initial focus with multiple attempts - only on browser
  useEffect(() => {
    if (!isBrowser) return;
    
    // Immediate attempt
    forceFocus();
    
    // Multiple delayed attempts with increasing delays
    const delays = [100, 300, 500, 1000, 2000];
    
    delays.forEach(delay => {
      const timeoutId = setTimeout(() => {
        if (document.activeElement !== inputRef.current) {
          forceFocus();
        }
      }, delay);
      
      timeoutsRef.current.push(timeoutId);
    });
    
    // Try again when visibility changes (user switches tabs/apps and returns)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Clear any existing timeout
        if (visibilityTimeoutRef.current) {
          clearTimeout(visibilityTimeoutRef.current);
        }
        
        // Set a short timeout to make sure the page is fully visible
        visibilityTimeoutRef.current = setTimeout(() => {
          forceFocus();
        }, 100);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // iOS specific: try to focus on any touch interaction with the page
    const captureTouch = () => {
      if (!touchInitiatedRef.current) {
        touchInitiatedRef.current = true;
        forceFocus();
      }
    };
    
    // Use capture phase to catch all touch events
    document.addEventListener('touchstart', captureTouch, { capture: true });
    document.addEventListener('click', captureTouch, { capture: true });
    
    return () => {
      // Clean up all timeouts
      timeoutsRef.current.forEach(id => clearTimeout(id));
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', captureTouch, { capture: true });
      document.removeEventListener('click', captureTouch, { capture: true });
    };
  }, [isBrowser, forceFocus]);
  
  // Keep trying to focus if the window is resized (orientation changes)
  useEffect(() => {
    if (!isBrowser) return;
    
    const handleResize = () => {
      setTimeout(forceFocus, 300); // Delay slightly to allow the resize to complete
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isBrowser, forceFocus]);

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    // Just placeholder functionality - the actual submit logic will be provided by the component
    setInput('');
    if (isBrowser && inputRef.current) {
      forceFocus(); // Re-focus after submission
    }
  }, [isBrowser, forceFocus]);

  return {
    input,
    setInput,
    handleChange,
    handleSubmit,
    inputRef,
    forceFocus
  };
} 