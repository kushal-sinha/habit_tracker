import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { Todo } from '@/types/habit';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const colorScheme = useColorScheme();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(todo.completed ? 1 : 0);
  const colors = Colors[colorScheme ?? 'dark'];

  React.useEffect(() => {
    checkScale.value = withSpring(todo.completed ? 1 : 0, { damping: 12 });
  }, [todo.completed]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.02, { duration: 80 }),
      withSpring(1)
    );
    onToggle(todo.id);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, animatedCardStyle]}
    >
      <View style={styles.checkboxWrap}>
        <View style={[styles.checkbox, { borderColor: colors.primary }]}>
          <Animated.View
            style={[
              styles.checkboxInner,
              { backgroundColor: todo.completed ? colors.primary : 'transparent' },
              animatedCheckStyle,
            ]}
          >
            {todo.completed && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </Animated.View>
        </View>
      </View>
      <Text
        style={[
          styles.title,
          { color: colors.text },
          todo.completed && styles.titleCompleted,
        ]}
        numberOfLines={2}
      >
        {todo.title}
      </Text>
      {onDelete && (
        <Pressable
          onPress={() => onDelete(todo.id)}
          hitSlop={8}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={20} color={colors.muted} />
        </Pressable>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  checkboxWrap: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  deleteBtn: {
    padding: 4,
  },
});
