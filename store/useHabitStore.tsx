import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { DayRecord, Habit } from '@/types/habit';
import { todayKey, getDaysInRange, parseDateKey } from '@/utils/date';
import {
  XP_PER_HABIT,
  XP_ALL_DAILY,
  XP_LEVEL_BASE,
  LEVEL_NAMES,
} from '@/types/habit';

const HABITS_KEY = '@habit_tracker_habits';
const RECORDS_KEY = '@habit_tracker_records';
const XP_KEY = '@habit_tracker_xp';
const STREAK_KEY = '@habit_tracker_streak';
const LAST_DATE_KEY = '@habit_tracker_last_date';

function levelFromXP(xp: number): { level: number; progress: number; name: string } {
  let level = 1;
  let needed = XP_LEVEL_BASE;
  let totalSpent = 0;
  while (totalSpent + needed <= xp) {
    totalSpent += needed;
    level++;
    needed = Math.floor(needed * 1.2);
  }
  const progress = level > 1 ? (xp - totalSpent) / needed : xp / needed;
  const name = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  return { level, progress: Math.min(1, progress), name };
}

type HabitStoreValue = ReturnType<typeof useHabitStoreInner>;

const HabitStoreContext = createContext<HabitStoreValue | null>(null);

function useHabitStoreInner() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<Record<string, DayRecord>>({});
  const [totalXP, setTotalXP] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const [h, r, xp, streak, last] = await Promise.all([
        AsyncStorage.getItem(HABITS_KEY),
        AsyncStorage.getItem(RECORDS_KEY),
        AsyncStorage.getItem(XP_KEY),
        AsyncStorage.getItem(STREAK_KEY),
        AsyncStorage.getItem(LAST_DATE_KEY),
      ]);
      if (h) setHabits(JSON.parse(h));
      if (r) setRecords(JSON.parse(r));
      if (xp) setTotalXP(Number(xp));
      if (streak) setCurrentStreak(Number(streak));
      if (last) setLastDate(last);
    } catch (e) {
      console.warn('Failed to load habit store', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistHabits = useCallback((next: Habit[]) => {
    setHabits(next);
    AsyncStorage.setItem(HABITS_KEY, JSON.stringify(next));
  }, []);

  const persistRecords = useCallback((next: Record<string, DayRecord>) => {
    setRecords(next);
    AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(next));
  }, []);

  const persistXP = useCallback((xp: number) => {
    setTotalXP(xp);
    AsyncStorage.setItem(XP_KEY, String(xp));
  }, []);

  const persistStreak = useCallback((streak: number, date: string | null) => {
    setCurrentStreak(streak);
    setLastDate(date);
    AsyncStorage.setItem(STREAK_KEY, String(streak));
    if (date) AsyncStorage.setItem(LAST_DATE_KEY, date);
    else AsyncStorage.removeItem(LAST_DATE_KEY);
  }, []);

  const addHabit = useCallback(
    (title: string) => {
      const newHabit: Habit = {
        id: `habit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        title,
        completedToday: false,
        createdAt: new Date().toISOString(),
      };
      persistHabits([...habits, newHabit]);
      return newHabit;
    },
    [habits, persistHabits]
  );

  const toggleHabit = useCallback(
    (id: string) => {
      const today = todayKey();
      const yesterday = getDaysInRange(2)[0];
      const next = habits.map((h) =>
        h.id === id ? { ...h, completedToday: !h.completedToday } : h
      );
      persistHabits(next);

      const completed = next.filter((h) => h.completedToday).length;
      const total = next.length;
      const wasCompleted = habits.find((h) => h.id === id)?.completedToday ?? false;
      const isNowCompleted = !wasCompleted;

      let xpDelta = 0;
      if (isNowCompleted) {
        xpDelta = XP_PER_HABIT;
        if (total > 0 && completed === total) xpDelta += XP_ALL_DAILY;
      } else {
        // Undo: subtract XP that was previously added
        const hadAllDone = completed + 1 === total;
        xpDelta = -(XP_PER_HABIT + (hadAllDone ? XP_ALL_DAILY : 0));
      }

      const nextRecords = { ...records };
      const todayRecord: DayRecord = nextRecords[today] ?? {
        date: today,
        completedCount: 0,
        totalCount: total,
        habitIds: next.map((h) => h.id),
      };
      todayRecord.completedCount = completed;
      todayRecord.totalCount = total;
      nextRecords[today] = todayRecord;
      persistRecords(nextRecords);

      const newXP = Math.max(0, totalXP + xpDelta);
      persistXP(newXP);

      // Streak: on complete, increment when moving from yesterday to today; on undo, revert today's streak update
      let newStreak = currentStreak;
      if (isNowCompleted) {
        if (lastDate !== today) {
          if (lastDate === yesterday) {
            newStreak = currentStreak + 1;
          } else if (lastDate && lastDate !== today) {
            const last = parseDateKey(lastDate);
            const todayDate = parseDateKey(today);
            const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
            if (diffDays > 1) newStreak = 1;
          } else if (!lastDate) {
            newStreak = 1;
          }
          persistStreak(newStreak, today);
        }
      } else {
        // Undo: revert streak if we had applied it for today
        if (lastDate === today) {
          newStreak = Math.max(0, currentStreak - 1);
          persistStreak(newStreak, newStreak > 0 ? yesterday : null);
        }
      }

      return {
        xpDelta,
        completed,
        total,
        allDone: total > 0 && completed === total,
        newStreak,
        isUncheck: !isNowCompleted,
      };
    },
    [habits, records, totalXP, currentStreak, lastDate, persistHabits, persistRecords, persistXP, persistStreak]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      persistHabits(habits.filter((h) => h.id !== id));
    },
    [habits, persistHabits]
  );

  const resetProgress = useCallback(() => {
    persistXP(0);
    persistStreak(0, null);
  }, [persistXP, persistStreak]);

  const todayRecord = records[todayKey()];
  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalToday = habits.length;
  const allDoneToday = totalToday > 0 && completedToday === totalToday;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const heatmapData = useCallback(() => {
    const keys = getDaysInRange(90);
    return keys.map((date) => ({
      date,
      count: records[date]?.completedCount ?? 0,
      total: records[date]?.totalCount ?? 0,
    }));
  }, [records]);

  const { level, progress: levelProgress, name: levelName } = levelFromXP(totalXP);

  return {
    loaded,
    habits,
    records,
    totalXP,
    currentStreak,
    lastDate,
    addHabit,
    toggleHabit,
    deleteHabit,
    resetProgress,
    todayRecord,
    completedToday,
    totalToday,
    allDoneToday,
    progressPercent,
    heatmapData,
    level,
    levelProgress,
    levelName,
    refresh: load,
  };
}

export function HabitStoreProvider({ children }: { children: React.ReactNode }) {
  const value = useHabitStoreInner();
  return <HabitStoreContext.Provider value={value}>{children}</HabitStoreContext.Provider>;
}

export function useHabitStore(): HabitStoreValue {
  const ctx = useContext(HabitStoreContext);
  if (ctx == null) throw new Error('useHabitStore must be used within HabitStoreProvider');
  return ctx;
}
