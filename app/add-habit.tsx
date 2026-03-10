import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useHabitStore } from '@/store/useHabitStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AddHabitScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme ?? 'dark'];
  const { addHabit } = useHabitStore();
  const [title, setTitle] = useState('');
  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSave = () => {
    const t = title.trim();
    if (!t) return;
    addHabit(t);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8, borderColor: colors.cardBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn} hitSlop={12}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>New Habit</Text>
        <View style={styles.closeBtn} />
      </View>

      <View style={[styles.formWrap, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.form}>
        <Text style={[styles.label, { color: colors.muted }]}>What do you want to track?</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.text }]}
          placeholder="e.g. Workout, Read 20 pages..."
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
          autoFocus
          maxLength={80}
        />
        <AnimatedPressable
          onPress={handleSave}
          onPressIn={() => { scale.value = withSpring(0.96); }}
          onPressOut={() => { scale.value = withSpring(1); }}
          style={[
            styles.saveBtn,
            { backgroundColor: title.trim() ? colors.primary : colors.cardBorder },
            animatedButtonStyle,
          ]}
          disabled={!title.trim()}
        >
          <Text style={styles.saveBtnText}>Add Habit</Text>
        </AnimatedPressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  formWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    padding: 20,
    paddingTop: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 24,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
