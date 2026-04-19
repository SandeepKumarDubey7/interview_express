import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { apiGet, apiPut } from '@/services/apiClient';

// ── Types ──────────────────────────────────────────────
export interface ActivityItem {
    id: string;
    text: string;
    type: 'aptitude' | 'resume' | 'dsa' | 'interview' | 'resource' | 'general';
    timestamp: string;
}

export interface UserStats {
    problemsSolved: number;
    practiceMinutes: number;
    mockInterviews: number;
    correctAnswers: number;
    totalAnswers: number;
    streak: number;
    lastActiveDate: string;
    xp: number;
    activities: ActivityItem[];
}

interface UserProgressContextType {
    stats: UserStats;
    addProblemSolved: () => void;
    addPracticeTime: (minutes: number) => void;
    addMockInterview: () => void;
    addAptitudeResult: (correct: number, total: number) => void;
    addActivity: (text: string, type: ActivityItem['type']) => void;
    addXP: (amount: number) => void;
    level: number;
    xpForNextLevel: number;
    xpInCurrentLevel: number;
    accuracyRate: number;
    practiceHours: number;
    earnedBadges: { emoji: string; label: string }[];
}

// ── Defaults ───────────────────────────────────────────
const DEFAULT_STATS: UserStats = {
    problemsSolved: 0,
    practiceMinutes: 0,
    mockInterviews: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    streak: 0,
    lastActiveDate: '',
    xp: 0,
    activities: [],
};

// ── Helpers ────────────────────────────────────────────
function storageKey(userId: string | undefined) {
    return userId ? `ie_progress_${userId}` : 'ie_progress_guest';
}

function loadStatsLocal(userId: string | undefined): UserStats {
    try {
        const raw = localStorage.getItem(storageKey(userId));
        if (raw) return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return { ...DEFAULT_STATS };
}

function saveStatsLocal(userId: string | undefined, stats: UserStats) {
    localStorage.setItem(storageKey(userId), JSON.stringify(stats));
}

function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

function computeLevel(xp: number): { level: number; xpForNext: number; xpInCurrent: number } {
    let level = 1;
    let totalNeeded = 0;
    while (true) {
        const needed = level * 100;
        if (xp < totalNeeded + needed) {
            return { level, xpForNext: needed, xpInCurrent: xp - totalNeeded };
        }
        totalNeeded += needed;
        level++;
    }
}

const ALL_BADGES = [
    { emoji: '🚀', label: 'Quick Start', condition: (s: UserStats) => s.problemsSolved >= 1 || s.mockInterviews >= 1 },
    { emoji: '🎯', label: 'Sharpshooter', condition: (s: UserStats) => s.totalAnswers >= 10 && (s.correctAnswers / s.totalAnswers) >= 0.8 },
    { emoji: '📝', label: 'Resume Pro', condition: (s: UserStats) => s.activities.some(a => a.type === 'resume') },
    { emoji: '🔥', label: 'On Fire', condition: (s: UserStats) => s.streak >= 3 },
    { emoji: '⚡', label: 'Speed Demon', condition: (s: UserStats) => s.problemsSolved >= 10 },
    { emoji: '🏆', label: 'Veteran', condition: (s: UserStats) => s.problemsSolved >= 50 },
];

// ── Context ────────────────────────────────────────────
const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const useUserProgress = () => {
    const context = useContext(UserProgressContext);
    if (!context) throw new Error('useUserProgress must be used within UserProgressProvider');
    return context;
};

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const userId = currentUser?.id;
    const [stats, setStats] = useState<UserStats>(() => loadStatsLocal(userId));
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Load progress from API when user changes
    useEffect(() => {
        setDataLoaded(false);
        if (!userId) {
            setStats(loadStatsLocal(undefined));
            setDataLoaded(true);
            return;
        }
        apiGet(`/api/progress/${userId}`)
            .then((data) => {
                const { _id, userId: _uid, ...progressData } = data;
                const merged = { ...DEFAULT_STATS, ...progressData };
                setStats(merged);
                saveStatsLocal(userId, merged);
                setDataLoaded(true);
            })
            .catch(() => {
                setStats(loadStatsLocal(userId));
                setDataLoaded(true);
            });
    }, [userId]);

    // Debounced save to API + localStorage on change
    useEffect(() => {
        saveStatsLocal(userId, stats);

        if (!userId) return;
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            const { ...toSave } = stats;
            apiPut(`/api/progress/${userId}`, toSave).catch(console.error);
        }, 1000);

        return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
    }, [stats, userId]);

    // Evaluate and update streak AFTER data has loaded from API
    useEffect(() => {
        if (!dataLoaded || !userId) return;

        const today = getToday();
        const lastActive = stats.lastActiveDate;

        // Already active today — no change needed
        if (lastActive === today) return;

        if (!lastActive) {
            // First time user — start streak at 1
            setStats(prev => ({ ...prev, streak: 1, lastActiveDate: today }));
        } else {
            const lastDate = new Date(lastActive);
            const todayDate = new Date(today);
            const diffDays = Math.floor(
                (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === 1) {
                // Consecutive day — increment streak
                setStats(prev => ({ ...prev, streak: prev.streak + 1, lastActiveDate: today }));
            } else if (diffDays > 1) {
                // Missed day(s) — reset streak to 1 for today
                setStats(prev => ({ ...prev, streak: 1, lastActiveDate: today }));
            }
        }
    }, [dataLoaded, userId]); // eslint-disable-line react-hooks/exhaustive-deps

    const bumpStreak = useCallback(() => {
        const today = getToday();
        setStats(prev => {
            if (prev.lastActiveDate === today) return prev;
            const lastDate = prev.lastActiveDate ? new Date(prev.lastActiveDate) : null;
            const todayDate = new Date(today);
            let newStreak = 1;
            if (lastDate) {
                const diffDays = Math.floor(
                    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                newStreak = diffDays === 1 ? prev.streak + 1 : 1;
            }
            return { ...prev, streak: newStreak, lastActiveDate: today };
        });
    }, []);

    const addActivity = useCallback((text: string, type: ActivityItem['type']) => {
        setStats(prev => ({
            ...prev,
            activities: [
                { id: Date.now().toString(36), text, type, timestamp: new Date().toISOString() },
                ...prev.activities.slice(0, 19),
            ],
        }));
        bumpStreak();
    }, [bumpStreak]);

    const addProblemSolved = useCallback(() => {
        setStats(prev => ({ ...prev, problemsSolved: prev.problemsSolved + 1, xp: prev.xp + 10 }));
        bumpStreak();
    }, [bumpStreak]);

    const addPracticeTime = useCallback((minutes: number) => {
        setStats(prev => ({ ...prev, practiceMinutes: prev.practiceMinutes + minutes, xp: prev.xp + Math.floor(minutes) }));
        bumpStreak();
    }, [bumpStreak]);

    const addMockInterview = useCallback(() => {
        setStats(prev => ({ ...prev, mockInterviews: prev.mockInterviews + 1, xp: prev.xp + 25 }));
        bumpStreak();
    }, [bumpStreak]);

    const addAptitudeResult = useCallback((correct: number, total: number) => {
        setStats(prev => ({
            ...prev,
            correctAnswers: prev.correctAnswers + correct,
            totalAnswers: prev.totalAnswers + total,
            xp: prev.xp + correct * 5,
        }));
        bumpStreak();
    }, [bumpStreak]);

    const addXP = useCallback((amount: number) => {
        setStats(prev => ({ ...prev, xp: prev.xp + amount }));
    }, []);

    const { level, xpForNext, xpInCurrent } = computeLevel(stats.xp);
    const accuracyRate = stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0;
    const practiceHours = Math.round((stats.practiceMinutes / 60) * 10) / 10;
    const earnedBadges = ALL_BADGES.filter(b => b.condition(stats)).map(({ emoji, label }) => ({ emoji, label }));

    return (
        <UserProgressContext.Provider value={{
            stats,
            addProblemSolved,
            addPracticeTime,
            addMockInterview,
            addAptitudeResult,
            addActivity,
            addXP,
            level,
            xpForNextLevel: xpForNext,
            xpInCurrentLevel: xpInCurrent,
            accuracyRate,
            practiceHours,
            earnedBadges,
        }}>
            {children}
        </UserProgressContext.Provider>
    );
};
