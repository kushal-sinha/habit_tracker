/**
 * Habit Tracker theme: modern, minimal, purple-orange gradient, dark-friendly
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1a1a2e',
    background: '#f8f7fc',
    tint: '#7c3aed',
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: '#7c3aed',
    card: '#ffffff',
    cardBorder: '#e5e7eb',
    primary: '#7c3aed',
    primaryEnd: '#ea580c',
    success: '#10b981',
    muted: '#6b7280',
  },
  dark: {
    text: '#f3f4f6',
    background: '#0f0f1a',
    tint: '#a78bfa',
    icon: '#9ca3af',
    tabIconDefault: '#6b7280',
    tabIconSelected: '#a78bfa',
    card: '#1a1a2e',
    cardBorder: '#2d2d44',
    primary: '#8b5cf6',
    primaryEnd: '#f97316',
    success: '#34d399',
    muted: '#9ca3af',
  },
};

export const Gradients = {
  primary: ['#7c3aed', '#a855f7', '#ea580c'],
  card: ['#1e1b4b', '#312e81'],
  success: ['#059669', '#10b981'],
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
