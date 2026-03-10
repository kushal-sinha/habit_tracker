import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 120;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CX = SIZE / 2;
const CY = SIZE / 2;

interface ProgressRingProps {
  progress: number; // 0–100
  label?: string;
}

export function ProgressRing({ progress, label = 'Daily Progress' }: ProgressRingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progress / 100, {
      damping: 15,
      stiffness: 90,
    });
  }, [progress]);

  const circumference = 2 * Math.PI * R;
  const animatedProps = useAnimatedProps(() => {
    const p = Math.min(1, Math.max(0, animatedProgress.value));
    const strokeDashoffset = circumference * (1 - p);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Circle
          cx={CX}
          cy={CY}
          r={R}
          stroke={colors.cardBorder}
          strokeWidth={STROKE}
          fill="transparent"
        />
        <AnimatedCircle
          cx={CX}
          cy={CY}
          r={R}
          stroke={colors.success}
          strokeWidth={STROKE}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${CX} ${CY})`}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={[styles.center, { width: SIZE, height: SIZE }]}>
          <Text style={[styles.percent, { color: colors.text }]}>
            {Math.round(progress)}%
          </Text>
          <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignSelf: 'center',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
