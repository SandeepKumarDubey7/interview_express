/**
 * Aptitude Service — calls Flask backend for AI-generated questions and explanations.
 */

import { apiPost } from './baseService';

export interface AptitudeQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

/**
 * Generate aptitude questions using AI.
 */
export async function generateAptitudeQuestions(
  category: string = 'quantitative',
  count: number = 5,
  difficulty: string = 'medium'
): Promise<AptitudeQuestion[]> {
  const result = await apiPost<{ questions: AptitudeQuestion[]; source: string }>(
    '/api/ai/aptitude/generate',
    { category, count, difficulty }
  );

  if (result.error || !result.data) {
    return [];
  }

  return result.data.questions || [];
}

/**
 * Get AI explanation for an aptitude answer.
 */
export async function explainAptitudeAnswer(
  question: string,
  correctAnswer: string
): Promise<string> {
  const result = await apiPost<{ explanation: string }>(
    '/api/ai/aptitude/explain',
    { question, correctAnswer }
  );

  if (result.error || !result.data) {
    return result.error || 'Explanation unavailable.';
  }

  return result.data.explanation;
}
