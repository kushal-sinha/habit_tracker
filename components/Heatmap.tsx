import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { getDaysInRange, getWeekday } from '@/utils/date';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const COLS = 13;
const CELL = 10;
const GAP = 3;
const WIDTH = COLS * (CELL + GAP) - GAP;

function getColor(count: number, total: number, isDark: boolean): string {
  if (total === 0) return isDark ? '#2d2d44' : '#e5e7eb';
  const ratio = count / total;
  if (ratio <= 0) return isDark ? '#2d2d44' : '#e5e7eb';
  if (ratio < 0.33) return '#86efac';
  if (ratio < 0.66) return '#22c55e';
  return '#15803d';
}

interface HeatmapProps {
  data: { date: string; count: number; total: number }[];
}

export function Heatmap({ data }: HeatmapProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'dark'];

  const days = getDaysInRange(90);
  const mapByDate = new Map(data.map((d) => [d.date, d]));

  const rows: { date: string; count: number; total: number }[][] = [];
  let week: { date: string; count: number; total: number }[] = [];
  let startDow = getWeekday(days[0]);

  for (let i = 0; i < startDow; i++) {
    week.push({ date: '', count: 0, total: 0 });
  }
  for (const d of days) {
    const r = mapByDate.get(d) ?? { date: d, count: 0, total: 0 };
    week.push(r);
    if (week.length === 7) {
      rows.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push({ date: '', count: 0, total: 0 });
    rows.push(week);
  }

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.text }]}>Last 90 days</Text>
      <Svg width={WIDTH} height={rows.length * (CELL + GAP) - GAP} style={styles.svg}>
        {rows.map((row, ri) =>
          row.map((cell, ci) => {
            if (!cell.date) return null;
            const fill = getColor(cell.count, cell.total, isDark);
            return (
              <Rect
                key={`${ri}-${ci}`}
                x={ci * (CELL + GAP)}
                y={ri * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={3}
                fill={fill}
              />
            );
          })
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  svg: {
    alignSelf: 'flex-start',
  },
});
