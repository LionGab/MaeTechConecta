import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface PushRegistrationResult {
  granted: boolean;
  expoPushToken?: string;
  error?: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  try {
    // Android: criar canal padrão
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Padrão',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    // Verificar/solicitar permissão
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { granted: false, error: 'Permissão de notificações negada.' };
    }

    // Obter token Expo
    const token = await Notifications.getExpoPushTokenAsync();
    return { granted: true, expoPushToken: token.data };
  } catch (error: any) {
    return { granted: false, error: error?.message || 'Falha ao registrar push.' };
  }
}

export function addNotificationListeners(
  onReceive?: (n: Notifications.Notification) => void,
  onResponse?: (r: Notifications.NotificationResponse) => void
) {
  const receiveSub = Notifications.addNotificationReceivedListener((notification) => {
    onReceive?.(notification);
  });
  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    onResponse?.(response);
  });
  return () => {
    receiveSub.remove();
    responseSub.remove();
  };
}

export async function scheduleLocalNotification(title: string, body: string, seconds = 1) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds },
  });
}
