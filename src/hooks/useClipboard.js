'use client';

import { useState } from 'react';
import useSafeDOM from './useSafeDOM';

/**
 * A hook for safely copying text to clipboard with feedback state
 * @returns {Object} Object containing copy function and state
 */
export default function useClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const { copyToClipboard } = useSafeDOM();
  
  /**
   * Copy text to clipboard and manage feedback state
   * @param {string} text - Text to copy
   * @param {number} resetAfter - Reset 'copied' state after ms (default: 2000)
   * @returns {Promise<boolean>} - Whether copy was successful
   */
  const copy = async (text, resetAfter = 2000) => {
    try {
      const success = await copyToClipboard(text);
      
      if (success) {
        setCopied(true);
        setError(null);
        
        // Reset copied state after specified time
        if (resetAfter > 0) {
          setTimeout(() => {
            setCopied(false);
          }, resetAfter);
        }
        
        return true;
      } else {
        throw new Error('Copy operation failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to copy to clipboard');
      setCopied(false);
      return false;
    }
  };
  
  return { copy, copied, error };
} 