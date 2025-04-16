# Safe DOM Operations in Next.js App Router

This guide explains how to safely handle DOM manipulations in a Next.js App Router application to avoid the common error:

```
Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
```

## The Problem

When manually manipulating the DOM (adding/removing elements) in a React + Next.js application, you may encounter errors during route transitions. This happens because:

1. Your component adds elements to `document.body` directly
2. Route changes trigger component unmounting
3. React's cleanup happens before your manual DOM operations complete
4. When `removeChild()` is called on a node that's already gone, it crashes

Common patterns that cause this issue:

```js
// Problem 1: Dangling setTimeout
const el = document.createElement('div');
document.body.appendChild(el);
setTimeout(() => {
  document.body.removeChild(el); // Crashes if component unmounts before timeout completes
}, 3000);

// Problem 2: No parent node check
const textarea = document.createElement('textarea');
document.body.appendChild(textarea);
document.body.removeChild(textarea); // Crashes if component unmounts between operations
```

## The Solution

We've created several utilities to safely handle DOM operations:

### 1. `useSafeDOM` Hook

A custom hook that tracks DOM elements and timeouts, ensuring proper cleanup when the component unmounts:

```jsx
import useSafeDOM from '../hooks/useSafeDOM';

function MyComponent() {
  const { 
    appendChild, 
    removeChild, 
    setTimeout, 
    createTempElement 
  } = useSafeDOM();
  
  const handleClick = () => {
    // Create element
    const notification = createTempElement('div', {
      className: 'notification',
      textContent: 'Hello world!'
    });
    
    // Safely append to body
    appendChild(notification);
    
    // Safely remove after delay (auto-cleanup on unmount)
    setTimeout(() => {
      removeChild(notification);
    }, 3000);
  };
  
  return <button onClick={handleClick}>Show Notification</button>;
}
```

### 2. React Portal Component

For rendering elements to `document.body` or other containers using React's portal API:

```jsx
import Portal from '../components/Portal';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      
      {showModal && (
        <Portal>
          <div className="modal">
            <h2>Modal Content</h2>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </Portal>
      )}
    </>
  );
}
```

### 3. Toast Component

A reusable toast notification that uses Portal for safe rendering:

```jsx
import Toast from '../components/Toast';

function MyComponent() {
  const [showToast, setShowToast] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowToast(true)}>Show Toast</button>
      
      {showToast && (
        <Toast 
          message="Operation completed!" 
          duration={2000}
          onClose={() => setShowToast(false)}
          position="bottom"
        />
      )}
    </>
  );
}
```

### 4. Clipboard Utility

A safe utility for clipboard operations:

```jsx
import useClipboard from '../hooks/useClipboard';

function MyComponent() {
  const { copy, copied, error } = useClipboard();
  
  const handleCopy = async () => {
    await copy('Text to copy');
    // Copied state is managed automatically
  };
  
  return (
    <>
      <button onClick={handleCopy}>Copy Text</button>
      {copied && <span>Copied!</span>}
    </>
  );
}
```

## Best Practices

1. **Use React's Portal API** instead of direct DOM manipulation when possible
2. **Always check if a node exists and has a parent** before removing it
3. **Clean up timeouts and intervals** in `useEffect` cleanup functions
4. **Track all DOM elements** added manually and clean them up on unmount
5. **Prefer React state and effects** over manual DOM manipulation

## Example Component

See `src/components/DOMExamples.js` for a complete example demonstrating all these patterns. 