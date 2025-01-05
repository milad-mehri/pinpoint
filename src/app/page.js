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
  const response = await fetch("/nextjs-github-pages/daily.csv"); // Fetch the CSV file from the public directory
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
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500">Error loading daily puzzle.</h1>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  // Loading state
  if (!puzzle) {
    return <div className="h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
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
    <div className="h-screen flex flex-col overflow-hidden custom:overflow-auto">
      {/* Header */}
      <header className="h-[10vh] flex-shrink-0">
        <Header />
      </header>

      {/* Main Content */}
      <main className="h-[90vh] flex-grow overflow-hidden lg:flex items-center justify-center bg-gray-100">
        <Game
          words={words}
          category={puzzle.category}
          keyWords={puzzle.key_words}
          difficulty={puzzle.difficulty}
          mode="daily"
        />
      </main>
    </div>
  );
}
