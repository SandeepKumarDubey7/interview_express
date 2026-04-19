import { useState } from 'react';
import { TestCaseResult } from '@/services/codeExecutionService';

interface TestCasePanelProps {
    testCaseResults: TestCaseResult[];
    isRunning: boolean;
    onRunCustom: (input: string) => void;
    customOutput: string | null;
    customError: string | null;
    examples: { input: string; output: string; explanation?: string }[];
}

export function TestCasePanel({
    testCaseResults,
    isRunning,
    onRunCustom,
    customOutput,
    customError,
    examples,
}: TestCasePanelProps) {
    const [activeTab, setActiveTab] = useState<'results' | 'custom'>('results');
    const [customInput, setCustomInput] = useState(examples[0]?.input || '');

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-[#333]">
            {/* Tab bar */}
            <div className="flex items-center border-b border-[#333] bg-[#252526]">
                <button
                    onClick={() => setActiveTab('results')}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === 'results'
                            ? 'text-white border-b-2 border-blue-500 bg-[#1e1e1e]'
                            : 'text-white/50 hover:text-white/70'
                        }`}
                >
                    Test Results
                    {testCaseResults.length > 0 && (
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${testCaseResults.every(r => r.passed)
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                            {testCaseResults.filter(r => r.passed).length}/{testCaseResults.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('custom')}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === 'custom'
                            ? 'text-white border-b-2 border-blue-500 bg-[#1e1e1e]'
                            : 'text-white/50 hover:text-white/70'
                        }`}
                >
                    Custom Input
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-3">
                {activeTab === 'results' ? (
                    <div className="space-y-3">
                        {isRunning ? (
                            <div className="flex items-center gap-3 py-8 justify-center text-white/50">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                                <span className="text-sm">Running test cases...</span>
                            </div>
                        ) : testCaseResults.length === 0 ? (
                            <div className="text-center py-8 text-white/30 text-sm">
                                Click "Run Code" to test your solution
                            </div>
                        ) : (
                            testCaseResults.map((result, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-lg border p-3 ${result.passed
                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                            : 'border-red-500/30 bg-red-500/5'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${result.passed
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : result.status === 'Time Limit Exceeded'
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : result.status === 'Runtime Error'
                                                            ? 'bg-yellow-500/20 text-yellow-400'
                                                            : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {result.status}
                                            </span>
                                            <span className="text-xs text-white/40">Case {idx + 1}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-white/30">
                                            {result.executionTime && <span>⏱ {result.executionTime}</span>}
                                            {result.memory && <span>💾 {(result.memory / 1000).toFixed(1)} MB</span>}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-1.5 text-xs font-mono">
                                        <div>
                                            <span className="text-white/40">Input: </span>
                                            <span className="text-white/70">{result.input}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/40">Expected: </span>
                                            <span className="text-emerald-400/80">{result.expectedOutput}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/40">Output: </span>
                                            <span className={result.passed ? 'text-emerald-400/80' : 'text-red-400/80'}>
                                                {result.actualOutput || '(empty)'}
                                            </span>
                                        </div>
                                        {result.error && (
                                            <div className="mt-2 p-2 rounded bg-red-500/10 text-red-400/80 whitespace-pre-wrap">
                                                {result.error}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* Custom Input Tab */
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-white/50 mb-1.5 block">Custom Input</label>
                            <textarea
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                className="w-full h-24 bg-[#2d2d2d] border border-[#444] rounded-lg p-3 text-sm text-white/80 font-mono resize-none focus:outline-none focus:border-blue-500/50"
                                placeholder="Enter your custom test input..."
                            />
                        </div>
                        <button
                            onClick={() => onRunCustom(customInput)}
                            disabled={isRunning}
                            className="px-4 py-2 bg-[#2d2d2d] border border-[#444] rounded-lg text-sm text-white/70 hover:bg-[#333] hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isRunning ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Run Custom Test
                                </>
                            )}
                        </button>

                        {/* Custom Output */}
                        {(customOutput || customError) && (
                            <div className="mt-2">
                                <label className="text-xs font-medium text-white/50 mb-1.5 block">Output</label>
                                <div className={`p-3 rounded-lg border text-sm font-mono whitespace-pre-wrap ${customError
                                        ? 'bg-red-500/5 border-red-500/30 text-red-400/80'
                                        : 'bg-[#2d2d2d] border-[#444] text-white/70'
                                    }`}>
                                    {customError || customOutput}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
