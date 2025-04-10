"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Keyboard from "./Keyboard";
import DailyTimer from "./DailyTimer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt,
  faArrowRight,
  faDumbbell,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";

const Game = ({ words, category, keyWords, difficulty, mode, gameId = 0 }) => {
  const [revealedWords, setRevealedWords] = useState([words[0]]);

  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false); // Track if the guess was correct
  const [isMobile, setIsMobile] = useState(false);
  const [visibleWords, setVisibleWords] = useState(["Word 1"]); // Track words revealed during gameplay

  const inputRef = useRef(null); // Create a ref for the input element

  useEffect(() => {
    if (gameOver) {
      console.log("Game over state updated.");
    }
  }, [gameOver]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input
    }
  }, [input]); // Re-run whenever input changes

  // Detect if the device is mobile
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 640); // Detect mobile devices
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);
  useEffect(() => {
    if (mode === "daily") {
      const completed = checkDailyCompletion();
      // console.log(completed.revealedWords)
      if (completed) {
        setGameOver(true); // Skip directly to the end
        setCorrectGuess(completed.success);
        setGuesses(completed.guesses || []);
        setRevealedWords(completed.revealedWords); // Restore revealed words
        setVisibleWords(
          completed.revealedWords.slice(0, completed.guesses.length)
        ); // Restore visible words
        return;
      }
    }

    // Default behavior for practice mode or if daily isn't completed
    setRevealedWords([words[0]]);
    setVisibleWords([words[0]]);
  }, [words, mode]);

  const handleShare = () => {
    const popup = document.createElement("div");
    popup.className =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg opacity-0 transition-opacity duration-300";
    popup.textContent = "Copied to clipboard!";
    document.body.appendChild(popup);

    // Fade in the popup
    setTimeout(() => {
      popup.style.opacity = "1";
    }, 100);

    // Fade out and remove the popup after 2 seconds
    setTimeout(() => {
      popup.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(popup);
      }, 300);
    }, 2000);

    const currentUrl = window.location.href;
    const gameNumber = mode === "practice" ? `Practice #${gameId}` : "Daily";
    const linkPath = mode === "practice" ? `${currentUrl}` : `${currentUrl}`;
    const tries = guesses.length;
    const message = correctGuess
      ? mode === "practice"
        ? `🎉 I solved Pinpoint ${gameNumber} in ${tries} ${
            tries === 1 ? "try" : "tries"
          }, beating ${difficulty}% of players! Think you can? Try it here: ${linkPath}`
        : `🎉 I just completed Pinpoint ${gameNumber} in ${tries} ${
            tries === 1 ? "try" : "tries"
          }! This one has a ${difficulty}% success rate. Think you can? Try it here: ${linkPath}`
      : mode === "practice"
      ? `❌ I failed Pinpoint ${gameNumber} after ${tries} ${
          tries === 1 ? "try" : "tries"
        }. Only ${difficulty}% of players solved it! Think you can do better? Try it here: ${linkPath}`
      : `❌ Pinpoint ${gameNumber} stumped me after ${tries} ${
          tries === 1 ? "try" : "tries"
        }! This one has a ${difficulty}% success rate. Think you can? Try it here: ${linkPath}`;

    // Use `navigator.clipboard.writeText` if available, otherwise fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).catch((err) => {
        console.error("Clipboard write failed:", err);
        fallbackCopyText(message); // Fallback in case of an error
      });
    } else {
      fallbackCopyText(message);
    }
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to the bottom of the page
    textArea.style.left = "-9999px"; // Keep it out of view
    textArea.style.top = "0";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (!successful) {
        console.error("Fallback: Copy failed");
      }
    } catch (err) {
      console.error("Fallback: Copy error", err);
    }

    document.body.removeChild(textArea);
  };

  const saveResult = (success, revealedWords, guesses) => {
    const now = new Date();
    const pstDate = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );
    const startOfYear = new Date(pstDate.getFullYear(), 0, 0);
    const diff = pstDate - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const key = "dailyResults";
    const results = JSON.parse(localStorage.getItem(key)) || {};

    // Save the result for the current day
    results[`day_${dayOfYear}`] = {
      success,
      revealedWords,
      guesses,
    };

    // Update localStorage
    localStorage.setItem(key, JSON.stringify(results));
  };

  const checkDailyCompletion = () => {
    const now = new Date();
    const pstDate = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );
    const startOfYear = new Date(pstDate.getFullYear(), 0, 0);
    const diff = pstDate - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const key = "dailyResults";
    const results = JSON.parse(localStorage.getItem(key)) || {};
    console.log(results[`day_${dayOfYear}`]);
    // Return today's result if it exists
    return results[`day_${dayOfYear}`];
  };

  const handleGuess = () => {
    if (input.trim() === "") return;

    const newGuesses = [...guesses, input]; // Create the updated guesses array
    setGuesses(newGuesses);
    setInput("");

    const isCorrect = keyWords
      .split(";")
      .map((kw) => kw.trim().toLowerCase())
      .some((keyword) => input.trim().toLowerCase().includes(keyword));

    if (isCorrect) {
      setGameOver(true);
      setCorrectGuess(true);
      setRevealedWords(words); // Reveal all words
      setVisibleWords([...revealedWords]); // Preserve only revealed words in visibleWords

      if (mode === "daily") saveResult(true, words, newGuesses); // Save result as success
    } else if (revealedWords.length < words.length) {
      const nextWord = words[revealedWords.length];
      setRevealedWords([...revealedWords, nextWord]);
      setVisibleWords([...visibleWords, nextWord]); // Add the word to visibleWords
    } else {
      setGameOver(true);
      setCorrectGuess(false); // End the game with incorrect guess
      if (mode === "daily") saveResult(false, words, newGuesses); // Save result as failure
    }
  };

  const handleKeyboardInput = (key) => {
    if (key === "DEL" || key === "BACKSPACE") {
      setInput((prev) => prev.slice(0, -1));
    } else if (key === "ENTER") {
      handleGuess();
    } else if (/^[a-zA-Z0-9 ]$/.test(key)) {
      setInput((prev) => prev + key);
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
    <div className="bg-white shadow-lg rounded-lg w-full sm:w-4/5 lg:w-2/3 max-w-lg mx-auto p-6 flex flex-col justify-between">
      {/* Words Section */}
      <div className="space-y-0">
        {words.map((word, index) => {
          const isRevealed = revealedWords.includes(word); // Check if the word is revealed
          const isVisible = visibleWords.includes(word);
          return (
            <div
              key={index}
              className={`py-4 px-4 text-lg font-semibold text-center border-none ${
                index === 0 ? "rounded-t-lg" : ""
              } ${index === words.length - 1 ? "rounded-b-lg" : ""}`}
              style={{
                backgroundColor: `rgba(173, 216, 230, ${0.2 + index * 0.2})`,
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Hint Word */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className={
                    isRevealed
                      ? "text-black"
                      : gameOver
                      ? "text-gray-500"
                      : "text-black"
                  }
                >
                  {isRevealed ? word : `Word ${index + 1}`}
                </motion.span>

                {/* Not Used Badge */}

                {!visibleWords.includes(word) &&
                  gameOver &&
                  words.includes(word) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="right-[15px] absolute ml-2 text-sm text-slate-100 bg-blue-300 rounded px-2 py-1"
                    >
                      Not Used
                    </motion.span>
                  )}
              </div>
            </div>
          );
        })}
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
                <p className="text-lg text-green-500 mb-2">
                  Correct! You are smarter than{" "}
                  <span className="font-bold">{difficulty}%</span> of players.
                </p>
                <h2 className="text-2xl font-bold text-black">{category}</h2>
              </>
            ) : (
              <>
                <p className="text-lg text-red-500 mb-2">
                  Wrong! You did not guess correct.
                </p>
                <h2 className="text-2xl font-bold text-black">{category}</h2>
              </>
            )}
            {mode === "daily" && <DailyTimer />}

            {/* Next and Share Buttons */}
            <div className="flex justify-center mt-6 gap-4">
              {/* Share Button */}
              {/* Share Button */}
              <button
                title="Share"
                onClick={handleShare}
                className="bg-gray-100 hover:bg-gray-200 text-gray-500 w-14 h-9 rounded-full flex items-center justify-center shadow-md transition"
              >
                <FontAwesomeIcon icon={faShareAlt} className="text-xl" />{" "}
              </button>
              {mode === "practice" && (
                <button
                  title="Daily mode"
                  onClick={() => (window.location.href = "/pinpoint")} // Replace with navigation logic if needed
                  className="bg-gray-100 hover:bg-gray-200 text-gray-500 w-14 h-9 rounded-full flex items-center justify-center shadow-md transition"
                >
                  <FontAwesomeIcon icon={faCalendarDay} className="text-xl" />{" "}
                </button>
              )}
              {/* Next Button */}
              <button
                title="Practice mode"
                onClick={() => (window.location.href = "/practice")} // Replace with navigation logic if needed
                className="bg-gray-100 hover:bg-gray-200 text-gray-500 w-14 h-9 rounded-full flex items-center justify-center shadow-md transition"
              >
                {mode === "daily" ? (
                  <>
                    <FontAwesomeIcon icon={faDumbbell} className="text-xl" />{" "}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xl" />{" "}
                  </>
                )}
              </button>

              {/* Daily Button */}
            </div>
          </motion.div>
        ) : (
          <>
            <input
              type="text"
              autoFocus={true} // Ensure focus doesn't force a mismatch
              value={input}
              readOnly={isMobile} // Prevent keyboard opening for mobile
              onChange={(e) => setInput(e.target.value)} // Handle only if not readOnly
              onKeyPress={(e) => {
                if (e.key === "Enter") handleGuess();
              }}
              placeholder="Guess the category..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {isMobile && <Keyboard onKeyPress={handleKeyboardInput} />}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
