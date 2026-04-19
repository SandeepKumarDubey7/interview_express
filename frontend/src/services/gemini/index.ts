
/**
 * DEPRECATED — This directory is replaced by src/services/ai/
 *
 * All exports now redirect to the new Ollama-based AI services.
 * Kept for backward compatibility only.
 */

export { analyzeResume } from '../ai/resumeService';
export { generateInterviewQuestions, evaluateInterviewAnswer } from '../ai/interviewService';
export { explainAptitudeAnswer } from '../ai/aptitudeService';
export { generateCareerInsight } from '../ai/careerService';

// Legacy queryGemini compatibility shim
export type GeminiResponse = { text: string; error: string | null };

export async function queryGemini(prompt: string): Promise<GeminiResponse> {
  const { apiPost } = await import('../ai/baseService');
  const result = await apiPost<{ reply: string }>('/api/ai/chat', {
    message: prompt,
    history: [],
  });

  if (result.error || !result.data) {
    return { text: '', error: result.error || 'Failed to get response' };
  }

  return { text: result.data.reply, error: null };
}
