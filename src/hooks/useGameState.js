import { useState, useEffect } from 'react';
import { saveResult } from '../utils/gameUtils';
import { GAME_MODES } from '../constants/gameConstants';

export const useGameState = (words, mode, keyWords) => {
  const [revealedWords, setRevealedWords] = useState([words[0]]);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [visibleWords, setVisibleWords] = useState([words[0]]);

  const handleGuess = () => {
    if (input.trim() === "") return;

    const newGuesses = [...guesses, input];
    setGuesses(newGuesses);
    setInput("");

    const isCorrect = keyWords
      .split(";")
      .map((kw) => kw.trim().toLowerCase())
      .some((keyword) => input.trim().toLowerCase().includes(keyword));

    if (isCorrect) {
      setGameOver(true);
      setCorrectGuess(true);
      setRevealedWords(words);
      setVisibleWords([...revealedWords]);

      if (mode === GAME_MODES.DAILY) saveResult(true, words, newGuesses);
    } else if (revealedWords.length < words.length) {
      const nextWord = words[revealedWords.length];
      setRevealedWords([...revealedWords, nextWord]);
      setVisibleWords([...visibleWords, nextWord]);
    } else {
      setGameOver(true);
      setCorrectGuess(false);
      if (mode === GAME_MODES.DAILY) saveResult(false, words, newGuesses);
    }
  };

  return {
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
  };
}; 