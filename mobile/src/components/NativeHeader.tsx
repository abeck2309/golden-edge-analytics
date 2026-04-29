import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type NativeHeaderProps = {
  canGoBack: boolean;
  onBack: () => void;
  onOpenHub: () => void;
  onOpenNotifications: () => void;
  title: string;
};

export function NativeHeader({
  canGoBack,
  onBack,
  onOpenHub,
  onOpenNotifications,
  title
}: NativeHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        accessibilityRole="button"
        disabled={!canGoBack}
        onPress={onBack}
        style={[styles.iconButton, !canGoBack && styles.iconButtonDisabled]}
      >
        <Text style={styles.iconText}>‹</Text>
      </TouchableOpacity>

      <TouchableOpacity accessibilityRole="button" onPress={onOpenHub} style={styles.titleWrap}>
        <Text style={styles.eyebrow}>Golden Edge Analytics</Text>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity accessibilityRole="button" onPress={onOpenNotifications} style={styles.alertButton}>
        <View style={styles.liveDot} />
        <Text style={styles.alertText}>Alerts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: "#0D0D0F",
    borderBottomColor: "rgba(180,151,90,0.28)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  iconButton: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  iconButtonDisabled: {
    opacity: 0.28
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 30
  },
  titleWrap: {
    flex: 1
  },
  eyebrow: {
    color: "#B4975A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2
  },
  alertButton: {
    alignItems: "center",
    borderColor: "rgba(180,151,90,0.42)",
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  alertText: {
    color: "#F4E7C5",
    fontSize: 12,
    fontWeight: "800"
  },
  liveDot: {
    backgroundColor: "#FF2F45",
    borderRadius: 5,
    height: 10,
    shadowColor: "#FF2F45",
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    width: 10
  }
});
