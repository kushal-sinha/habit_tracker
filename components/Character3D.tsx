import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { CharacterMood } from '@/types/habit';
import type { CharacterSkin } from '@/types/achievements';
import { getCharacterForStreak } from '@/types/achievements';

interface Character3DProps {
  mood: CharacterMood;
  skin?: CharacterSkin;
}

export function Character3D({ mood, skin: skinProp }: Character3DProps) {
  const skin = skinProp ?? getCharacterForStreak(0);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.fallback]}>
        <View style={[styles.fallbackBlob, { backgroundColor: skin.bodyColor }]} />
      </View>
    );
  }

  try {
    const { Character3DScene } = require('./Character3DScene');
    return (
      <View style={styles.container}>
        <Character3DScene mood={mood} skin={skin} style={styles.canvas} />
      </View>
    );
  } catch {
    return (
      <View style={[styles.container, styles.fallback]}>
        <View style={[styles.fallbackBlob, { backgroundColor: skin.bodyColor }]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: 180,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackBlob: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#a78bfa',
    opacity: 0.9,
  },
});
