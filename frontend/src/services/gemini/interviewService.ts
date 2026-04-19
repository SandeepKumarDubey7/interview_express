
import { queryGemini } from './baseService';

export async function generateInterviewQuestions(jobTitle: string, experience: string): Promise<string[]> {
  const prompt = `
    Generate 5 realistic interview questions for a ${jobTitle} position with ${experience} years of experience.
    
    For each question, provide:
    1. The question itself
    2. What the interviewer is looking for in the answer
    
    Format each question as:
    "Question: [The question]
    Looking for: [What interviewer expects]"
    
    Return exactly 5 questions.
  `;
  
  try {
    const response = await queryGemini(prompt);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Parse the questions from the response
    const questions = response.text
      .split(/Question:/)
      .filter(q => q.trim().length > 0)
      .map(q => `Question:${q.trim()}`)
      .slice(0, 5);
    
    return questions.length > 0 ? questions : [
      "Question: Tell me about your experience with similar roles.\nLooking for: Relevant experience and how it applies to this position.",
      "Question: How do you handle challenging situations at work?\nLooking for: Problem-solving abilities and resilience.",
      "Question: What are your strengths and weaknesses?\nLooking for: Self-awareness and growth mindset.",
      "Question: Why do you want to work at our company?\nLooking for: Research about the company and alignment with values.",
      "Question: Where do you see yourself in five years?\nLooking for: Career ambitions and commitment."
    ];
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return [
      "Failed to generate interview questions. Please try again."
    ];
  }
}

export async function evaluateInterviewAnswer(question: string, answer: string): Promise<{
  score: number;
  feedback: string;
  improvementTips: string;
}> {
  const prompt = `
    You are an expert interview coach. Evaluate the following interview answer for this question:
    
    Question: ${question}
    
    Answer: ${answer}
    
    Provide:
    1. A score from 0-10
    2. Brief but specific feedback (2-3 sentences)
    3. One tip for improvement
    
    Format your response in JSON with these keys: "score", "feedback", and "improvementTips".
  `;
  
  try {
    const response = await queryGemini(prompt);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Try to parse the JSON response
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      
      const jsonResult = JSON.parse(jsonMatch[0]);
      return {
        score: parseInt(jsonResult.score, 10) || 5,
        feedback: jsonResult.feedback || "No specific feedback provided.",
        improvementTips: jsonResult.improvementTips || "Try to be more specific in your answer."
      };
    } catch (parseError) {
      console.error("Failed to parse evaluation response:", parseError);
      return {
        score: 5,
        feedback: "The response could not be properly evaluated. Please try again.",
        improvementTips: "Ensure your answer is clear and addresses the question directly."
      };
    }
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return {
      score: 0,
      feedback: "Failed to evaluate your answer due to a technical issue.",
      improvementTips: "Please try again later."
    };
  }
}
