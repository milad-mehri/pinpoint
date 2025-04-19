"use client"; // Ensures this component is client-side

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Game from "../components/Game";
import GameLayout from "../components/GameLayout";
import Papa from "papaparse";
import { DateTime } from "luxon";

/**
 * Helper function to calculate days from January 1, 2025
 */
function getDaysFromJan2025() {
  const now = DateTime.utc().setZone("America/Los_Angeles");
  const jan2025 = DateTime.fromObject({ year: 2025, month: 1, day: 1 }, { zone: "America/Los_Angeles" });
  const diffDays = now.diff(jan2025, 'days').days;
  return Math.floor(diffDays) + 2; // Add 2 to start from line 2
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

  const daysFromJan2025 = getDaysFromJan2025();
  const index = daysFromJan2025 - 1; // Convert to 0-based index

  if (index >= parsedData.data.length) {
    throw new Error("Not enough puzzles available for this date. Please add more puzzles to daily.csv.");
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0">
        <Header />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col sm:justify-start lg:justify-center bg-gray-100">
        <GameLayout>
          <div className="mt-4 lg:mt-0">
            <Game
              words={words}
              category={puzzle.category}
              keyWords={puzzle.key_words}
              difficulty={puzzle.difficulty}
              mode="daily"
            />
          </div>
        </GameLayout>
      </main>
    </div>
  );
}
