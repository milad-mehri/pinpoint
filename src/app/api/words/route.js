import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "categories.csv");
  const data = fs.readFileSync(filePath, "utf-8");

  // Parse the CSV into an array of objects
  const rows = data.split("\n").slice(1); // Skip the header
  const categories = rows.map((row) => {
    const [category, key_words, word1, word2, word3, word4, word5, difficulty] =
      row.split(",");
    return { category, key_words, words: [word1, word2, word3, word4, word5], difficulty };
  });

  // Select a random category
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  return NextResponse.json(randomCategory);
}
