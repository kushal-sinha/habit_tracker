export interface Habit {
  id: string;
  title: string;
  completedToday: boolean;
  createdAt: string; // ISO date
  color?: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  completedCount: number;
  totalCount: number;
  habitIds: string[];
}

export type CharacterMood = 'idle' | 'habit_completed' | 'all_completed' | 'streak_broken';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dateKey: string; // YYYY-MM-DD
  createdAt: string; // ISO
}

export const XP_PER_HABIT = 10;
export const XP_ALL_DAILY = 25;
export const XP_STREAK_BONUS = 5;
export const XP_LEVEL_BASE = 100;
export const LEVEL_NAMES = [
  'Beginner',
  'Rising Star',
  'Habit Builder',
  'Consistency Builder',
  'Streak Master',
  'Productivity Pro',
  'Legend',
] as const;
