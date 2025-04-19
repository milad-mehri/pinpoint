import { useState, useEffect } from 'react';

export const useKeyboardInput = (onGuess, isMobile) => {
  const [input, setInput] = useState("");

  const handleKeyboardInput = (key) => {
    if (key === "DEL" || key === "BACKSPACE") {
      setInput((prev) => prev.slice(0, -1));
    } else if (key === "ENTER") {
      onGuess();
    } else if (/^[a-zA-Z0-9 ]$/.test(key)) {
      setInput((prev) => prev + key);
    }
  };

  useEffect(() => {
    if (isMobile) return;

    const handlePhysicalKeyPress = (e) => {
      if (e.key === "Enter") {
        onGuess();
      } else if (e.key === "Backspace") {
        handleKeyboardInput("DEL");
      } else if (/^[a-zA-Z0-9 ]$/.test(e.key)) {
        handleKeyboardInput(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyPress);
    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    };
  }, [isMobile, onGuess]);

  return {
    input,
    setInput,
    handleKeyboardInput
  };
}; 