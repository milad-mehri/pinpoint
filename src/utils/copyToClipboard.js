'use client';

/**
 * Safely copy text to clipboard with fallback for browsers without clipboard API
 * Specifically designed to avoid the "removeChild" error during route changes
 * 
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Whether copy was successful
 */
export async function copyToClipboard(text) {
  // Use Clipboard API if available (modern browsers)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, falling back to manual method');
      // Fall through to manual method
    }
  }
  
  // Fallback method with extra safety
  return new Promise((resolve) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      
      // Set up the textarea
      textArea.value = text;
      Object.assign(textArea.style, {
        position: 'fixed',
        left: '-9999px',
        top: '0',
        opacity: '0'
      });
      
      // Add a special class to identify it for cleanup
      textArea.classList.add('clipboard-temp');
      
      // Register the element for automatic cleanup
      if (window.__PENDING_CLEANUP_ELEMENTS) {
        window.__PENDING_CLEANUP_ELEMENTS.push(textArea);
      } else {
        window.__PENDING_CLEANUP_ELEMENTS = [textArea];
      }
      
      // Set up a self-cleaning timeout
      const timeoutId = setTimeout(() => {
        if (textArea.parentNode === document.body) {
          try {
            document.body.removeChild(textArea);
          } catch (e) {
            console.warn('Cleaning up textArea element failed:', e.message);
          }
        }
      }, 1000);
      
      // Append to the document body
      document.body.appendChild(textArea);
      
      // Select the text
      textArea.focus();
      textArea.select();
      
      let successful = false;
      try {
        successful = document.execCommand('copy');
      } catch (err) {
        console.error('execCommand copy failed', err);
      }
      
      // Clean up right away if possible
      try {
        if (document.body.contains(textArea)) {
          document.body.removeChild(textArea);
        }
      } catch (e) {
        // Ignore any cleanup errors, the timeout will handle it
      }
      
      // Clear the timeout since we've already attempted cleanup
      clearTimeout(timeoutId);
      
      // Resolve with the result
      resolve(successful);
    } catch (err) {
      console.error('Clipboard fallback failed entirely', err);
      resolve(false);
    }
  });
}

/**
 * Set up global cleanup of any clipboard elements that might have been left behind
 * Should be called during initialization
 */
export function setupClipboardCleanup() {
  if (typeof window === 'undefined') return;
  
  // Create a registry for elements that might need cleanup
  window.__PENDING_CLEANUP_ELEMENTS = window.__PENDING_CLEANUP_ELEMENTS || [];
  
  // Clean up on route transitions
  const cleanup = () => {
    if (window.__PENDING_CLEANUP_ELEMENTS && window.__PENDING_CLEANUP_ELEMENTS.length > 0) {
      window.__PENDING_CLEANUP_ELEMENTS.forEach(el => {
        try {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      });
      window.__PENDING_CLEANUP_ELEMENTS = [];
    }
  };
  
  // Add event listeners for cleanup
  window.addEventListener('beforeunload', cleanup);
  
  // Clean up periodically just to be safe
  setInterval(cleanup, 30000);
} 