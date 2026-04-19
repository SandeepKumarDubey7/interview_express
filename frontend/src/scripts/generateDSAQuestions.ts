
import { fetchMultipleLeetCodeQuestions, convertLeetCodeQuestions } from '../services/leetcodeService';
import fs from 'fs';
import path from 'path';

/**
 * Generates DSA questions using the LeetCode API and saves them to a file
 * This script can be run manually to update the questions data
 */
async function generateDSAQuestions(count: number = 100) {
  console.log(`Fetching ${count} questions from LeetCode API...`);
  
  try {
    // Fetch questions from LeetCode API
    const leetcodeQuestions = await fetchMultipleLeetCodeQuestions(count);
    console.log(`Successfully fetched ${leetcodeQuestions.length} questions`);
    
    // Convert to our format
    const dsaQuestions = convertLeetCodeQuestions(leetcodeQuestions);
    
    // Write to a JSON file that can be imported
    const outputPath = path.resolve(__dirname, '../data/generatedDSAQuestions.json');
    fs.writeFileSync(outputPath, JSON.stringify(dsaQuestions, null, 2));
    
    console.log(`Questions saved to ${outputPath}`);
    return dsaQuestions;
  } catch (error) {
    console.error('Error generating DSA questions:', error);
    return [];
  }
}

// You can uncomment and run this function to generate questions
// generateDSAQuestions(1000);

export default generateDSAQuestions;
