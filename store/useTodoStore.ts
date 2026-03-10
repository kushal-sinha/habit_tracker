import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import type { Todo } from '@/types/habit';
import { todayKey } from '@/utils/date';

const TODOS_KEY = '@habit_tracker_todos';

export function useTodoStore() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(TODOS_KEY);
      if (raw) setTodos(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load todo store', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persist = useCallback((next: Todo[]) => {
    setTodos(next);
    AsyncStorage.setItem(TODOS_KEY, JSON.stringify(next));
  }, []);

  const addTodo = useCallback(
    (title: string) => {
      const today = todayKey();
      const newTodo: Todo = {
        id: `todo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        title: title.trim(),
        completed: false,
        dateKey: today,
        createdAt: new Date().toISOString(),
      };
      persist([...todos, newTodo]);
      return newTodo;
    },
    [todos, persist]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      persist(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [todos, persist]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      persist(todos.filter((t) => t.id !== id));
    },
    [todos, persist]
  );

  const todayTodos = todos.filter((t) => t.dateKey === todayKey());

  return {
    loaded,
    todos: todayTodos,
    allTodos: todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    refresh: load,
  };
}
