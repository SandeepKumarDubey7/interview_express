
import { queryGemini } from './baseService';

export async function generateCareerInsight(
  careerPath: string,
  detectedSkills: string[],
  missingSkills: string[]
): Promise<string> {
  const prompt = `
    You are a career advisor powered by AI. Based on the following ML career prediction results, 
    provide a personalized career insight paragraph (4-6 sentences) that includes:
    
    1. Why this career path is a good fit based on the detected skills
    2. Industry trends and demand for this role
    3. Specific actionable advice to bridge the skill gaps
    4. Salary growth potential and career progression
    
    Predicted Career Path: ${careerPath}
    Detected Skills: ${detectedSkills.join(', ')}
    Missing Skills: ${missingSkills.join(', ')}
    
    Write in a motivating, professional tone. Be specific and actionable.
    Do NOT use markdown formatting — just plain text paragraphs.
  `;

  try {
    const response = await queryGemini(prompt);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.text;
  } catch (error) {
    console.error("Error generating career insight:", error);
    return "Unable to generate AI career insight at this time. Please try again later.";
  }
}
