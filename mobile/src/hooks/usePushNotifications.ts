import { useCallback, useEffect, useState } from "react";

import {
  addNotificationListeners,
  PushRegistrationResult,
  registerForPushNotifications,
  scheduleLocalTestNotification
} from "../services/notifications";
import { registerPushTokenWithBackend } from "../services/pushTokenRegistration";

type NotificationState = {
  lastMessage: string | null;
  pushToken: string | null;
  registration: PushRegistrationResult | null;
  registering: boolean;
};

export function usePushNotifications() {
  const [state, setState] = useState<NotificationState>({
    lastMessage: null,
    pushToken: null,
    registration: null,
    registering: false
  });

  const register = useCallback(async () => {
    setState((current) => ({ ...current, registering: true }));

    const registration = await registerForPushNotifications();

    if (registration.token) {
      try {
        await registerPushTokenWithBackend(registration.token);
      } catch (error) {
        console.warn("Push token backend registration failed", error);
      }
    }

    setState((current) => ({
      ...current,
      registration,
      registering: false,
      pushToken: registration.token
    }));

    return registration;
  }, []);

  const sendLocalTest = useCallback(async () => {
    await scheduleLocalTestNotification();
  }, []);

  useEffect(() => {
    return addNotificationListeners({
      onReceived: (notification) => {
        setState((current) => ({
          ...current,
          lastMessage: notification.request.content.body ?? notification.request.content.title ?? "Notification received"
        }));
      }
    });
  }, []);

  return {
    ...state,
    register,
    sendLocalTest
  };
}
