
import { queryGemini } from './baseService';

export async function explainAptitudeAnswer(question: string, correctAnswer: string): Promise<string> {
  const prompt = `
    Explain the following aptitude test question and its correct answer:
    
    Question: ${question}
    Correct Answer: ${correctAnswer}
    
    Please provide:
    1. A clear step-by-step explanation of how to arrive at the answer
    2. Any formulas or concepts needed to understand the question
    3. A brief explanation of why other answers would be incorrect (if applicable)
    
    Make your explanation educational and easy to understand.
  `;
  
  try {
    const response = await queryGemini(prompt);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.text;
  } catch (error) {
    console.error("Error explaining aptitude answer:", error);
    return "Sorry, I couldn't generate an explanation for this question. Please try again later.";
  }
}
