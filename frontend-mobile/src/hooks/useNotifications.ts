
import { Platform } from 'react-native';

// ─── Web Notifications (built into browsers, no library needed) ───

const sendWebNotification = async (title: string, body: string) => {
  if (typeof window === 'undefined') return;

  // Ask permission if not granted yet
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  } else {
    // Permission denied — fall back to browser alert
    alert(`${title}\n\n${body}`);
  }
};

// ─── Mobile Notifications (expo-notifications) ────────────────────

let ExpoNotifications: any = null;

const getExpoNotif = async () => {
  if (ExpoNotifications) return ExpoNotifications;
  ExpoNotifications = await import('expo-notifications');
  ExpoNotifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  return ExpoNotifications;
};

const sendMobileNotification = async (title: string, body: string) => {
  try {
    const notif = await getExpoNotif();
    await notif.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: null,
    });
  } catch { }
};

const sendMobileReminderNotification = async () => {
  try {
    const notif = await getExpoNotif();
    await notif.scheduleNotificationAsync({
      content: {
        title: '📚 Time to Quiz!',
        body: 'You have new quizzes waiting. Come test your knowledge!',
      },
      trigger: {
        type: notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        repeats: false,
      },
    });
  } catch { }
};

// ─── Unified hook — works on both web and mobile ──────────────────

export const useNotifications = () => {

  const sendQuizCompletedNotification = async (score: number, total: number) => {
    const title = '🎉 Quiz Completed!';
    const body = `You scored ${score} out of ${total}. Great job!`;

    if (Platform.OS === 'web') {
      await sendWebNotification(title, body);
    } else {
      await sendMobileNotification(title, body);
    }
  };

  const sendReminderNotification = async () => {
    const title = '📚 Time to Quiz!';
    const body = 'You have new quizzes waiting. Come test your knowledge!';

    if (Platform.OS === 'web') {
      // On web show it after 5 seconds to mimic the mobile delay
      setTimeout(() => sendWebNotification(title, body), 5000);
    } else {
      await sendMobileReminderNotification();
    }
  };

  return { sendQuizCompletedNotification, sendReminderNotification };
};









