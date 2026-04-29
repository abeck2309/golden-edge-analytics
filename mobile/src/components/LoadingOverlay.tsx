import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingOverlay() {
  return (
    <View pointerEvents="none" style={styles.overlay}>
      <ActivityIndicator color="#B4975A" size="large" />
      <Text style={styles.text}>Loading Golden Edge</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(7,7,7,0.82)",
    gap: 12,
    justifyContent: "center",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  text: {
    color: "#F4E7C5",
    fontSize: 13,
    fontWeight: "700"
  }
});
