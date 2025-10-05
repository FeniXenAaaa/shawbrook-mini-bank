import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

export default function ChatFloatingButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() =>
        router.push({
          pathname: "/(app)/ai-chat",
        })
      }
    >
      <Text style={styles.floatingButtonText}>💬</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#e10a93",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: { fontSize: 28, color: "#fff" },
});
