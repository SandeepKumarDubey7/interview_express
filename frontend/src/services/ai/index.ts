/**
 * AI Services — barrel exports.
 *
 * All AI features are accessed through this index.
 * Frontend → Flask Backend → Ollama
 */

// Base
export { apiPost, apiGet, checkHealth } from './baseService';

// Assistant
export { chatWithAssistant } from './assistantService';
export type { ChatMessage, ChatResponse } from './assistantService';

// Interview
export {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateFollowUp,
} from './interviewService';
export type { InterviewQuestion, InterviewEvaluation, FollowUp } from './interviewService';

// Resume
export { analyzeResume } from './resumeService';
export type { ResumeAnalysis } from './resumeService';

// Career
export { generateCareerInsight, getFullCareerInsight } from './careerService';
export type { CareerInsight } from './careerService';

// Aptitude
export { generateAptitudeQuestions, explainAptitudeAnswer } from './aptitudeService';
export type { AptitudeQuestion } from './aptitudeService';

// Code
export { evaluateCode, runCode, analyzeCode } from './codeService';
export type { CodeEvaluation, CodeRunResult, TestCaseResult } from './codeService';
