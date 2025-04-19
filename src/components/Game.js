"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { useGameState } from "../hooks/useGameState";
import { GAME_MODES, STYLES, SHARE_MESSAGES } from "../constants/gameConstants";
import { checkDailyCompletion, copyToClipboard } from "../utils/gameUtils";

// Dynamically import components that use browser APIs

const DailyTimer = dynamic(() => import("./DailyTimer"), { ssr: false });
const WordDisplay = dynamic(() => import("./WordDisplay"), { ssr: false });
const GameControls = dynamic(() => import("./GameControls"), { ssr: false });

const Game = ({ words, category, keyWords, difficulty, mode, gameId = 0 }) => {
  // Initialize with null to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const {
    revealedWords,
    setRevealedWords,
    guesses,
    setGuesses,
    input,
    setInput,
    gameOver,
    setGameOver,
    correctGuess,
    setCorrectGuess,
    visibleWords,
    setVisibleWords,
    handleGuess
  } = useGameState(words, mode, keyWords);


  // Handle mounting and initial mobile detection
  useEffect(() => {
    setMounted(true);
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Check daily completion
  useEffect(() => {
    if (!mounted) return;

    if (mode === GAME_MODES.DAILY) {
      const completed = checkDailyCompletion();
      if (completed) {
        setGameOver(true);
        setCorrectGuess(completed.success);
        setGuesses(completed.guesses || []);
        setRevealedWords(completed.revealedWords);
        setVisibleWords(completed.revealedWords.slice(0, completed.guesses.length));
        return;
      }
    }

    setRevealedWords([words[0]]);
    setVisibleWords([words[0]]);
  }, [words, mode, mounted]);

  const handleShare = async () => {
    if (!mounted) return;

    const currentUrl = window.location.href;
    const gameNumber = mode === GAME_MODES.PRACTICE ? `Practice #${gameId}` : "Daily";
    const tries = guesses.length;
    const tryText = tries === 1 ? "try" : "tries";

    const messageTemplate = correctGuess
      ? mode === GAME_MODES.PRACTICE
        ? SHARE_MESSAGES.SUCCESS.PRACTICE
        : SHARE_MESSAGES.SUCCESS.DAILY
      : mode === GAME_MODES.PRACTICE
        ? SHARE_MESSAGES.FAILURE.PRACTICE
        : SHARE_MESSAGES.FAILURE.DAILY;

    const message = messageTemplate
      .replace("{gameId}", gameId)
      .replace("{tries}", tries)
      .replace("{tryText}", tryText)
      .replace("{difficulty}", difficulty)
      .replace("{url}", currentUrl);

    const success = await copyToClipboard(message);
    if (success && mounted) {
      const popup = document.createElement("div");
      popup.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg opacity-0 transition-opacity duration-300";
      popup.textContent = "Copied to clipboard!";
      document.body.appendChild(popup);

      setTimeout(() => popup.style.opacity = "1", 100);
      setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => document.body.removeChild(popup), 300);
      }, 2000);
    }
  };

  // Prevent scroll on focus
  const handleFocus = (e) => {
    e.preventDefault();
    // Store current scroll position
    const scrollPos = window.scrollY;

    // Add a small delay to let the keyboard open
    setTimeout(() => {
      // Restore scroll position
      window.scrollTo(0, scrollPos);

      // If we're on iOS, we need an additional fix
      if (isMobile && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        containerRef.current.scrollIntoView({ block: 'center' });
      }
    }, 100);
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <div ref={containerRef} className={STYLES.container}>
      <div className={STYLES.wordSection}>
        {words.map((word, index) => (
          <WordDisplay
            mobile={isMobile}
            key={index}
            word={word}
            index={index}
            isRevealed={revealedWords.includes(word)}
            isVisible={visibleWords.includes(word)}
            totalWords={words.length}
            gameOver={gameOver}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="mt-4 flex flex-wrap gap-2">
          {guesses.map((guess, index) => (
            <span key={index} className="line-through text-gray-500 tracking-wide">
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
                <p className="text-lg text-green-500 mb-2 font-medium tracking-tight">
                  Correct! You are smarter than{" "}
                  <span className="font-bold">{difficulty}%</span> of players.
                </p>
                <h2 className="text-2xl font-bold text-black tracking-tight">{category}</h2>
              </>
            ) : (
              <>
                <p className="text-lg text-red-500 mb-2 font-medium tracking-tight">
                  Wrong! You did not guess correct.
                </p>
                <h2 className="text-2xl font-bold text-black tracking-tight">{category}</h2>
              </>
            )}
            {mode === GAME_MODES.DAILY && <DailyTimer />}
            <GameControls mode={mode} onShare={handleShare} />
          </motion.div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="text"
              autoFocus={false}
              value={input}
              readOnly={false}
              onChange={(e) => setInput(e.target.value)}
              onFocus={handleFocus}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleGuess();
              }}
              placeholder="Guess the category..."
              className={`${STYLES.input} tracking-wide font-medium placeholder:text-gray-400`}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
