// capitalize_csv.js

const fs = require('fs/promises');
const path = require('path');
const Papa = require('papaparse');

/**
 * Helper Function: Capitalize First Letter
 * 
 * Takes a string and returns it with the first letter capitalized.
 * If the input is not a string or is empty, it returns the input as-is.
 * 
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.trim() === '') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Processes the CSV file by capitalizing specified fields.
 * 
 * @param {string} inputFile - Path to the input CSV file.
 * @param {string} outputFile - Path to the output CSV file.
 * @param {Array<string>} fieldsToCapitalize - List of field names to capitalize.
 */
async function processCSV(inputFile, outputFile, fieldsToCapitalize) {
  try {
    // Read the CSV file
    const csvContent = await fs.readFile(inputFile, 'utf-8');
    
    // Parse the CSV data
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true
    });
    
    if (!parsed.data || !Array.isArray(parsed.data)) {
      throw new Error('Invalid CSV format. Expected a header row.');
    }
    
    // Process each row
    const processedData = parsed.data.map(row => {
      fieldsToCapitalize.forEach(field => {
        if (row[field]) {
          row[field] = capitalizeFirstLetter(row[field]);
        }
      });
      return row;
    });
    
    // Stringify the processed data back to CSV with minimal quoting
    const csvOutput = Papa.unparse(processedData, {
      columns: parsed.meta.fields,
      quotes: false, // Let PapaParse decide quoting based on content
      quoteChar: '"',
      delimiter: ",",
      escapeChar: '"',
      header: true
    });
    
    // Write the transformed data to the output file
    await fs.writeFile(outputFile, csvOutput, 'utf-8');
    
    console.log(`Successfully processed '${inputFile}' and saved to '${outputFile}'.`);
  } catch (error) {
    console.error(`Error processing CSV: ${error.message}`);
  }
}

/**
 * Main Function
 * 
 * Creates a backup of the original CSV and processes it.
 */
async function main() {
  const inputCSV = 'public/categories.csv'; // Input CSV file name
  const backupCSV = 'public/categories_backup.csv'; // Backup file name
  const outputCSV = 'public/categories_capitalized.csv'; // Output CSV file name
  
  // Fields to capitalize
  const fields = ['word1', 'word2', 'word3', 'word4', 'word5'];
  
  try { 
    // Check if input CSV exists
    await fs.access(inputCSV);
  } catch (err) {
    console.error(`Error: The file '${inputCSV}' does not exist in the current directory.`);
    process.exit(1);
  }
  
  try {
    // Create a backup of the original CSV
    await fs.copyFile(inputCSV, backupCSV);
    console.log(`Backup created: '${backupCSV}'`);
  } catch (err) {
    console.error(`Failed to create backup: ${err.message}`);
    process.exit(1);
  }
  
  // Process the CSV and write to output file
  await processCSV(inputCSV, outputCSV, fields);
}

main();
