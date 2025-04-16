'use client';

import { useState, useEffect } from 'react';
import Portal from './Portal';

/**
 * A toast notification component that safely renders to document.body
 * using React's portal mechanism instead of direct DOM manipulation.
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display
 * @param {number} props.duration - How long to show the toast in ms (default: 3000)
 * @param {Function} props.onClose - Callback when toast closes
 * @param {string} props.position - Position of toast ('top', 'bottom', etc.)
 * @returns {React.ReactNode} - The Toast component
 */
export default function Toast({
  message,
  duration = 3000,
  onClose,
  position = 'bottom'
}) {
  const [visible, setVisible] = useState(true);
  
  // Positions mapped to TailwindCSS classes
  const positionClasses = {
    top: 'top-4 left-1/2 transform -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 transform -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  // Auto-hide the toast after duration
  useEffect(() => {
    if (!visible) return;
    
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    // Clean up the timeout if component unmounts
    return () => clearTimeout(timer);
  }, [duration, visible, onClose]);
  
  // Don't render anything if not visible
  if (!visible) return null;
  
  return (
    <Portal>
      <div
        className={`fixed ${positionClasses[position] || positionClasses.bottom} 
                  bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg 
                  z-50 transition-opacity duration-300 opacity-100`}
      >
        {message}
      </div>
    </Portal>
  );
} 