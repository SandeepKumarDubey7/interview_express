/**
 * Mock Interview Service — calls Flask backend for AI-powered interview features.
 */

import { apiPost } from './baseService';

export interface InterviewQuestion {
  question: string;
  type: string;
  difficulty: string;
  lookingFor?: string;
}

export interface InterviewEvaluation {
  score: number;
  feedback: string;
  improvementTips: string;
  strengths: string[];
  weaknesses: string[];
}

export interface FollowUp {
  followUp: string;
  reason: string;
}

/**
 * Generate interview questions using AI.
 */
export async function generateInterviewQuestions(
  jobTitle: string = 'Software Engineer',
  experience: string = '3-5',
  type: string = 'mixed',
  count: number = 5
): Promise<InterviewQuestion[]> {
  const result = await apiPost<{ questions: InterviewQuestion[]; source: string }>(
    '/api/ai/interview/questions',
    { jobTitle, experience, type, count }
  );

  if (result.error || !result.data) {
    console.error('Failed to generate questions:', result.error);
    return [];
  }

  return result.data.questions || [];
}

/**
 * Evaluate an interview answer using AI.
 */
export async function evaluateInterviewAnswer(
  question: string,
  answer: string,
  userId?: string
): Promise<InterviewEvaluation> {
  const result = await apiPost<InterviewEvaluation>(
    '/api/ai/interview/evaluate',
    { question, answer, userId }
  );

  if (result.error || !result.data) {
    return {
      score: 0,
      feedback: result.error || 'Could not evaluate answer. Try again.',
      improvementTips: '',
      strengths: [],
      weaknesses: [],
    };
  }

  return result.data;
}

/**
 * Generate a follow-up question based on the exchange.
 */
export async function generateFollowUp(
  question: string,
  answer: string
): Promise<FollowUp> {
  const result = await apiPost<FollowUp>(
    '/api/ai/interview/follow-up',
    { question, answer }
  );

  if (result.error || !result.data) {
    return {
      followUp: 'Can you elaborate more on your approach?',
      reason: 'Default follow-up',
    };
  }

  return result.data;
}
