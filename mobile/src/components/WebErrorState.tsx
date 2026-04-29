import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type WebErrorStateProps = {
  onRetry: () => void;
};

export function WebErrorState({ onRetry }: WebErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Golden Edge is offline</Text>
      <Text style={styles.body}>
        Check your connection and try again. The app will reload the live hub when the site is reachable.
      </Text>
      <TouchableOpacity accessibilityRole="button" onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#070707",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center"
  },
  body: {
    color: "#B9B4A7",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    maxWidth: 320,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#B4975A",
    borderRadius: 999,
    marginTop: 22,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  buttonText: {
    color: "#101010",
    fontSize: 14,
    fontWeight: "900"
  }
});
