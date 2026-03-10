import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useEffect, useRef } from 'react';

const DAILY_REMINDER_ID = 'habit-daily-reminder';
const REMINDER_HOUR = 9;
const REMINDER_MINUTE = 0;

/** Set to true to test: notification fires in 10 seconds instead of daily at 9 AM. */
const TEST_NOTIFICATION = __DEV__;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useDailyHabitReminder(habitCount: number) {
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let cancelled = false;

    async function setup() {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('habits', {
            name: 'Habit reminders',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250],
          });
        }
        const { status } = await Notifications.getPermissionsAsync();
        const granted = status === 'granted' || (await Notifications.requestPermissionsAsync()).status === 'granted';
        if (!granted || cancelled) return;

        await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
        scheduledRef.current = false;

        if (habitCount > 0) {
          const content = {
            title: TEST_NOTIFICATION ? 'Test: Habit reminder 🔔' : "Time for your habits 🌟",
            body: `Complete your ${habitCount} habit${habitCount === 1 ? '' : 's'} today and keep your streak going!`,
            channelId: Platform.OS === 'android' ? 'habits' : undefined,
          };
          if (TEST_NOTIFICATION) {
            await Notifications.scheduleNotificationAsync({
              identifier: DAILY_REMINDER_ID,
              content,
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 10,
              },
            });
          } else {
            await Notifications.scheduleNotificationAsync({
              identifier: DAILY_REMINDER_ID,
              content,
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: REMINDER_HOUR,
                minute: REMINDER_MINUTE,
                channelId: Platform.OS === 'android' ? 'habits' : undefined,
              },
            });
          }
          scheduledRef.current = true;
        }
      } catch (e) {
        console.warn('Daily habit reminder setup failed', e);
      }
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, [habitCount]);
}
