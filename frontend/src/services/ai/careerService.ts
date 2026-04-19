/**
 * Career Navigator Service — calls Flask backend for AI career insights.
 */

import { apiPost } from './baseService';

export interface CareerInsight {
  careerPath: string;
  insight: string;
  missingSkills: string[];
  roadmap: { step: number; title: string; description: string; duration: string }[];
  salaryEstimate: string;
}

/**
 * Generate AI-powered career insight based on resume analysis results.
 */
export async function generateCareerInsight(
  careerPath: string,
  detectedSkills: string[],
  missingSkills: string[]
): Promise<string> {
  const result = await apiPost<CareerInsight>(
    '/api/ai/career/insight',
    { careerPath, detectedSkills, missingSkills }
  );

  if (result.error || !result.data) {
    return result.error || 'Career insight unavailable at this time.';
  }

  return result.data.insight || 'No insight generated.';
}

/**
 * Get full career insight including roadmap and salary estimate.
 */
export async function getFullCareerInsight(
  careerPath: string,
  detectedSkills: string[],
  missingSkills: string[]
): Promise<CareerInsight> {
  const result = await apiPost<CareerInsight>(
    '/api/ai/career/insight',
    { careerPath, detectedSkills, missingSkills }
  );

  if (result.error || !result.data) {
    return {
      careerPath,
      insight: result.error || 'Career insight unavailable.',
      missingSkills,
      roadmap: [],
      salaryEstimate: '',
    };
  }

  return result.data;
}
