/**
 * Code Evaluation Service — calls Flask backend for code execution + AI analysis.
 *
 * IMPORTANT: Code is executed server-side via subprocess, NOT by AI.
 * AI is only used for error explanations and optimization suggestions.
 */

import { apiPost } from './baseService';

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface CodeEvaluation {
  passed: boolean;
  results: TestCaseResult[];
  error: string | null;
  analysis?: {
    timeComplexity: string;
    spaceComplexity: string;
    suggestions: string[];
    errorExplanation: string | null;
  };
}

export interface CodeRunResult {
  stdout: string;
  stderr: string;
  returncode: number;
  error: string | null;
}

/**
 * Evaluate code against test cases (with optional AI analysis).
 */
export async function evaluateCode(
  code: string,
  language: string,
  testCases: { input: string; output: string }[],
  analyze: boolean = true
): Promise<CodeEvaluation> {
  const result = await apiPost<CodeEvaluation>(
    '/api/ai/code/evaluate',
    { code, language, testCases, analyze }
  );

  if (result.error || !result.data) {
    return {
      passed: false,
      results: [],
      error: result.error || 'Code evaluation failed.',
    };
  }

  return result.data;
}

/**
 * Run code with custom input (no test case validation).
 */
export async function runCode(
  code: string,
  language: string,
  input: string = ''
): Promise<CodeRunResult> {
  const result = await apiPost<CodeRunResult>(
    '/api/ai/code/run',
    { code, language, input }
  );

  if (result.error || !result.data) {
    return {
      stdout: '',
      stderr: result.error || 'Code execution failed.',
      returncode: -1,
      error: result.error || 'Failed to run code.',
    };
  }

  return result.data;
}

/**
 * Analyze code with AI (time complexity, suggestions).
 */
export async function analyzeCode(
  code: string,
  language: string,
  error?: string
): Promise<{
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: string[];
  errorExplanation: string | null;
}> {
  const result = await apiPost<{
    timeComplexity: string;
    spaceComplexity: string;
    suggestions: string[];
    errorExplanation: string | null;
  }>('/api/ai/code/analyze', { code, language, error });

  if (result.error || !result.data) {
    return {
      timeComplexity: 'Unknown',
      spaceComplexity: 'Unknown',
      suggestions: [],
      errorExplanation: null,
    };
  }

  return result.data;
}
