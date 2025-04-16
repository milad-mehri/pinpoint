'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import useGameInput from '../hooks/useGameInput';

const OffscreenInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type here...',
  className = '',
  onFocus,
  onBlur,
}) => {
  const [focused, setFocused] = useState(false);
  const fakeInputRef = useRef(null);
  const [isIOS, setIsIOS] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(value.length);
  const [showCursor, setShowCursor] = useState(false);
  const cursorIntervalRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Use our custom hook for aggressive focus handling
  const { inputRef, forceFocus } = useGameInput();
  
  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Detect iOS on mount - only in browser
  useEffect(() => {
    if (!isBrowser) return;
    
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
  }, [isBrowser]);
  
  // Handle cursor blinking when focused
  useEffect(() => {
    if (!isBrowser) return;
    
    if (focused) {
      setShowCursor(true);
      cursorIntervalRef.current = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530); // Standard cursor blink rate
    } else {
      clearInterval(cursorIntervalRef.current);
      setShowCursor(false);
    }
    
    return () => {
      clearInterval(cursorIntervalRef.current);
    };
  }, [focused, isBrowser]);
  
  // Update cursor position when value changes
  useEffect(() => {
    setCursorPosition(value.length);
  }, [value]);
  
  // Focus the real input when the fake input is clicked
  const handleFakeInputClick = () => {
    forceFocus();
  };
  
  // Handle real input focus/blur
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };
  
  return (
    <div className={`relative w-full input-wrapper ${className}`}>
      {/* Fake visual input element */}
      <div
        ref={fakeInputRef}
        className={`w-full border ${focused ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'} rounded-md px-4 py-2 text-lg outline-none pr-12 bg-white select-none min-h-[42px]`}
        onClick={handleFakeInputClick}
        role="textbox"
        aria-label={placeholder}
        tabIndex={-1} // Not directly focusable, we'll focus the real input instead
      >
        <span>
          {value.substring(0, cursorPosition)}
          {focused && showCursor && <span className="cursor">|</span>}
          {value.substring(cursorPosition)}
        </span>
        
        {/* Show placeholder when empty */}
        {value === "" && !focused && (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
      
      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors bg-transparent border-none p-2"
        aria-label="Submit"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
      
      {/* Real offscreen input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-hidden="true"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{
          position: 'fixed',
          top: isIOS ? '-100vh' : '0', // Move it way off-screen on iOS
          left: '0',
          opacity: '0',
          height: '1px',
          width: '1px',
          pointerEvents: 'none', // Prevent it from interfering with other elements
          zIndex: '-1000',
          fontSize: '16px', // Prevent zoom on iOS
        }}
      />

      {/* Additional styles for the cursor */}
      <style jsx>{`
        .cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          vertical-align: middle;
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default OffscreenInput; 