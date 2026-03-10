import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { getDaysInRange, getWeekday } from '@/utils/date';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const COLS = 7; // days per week
const GAP = 2;
const DAYS_COUNT = 30;

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
  const [layoutWidth, setLayoutWidth] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setLayoutWidth(w);
  }, []);

  // Oldest first so top row = start of period, bottom row = recent (today)
  const daysOldestFirst = [...getDaysInRange(DAYS_COUNT)].reverse();
  const mapByDate = new Map(data.map((d) => [d.date, d]));

  const rows: { date: string; count: number; total: number }[][] = [];
  let week: { date: string; count: number; total: number }[] = [];
  const startDow = getWeekday(daysOldestFirst[0]);

  for (let i = 0; i < startDow; i++) {
    week.push({ date: '', count: 0, total: 0 });
  }
  for (const d of daysOldestFirst) {
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

  // Cell size so grid fills full container width
  const cell = layoutWidth > 0 ? (layoutWidth + GAP) / COLS - GAP : 8;
  const width = layoutWidth > 0 ? layoutWidth : COLS * (8 + GAP) - GAP;
  const height = rows.length * (cell + GAP) - GAP;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <Text style={[styles.title, { color: colors.text }]}>Last 30 days</Text>
      <Svg width={width} height={height} style={styles.svg}>
        {rows.map((row, ri) =>
          row.map((cellData, ci) => {
            if (!cellData.date) return null;
            const fill = getColor(cellData.count, cellData.total, isDark);
            return (
              <Rect
                key={`${ri}-${ci}`}
                x={ci * (cell + GAP)}
                y={ri * (cell + GAP)}
                width={cell}
                height={cell}
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
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  svg: {
    alignSelf: 'stretch',
  },
});
