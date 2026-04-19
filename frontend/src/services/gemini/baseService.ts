
// Gemini API key and URL from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

export interface GeminiResponse {
  text: string;
  error?: string;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function queryGemini(prompt: string): Promise<GeminiResponse> {
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });

      // Handle rate limiting with retry
      if (response.status === 429) {
        const waitTime = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
        console.warn(`Gemini rate limited (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${waitTime}ms...`);
        if (attempt < MAX_RETRIES - 1) {
          await sleep(waitTime);
          continue;
        }
        return { text: "", error: "API rate limit exceeded. Please wait a moment and try again." };
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        return { text: "", error: errorData.error?.message || "Failed to get response from Gemini" };
      }

      const data = await response.json();

      // Extract the text from the response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return { text };
    } catch (error) {
      console.error(`Error querying Gemini (attempt ${attempt + 1}):`, error);
      if (attempt < MAX_RETRIES - 1) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      return {
        text: "",
        error: error instanceof Error ? error.message : "An unknown error occurred"
      };
    }
  }

  return { text: "", error: "Failed after multiple retries" };
}
