import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Character3D } from '@/components/Character3D';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { CharacterSkin } from '@/types/achievements';

interface CharacterDetailModalProps {
  visible: boolean;
  character: CharacterSkin | null;
  unlocked: boolean;
  onClose: () => void;
}

export function CharacterDetailModal({
  visible,
  character,
  unlocked,
  onClose,
}: CharacterDetailModalProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme ?? 'dark'];

  if (!character) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8, borderColor: colors.cardBorder }]}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{character.name}</Text>
          <View style={styles.closeBtn} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom , flexGrow: 1, justifyContent: 'center' },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 3D Preview */}
          <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.previewWrap}>
              <Character3D mood="idle" skin={character} />
            </View>
            <Text style={[styles.characterName, { color: colors.text }]}>
              {character.name} {character.emoji}
            </Text>
            <Text style={[styles.characterDesc, { color: colors.muted }]}>{character.description}</Text>
            {!unlocked && (
              <View style={[styles.lockedBadge, { backgroundColor: colors.cardBorder }]}>
                <Ionicons name="lock-closed" size={14} color={colors.muted} />
                <Text style={[styles.lockedText, { color: colors.muted }]}>
                  Unlock at {character.streakRequired} day streak
                </Text>
              </View>
            )}
          </View>

          {/* Power Up section */}
          <View style={[styles.powerUpCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.powerUpHeader}>
              <Ionicons name="flash" size={22} color={character.lightColor} />
              <Text style={[styles.powerUpTitle, { color: colors.text }]}>Power Up</Text>
            </View>
            <Text style={[styles.powerUpName, { color: character.lightColor }]}>{character.powerUp.name}</Text>
            <Text style={[styles.powerUpDesc, { color: colors.muted }]}>{character.powerUp.description}</Text>
            <View style={styles.statsWrap}>
              {character.powerUp.stats.map((stat, i) => (
                <View key={i} style={[styles.statRow, { borderBottomColor: colors.cardBorder }]}>
                  <Ionicons name="checkmark-circle" size={18} color={character.bodyColor} />
                  <Text style={[styles.statText, { color: colors.text }]}>{stat}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 16 },
  previewCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  previewWrap: { width: '100%', height: 180, marginBottom: 12 },
  characterName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  characterDesc: { fontSize: 14, textAlign: 'center' },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  lockedText: { fontSize: 13, fontWeight: '600' },
  powerUpCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  powerUpHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  powerUpTitle: { fontSize: 16, fontWeight: '700' },
  powerUpName: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  powerUpDesc: { fontSize: 14, lineHeight: 20, marginBottom: 14 },
  statsWrap: { gap: 4 },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  statText: { fontSize: 15, flex: 1 },
});
