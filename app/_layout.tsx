import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { HabitStoreProvider } from '@/store/useHabitStore';

SplashScreen.preventAutoHideAsync();

const SPLASH_BG = '#FDF2F8';
const SPLASH_BG_DARK = '#1F0A14';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashAnimationDone, setSplashAnimationDone] = useState(false);

  useEffect(() => {
    if (splashAnimationDone) {
      SplashScreen.hideAsync();
    }
  }, [splashAnimationDone]);

  const handleAnimationFinish = useCallback(() => {
    setSplashAnimationDone(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSplashAnimationDone(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const splashBg = colorScheme === 'dark' ? SPLASH_BG_DARK : SPLASH_BG;

  return (
    <HabitStoreProvider>
      <ThemeProvider value={theme}>
        <View style={styles.root}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: colorScheme === 'dark' ? '#0f0f1a' : SPLASH_BG },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="add-habit" options={{ presentation: 'modal', title: 'Add Habit', headerShown: false }} />
          </Stack>
          {!splashAnimationDone && (
            <View
              style={[StyleSheet.absoluteFill, styles.splashOverlay, { backgroundColor: splashBg }]}
              pointerEvents="auto"
            >
              <LottieView
                source={require('../assets/productivity.json')}
                autoPlay
                loop={false}
                onAnimationFinish={handleAnimationFinish}
                style={styles.lottie}
              />
            </View>
          )}
        </View>
        <StatusBar style="light" />
      </ThemeProvider>
    </HabitStoreProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  lottie: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
