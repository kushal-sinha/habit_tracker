import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StreakCounterProps {
  streak: number;
  justIncreased?: boolean;
}

export function StreakCounter({ streak, justIncreased }: StreakCounterProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.6);
  const numScale = useSharedValue(1);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.5, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (justIncreased) {
      numScale.value = withSequence(
        withSpring(1.4, { damping: 8 }),
        withSpring(1)
      );
      scale.value = withSequence(
        withSpring(1.15),
        withSpring(1)
      );
    }
  }, [justIncreased, streak]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: glow.value,
  }));

  const numberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numScale.value }],
  }));

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Animated.View style={flameStyle}>
        <Ionicons name="flame" size={32} color="#f97316" />
      </Animated.View>
      <Animated.Text style={[styles.streakNum, { color: colors.text }, numberStyle]}>
        {streak}
      </Animated.Text>
      <Text style={[styles.label, { color: colors.muted }]}>
        Day Streak
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  streakNum: {
    fontSize: 24,
    fontWeight: '800',
  },
  label: {
    fontSize: 14,
  },
});
