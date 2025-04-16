"use client"; // Ensures this component is client-side

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Game from "../components/Game";
import Papa from "papaparse";
import { DateTime } from "luxon";

/**
 * Helper function to calculate the "day of the year" based on PST.
 */
function getPSTDayOfYear() {
  const now = DateTime.utc().setZone("America/Los_Angeles");
  return now.ordinal; // Returns 1-based day of the year
}

/**
 * Fetches the daily puzzle from `daily.csv` in the `public` directory.
 */
async function getDailyPuzzleClient() {
  const response = await fetch("/daily.csv"); // Fetch the CSV file from the public directory
  if (!response.ok) {
    throw new Error("Failed to fetch daily puzzle CSV.");
  }

  const csvData = await response.text(); // Parse CSV data as text
  const parsedData = Papa.parse(csvData, { header: true }); // Use PapaParse to parse CSV

  // Ensure parsed data is valid
  if (!parsedData || !parsedData.data || !Array.isArray(parsedData.data)) {
    throw new Error("Invalid CSV format.");
  }

  const dayOfYear = getPSTDayOfYear();
  const index = dayOfYear - 1; // Adjust for 1-based dayOfYear

  if (index >= parsedData.data.length) {
    throw new Error("Day of the year out of range.");
  }

  return parsedData.data[index]; // Return the puzzle for the current day
}

/**
 * The `DailyPuzzle` component, now client-side rendered.
 */
export default function DailyPuzzle() {
  const [puzzle, setPuzzle] = useState(null); // Store the puzzle data
  const [error, setError] = useState(null); // Store any error

  // Fetch the daily puzzle on component mount
  useEffect(() => {
    async function fetchDailyPuzzle() {
      try {
        const puzzleData = await getDailyPuzzleClient();
        setPuzzle(puzzleData); // Update state with puzzle data
      } catch (err) {
        console.error("Error fetching daily puzzle:", err.message);
        setError(err.message);
      }
    }
    fetchDailyPuzzle();
  }, []);

  // Error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100 fade-in">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error loading daily puzzle.</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!puzzle) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 fade-in">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  // Prepare the words for the `Game` component
  const words = [
    puzzle.word1,
    puzzle.word2,
    puzzle.word3,
    puzzle.word4,
    puzzle.word5,
  ];

  // Render the puzzle
  return (
    <div className="min-h-screen flex flex-col overflow-hidden fade-in">
      {/* Header */}
      <header className="flex-shrink-0 shadow-md z-10 sticky top-0">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex items-start justify-start bg-gray-100 w-full">
        <div className="game-container w-full">
          <Game
            words={words}
            category={puzzle.category}
            keyWords={puzzle.key_words}
            difficulty={puzzle.difficulty}
            mode="daily"
          />
        </div>
      </main>
    </div>
  );
}
