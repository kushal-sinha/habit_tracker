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
import type { Habit } from '@/types/habit';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const colorScheme = useColorScheme();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(habit.completedToday ? 1 : 0);
  const lastCompletedRef = React.useRef(habit.completedToday);
  const colors = Colors[colorScheme ?? 'dark'];

  React.useEffect(() => {
    if (lastCompletedRef.current === habit.completedToday) return;
    lastCompletedRef.current = habit.completedToday;
    checkScale.value = withSpring(habit.completedToday ? 1 : 0, { damping: 12 });
  }, [habit.completedToday]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.02, { duration: 80 }),
      withSpring(1)
    );
    onToggle(habit.id);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, animatedCardStyle]}
    >
      <View style={styles.checkboxWrap}>
        <View style={[styles.checkbox, { borderColor: colors.primary }]}>
          <Animated.View
            style={[
              styles.checkboxInner,
              { backgroundColor: habit.completedToday ? colors.success : 'transparent' },
              animatedCheckStyle,
            ]}
          >
            {habit.completedToday && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </Animated.View>
        </View>
      </View>
      <Text
        style={[
          styles.title,
          { color: colors.text },
          habit.completedToday && styles.titleCompleted,
        ]}
        numberOfLines={2}
      >
        {habit.title}
      </Text>
      {onDelete && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onDelete(habit.id);
          }}
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  checkboxWrap: {
    marginRight: 14,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 18,
    height: 18,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 4,
  },
});
