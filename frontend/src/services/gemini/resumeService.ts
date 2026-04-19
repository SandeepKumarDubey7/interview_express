
import { queryGemini } from './baseService';

export async function analyzeResume(resumeText: string): Promise<{
  score: number;
  suggestions: string[];
  analysis: string;
}> {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) and resume reviewer.
    
    Analyze the following resume and provide:
    1. An ATS compatibility score from 0-100
    2. 3-5 specific suggestions for improvement
    3. A brief analysis of the resume's strengths and weaknesses
    
    Format your response in JSON with these exact keys: "score", "suggestions" (an array of strings), and "analysis" (a string).
    
    Resume:
    ${resumeText}
  `;

  try {
    const response = await queryGemini(prompt);
    
    if (response.error) {
      throw new Error(response.error);
    }

    // Try to parse the JSON response
    try {
      // Extract JSON from the response text
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      
      const jsonResult = JSON.parse(jsonMatch[0]);
      return {
        score: parseInt(jsonResult.score, 10) || 0,
        suggestions: Array.isArray(jsonResult.suggestions) ? jsonResult.suggestions : [],
        analysis: jsonResult.analysis || ""
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError, response.text);
      // Fallback response
      return {
        score: 70,
        suggestions: ["Could not generate specific suggestions. Please try again."],
        analysis: "Error analyzing resume. The AI response couldn't be properly parsed."
      };
    }
  } catch (error) {
    console.error("Resume analysis error:", error);
    return {
      score: 0,
      suggestions: ["An error occurred during analysis. Please try again later."],
      analysis: "Failed to analyze resume due to an error."
    };
  }
}
