// app/daily/page.js (Next.js 13+ App Router)

export const revalidate = 0; // Prevent Next.js from caching the page

import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";
import { DateTime } from 'luxon';

import Header from "../components/Header";
import Game from "../components/Game";

/**
 * Helper to get the "day of year" based on PST using Luxon.
 */
function getPSTDayOfYear() {
  const now = DateTime.utc().setZone('America/Los_Angeles');
  const dayOfYear = now.ordinal; // 1-based
console.log(dayOfYear)
  return dayOfYear;
}

/**
 * Reads `public/daily.csv`, picks the puzzle row for today's PST-based dayOfYear.
 */
async function getDailyPuzzle() {
  // 1. Calculate day of the year using PST
  const dayOfYear = getPSTDayOfYear();

  // **Validation: Ensure dayOfYear is within expected range**
  if (dayOfYear < 1) {
    throw new Error("Day of the year is less than 1. Check date calculations.");
  }

  // 2. Path to daily.csv in public directory
  const csvFilePath = path.join(process.cwd(), "public", "daily.csv");

  // 3. Read and parse the CSV file
  const csvData = await fs.readFile(csvFilePath, "utf-8");
  const parsedData = Papa.parse(csvData, { header: true });

  // **Ensure parsedData has a 'data' property and it's an array**
  if (!parsedData || !parsedData.data || !Array.isArray(parsedData.data)) {
    throw new Error("Invalid CSV format. 'data' property is missing or not an array.");
  }

  // Adjust for 1-based dayOfYear
  const index = dayOfYear - 1;

  // 4. Validate the dayOfYear against the number of puzzles
  if (index >= parsedData.data.length) {
    throw new Error("Day of the year out of range (PST).");
  }

  // 5. Return the puzzle row for the current day
  return parsedData.data[index];
}

export default async function DailyPuzzle() {
  let puzzle;
  try {
    puzzle = await getDailyPuzzle();
  } catch (error) {
    console.error("Error reading daily puzzle:", error.message);
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading daily puzzle.
        </h1>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  // Prepare the words for the Game component
  const words = [
    puzzle.word1,
    puzzle.word2,
    puzzle.word3,
    puzzle.word4,
    puzzle.word5,
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden custom:overflow-auto">
      {/* Header */}
      <header className="h-[10vh] flex-shrink-0">
        <Header />
      </header>

      {/* Main content */}
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
