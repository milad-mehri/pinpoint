// app/practice/[puzzlenum]/page.js

import Header from "../../../components/Header";
import Game from "../../../components/Game";
import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";
import { notFound } from "next/navigation";

// Helper function to read and parse the CSV file
async function readCategoriesCSV() {
  try {
    const csvFilePath = path.join(process.cwd(), "public", "categories.csv");
    const csvData = await fs.readFile(csvFilePath, "utf-8");
    const parsedData = Papa.parse(csvData, { header: true });
    
    if (!parsedData.data || !Array.isArray(parsedData.data)) {
      throw new Error("Invalid CSV format. Expected an array of data.");
    }
    
    return parsedData.data;
  } catch (error) {
    console.error("Error reading categories CSV:", error);
    throw error;
  }
}

// Optimized generateStaticParams function
export async function generateStaticParams() {
  try {
    const categoriesData = await readCategoriesCSV();
    
    // Generate params for each puzzle (1-based indexing)
    return categoriesData.map((_, index) => ({
      puzzlenum: (index + 1).toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
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
    // Get puzzle data using the shared function
    const categoriesData = await readCategoriesCSV();
    const totalPuzzles = categoriesData.length;

    // Check if the puzzle number is within the valid range
    if (puzzleNumber > totalPuzzles) {
      // Trigger a 404 page if the puzzle number exceeds available puzzles
      notFound();
    }

    // Retrieve the specific puzzle data (1-based indexing)
    const puzzle = categoriesData[puzzleNumber - 1];

    // Prepare the words array for the Game component
    const words = [
      puzzle.word1,
      puzzle.word2,
      puzzle.word3,
      puzzle.word4,
      puzzle.word5,
    ];

    // Render the page with the fetched puzzle data
    return (
      <div className="min-h-screen flex flex-col overflow-hidden fade-in">
        {/* Header */}
        <header className="flex-shrink-0 shadow-md z-10 sticky-top">
          <Header />
        </header>

        {/* Main Content */}
        <main className="flex-center bg-gray-100 w-full">
          <div className="game-container w-full">
            <Game
              words={words}
              category={puzzle.category}
              keyWords={puzzle.key_words}
              difficulty={puzzle.difficulty}
              mode="practice"
              gameId={puzzleNumber}
            />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading puzzle:", error);

    // Render an error message UI if something goes wrong
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100 fade-in">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error loading puzzle.</h1>
          <p className="text-gray-600 mb-4">Please check the puzzle number or try again later.</p>
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
}
