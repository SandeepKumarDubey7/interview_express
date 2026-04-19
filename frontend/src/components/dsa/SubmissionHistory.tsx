import { getLanguageName } from '@/services/codeExecutionService';

export interface SubmissionRecord {
    id: string;
    questionId: string;
    language: string;
    verdict: string;
    executionTime: string | null;
    memory: number | null;
    code: string;
    timestamp: number;
}

// localStorage helpers
const STORAGE_KEY = 'dsa_submissions';

export function getSubmissions(questionId: string): SubmissionRecord[] {
    try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SubmissionRecord[];
        return all.filter(s => s.questionId === questionId).sort((a, b) => b.timestamp - a.timestamp);
    } catch {
        return [];
    }
}

export function saveSubmission(record: Omit<SubmissionRecord, 'id'>): void {
    try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SubmissionRecord[];
        all.push({ ...record, id: crypto.randomUUID() });
        // Keep max 100 submissions
        if (all.length > 100) all.splice(0, all.length - 100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
        // Ignore storage failures
    }
}

interface SubmissionHistoryProps {
    questionId: string;
    submissions: SubmissionRecord[];
    onRestoreCode: (code: string, language: string) => void;
}

export function SubmissionHistory({ questionId, submissions, onRestoreCode }: SubmissionHistoryProps) {
    if (submissions.length === 0) {
        return (
            <div className="text-center py-6 text-white/30 text-sm">
                No submissions yet
            </div>
        );
    }

    return (
        <div className="overflow-auto">
            <table className="w-full text-xs">
                <thead>
                    <tr className="text-white/40 border-b border-[#333]">
                        <th className="text-left py-2 px-3 font-medium">Status</th>
                        <th className="text-left py-2 px-3 font-medium">Language</th>
                        <th className="text-left py-2 px-3 font-medium">Time</th>
                        <th className="text-left py-2 px-3 font-medium">Memory</th>
                        <th className="text-left py-2 px-3 font-medium">Submitted</th>
                        <th className="text-left py-2 px-3 font-medium"></th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-[#333]/50 hover:bg-white/[0.02]">
                            <td className="py-2 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.verdict === 'Accepted'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : sub.verdict === 'Time Limit Exceeded'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : sub.verdict === 'Runtime Error'
                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {sub.verdict}
                                </span>
                            </td>
                            <td className="py-2 px-3 text-white/60">{getLanguageName(sub.language)}</td>
                            <td className="py-2 px-3 text-white/60">{sub.executionTime || '-'}</td>
                            <td className="py-2 px-3 text-white/60">
                                {sub.memory ? `${(sub.memory / 1000).toFixed(1)} MB` : '-'}
                            </td>
                            <td className="py-2 px-3 text-white/40">
                                {new Date(sub.timestamp).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </td>
                            <td className="py-2 px-3">
                                <button
                                    onClick={() => onRestoreCode(sub.code, sub.language)}
                                    className="text-blue-400/70 hover:text-blue-400 text-[10px] font-medium"
                                >
                                    Restore
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
