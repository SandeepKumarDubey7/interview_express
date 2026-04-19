
// LeetCode GraphQL API service
interface LeetCodeTag {
  name: string;
}

interface LeetCodeQuestion {
  title: string;
  titleSlug: string;
  difficulty: string;
  topicTags: LeetCodeTag[];
}

interface LeetCodeResponse {
  data: {
    randomQuestion: LeetCodeQuestion;
  };
}

/**
 * Fetches a random question from the LeetCode GraphQL API
 */
export async function fetchRandomLeetCodeQuestion(): Promise<LeetCodeQuestion | null> {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          {
            randomQuestion {
              title
              titleSlug
              difficulty
              topicTags {
                name
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from LeetCode API: ${response.status}`);
    }

    const data: LeetCodeResponse = await response.json();
    return data.data.randomQuestion;
  } catch (error) {
    console.error('Error fetching random LeetCode question:', error);
    return null;
  }
}

/**
 * Fetches multiple random questions from the LeetCode GraphQL API
 * @param count Number of questions to fetch
 */
export async function fetchMultipleLeetCodeQuestions(count: number = 20): Promise<LeetCodeQuestion[]> {
  const questions: LeetCodeQuestion[] = [];
  const uniqueTitleSlugs = new Set<string>();

  // We'll fetch questions in batches to avoid overloading the API
  const batchSize = 10;
  const maxRetries = Math.min(count * 2, 200); // Limit retries to avoid infinite loops
  let retries = 0;

  while (questions.length < count && retries < maxRetries) {
    try {
      const question = await fetchRandomLeetCodeQuestion();
      
      if (question && !uniqueTitleSlugs.has(question.titleSlug)) {
        uniqueTitleSlugs.add(question.titleSlug);
        questions.push(question);
        
        // Log progress every 10 questions
        if (questions.length % 10 === 0) {
          console.log(`Fetched ${questions.length}/${count} LeetCode questions`);
        }
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error in batch fetch:', error);
    }
    
    retries++;
  }

  return questions;
}

/**
 * Converts LeetCode questions to our DSA question format
 * Note: This is a partial conversion as we don't have access to all LeetCode question details
 */
export function convertLeetCodeQuestions(leetcodeQuestions: LeetCodeQuestion[]): any[] {
  return leetcodeQuestions.map((q, index) => {
    const difficulty = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1).toLowerCase() as "Easy" | "Medium" | "Hard";
    const category = q.topicTags.length > 0 ? q.topicTags[0].name : "Algorithm";
    
    return {
      id: q.titleSlug,
      title: q.title,
      difficulty: difficulty,
      category: category,
      description: `Visit LeetCode for the full description: https://leetcode.com/problems/${q.titleSlug}/`,
      examples: [
        {
          input: "See LeetCode for examples",
          output: "See LeetCode for examples"
        }
      ],
      constraints: ["See LeetCode for constraints"],
      starterCode: {
        javascript: `function solve${q.title.replace(/[^a-zA-Z0-9]/g, '')}() {\n  // Write your code here\n};`,
        python: `def solve_${q.titleSlug.replace(/-/g, '_')}():\n    # Write your code here\n    pass`,
        java: `class Solution {\n    public void solve${q.title.replace(/[^a-zA-Z0-9]/g, '')}() {\n        // Write your code here\n    }\n}`
      }
    };
  });
}
