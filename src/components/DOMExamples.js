'use client';

import { useState } from 'react';
import useSafeDOM from '../hooks/useSafeDOM';
import useClipboard from '../hooks/useClipboard';
import Portal from './Portal';

/**
 * Example component demonstrating safe DOM manipulation patterns
 * for Next.js App Router and React
 */
export default function DOMExamples() {
  const { 
    appendChild, 
    removeChild, 
    setTimeout: safeSetTimeout, 
    createTempElement 
  } = useSafeDOM();
  
  const { copy, copied } = useClipboard();
  const [showModal, setShowModal] = useState(false);
  const [demoText, setDemoText] = useState('Test content for clipboard');
  const [showToast, setShowToast] = useState(false);
  
  // Example 1: Safe temporary element creation/removal with timeout
  const handleTemporaryElement = () => {
    // Create a floating notification element
    const notification = createTempElement('div', {
      className: 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded shadow-lg',
      textContent: 'Temporary element created! Will remove in 3 seconds...'
    });
    
    // Safely append to body
    appendChild(notification);
    
    // Safely remove after 3 seconds (cleanup handled automatically on unmount)
    safeSetTimeout(() => {
      removeChild(notification);
    }, 3000);
  };
  
  // Example 2: Safe clipboard operations
  const handleClipboardCopy = async () => {
    await copy(demoText);
    setShowToast(true);
    safeSetTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  
  // Example 3: Safe modal using React Portal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Safe DOM Operations Examples</h1>
      
      <div className="space-y-6">
        {/* Example 1: Temporary Element */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Example 1: Temporary DOM Element</h2>
          <p className="text-sm mb-4">Creates a temporary notification that auto-removes after 3 seconds.</p>
          <button 
            onClick={handleTemporaryElement}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Temporary Element
          </button>
        </div>
        
        {/* Example 2: Clipboard Operations */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Example 2: Safe Clipboard Operations</h2>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={demoText}
              onChange={(e) => setDemoText(e.target.value)}
              className="border rounded px-2 py-1 flex-grow"
            />
            <button 
              onClick={handleClipboardCopy}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Copy Text
            </button>
          </div>
          {copied && <p className="text-sm text-green-600">✓ Copied to clipboard!</p>}
        </div>
        
        {/* Example 3: React Portal for Modals */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Example 3: React Portal for Modals</h2>
          <p className="text-sm mb-4">
            Using React Portal instead of direct DOM manipulation is safer for route changes.
          </p>
          <button 
            onClick={toggleModal}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            {showModal ? 'Close Modal' : 'Open Modal'}
          </button>
        </div>
      </div>
      
      {/* Modal using Portal */}
      {showModal && (
        <Portal className="modal-container">
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Modal Using React Portal</h2>
              <p className="mb-4">
                This modal is rendered using React Portal, which means:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>It's safely attached to DOM</li>
                <li>React handles cleanup on unmount</li>
                <li>No direct DOM manipulation</li>
                <li>Works with route changes</li>
              </ul>
              <button 
                onClick={toggleModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close Modal
              </button>
            </div>
          </div>
        </Portal>
      )}
      
      {/* Toast notification */}
      {showToast && (
        <Portal>
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg">
            Copied to clipboard!
          </div>
        </Portal>
      )}
    </div>
  );
} 