import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Character3D } from '@/components/Character3D';
import { CharacterDetailModal } from '@/components/CharacterDetailModal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHabitStore } from '@/store/useHabitStore';
import { useAchievementStore } from '@/store/useAchievementStore';
import { CHARACTERS } from '@/types/achievements';
import type { CharacterSkin } from '@/types/achievements';

function AchievementRow({
  character,
  unlockedAt,
  currentStreak,
  onPress,
  onShare,
  colors,
}: {
  character: CharacterSkin;
  unlockedAt: string | null;
  currentStreak: number;
  onPress: () => void;
  onShare: () => void;
  colors: (typeof Colors)['dark'];
}) {
  const unlocked = currentStreak >= character.streakRequired;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
        pressed && styles.rowPressed,
      ]}
    >
      <View style={[styles.emojiWrap, { backgroundColor: unlocked ? character.bodyColor + '30' : colors.cardBorder }]}>
        <Text style={styles.emoji}>{character.emoji}</Text>
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.charName, { color: colors.text }]}>{character.name}</Text>
        <Text style={[styles.charDesc, { color: colors.muted }]}>{character.description}</Text>
        {unlockedAt && (
          <Text style={[styles.unlockedAt, { color: colors.primary }]}>
            Unlocked {unlockedAt}
          </Text>
        )}
      </View>
      {unlocked && (
        <Pressable onPress={onShare} style={[styles.shareBtn, { backgroundColor: colors.primary }]}>
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

export default function AchievementsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme ?? 'dark'];
  const { currentStreak } = useHabitStore();
  const { currentCharacter, unlockedAt } = useAchievementStore(currentStreak);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterSkin | null>(null);

  const handleShare = (character: CharacterSkin) => {
    const message = `I unlocked ${character.name} ${character.emoji} in Habit Tracker! ${character.streakRequired} day streak. Keep building habits!`;
    Share.share({
      message,
      title: `Habit Tracker – ${character.name}`,
    });
  };

  const handleShareAll = () => {
    const unlocked = CHARACTERS.filter((c) => currentStreak >= c.streakRequired);
    const names = unlocked.map((c) => `${c.name} ${c.emoji}`).join(', ');
    Share.share({
      message: `My Habit Tracker achievements: ${names}. ${currentStreak} day streak! 🔥`,
      title: 'My Habit Tracker Achievements',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>Achievements</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Unlock characters by keeping your streak going!
        </Text>

        {/* Current character preview - tap to see details */}
        <Pressable
          onPress={() => setSelectedCharacter(currentCharacter)}
          style={[styles.currentCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Text style={[styles.currentLabel, { color: colors.muted }]}>Current character — tap for details</Text>
          <View style={styles.previewWrap}>
            <Character3D mood="idle" skin={currentCharacter} />
          </View>
          <Text style={[styles.currentName, { color: colors.text }]}>
            {currentCharacter.name} {currentCharacter.emoji}
          </Text>
          <Pressable onPress={handleShareAll} style={[styles.shareAllBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="share-social-outline" size={18} color="#fff" />
            <Text style={styles.shareAllText}>Share my achievements</Text>
          </Pressable>
        </Pressable>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>All characters — tap for details</Text>
        {CHARACTERS.map((char) => (
          <AchievementRow
            key={char.id}
            character={char}
            unlockedAt={unlockedAt[char.id] ?? null}
            currentStreak={currentStreak}
            onPress={() => setSelectedCharacter(char)}
            onShare={() => handleShare(char)}
            colors={colors}
          />
        ))}
      </ScrollView>

      <CharacterDetailModal
        visible={!!selectedCharacter}
        character={selectedCharacter}
        unlocked={selectedCharacter ? currentStreak >= selectedCharacter.streakRequired : false}
        onClose={() => setSelectedCharacter(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 15, marginBottom: 24 },
  currentCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
  },
  currentLabel: { fontSize: 12, marginBottom: 8 },
  previewWrap: { width: '100%', height: 180, marginBottom: 8 },
  currentName: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  shareAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  shareAllText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  rowPressed: { opacity: 0.85 },
  emojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: { fontSize: 24 },
  textWrap: { flex: 1 },
  charName: { fontSize: 16, fontWeight: '700' },
  charDesc: { fontSize: 13, marginTop: 2 },
  unlockedAt: { fontSize: 12, marginTop: 4 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  shareText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
