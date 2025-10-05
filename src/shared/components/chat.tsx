import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from 'expo-router';

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      `You: ${input}`,
      `AI: Mock response to "${input}"`,
    ]);
    setInput("");
  };

  return (
    <Modal animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>AI Chat</Text>
          <ScrollView style={styles.messages}>
            {messages.map((msg, i) => (
              <Text key={i} style={styles.message}>
                {msg}
              </Text>
            ))}
          </ScrollView>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            style={styles.input}
          />
          <View style={styles.buttons}>
            <Pressable onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  messages: { marginBottom: 12 },
  message: { marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  sendButton: {
    backgroundColor: "#e10a93",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendText: { color: "#fff", fontWeight: "bold" },
  closeButton: {
    backgroundColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeText: { fontWeight: "bold" },
});
