
/**
 * Gemini Service — DEPRECATED
 *
 * This file now redirects all imports to the new AI service layer.
 * Frontend → Flask Backend → Ollama (NOT Gemini anymore)
 *
 * Kept for backward compatibility with any files still importing from here.
 */

// Re-export from new AI services
export { analyzeResume } from './ai/resumeService';
export { generateInterviewQuestions, evaluateInterviewAnswer } from './ai/interviewService';
export { explainAptitudeAnswer } from './ai/aptitudeService';
export { generateCareerInsight } from './ai/careerService';
export { chatWithAssistant } from './ai/assistantService';

// Legacy queryGemini → now calls the backend via chatWithAssistant
export type GeminiResponse = { text: string; error: string | null };

export async function queryGemini(prompt: string): Promise<GeminiResponse> {
  const { apiPost } = await import('./ai/baseService');
  const result = await apiPost<{ reply: string }>('/api/ai/chat', {
    message: prompt,
    history: [],
  });

  if (result.error || !result.data) {
    return { text: '', error: result.error || 'Failed to get response' };
  }

  return { text: result.data.reply, error: null };
}
