import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { dsaQuestions, DSAQuestion } from '@/data/dsaQuestions';
import { generatedDSAQuestions } from '@/data/generatedDSAQuestions';
import { MonacoCodeEditor } from '@/components/dsa/MonacoCodeEditor';
import { TestCasePanel } from '@/components/dsa/TestCasePanel';
import { SubmissionHistory, SubmissionRecord, getSubmissions, saveSubmission } from '@/components/dsa/SubmissionHistory';
import { runAllTestCases, runWithCustomInput, TestCaseResult, SubmissionResult } from '@/services/codeExecutionService';
import { useDSAProgress } from '@/contexts/DSAProgressContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function LeetCodeEditorPage() {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { markQuestionCompleted, getQuestionProgress, getCompletionStats } = useDSAProgress();
    const { addProblemSolved, addActivity, addXP, addPracticeTime } = useUserProgress();

    // Find the question
    const question: DSAQuestion | undefined =
        dsaQuestions.find(q => q.id === questionId) ||
        generatedDSAQuestions.find(q => q.id === questionId);

    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
    const [customOutput, setCustomOutput] = useState<string | null>(null);
    const [customError, setCustomError] = useState<string | null>(null);
    const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
    const [bottomTab, setBottomTab] = useState<'testcase' | 'submissions'>('testcase');
    const [showSuccess, setShowSuccess] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);

    // Helper: get starter code
    const getStarterCode = useCallback((q: DSAQuestion, lang: string): string => {
        const existing = q.starterCode[lang];
        if (existing) return existing;
        const fnName = q.title.replace(/[^a-zA-Z0-9]/g, '').replace(/^(.)/, (_, c) => c.toLowerCase());
        if (lang === 'c') {
            return `#include <stdio.h>\n#include <stdlib.h>\n\n// ${q.title}\nvoid ${fnName}() {\n    // Write your code here\n}\n\nint main() {\n    ${fnName}();\n    return 0;\n}`;
        }
        if (lang === 'cpp') {
            return `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\n// ${q.title}\nclass Solution {\npublic:\n    void ${fnName}() {\n        // Write your code here\n    }\n};\n\nint main() {\n    Solution sol;\n    sol.${fnName}();\n    return 0;\n}`;
        }
        return `// ${q.title}\n// Write your solution here`;
    }, []);

    // Initialize code when question or language changes
    useEffect(() => {
        if (question) {
            setCode(getStarterCode(question, language));
            setTestCaseResults([]);
            setCustomOutput(null);
            setCustomError(null);
        }
    }, [question?.id, language, getStarterCode]);

    // Load submissions
    useEffect(() => {
        if (questionId) {
            setSubmissions(getSubmissions(questionId));
        }
    }, [questionId]);

    if (!currentUser) return <Navigate to="/login" replace />;
    if (!question) {
        return (
            <div className="h-screen bg-[#1e1e1e] flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-xl mb-4">Question not found</p>
                    <button onClick={() => navigate('/practice/dsa')} className="text-blue-400 hover:underline">
                        ← Back to problems
                    </button>
                </div>
            </div>
        );
    }

    const difficultyColor = question.difficulty === 'Easy' ? 'text-emerald-400' : question.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400';
    const difficultyBg = question.difficulty === 'Easy' ? 'bg-emerald-500/10' : question.difficulty === 'Medium' ? 'bg-yellow-500/10' : 'bg-red-500/10';

    // Build test cases from examples + known input/output
    const getTestCases = () => {
        const cases: { input: string; output: string }[] = [];
        // From examples
        question.examples.forEach(ex => {
            if (ex.input && ex.output) {
                cases.push({ input: ex.input, output: ex.output });
            }
        });
        return cases.length > 0 ? cases : [{ input: '', output: '' }];
    };

    const handleRun = async () => {
        setIsRunning(true);
        setTestCaseResults([]);
        setBottomTab('testcase');

        try {
            const testCases = getTestCases();
            const result = await runAllTestCases(code, language, testCases);
            setTestCaseResults(result.testCaseResults);

            if (result.verdict === 'Accepted') {
                toast.success('All sample test cases passed!');
            } else {
                toast.error(`${result.testCasesPassed}/${result.totalTestCases} test cases passed`);
            }
        } catch (error) {
            toast.error('Failed to run code. Please try again.');
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setTestCaseResults([]);
        setBottomTab('testcase');

        try {
            const testCases = getTestCases();
            const allTestCases = [...testCases];

            const result = await runAllTestCases(code, language, allTestCases);
            setTestCaseResults(result.testCaseResults);

            // Save submission
            const submissionRecord: Omit<SubmissionRecord, 'id'> = {
                questionId: question.id,
                language,
                verdict: result.verdict,
                executionTime: result.executionTime,
                memory: result.memory,
                code,
                timestamp: Date.now(),
            };
            saveSubmission(submissionRecord);
            setSubmissions(getSubmissions(question.id));

            if (result.verdict === 'Accepted') {
                // Award XP
                const xpMap = { Easy: 10, Medium: 20, Hard: 40 };
                const xp = xpMap[question.difficulty] || 10;
                const progress = getQuestionProgress(question.id);
                const isFirstSolve = !progress?.completed;

                // Mark completed
                markQuestionCompleted(question.id, question.difficulty, question.category);

                if (isFirstSolve) {
                    setXpEarned(xp);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    // Update dashboard stats
                    addProblemSolved();
                    addPracticeTime(10);
                    addActivity(`Solved "${question.title}" (${question.difficulty})`, 'dsa');
                }

                toast.success('🎉 Solution Accepted!');
            } else {
                toast.error(`Verdict: ${result.verdict}`);
            }
        } catch (error) {
            toast.error('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRunCustom = async (input: string) => {
        setIsRunning(true);
        setCustomOutput(null);
        setCustomError(null);

        try {
            const result = await runWithCustomInput(code, language, input);
            setCustomOutput(result.output);
            if (result.error) setCustomError(result.error);
        } catch {
            setCustomError('Failed to execute code');
        } finally {
            setIsRunning(false);
        }
    };

    const handleRestoreCode = (restoredCode: string, lang: string) => {
        setLanguage(lang);
        setCode(restoredCode);
        toast.info('Code restored from submission');
    };

    const handleReset = () => {
        setCode(getStarterCode(question, language));
        setTestCaseResults([]);
        toast.info('Code reset to starter template');
    };

    return (
        <div className="h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
            {/* Success Animation Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="animate-bounce text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <div className="text-3xl font-bold text-emerald-400 mb-2">Accepted!</div>
                        <div className="text-lg text-yellow-400 font-semibold">+{xpEarned} XP</div>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 h-12 bg-[#252526] border-b border-[#333] shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/practice/dsa')}
                        className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Problems
                    </button>
                    <div className="w-px h-5 bg-[#444]" />
                    <span className="text-sm font-medium text-white/90 truncate max-w-[300px]">{question.title}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${difficultyBg} ${difficultyColor}`}>
                        {question.difficulty}
                    </span>
                    <span className="text-xs text-white/30 hidden sm:inline">{question.category}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Language Selector */}
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-[#333] border border-[#444] text-white/80 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-blue-500/50"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python 3</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                    </select>

                    {/* Reset */}
                    <button
                        onClick={handleReset}
                        className="p-1.5 text-white/40 hover:text-white/70 transition-colors"
                        title="Reset code"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>

                    <div className="w-px h-5 bg-[#444]" />

                    {/* Run */}
                    <button
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#333] hover:bg-[#3e3e3e] border border-[#444] rounded-md text-xs font-medium text-white/80 transition-colors disabled:opacity-50"
                    >
                        {isRunning ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                        Run
                    </button>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-md text-xs font-bold text-white transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        )}
                        Submit
                    </button>
                </div>
            </div>

            {/* Main Content — Horizontal Split */}
            <PanelGroup direction="horizontal" className="flex-1">
                {/* Left Panel — Problem Description */}
                <Panel defaultSize={40} minSize={25}>
                    <div className="h-full overflow-auto bg-[#1e1e1e]">
                        <div className="p-5">
                            {/* Title */}
                            <h1 className="text-xl font-bold text-white mb-3">{question.title}</h1>
                            <div className="flex items-center gap-2 mb-5 flex-wrap">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded ${difficultyBg} ${difficultyColor}`}>
                                    {question.difficulty}
                                </span>
                                <span className="text-xs text-white/40 px-2 py-1 bg-white/5 rounded">{question.category}</span>
                                {getQuestionProgress(question.id)?.completed && (
                                    <span className="text-xs font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Solved
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="text-sm text-white/70 leading-relaxed mb-6 whitespace-pre-wrap">
                                {question.description}
                            </div>

                            {/* Examples */}
                            <div className="space-y-4 mb-6">
                                {question.examples.map((example, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-sm font-bold text-white/80 mb-2">Example {idx + 1}:</h3>
                                        <div className="bg-[#2d2d2d] rounded-lg p-3 text-sm font-mono space-y-1 border border-[#3e3e3e]">
                                            <div>
                                                <span className="text-white/40">Input: </span>
                                                <span className="text-white/80">{example.input}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/40">Output: </span>
                                                <span className="text-white/80">{example.output}</span>
                                            </div>
                                            {example.explanation && (
                                                <div className="pt-1 border-t border-[#444] mt-1">
                                                    <span className="text-white/40">Explanation: </span>
                                                    <span className="text-white/60">{example.explanation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Constraints */}
                            <div>
                                <h3 className="text-sm font-bold text-white/80 mb-2">Constraints:</h3>
                                <ul className="space-y-1">
                                    {question.constraints.map((c, idx) => (
                                        <li key={idx} className="text-sm text-white/50 flex items-start gap-2">
                                            <span className="text-white/20 mt-0.5">•</span>
                                            <code className="text-xs bg-[#2d2d2d] px-1.5 py-0.5 rounded text-white/60">{c}</code>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Panel>

                {/* Resize Handle */}
                <PanelResizeHandle className="w-1.5 bg-[#333] hover:bg-blue-500/50 transition-colors cursor-col-resize" />

                {/* Right Panel — Editor + Console */}
                <Panel defaultSize={60} minSize={35}>
                    <PanelGroup direction="vertical">
                        {/* Code Editor */}
                        <Panel defaultSize={60} minSize={30}>
                            <MonacoCodeEditor
                                value={code}
                                onChange={setCode}
                                language={language}
                            />
                        </Panel>

                        {/* Resize Handle */}
                        <PanelResizeHandle className="h-1.5 bg-[#333] hover:bg-blue-500/50 transition-colors cursor-row-resize" />

                        {/* Bottom — Test Cases / Submissions */}
                        <Panel defaultSize={40} minSize={15}>
                            <div className="h-full flex flex-col bg-[#1e1e1e]">
                                {/* Bottom Tab Bar */}
                                <div className="flex items-center border-b border-[#333] bg-[#252526] shrink-0">
                                    <button
                                        onClick={() => setBottomTab('testcase')}
                                        className={`px-4 py-2 text-xs font-medium transition-colors ${bottomTab === 'testcase'
                                                ? 'text-white border-b-2 border-blue-500 bg-[#1e1e1e]'
                                                : 'text-white/50 hover:text-white/70'
                                            }`}
                                    >
                                        Console
                                    </button>
                                    <button
                                        onClick={() => setBottomTab('submissions')}
                                        className={`px-4 py-2 text-xs font-medium transition-colors ${bottomTab === 'submissions'
                                                ? 'text-white border-b-2 border-blue-500 bg-[#1e1e1e]'
                                                : 'text-white/50 hover:text-white/70'
                                            }`}
                                    >
                                        Submissions
                                        {submissions.length > 0 && (
                                            <span className="ml-1.5 text-[10px] text-white/30">({submissions.length})</span>
                                        )}
                                    </button>
                                </div>

                                {/* Bottom Content */}
                                <div className="flex-1 overflow-auto">
                                    {bottomTab === 'testcase' ? (
                                        <TestCasePanel
                                            testCaseResults={testCaseResults}
                                            isRunning={isRunning || isSubmitting}
                                            onRunCustom={handleRunCustom}
                                            customOutput={customOutput}
                                            customError={customError}
                                            examples={question.examples}
                                        />
                                    ) : (
                                        <SubmissionHistory
                                            questionId={question.id}
                                            submissions={submissions}
                                            onRestoreCode={handleRestoreCode}
                                        />
                                    )}
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                </Panel>
            </PanelGroup>
        </div>
    );
}
