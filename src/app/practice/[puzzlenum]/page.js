// app/practice/[puzzlenum]/page.js

import Header from "../../../components/Header";
import Game from "../../../components/Game";
import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";
import { notFound } from 'next/navigation';

// Add this function
export async function generateStaticParams() {
  // 1. Define the path to the CSV file
  const csvFilePath = path.join(process.cwd(), "public", "categories.csv");

  // 2. Read the CSV file content
  const csvData = await fs.readFile(csvFilePath, "utf-8");

  // 3. Parse the CSV data using Papa Parse
  const parsedData = Papa.parse(csvData, { header: true });

  // 4. Validate the parsed data structure
  if (!parsedData || !parsedData.data || !Array.isArray(parsedData.data)) {
    throw new Error("Invalid CSV format. Expected an array of data.");
  }

  const totalPuzzles = parsedData.data.length;

  // 5. Generate an array of params for each puzzle (1-based indexing)
  const params = Array.from({ length: totalPuzzles }, (_, index) => ({
    puzzlenum: (index + 1).toString(),
  }));

  return params;
}

export default async function PracticePuzzle({ params }) {
  const { puzzlenum } = await params; // Extract the puzzle number from the URL

  // Validate and parse the puzzle number
  const puzzleNumber = parseInt(puzzlenum, 10);
  if (isNaN(puzzleNumber) || puzzleNumber < 1) {
    // Trigger a 404 page if the puzzle number is invalid
    notFound();
  }

  try {
    // 1. Define the path to the CSV file
    const csvFilePath = path.join(process.cwd(), "public", "categories.csv");

    // 2. Read the CSV file content
    const csvData = await fs.readFile(csvFilePath, "utf-8");

    // 3. Parse the CSV data using Papa Parse
    const parsedData = Papa.parse(csvData, { header: true });

    // 4. Validate the parsed data structure
    if (!parsedData || !parsedData.data || !Array.isArray(parsedData.data)) {
      throw new Error("Invalid CSV format. Expected an array of data.");
    }

    const totalPuzzles = parsedData.data.length;

    // 5. Check if the puzzle number is within the valid range
    if (puzzleNumber > totalPuzzles) {
      // Trigger a 404 page if the puzzle number exceeds available puzzles
      notFound();
    }

    // 6. Retrieve the specific puzzle data (1-based indexing)
    const puzzle = parsedData.data[puzzleNumber - 1];

    // 7. Prepare the words array for the Game component
    const words = [
      puzzle.word1,
      puzzle.word2,
      puzzle.word3,
      puzzle.word4,
      puzzle.word5,
    ];

    // 8. Render the page with the fetched puzzle data
    return (
      <div className="h-screen flex flex-col custom:overflow-auto">
        {/* Header */}
        <header className="h-[10vh] flex-shrink-0">
          <Header />
        </header>

        {/* Main content */}
        <main className="h-[90vh] flex-grow lg:flex items-center justify-center bg-gray-100">
          <Game
            words={words}
            category={puzzle.category}
            keyWords={puzzle.key_words}
            difficulty={puzzle.difficulty}
            mode="practice"
            gameId={puzzleNumber}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading puzzle:", error);

    // Render an error message UI if something goes wrong
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading puzzle.
        </h1>
        <p className="text-gray-600">
          Please check the puzzle number or try again later.
        </p>
      </div>
    );
  }
}
