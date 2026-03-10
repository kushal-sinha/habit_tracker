import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import type { CharacterId } from '@/types/achievements';
import { getCharacterForStreak, getUnlockedCharacterIds } from '@/types/achievements';
import { todayKey } from '@/utils/date';

const UNLOCKED_KEY = '@habit_tracker_achievements_unlocked';

export type UnlockedMap = Partial<Record<CharacterId, string>>;

export function useAchievementStore(currentStreak: number) {
  const [unlockedAt, setUnlockedAt] = useState<UnlockedMap>({} as UnlockedMap);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(UNLOCKED_KEY);
      if (raw) setUnlockedAt(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load achievements', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persist = useCallback((next: UnlockedMap) => {
    setUnlockedAt(next);
    AsyncStorage.setItem(UNLOCKED_KEY, JSON.stringify(next));
  }, []);

  const unlockAchievement = useCallback(
    (characterId: CharacterId, date: string) => {
      setUnlockedAt((prev) => {
        if (prev[characterId]) return prev;
        const next = { ...prev, [characterId]: date };
        AsyncStorage.setItem(UNLOCKED_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  // When streak increases, unlock any newly reached characters
  useEffect(() => {
    if (!loaded) return;
    const unlockedIds = getUnlockedCharacterIds(currentStreak);
    const today = todayKey();
    setUnlockedAt((prev) => {
      let changed = false;
      const next = { ...prev };
      unlockedIds.forEach((id) => {
        if (!next[id]) {
          next[id] = today;
          changed = true;
        }
      });
      if (changed) AsyncStorage.setItem(UNLOCKED_KEY, JSON.stringify(next));
      return next;
    });
  }, [loaded, currentStreak]);

  const currentCharacter = getCharacterForStreak(currentStreak);

  return {
    loaded,
    unlockedAt,
    currentCharacter,
    unlockAchievement,
    refresh: load,
  };
}
