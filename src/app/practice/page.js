// app/practice/page.js

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Papa from "papaparse"; // Install and import PapaParse for client-side parsing

export const metadata = {
  title: "Pinpoint Unlimited - Practice Mode | Category Guessing Game",
  description: "Play Pinpoint's unlimited practice mode! Endless category guessing challenges to improve your skills. Free online game with unlimited puzzles.",
  openGraph: {
    title: "Pinpoint Unlimited - Practice Mode | Category Guessing Game",
    description: "Play Pinpoint's unlimited practice mode! Endless category guessing challenges to improve your skills. Free online game with unlimited puzzles.",
    url: "https://playpinpoint.co/practice",
  },
  alternates: {
    canonical: "https://playpinpoint.co/practice"
  }
};

export default function Practice() {
  const router = useRouter();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        // Fetch the categories.csv file from the public folder
        const response = await fetch("/categories.csv");
        if (!response.ok) {
          throw new Error("Failed to fetch categories.csv");
        }

        const csvData = await response.text();

        // Parse the CSV data to get the count
        const parsedData = Papa.parse(csvData, { header: true });
        const puzzleCount = parsedData.data.length;

        // Generate a random puzzle number
        const randomPuzzle = Math.floor(Math.random() * puzzleCount) + 1;

        // Redirect to the specific puzzle page
        router.replace(`/practice/${randomPuzzle}`);
      } catch (error) {
        console.error("Failed to fetch categories.csv or redirect:", error);
      }
    };

    fetchAndRedirect();
  }, [router]);

  return null; // No UI, just a redirect
}
