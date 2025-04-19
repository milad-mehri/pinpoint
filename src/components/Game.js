"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Keyboard from "./Keyboard";
import DailyTimer from "./DailyTimer";
import WordDisplay from "./WordDisplay";
import GameControls from "./GameControls";
import { useGameState } from "../hooks/useGameState";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { GAME_MODES, STYLES, SHARE_MESSAGES } from "../constants/gameConstants";
import { checkDailyCompletion, copyToClipboard } from "../utils/gameUtils";

const Game = ({ words, category, keyWords, difficulty, mode, gameId = 0 }) => {
  const [isMobile, setIsMobile] = useState(false);
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

  const { handleKeyboardInput } = useKeyboardInput(handleGuess, isMobile);

  // Detect if the device is mobile
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Check daily completion
  useEffect(() => {
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
  }, [words, mode]);

  const handleShare = async () => {
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
    if (success) {
      // Show success popup
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

  return (
    <div className={STYLES.container}>
      <div className={STYLES.wordSection}>
        {words.map((word, index) => (
          <WordDisplay
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
            {mode === GAME_MODES.DAILY && <DailyTimer />}
            <GameControls mode={mode} onShare={handleShare} />
          </motion.div>
        ) : (
          <>
            <input
              type="text"
              autoFocus={true}
              value={input}
              readOnly={isMobile}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleGuess();
              }}
              placeholder="Guess the category..."
              className={STYLES.input}
            />

            {isMobile && <Keyboard onKeyPress={handleKeyboardInput} />}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
