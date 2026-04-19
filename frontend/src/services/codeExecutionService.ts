/**
 * Code Execution Service
 *
 * Executes code via Flask backend (Python subprocess) — NOT via AI.
 * AI is only used for error explanations and optimization suggestions.
 *
 * Architecture: Frontend → Flask Backend → subprocess (actual execution) + Ollama (analysis)
 */

import { evaluateCode, runCode, analyzeCode } from '@/services/ai/codeService';

const LANGUAGE_NAMES: Record<string, string> = {
    javascript: 'JavaScript',
    python: 'Python 3',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
};

export interface ExecutionResult {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    status: {
        id: number;
        description: string;
    };
    time: string | null;
    memory: number | null;
}

export interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    executionTime: string | null;
    memory: number | null;
    status: string;
    error?: string;
}

export interface SubmissionResult {
    verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
    testCasesPassed: number;
    totalTestCases: number;
    testCaseResults: TestCaseResult[];
    executionTime: string | null;
    memory: number | null;
    analysis?: {
        timeComplexity: string;
        spaceComplexity: string;
        suggestions: string[];
        errorExplanation: string | null;
    };
}

/**
 * Run code against a single test case via Flask backend.
 */
export async function runTestCase(
    code: string,
    language: string,
    input: string,
    expectedOutput: string
): Promise<TestCaseResult> {
    try {
        const result = await evaluateCode(code, language, [{ input, output: expectedOutput }], false);

        if (result.results && result.results.length > 0) {
            const tc = result.results[0];
            return {
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: tc.actualOutput,
                passed: tc.passed,
                executionTime: null,
                memory: null,
                status: tc.passed ? 'Accepted' : (result.error || 'Wrong Answer'),
                error: tc.passed ? undefined : result.error || undefined,
            };
        }

        // Fallback if no results
        return {
            input,
            expectedOutput: expectedOutput.trim(),
            actualOutput: '',
            passed: false,
            executionTime: null,
            memory: null,
            status: result.error || 'Error',
            error: result.error || 'No results returned',
        };
    } catch (error) {
        return {
            input,
            expectedOutput: expectedOutput.trim(),
            actualOutput: '',
            passed: false,
            executionTime: null,
            memory: null,
            status: 'Error',
            error: error instanceof Error ? error.message : 'Execution failed',
        };
    }
}

/**
 * Run code against all test cases for a problem via Flask backend.
 * Code is ACTUALLY EXECUTED via subprocess — not AI.
 */
export async function runAllTestCases(
    code: string,
    language: string,
    testCases: { input: string; output: string }[]
): Promise<SubmissionResult> {
    try {
        // Send all test cases in one request for efficient execution
        const result = await evaluateCode(code, language, testCases, true);

        const testCaseResults: TestCaseResult[] = (result.results || []).map((tc) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: tc.actualOutput,
            passed: tc.passed,
            executionTime: null,
            memory: null,
            status: tc.passed ? 'Accepted' : 'Wrong Answer',
        }));

        const passed = testCaseResults.filter(r => r.passed).length;
        const allPassed = passed === testCaseResults.length;

        let verdict: SubmissionResult['verdict'] = 'Accepted';
        if (!allPassed) {
            const errorType = result.error || '';
            if (errorType.includes('Compilation') || errorType.includes('compile')) verdict = 'Compilation Error';
            else if (errorType.includes('Time Limit')) verdict = 'Time Limit Exceeded';
            else if (errorType.includes('Runtime')) verdict = 'Runtime Error';
            else verdict = 'Wrong Answer';
        }

        return {
            verdict,
            testCasesPassed: passed,
            totalTestCases: testCaseResults.length,
            testCaseResults,
            executionTime: null,
            memory: null,
            analysis: result.analysis,
        };
    } catch (error) {
        return {
            verdict: 'Runtime Error',
            testCasesPassed: 0,
            totalTestCases: testCases.length,
            testCaseResults: testCases.map(tc => ({
                input: tc.input,
                expectedOutput: tc.output.trim(),
                actualOutput: '',
                passed: false,
                executionTime: null,
                memory: null,
                status: 'Error',
                error: error instanceof Error ? error.message : 'Execution failed',
            })),
            executionTime: null,
            memory: null,
        };
    }
}

/**
 * Run code with custom input (no expected output check).
 * Code is ACTUALLY EXECUTED via Flask backend subprocess.
 */
export async function runWithCustomInput(
    code: string,
    language: string,
    input: string
): Promise<{ output: string; error?: string; time?: string; memory?: number }> {
    try {
        const result = await runCode(code, language, input);

        if (result.error) {
            return {
                output: result.stderr || '',
                error: result.error,
            };
        }

        return {
            output: result.stdout || '',
            error: result.stderr ? result.stderr : undefined,
        };
    } catch (error) {
        return {
            output: '',
            error: error instanceof Error ? error.message : 'Execution failed',
        };
    }
}

/**
 * Analyze code with AI for complexity and optimization (no execution).
 */
export async function getCodeAnalysis(
    code: string,
    language: string,
    error?: string
): Promise<{
    timeComplexity: string;
    spaceComplexity: string;
    suggestions: string[];
    errorExplanation: string | null;
}> {
    return analyzeCode(code, language, error);
}

export function getLanguageName(langId: string): string {
    return LANGUAGE_NAMES[langId] || langId;
}
