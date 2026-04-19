/**
 * Resume ATS Analysis Service — calls Flask backend.
 */

import { apiPost } from './baseService';

export interface ResumeAnalysis {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  formattingIssues: string[];
  improvements: string[];
  analysis: string;
}

/**
 * Analyze a resume for ATS compatibility.
 */
export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const result = await apiPost<ResumeAnalysis>(
    '/api/ai/resume/analyze',
    { resumeText }
  );

  if (result.error || !result.data) {
    return {
      atsScore: 0,
      missingKeywords: [],
      suggestions: [result.error || 'Failed to analyze resume. Please try again.'],
      formattingIssues: [],
      improvements: [],
      analysis: result.error || 'Analysis unavailable.',
    };
  }

  return result.data;
}
