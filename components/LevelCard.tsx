import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface LevelCardProps {
  level: number;
  progress: number;
  title: string;
}

export function LevelCard({ level, progress, title }: LevelCardProps) {

  console.log('LevelCard', level, progress, title);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const barWidth = useSharedValue(progress);

  useEffect(() => {
    barWidth.value = withSpring(progress, { damping: 15, stiffness: 90 });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%`,
  }));

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={styles.row}>
        <Text style={[styles.levelLabel, { color: colors.muted }]}>Level {level}</Text>
        <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.cardBorder }]}>
        <Animated.View style={[styles.bar, { backgroundColor: colors.primary }, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelLabel: {
    fontSize: 13,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
});
