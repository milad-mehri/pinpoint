"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import DailyTimer from "./DailyTimer";
import OffscreenInput from "./OffscreenInput";
import useGameInput from "../hooks/useGameInput";
import useSafeDOM from "../hooks/useSafeDOM";
import useClipboard from "../hooks/useClipboard";
import Toast from "./Toast";
import { safeAppendChild, safeRemoveChild, isNodeSafe } from "../utils/safeDom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt,
  faArrowRight,
  faDumbbell,
  faCalendarDay,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const Game = ({ words, category, keyWords, difficulty, mode, gameId = 0 }) => {
  const [revealedWords, setRevealedWords] = useState([words[0]]);

  const [guesses, setGuesses] = useState([]);
  const { input, setInput, inputRef, forceFocus } = useGameInput();
  const [gameOver, setGameOver] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false); // Track if the guess was correct
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [visibleWords, setVisibleWords] = useState([words[0]]); // Track words revealed during gameplay
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { setTimeout: safeSetTimeout } = useSafeDOM();
  const { copy } = useClipboard();

  const gameContainerRef = useRef(null); // Reference for the game container
  const originalScrollPos = useRef(0); // Store original scroll position

  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (gameOver) {
      console.log("Game over state updated.");
    }
  }, [gameOver]);

  // Detect device type and iOS specifically
  useEffect(() => {
    if (!isBrowser) return;
    
    const updateDeviceInfo = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
      
      // iOS detection
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(iOS);
      
      // Add iOS classes if needed
      if (iOS && document.body) {
        document.body.classList.add('ios-device');
      }
    };

    updateDeviceInfo();
    window.addEventListener("resize", updateDeviceInfo);

    return () => {
      window.removeEventListener("resize", updateDeviceInfo);
    };
  }, [isBrowser]);

  // Handle iOS viewport and keyboard
  useEffect(() => {
    if (!isBrowser || !isIOS) return;

    // For iOS, we need to prevent the viewport from being moved by the keyboard
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      const newMeta = document.createElement('meta');
      newMeta.name = 'viewport';
      newMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      safeAppendChild(document.head, newMeta);
    } else {
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    }

    // Create wrapper elements for iOS if they don't exist
    if (!document.querySelector('.ios-viewport')) {
      // Save the body's children
      const bodyChildren = Array.from(document.body.children);
      
      // Create new iOS-specific wrapper elements
      const viewportEl = document.createElement('div');
      viewportEl.className = 'ios-viewport';
      
      const containerEl = document.createElement('div');
      containerEl.className = 'ios-container';
      
      const contentEl = document.createElement('div');
      contentEl.className = 'ios-content';
      
      // Use safe DOM methods
      safeAppendChild(document.body, viewportEl);
      safeAppendChild(viewportEl, containerEl);
      safeAppendChild(containerEl, contentEl);
      
      bodyChildren.forEach(child => {
        if (child !== viewportEl && isNodeSafe(child)) {
          safeAppendChild(contentEl, child);
        }
      });
    }

    // Keyboard handling for iOS
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When coming back from keyboard, restore position
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 50);
      }
    };

    // Track scroll position to restore it when needed
    const handleScroll = () => {
      if (!isKeyboardVisible) {
        originalScrollPos.current = window.scrollY;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isBrowser, isIOS, isKeyboardVisible]);

  // Add viewport height fix for mobile keyboards
  useEffect(() => {
    if (!isBrowser) return;
    
    // Function to update viewport height
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Initial set
    setVH();

    // Update on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, [isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;
    
    if (mode === "daily") {
      const completed = checkDailyCompletion();
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
  }, [words, mode, isBrowser]);

  // Ensure input is focused when component mounts and whenever gameOver changes
  useEffect(() => {
    if (!isBrowser || gameOver) return;
    // Use our aggressive focus method
    forceFocus();
  }, [gameOver, forceFocus, isBrowser]);

  const handleShare = () => {
    if (!isBrowser) return;
    
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

    // Use our new clipboard hook to safely copy text
    copy(message)
      .then(success => {
        if (success) {
          setToastMessage("Copied to clipboard!");
          setShowToast(true);
          
          // Hide toast after 2 seconds
          safeSetTimeout(() => {
            setShowToast(false);
          }, 2000);
        }
      })
      .catch(() => {
        setToastMessage("Failed to copy");
        setShowToast(true);
        
        safeSetTimeout(() => {
          setShowToast(false);
        }, 2000);
      });
  };

  const saveResult = (success, revealedWords, guesses) => {
    if (!isBrowser) return;
    
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
    if (!isBrowser) return null;
    
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
      
      // Re-focus input after revealing a new word
      setTimeout(forceFocus, 100);
    } else {
      setGameOver(true);
      setCorrectGuess(false); // End the game with incorrect guess
      if (mode === "daily") saveResult(false, words, newGuesses); // Save result as failure
    }
  };

  // Handle input focus with iOS specific behavior
  const handleInputFocus = () => {
    setIsKeyboardVisible(true);
    
    if (!isBrowser) return;
    
    if (isIOS) {
      // For iOS, store the current scroll position
      originalScrollPos.current = window.scrollY;
      
      // Fix the layout in place for iOS
      document.body.style.position = 'fixed';
      document.body.style.top = `-${originalScrollPos.current}px`;
      document.body.style.width = '100%';
      
      // Prevent default iOS behavior by manually handling focus
      setTimeout(() => {
        if (gameContainerRef.current) {
          gameContainerRef.current.scrollIntoView({ block: 'start', behavior: 'auto' });
        }
        
        // Make sure the iOS viewport is at the top
        const iosViewport = document.querySelector('.ios-viewport');
        if (iosViewport) {
          iosViewport.scrollTop = 0;
        }
      }, 50);
    } else if (isMobile) {
      // For other mobile devices, just scroll to the game container
      setTimeout(() => {
        if (gameContainerRef.current) {
          gameContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };
  
  // Handle input blur with iOS specific behavior
  const handleInputBlur = () => {
    setIsKeyboardVisible(false);
    
    if (!isBrowser) return;
    
    if (isIOS) {
      // Restore normal scrolling for iOS
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore the original scroll position
      window.scrollTo(0, originalScrollPos.current);
    }
  };

  return (
    <>
      <div 
        ref={gameContainerRef}
        className="bg-white shadow-lg rounded-lg w-full sm:w-4/5 lg:w-2/3 max-w-lg mx-auto p-6 flex flex-col justify-between position-fixed overflow-y-auto"
        style={{ 
          height: "auto", 
          maxHeight: isMobile ? "fit-content" : "calc(var(--vh, 1vh) * 100 - 100px)" 
        }}
      >
        {/* Words Section */}
        <div className="space-y-0 overflow-y-auto flex-shrink-0">
          {words.map((word, index) => {
            const isRevealed = revealedWords.includes(word); // Check if the word is revealed
            const isVisible = visibleWords.includes(word);
            return (
              <div
                key={index}
                className={`py-3 px-4 text-lg font-semibold text-center border-none ${
                  index === 0 ? "rounded-t-lg" : ""
                } ${index === words.length - 1 ? "rounded-b-lg" : ""}`}
                style={{
                  backgroundColor: `rgba(173, 216, 230, ${0.2 + index * 0.2})`,
                  padding: isMobile ? "0.5rem 1rem" : "0.75rem 1rem",
                  minHeight: isMobile ? "2.5rem" : "3rem",
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
        <div className="space-y-2 mt-auto">
          <div className="mt-2 flex flex-wrap gap-2">
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

                <button
                  title="Share"
                  onClick={handleShare}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-500 w-14 h-9 rounded-full flex items-center justify-center shadow-md transition"
                >
                  <FontAwesomeIcon icon={faShareAlt} className="text-xl" />{" "}
                </button>
                <button
                    title="Daily mode"
                    onClick={() => (window.location.href = "/feedback")} // Replace with navigation logic if needed
                    className="bg-gray-100 hover:bg-gray-200 text-gray-500 w-14 h-9 rounded-full flex items-center justify-center shadow-md transition"
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />{" "}
                  </button>

                {mode === "practice" && (
                  <button
                    title="Daily mode"
                    onClick={() => (window.location.href = "/")} // Replace with navigation logic if needed
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
              </div>
            </motion.div>
          ) : (
            <OffscreenInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={handleGuess}
              placeholder="Guess the category..."
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="w-full"
            />
          )}
        </div>
      </div>
      
      {/* Toast notification using our Portal component */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          duration={2000}
          onClose={() => setShowToast(false)}
          position="bottom"
        />
      )}
    </>
  );
};

export default Game;
