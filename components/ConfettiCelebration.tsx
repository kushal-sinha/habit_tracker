import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ConfettiCelebrationProps {
  visible: boolean;
  onDismiss: () => void;
  message?: string;
  subMessage?: string;
}

const PARTICLE_COUNT = 24;
const colors = ['#a78bfa', '#f97316', '#34d399', '#fbbf24', '#f472b6'];

export function ConfettiCelebration({
  visible,
  onDismiss,
  message = 'Great job!',
  subMessage = "You completed all habits today.\n🔥 Streak maintained!",
}: ConfettiCelebrationProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'dark'];
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 12 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: visible ? 'auto' : 'none',
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder },
          cardStyle,
        ]}
      >
        <View style={styles.particles}>
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <Particle key={i} index={i} color={colors[i % colors.length]} />
          ))}
        </View>
        <Ionicons name="checkmark-circle" size={56} color={themeColors.success} style={styles.icon} />
        <Text style={[styles.message, { color: themeColors.text }]}>{message}</Text>
        <Text style={[styles.subMessage, { color: themeColors.muted }]}>{subMessage}</Text>
        <Text style={[styles.tapHint, { color: themeColors.muted }]}>Tap to close</Text>
      </Animated.View>
    </Animated.View>
  );
}

function Particle({ index, color }: { index: number; color: string }) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
    const dist = 60 + Math.random() * 40;
    x.value = withDelay(
      index * 30,
      withSpring(Math.cos(angle) * dist, { damping: 8 })
    );
    y.value = withDelay(
      index * 30,
      withSpring(Math.sin(angle) * dist, { damping: 8 })
    );
    opacity.value = withDelay(index * 30, withTiming(0.9, { duration: 200 }));
    scale.value = withDelay(index * 30, withSpring(1));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: color },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    margin: 24,
    padding: 28,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    maxWidth: 320,
  },
  particles: {
    position: 'absolute',
    width: 1,
    height: 1,
    top: '50%',
    left: '50%',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    left: -5,
    top: -5,
  },
  icon: {
    marginBottom: 12,
  },
  message: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  tapHint: {
    fontSize: 12,
    marginTop: 16,
  },
});
