import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SettingsService from "../services/SettingsService";
import ChatInput from "../components/ChatInput";

export default function HomeScreen() {
  const [userName, setUserName] = useState(SettingsService.getFullName());
  const [inputText, setInputText] = useState("");
  const navigation = useNavigation();

  // Subscribe to settings changes
  useEffect(() => {
    const unsubscribe = SettingsService.subscribe(() => {
      setUserName(SettingsService.getFullName());
    });
    return unsubscribe;
  }, []);

  const handleSend = () => {
    // Navigate to a new chat with the message
    navigation.navigate("Chat", {
      conversationId: "new",
      title: "New Chat",
      initialMessage: inputText,
    });
    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {userName}</Text>
        <Text style={styles.subtitle}>How can I help you today?</Text>
      </View>

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        placeholder="Ask me anything..."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});

