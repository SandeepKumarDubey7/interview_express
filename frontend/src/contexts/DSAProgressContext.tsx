import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { apiGet, apiPut } from '@/services/apiClient';

export interface DSAProgress {
  questionId: string;
  completed: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  completedAt?: string;
  attempts: number;
  bestTime?: number;
}

export interface DSATopicProgress {
  topicId: string;
  topicName: string;
  completed: boolean;
  studiedAt?: string;
}

interface DSAProgressContextType {
  questionProgress: DSAProgress[];
  topicProgress: DSATopicProgress[];
  markQuestionCompleted: (questionId: string, difficulty: 'Easy' | 'Medium' | 'Hard', category: string, time?: number) => void;
  markTopicStudied: (topicId: string, topicName: string) => void;
  getQuestionProgress: (questionId: string) => DSAProgress | undefined;
  getTopicProgress: (topicId: string) => DSATopicProgress | undefined;
  getCompletionStats: () => {
    totalCompleted: number;
    easyCompleted: number;
    mediumCompleted: number;
    hardCompleted: number;
    topicsStudied: number;
  };
  resetProgress: () => void;
}

const DSAProgressContext = createContext<DSAProgressContextType | undefined>(undefined);

export const useDSAProgress = () => {
  const context = useContext(DSAProgressContext);
  if (!context) {
    throw new Error('useDSAProgress must be used within a DSAProgressProvider');
  }
  return context;
};

// ── localStorage keys ──
function questionKey(userId: string | undefined) {
  return userId ? `dsa_questions_${userId}` : 'dsaQuestionProgress';
}
function topicKey(userId: string | undefined) {
  return userId ? `dsa_topics_${userId}` : 'dsaTopicProgress';
}

export const DSAProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const [questionProgress, setQuestionProgress] = useState<DSAProgress[]>([]);
  const [topicProgress, setTopicProgress] = useState<DSATopicProgress[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load progress from API (or localStorage fallback)
  useEffect(() => {
    if (!userId) {
      // Guest: load from localStorage only
      try {
        const savedQ = localStorage.getItem(questionKey(undefined));
        setQuestionProgress(savedQ ? JSON.parse(savedQ) : []);
      } catch { setQuestionProgress([]); }
      try {
        const savedT = localStorage.getItem(topicKey(undefined));
        setTopicProgress(savedT ? JSON.parse(savedT) : []);
      } catch { setTopicProgress([]); }
      return;
    }

    apiGet(`/api/dsa-progress/${userId}`)
      .then((data) => {
        const qp = Array.isArray(data.questionProgress) ? data.questionProgress : [];
        const tp = Array.isArray(data.topicProgress) ? data.topicProgress : [];
        setQuestionProgress(qp);
        setTopicProgress(tp);
        localStorage.setItem(questionKey(userId), JSON.stringify(qp));
        localStorage.setItem(topicKey(userId), JSON.stringify(tp));
      })
      .catch(() => {
        // Fallback to localStorage
        try {
          const savedQ = localStorage.getItem(questionKey(userId));
          setQuestionProgress(savedQ ? JSON.parse(savedQ) : []);
        } catch { setQuestionProgress([]); }
        try {
          const savedT = localStorage.getItem(topicKey(userId));
          setTopicProgress(savedT ? JSON.parse(savedT) : []);
        } catch { setTopicProgress([]); }
      });
  }, [userId]);

  // Debounced save to API + localStorage
  useEffect(() => {
    // Save to localStorage immediately
    if (questionProgress.length > 0 || localStorage.getItem(questionKey(userId))) {
      localStorage.setItem(questionKey(userId), JSON.stringify(questionProgress));
    }
    if (topicProgress.length > 0 || localStorage.getItem(topicKey(userId))) {
      localStorage.setItem(topicKey(userId), JSON.stringify(topicProgress));
    }

    if (!userId) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      apiPut(`/api/dsa-progress/${userId}`, {
        questionProgress,
        topicProgress,
      }).catch(console.error);
    }, 1000);

    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [questionProgress, topicProgress, userId]);

  const markQuestionCompleted = useCallback((questionId: string, difficulty: 'Easy' | 'Medium' | 'Hard', category: string, time?: number) => {
    setQuestionProgress(prev => {
      const existingIndex = prev.findIndex(p => p.questionId === questionId);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          completed: true,
          completedAt: new Date().toISOString(),
          attempts: updated[existingIndex].attempts + 1,
          bestTime: time && (!updated[existingIndex].bestTime || time < updated[existingIndex].bestTime!)
            ? time
            : updated[existingIndex].bestTime
        };
        return updated;
      } else {
        return [...prev, {
          questionId,
          completed: true,
          difficulty,
          category,
          completedAt: new Date().toISOString(),
          attempts: 1,
          bestTime: time
        }];
      }
    });
  }, []);

  const markTopicStudied = useCallback((topicId: string, topicName: string) => {
    setTopicProgress(prev => {
      const existingIndex = prev.findIndex(p => p.topicId === topicId);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          completed: true,
          studiedAt: new Date().toISOString()
        };
        return updated;
      } else {
        return [...prev, {
          topicId,
          topicName,
          completed: true,
          studiedAt: new Date().toISOString()
        }];
      }
    });
  }, []);

  const getQuestionProgress = useCallback((questionId: string) => {
    return questionProgress.find(p => p.questionId === questionId);
  }, [questionProgress]);

  const getTopicProgress = useCallback((topicId: string) => {
    return topicProgress.find(p => p.topicId === topicId);
  }, [topicProgress]);

  const getCompletionStats = useCallback(() => {
    const totalCompleted = questionProgress.filter(p => p.completed).length;
    const easyCompleted = questionProgress.filter(p => p.completed && p.difficulty === 'Easy').length;
    const mediumCompleted = questionProgress.filter(p => p.completed && p.difficulty === 'Medium').length;
    const hardCompleted = questionProgress.filter(p => p.completed && p.difficulty === 'Hard').length;
    const topicsStudied = topicProgress.filter(p => p.completed).length;

    return { totalCompleted, easyCompleted, mediumCompleted, hardCompleted, topicsStudied };
  }, [questionProgress, topicProgress]);

  const resetProgress = useCallback(() => {
    setQuestionProgress([]);
    setTopicProgress([]);
    localStorage.removeItem(questionKey(userId));
    localStorage.removeItem(topicKey(userId));
    if (userId) {
      apiPut(`/api/dsa-progress/${userId}`, {
        questionProgress: [],
        topicProgress: [],
      }).catch(console.error);
    }
  }, [userId]);

  return (
    <DSAProgressContext.Provider value={{
      questionProgress,
      topicProgress,
      markQuestionCompleted,
      markTopicStudied,
      getQuestionProgress,
      getTopicProgress,
      getCompletionStats,
      resetProgress
    }}>
      {children}
    </DSAProgressContext.Provider>
  );
};