import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type PushRegistrationResult =
  | {
      status: "granted";
      token: string;
    }
  | {
      status: "denied" | "unavailable" | "missing-project-id";
      token: null;
      message: string;
    };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

async function configureAndroidChannel() {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync("vgk-updates", {
    name: "VGK Updates",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#B4975A"
  });
}

function getProjectId() {
  return Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
}

export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  await configureAndroidChannel();

  if (!Device.isDevice) {
    return {
      status: "unavailable",
      token: null,
      message: "Remote push notifications require a physical iOS or Android device."
    };
  }

  const existingPermission = await Notifications.getPermissionsAsync();
  let finalStatus = existingPermission.status;

  if (existingPermission.status !== "granted") {
    const requestedPermission = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermission.status;
  }

  if (finalStatus !== "granted") {
    return {
      status: "denied",
      token: null,
      message: "Notification permission was not granted."
    };
  }

  const projectId = getProjectId();

  if (!projectId) {
    return {
      status: "missing-project-id",
      token: null,
      message: "Add the EAS projectId in app.json before registering remote push tokens."
    };
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });

  return {
    status: "granted",
    token: token.data
  };
}

export async function scheduleLocalTestNotification() {
  await configureAndroidChannel();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Golden Edge Analytics",
      body: "VGK notification test is ready.",
      data: {
        type: "test",
        category: "vgk-update"
      }
    },
    trigger: {
      seconds: 2,
      channelId: "vgk-updates"
    }
  });
}

export function addNotificationListeners(options: {
  onReceived?: (notification: Notifications.Notification) => void;
  onResponse?: (response: Notifications.NotificationResponse) => void;
}) {
  const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
    options.onReceived?.(notification);
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    options.onResponse?.(response);
  });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
