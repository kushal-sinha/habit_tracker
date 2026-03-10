import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Character3D } from '@/components/Character3D';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';
import { HabitCard } from '@/components/HabitCard';
import { Heatmap } from '@/components/Heatmap';
import { LevelCard } from '@/components/LevelCard';
import { ProgressRing } from '@/components/ProgressRing';
import { StreakCounter } from '@/components/StreakCounter';
import { TodoCard } from '@/components/TodoCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDailyHabitReminder } from '@/hooks/useDailyHabitReminder';
import { useAchievementStore } from '@/store/useAchievementStore';
import { useHabitStore } from '@/store/useHabitStore';
import { useTodoStore } from '@/store/useTodoStore';
import type { CharacterMood } from '@/types/habit';
import { getGreeting } from '@/utils/date';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme ?? 'dark'];
  const {
    loaded,
    habits,
    toggleHabit,
    deleteHabit,
    completedToday,
    totalToday,
    allDoneToday,
    currentStreak,
    heatmapData,
    level,
    levelProgress,
    levelName,
    totalXP,
  } = useHabitStore();

  const { currentCharacter } = useAchievementStore(currentStreak);

  const {
    todos: todayTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodoStore();

  const [showCelebration, setShowCelebration] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [characterMood, setCharacterMood] = useState<CharacterMood>('idle');
  const prevAllDone = useRef(false);
  const prevStreak = useRef(currentStreak);
  const justIncreasedStreak = useRef(false);

  const heatmap = useMemo(() => heatmapData(), [heatmapData]);

  const completedTodos = todayTodos.filter((t) => t.completed).length;
  const totalTodos = todayTodos.length;
  const dailyProgressPercent =
    totalToday + totalTodos > 0
      ? ((completedToday + completedTodos) / (totalToday + totalTodos)) * 100
      : 0;

  useDailyHabitReminder(habits.length);

  React.useEffect(() => {
    if (allDoneToday && totalToday > 0 && !prevAllDone.current) {
      setShowCelebration(true);
      setCharacterMood('all_completed');
    }
    prevAllDone.current = allDoneToday;
  }, [allDoneToday, totalToday]);

  const handleToggle = (id: string) => {
    const result = toggleHabit(id);
    if (result.isUncheck) {
      setCharacterMood('idle');
      setShowCelebration(false);
      prevStreak.current = result.newStreak;
      justIncreasedStreak.current = false;
    } else {
      if (result.allDone) {
        setCharacterMood('all_completed');
        setShowCelebration(true);
      } else if (result.completed > 0) {
        setCharacterMood('habit_completed');
        setTimeout(() => setCharacterMood('idle'), 1500);
      }
      if (result.newStreak > prevStreak.current) {
        justIncreasedStreak.current = true;
        prevStreak.current = result.newStreak;
      }
    }
  };

  const handleAddTodo = () => {
    const t = newTodoTitle.trim();
    if (!t) return;
    addTodo(t);
    setNewTodoTitle('');
  };

  if (!loaded) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Text style={[styles.loading, { color: colors.muted }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={[styles.greeting, { color: colors.text }]}>
          {getGreeting()} 👋
        </Text>
        <Text style={[styles.subGreeting, { color: colors.muted }]}>
          Ready to continue your streak?
        </Text>

        {/* Streak */}
        <View style={styles.streakWrap}>
          <StreakCounter streak={currentStreak} justIncreased={justIncreasedStreak.current} />
        </View>

        {/* 3D Character - unlocks by streak */}
        <View style={styles.characterWrap}>
          <Character3D mood={characterMood} skin={currentCharacter} />
        </View>

        {/* Level - key so bar resets when XP changes (e.g. on undo) */}
        <LevelCard
          key={`level-${totalXP}`}
          level={level}
          progress={levelProgress}
          title={levelName}
        />

        {/* Daily Progress (habits + todos) */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Progress</Text>
        <View style={styles.progressWrap}>
          <ProgressRing progress={dailyProgressPercent} label="Completed" />
        </View>

        {/* Today's Habits */}
        <View style={styles.habitsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Habits</Text>
          <Link href="/add-habit" asChild>
            <View style={[styles.addButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={22} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </View>
          </Link>
        </View>

        {habits.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="fitness-outline" size={40} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No habits yet. Add one to get started!
            </Text>
            <Link href="/add-habit" asChild>
              <Text style={[styles.emptyLink, { color: colors.primary }]}>Add your first habit</Text>
            </Link>
          </View>
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onToggle={handleToggle} onDelete={deleteHabit} />
          ))
        )}

        {/* Daily Todos */}
        <Text style={[styles.sectionTitle, { color: colors.text }, styles.todosSectionTitle]}>
          Daily todos
        </Text>
        <View style={[styles.todoInputRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <TextInput
            style={[styles.todoInput, { color: colors.text }]}
            placeholder="Add a task for today..."
            placeholderTextColor={colors.muted}
            value={newTodoTitle}
            onChangeText={setNewTodoTitle}
            onSubmitEditing={handleAddTodo}
            returnKeyType="done"
            maxLength={120}
          />
          <Pressable
            style={[styles.todoAddBtn, { backgroundColor: newTodoTitle.trim() ? colors.primary : colors.cardBorder }]}
            onPress={handleAddTodo}
            disabled={!newTodoTitle.trim()}
          >
            <Text style={styles.todoAddBtnText}>Add</Text>
          </Pressable>
        </View>
        {todayTodos.length === 0 ? (
          <Text style={[styles.todosEmpty, { color: colors.muted }]}>
            No todos for today. Add one above.
          </Text>
        ) : (
          todayTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}

        {/* Heatmap */}
        <View style={styles.heatmapSection}>
          <Heatmap data={heatmap} />
        </View>
      </ScrollView>

      <ConfettiCelebration
        visible={showCelebration}
        onDismiss={() => {
          setShowCelebration(false);
          setCharacterMood('idle');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  loading: {
    textAlign: 'center',
    marginTop: 80,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 15,
    marginBottom: 16,
  },
  streakWrap: {
    marginBottom: 16,
  },
  characterWrap: {
    marginBottom: 16,
    height: 180,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressWrap: {
    marginBottom: 24,
  },
  habitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyCard: {
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 12,
  },
  emptyLink: {
    fontSize: 15,
    fontWeight: '700',
  },
  heatmapSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  todosSectionTitle: {
    marginTop: 8,
  },
  todoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  todoInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  todoAddBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  todoAddBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  todosEmpty: {
    fontSize: 14,
    marginBottom: 20,
    fontStyle: 'italic',
  },
});
