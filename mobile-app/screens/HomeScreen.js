import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SettingsService from "../services/SettingsService";
import ChatInput from "../components/ChatInput";

// Premade messages
const PREMADE_MESSAGES = [
  {
    label: "Inbox summary",
    message: "Give an update on most recent and important emails coming in.",
  },
  {
    label: "Calendar summary",
    message: "How is my calendar looking today?",
  },
  {
    label: "Motivation",
    message: "Give me a motivating quote",
  },
];

export default function HomeScreen() {
  const [userFirstName, setUserFirstName] = useState(SettingsService.getFirstName());
  const [inputText, setInputText] = useState("");
  const navigation = useNavigation();

  // Subscribe to settings changes
  useEffect(() => {
    const unsubscribe = SettingsService.subscribe(() => {
      setUserFirstName(SettingsService.getFirstName());
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

  const handlePremadeMessage = (message) => {
    setInputText(message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Image
            source={require("../assets/mobile_app_lobster.png")}
            style={styles.lobsterImage}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome, {userFirstName}</Text>
          <Text style={styles.subtitle}>How can I help you today?</Text>
        </View>

        <View style={styles.premadeContainer}>
          {PREMADE_MESSAGES.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.premadeButton}
              onPress={() => handlePremadeMessage(item.message)}
            >
              <Text style={styles.premadeLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  lobsterImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
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
    marginBottom: 32,
  },
  premadeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
    justifyContent: "center",
  },
  premadeButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  premadeLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
});

