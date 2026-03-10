import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heatmap } from '@/components/Heatmap';
import { LevelCard } from '@/components/LevelCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHabitStore } from '@/store/useHabitStore';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme ?? 'dark'];
  const { totalXP, level, levelProgress, levelName, heatmapData } = useHabitStore();
  const heatmap = useMemo(() => heatmapData(), [heatmapData]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>Your Progress</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Level up by completing habits and keeping streaks.
        </Text>

        <LevelCard level={level} progress={levelProgress} title={levelName} />

        <View style={[styles.xpCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Ionicons name="flash" size={24} color={colors.primary} />
          <Text style={[styles.xpValue, { color: colors.text }]}>{totalXP} XP</Text>
          <Text style={[styles.xpLabel, { color: colors.muted }]}>Total experience</Text>
        </View>

        <Heatmap data={heatmap} />
      </ScrollView>
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
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  xpValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  xpLabel: {
    fontSize: 13,
    marginLeft: 'auto',
  },
});
