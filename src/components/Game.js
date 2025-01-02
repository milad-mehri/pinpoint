"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Keyboard from "./Keyboard";
import { useRef } from "react"; // Add useRef to the imports


const Game = () => {
  const [words, setWords] = useState([
    "Word 1",
    "Word 2",
    "Word 3",
    "Word 4",
    "Word 5",
  ]); // Default placeholders
  const [category, setCategory] = useState(""); // Store the category
  const [keyWords, setKeyWords] = useState([]); // Store the key words for the category
  const [revealedWords, setRevealedWords] = useState(["Word 1"]); // Default reveal the first placeholder
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(0); // Difficulty percentage
  const [correctGuess, setCorrectGuess] = useState(false); // Track if the guess was correct
  const [isMobile, setIsMobile] = useState(false);

  const inputRef = useRef(null); // Create a ref for the input element

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input
    }
  }, [input]); // Re-run whenever input changes
  
  // Detect if the device is mobile
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 640); // Adjust breakpoint as needed
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  // Fetch random words from the API
  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch("/api/words");
      const data = await response.json();

      setWords(data.words); // Update with actual words
      setCategory(data.category); // Set the actual category
      setKeyWords(
        data.key_words.split(";").map((kw) => kw.trim().toLowerCase())
      ); // Split and normalize key words
      setDifficulty(data.difficulty); // Set difficulty percentage
      setRevealedWords([data.words[0]]); // Reveal the first word
    };

    fetchWords();
  }, []);

  const handleGuess = () => {
    if (input.trim() === "") return;

    const isCorrect = keyWords.some((keyword) =>
      input.trim().toLowerCase().includes(keyword)
    );

    if (isCorrect) {
      setGameOver(true);
      setCorrectGuess(true);
      setRevealedWords(words); // Reveal all words
    } else if (revealedWords.length < words.length) {
      setRevealedWords([...revealedWords, words[revealedWords.length]]);
    } else {
      setGameOver(true);
      setCorrectGuess(false); // End the game with incorrect guess
    }
    setGuesses([...guesses, input]);
    setInput("");
  };

  const handleKeyboardInput = (key) => {
    if (key === "DEL" || key === "BACKSPACE") {
      setInput((prev) => prev.slice(0, -1));
    } else if (key === "ENTER") {
      handleGuess();
    } else if (/^[a-zA-Z0-9 ]$/.test(key)) {
      // setInput((prev) => prev + key);
    }
  };

  // Add physical keyboard support for desktop
  useEffect(() => {
    if (isMobile) return; // Skip if on mobile

    const handlePhysicalKeyPress = (e) => {
      // if (e.key === "Enter") {
      //   handleGuess();
      // } else if (e.key === "Backspace") {
      //   handleKeyboardInput("DEL");
      // } else if (/^[a-zA-Z0-9 ]$/.test(e.key)) {
      //   handleKeyboardInput(e.key.toUpperCase());
      // }
    };

    window.addEventListener("keydown", handlePhysicalKeyPress);
    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    };
  }, [isMobile]);

  return (
    <div
      className="bg-white shadow-lg rounded-lg w-full sm:w-4/5 lg:w-2/3 max-w-lg mx-auto p-6 flex flex-col justify-between"
    >
      {/* Words Section */}
      <div className="space-y-0">
      {words.map((word, index) => (
  <div
    key={index}
    className={`py-4 px-4 text-lg font-semibold text-center border-none ${
      index === 0 ? "rounded-t-lg" : "" // Top corners rounded for the first word
    } ${
      index === words.length - 1 ? "rounded-b-lg" : "" // Bottom corners rounded for the last word
    }`}
    style={{
      backgroundColor: `rgba(173, 216, 230, ${0.2 + index * 0.2})`,
    }}
  >
    <motion.span
      initial={{ opacity: 0 }}
      animate={{
        opacity: revealedWords.includes(word) ? 1 : 0,
      }}
      transition={{ duration: 0.5 }}
      className="text-black"
    >
      {revealedWords.includes(word) ? word : `Word ${index + 1}`}
    </motion.span>
  </div>
))}
      </div>
      {/* Guesses Section */}
      <div className="space-y-4">
        <div className="mt-4 flex flex-wrap gap-2">
          {guesses.map((guess, index) => (
            <span key={index} className="line-through text-gray-500">
              {guess}
            </span>
          ))}
        </div>

        {gameOver ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-auto"
          >
            {correctGuess ? (
              <>
                <p className="text-lg text-gray-600 mb-2">
                  You are smarter than{" "}
                  <span className="font-bold">{difficulty}%</span> of players.
                </p>
                <h2 className="text-2xl font-bold text-black">{category}</h2>
              </>
            ) : (
              <>
                <p className="text-lg text-gray-600 mb-2">
                  You did not guess correct.
                </p>
                <h2 className="text-2xl font-bold text-black">{category}</h2>
              </>
            )}
          </motion.div>
        ) : (
          <>
            {isMobile ? (
              <>
                {/* Read-only Input for Mobile */}
                <input
                  type="text"
                  value={input}
                  readOnly
                  placeholder="Guess the category..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {/* On-screen Keyboard */}
                <Keyboard onKeyPress={handleKeyboardInput} />
              </>
            ) : (
              // Editable Input for Desktop
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleGuess();
                }}
                placeholder="Guess the category..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
