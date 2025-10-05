import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import ShawbrookModuleNetworking from "@/modules/@shawbrook/module-networking";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, `You: ${input}`]);
    setLoading(true);

    try {
      const reply = await ShawbrookModuleNetworking.sendChatMessage(input);
      setMessages((prev) => [...prev, `AI: ${reply}`]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, "AI: Error fetching response"]);
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await ShawbrookModuleNetworking.getChatHistory();
        setMessages(history);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  return (
    <Modal animationType="slide" transparent>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <View style={styles.modal}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <Text style={styles.title}>AI Chat</Text>

          <ScrollView
            style={styles.messages}
            ref={scrollRef}
            contentContainerStyle={styles.messagesContainer}
          >
            {messages.map((msg, i) => (
              <Text key={i} style={styles.message}>
                {msg}
              </Text>
            ))}
            {loading && <Text style={styles.message}>AI is typing...</Text>}
          </ScrollView>

          <View style={styles.inputWrapper}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              style={styles.input}
              editable={!loading}
            />
            <Pressable
              onPress={sendMessage}
              style={[styles.sendButton, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 16,
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 16,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
  messages: {
    flex: 1,
    marginBottom: 12,
  },
  messagesContainer: {
    paddingBottom: 10,
  },
  message: {
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#e10a93",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
