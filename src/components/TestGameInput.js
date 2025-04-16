'use client';

import React from 'react';
import useGameInput from '../hooks/useGameInput';

const TestGameInput = () => {
  const { input, handleChange, handleSubmit, inputRef, forceFocus } = useGameInput();

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Test Game Input</h2>
      
      <div className="w-full max-w-md">
        <input
          ref={inputRef}
          value={input}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2"
          placeholder="Type here..."
        />
        
        <div className="flex space-x-2">
          <button 
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
          
          <button 
            onClick={forceFocus}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
          >
            Focus Input
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-2 bg-gray-100 rounded w-full max-w-md">
        <p>Current input: <strong>{input}</strong></p>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>This component demonstrates the useGameInput hook, which aggressively maintains focus on the input element.</p>
        <p>It's particularly effective on iOS devices where keyboard focus can be challenging.</p>
      </div>
    </div>
  );
};

export default TestGameInput; 