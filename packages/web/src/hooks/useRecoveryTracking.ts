import { useState, useEffect, useCallback } from 'react';

interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface TriggerEntry {
  id: string;
  trigger: string;
  situation: string;
  urgeLevel: number;
  copingStrategy: string;
  timestamp: number;
}

interface RecoveryData {
  sobrietyStartDate: number;
  dailyGoals: DailyGoal[];
  triggers: TriggerEntry[];
  weeklyProgress: number[]; // Last 7 days of sobriety tracking
}

const STORAGE_KEY = 'mindhack_recovery_data';

export function useRecoveryTracking() {
  const [data, setData] = useState<RecoveryData>({
    sobrietyStartDate: Date.now(),
    dailyGoals: [],
    triggers: [],
    weeklyProgress: Array(7).fill(0),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);
      }
    } catch (error) {
      console.error('Error loading recovery data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveData = useCallback((newData: RecoveryData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving recovery data:', error);
    }
  }, []);

  // Sobriety calculations
  const getSobrietyDays = useCallback(() => {
    const now = Date.now();
    const diff = now - data.sobrietyStartDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [data.sobrietyStartDate]);

  const getSobrietyHours = useCallback(() => {
    const now = Date.now();
    const diff = now - data.sobrietyStartDate;
    return Math.floor(diff / (1000 * 60 * 60));
  }, [data.sobrietyStartDate]);

  const resetSobriety = useCallback(() => {
    saveData({
      ...data,
      sobrietyStartDate: Date.now(),
      weeklyProgress: Array(7).fill(0),
    });
  }, [data, saveData]);

  // Daily goals
  const addDailyGoal = useCallback((title: string) => {
    const newGoal: DailyGoal = {
      id: `goal_${Date.now()}`,
      title,
      completed: false,
      createdAt: Date.now(),
    };
    saveData({
      ...data,
      dailyGoals: [...data.dailyGoals, newGoal],
    });
  }, [data, saveData]);

  const toggleDailyGoal = useCallback((id: string) => {
    saveData({
      ...data,
      dailyGoals: data.dailyGoals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ),
    });
  }, [data, saveData]);

  const deleteDailyGoal = useCallback((id: string) => {
    saveData({
      ...data,
      dailyGoals: data.dailyGoals.filter(goal => goal.id !== id),
    });
  }, [data, saveData]);

  const clearCompletedGoals = useCallback(() => {
    saveData({
      ...data,
      dailyGoals: data.dailyGoals.filter(goal => !goal.completed),
    });
  }, [data, saveData]);

  const getTodayGoals = useCallback(() => {
    const today = new Date().toDateString();
    return data.dailyGoals.filter(
      goal => new Date(goal.createdAt).toDateString() === today
    );
  }, [data.dailyGoals]);

  const getCompletedTodayGoals = useCallback(() => {
    return getTodayGoals().filter(goal => goal.completed);
  }, [getTodayGoals]);

  // Trigger journal
  const addTrigger = useCallback((trigger: string, situation: string, urgeLevel: number, copingStrategy: string) => {
    const newTrigger: TriggerEntry = {
      id: `trigger_${Date.now()}`,
      trigger,
      situation,
      urgeLevel,
      copingStrategy,
      timestamp: Date.now(),
    };
    saveData({
      ...data,
      triggers: [newTrigger, ...data.triggers].slice(0, 100), // Keep last 100
    });
  }, [data, saveData]);

  const deleteTrigger = useCallback((id: string) => {
    saveData({
      ...data,
      triggers: data.triggers.filter(t => t.id !== id),
    });
  }, [data, saveData]);

  const getRecentTriggers = useCallback((days: number = 7) => {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return data.triggers.filter(t => t.timestamp > cutoff);
  }, [data.triggers]);

  const getTriggerStats = useCallback(() => {
    const recent = getRecentTriggers(7);
    const avgUrge = recent.length > 0
      ? recent.reduce((sum, t) => sum + t.urgeLevel, 0) / recent.length
      : 0;
    const commonTriggers = recent.reduce((acc, t) => {
      acc[t.trigger] = (acc[t.trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTriggers: recent.length,
      averageUrgeLevel: avgUrge.toFixed(1),
      mostCommon: Object.entries(commonTriggers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([trigger, count]) => ({ trigger, count })),
    };
  }, [getRecentTriggers]);

  // Weekly progress tracking
  const updateWeeklyProgress = useCallback((dayIndex: number, hours: number) => {
    const newProgress = [...data.weeklyProgress];
    newProgress[dayIndex] = hours;
    saveData({
      ...data,
      weeklyProgress: newProgress,
    });
  }, [data, saveData]);

  // Clear all data
  const clearAllData = useCallback(() => {
    setData({
      sobrietyStartDate: Date.now(),
      dailyGoals: [],
      triggers: [],
      weeklyProgress: Array(7).fill(0),
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    isLoading,
    // Sobriety
    getSobrietyDays,
    getSobrietyHours,
    resetSobriety,
    // Daily goals
    addDailyGoal,
    toggleDailyGoal,
    deleteDailyGoal,
    clearCompletedGoals,
    getTodayGoals,
    getCompletedTodayGoals,
    // Triggers
    addTrigger,
    deleteTrigger,
    getRecentTriggers,
    getTriggerStats,
    // Progress
    updateWeeklyProgress,
    // Utilities
    clearAllData,
  };
}

// Streak calculation hook
export function useStreakCalculation() {
  const [streak, setStreak] = useState(0);

  const calculateStreak = useCallback((weeklyProgress: number[]) => {
    // Simple streak: consecutive days with at least some progress
    let currentStreak = 0;
    for (let i = weeklyProgress.length - 1; i >= 0; i--) {
      if (weeklyProgress[i] > 0) {
        currentStreak++;
      } else if (i === weeklyProgress.length - 1) {
        // Allow today to be empty
        continue;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, []);

  return { streak, calculateStreak };
}

export default useRecoveryTracking;
