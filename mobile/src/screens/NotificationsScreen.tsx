import * as Clipboard from "expo-clipboard";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { usePushNotifications } from "../hooks/usePushNotifications";

type NotificationsScreenProps = {
  notifications: ReturnType<typeof usePushNotifications>;
};

const remoteAlertTypes = [
  "Game start",
  "Final score",
  "New article / update",
  "Breaking VGK news"
];

export function NotificationsScreen({ notifications }: NotificationsScreenProps) {
  const statusLabel = notifications.registration?.status ?? "not requested";
  const statusMessage =
    notifications.registration?.status === "granted"
      ? "Push notifications are enabled for this device."
      : notifications.registration?.message ??
        "Enable notifications to register this device for future VGK alerts.";

  async function registerDevice() {
    const result = await notifications.register();

    if (result.status === "granted") {
      Alert.alert("Notifications enabled", "Expo push token created for this device.");
    } else {
      Alert.alert("Notifications not enabled", result.message);
    }
  }

  async function copyToken() {
    if (!notifications.pushToken) {
      return;
    }

    await Clipboard.setStringAsync(notifications.pushToken);
    Alert.alert("Copied", "Expo push token copied.");
  }

  async function sendLocalTest() {
    await notifications.sendLocalTest();
    Alert.alert("Test scheduled", "A local notification should appear shortly.");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>VGK Alerts</Text>
        <Text style={styles.title}>Notification Settings</Text>
        <Text style={styles.body}>{statusMessage}</Text>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Permission</Text>
          <Text style={styles.statusValue}>{statusLabel}</Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          disabled={notifications.registering}
          onPress={registerDevice}
          style={[styles.primaryButton, notifications.registering && styles.disabledButton]}
        >
          <Text style={styles.primaryButtonText}>
            {notifications.registering ? "Registering..." : "Enable Push Notifications"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity accessibilityRole="button" onPress={sendLocalTest} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Send Local Test</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Expo Push Token</Text>
        <Text selectable style={styles.tokenText}>
          {notifications.pushToken ?? "No token yet"}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!notifications.pushToken}
          onPress={copyToken}
          style={[styles.secondaryButton, !notifications.pushToken && styles.disabledButton]}
        >
          <Text style={styles.secondaryButtonText}>Copy Token</Text>
        </TouchableOpacity>
        <Text style={styles.helperText}>
          Later, send this token to your backend from the register flow and store it against a user or device.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Remote Alert Types Ready</Text>
        {remoteAlertTypes.map((type) => (
          <View key={type} style={styles.alertTypeRow}>
            <View style={styles.dot} />
            <Text style={styles.alertTypeText}>{type}</Text>
          </View>
        ))}
      </View>

      {notifications.lastMessage ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Latest Notification</Text>
          <Text style={styles.body}>{notifications.lastMessage}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#070707",
    gap: 14,
    padding: 16,
    paddingBottom: 32
  },
  card: {
    backgroundColor: "#111114",
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18
  },
  eyebrow: {
    color: "#B4975A",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 8
  },
  body: {
    color: "#C9C3B5",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10
  },
  statusRow: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.10)",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14
  },
  statusLabel: {
    color: "#918B80",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  statusValue: {
    color: "#F4E7C5",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#B4975A",
    borderRadius: 12,
    marginTop: 18,
    paddingVertical: 13
  },
  primaryButtonText: {
    color: "#0A0A0A",
    fontSize: 14,
    fontWeight: "900"
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "rgba(180,151,90,0.52)",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    paddingVertical: 13
  },
  secondaryButtonText: {
    color: "#F4E7C5",
    fontSize: 14,
    fontWeight: "900"
  },
  disabledButton: {
    opacity: 0.45
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900"
  },
  tokenText: {
    backgroundColor: "#09090A",
    borderRadius: 10,
    color: "#C9C3B5",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    padding: 12
  },
  helperText: {
    color: "#918B80",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12
  },
  alertTypeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingTop: 13
  },
  alertTypeText: {
    color: "#C9C3B5",
    fontSize: 14,
    fontWeight: "700"
  },
  dot: {
    backgroundColor: "#B4975A",
    borderRadius: 4,
    height: 8,
    width: 8
  }
});
