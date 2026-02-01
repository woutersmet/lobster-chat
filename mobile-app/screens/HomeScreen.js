import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Image, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SettingsService from "../services/SettingsService";
import ApiService from "../services/ApiService";
import ChatService from "../services/ChatService";
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
  const [serverMode, setServerMode] = useState(SettingsService.getServerMode());
  const [healthStatus, setHealthStatus] = useState(null); // null, 'online', 'offline'
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Subscribe to settings changes
  useEffect(() => {
    const unsubscribe = SettingsService.subscribe(() => {
      setUserFirstName(SettingsService.getFirstName());
      setServerMode(SettingsService.getServerMode());
    });
    return unsubscribe;
  }, []);

  // Check health on mount if in server mode
  useEffect(() => {
    if (serverMode === 'server') {
      checkHealth();
    }
  }, [serverMode]);

  const checkHealth = async () => {
    if (serverMode === 'server') {
      const result = await ApiService.checkHealth();
      setHealthStatus(result.success ? 'online' : 'offline');
      return result;
    }
    return { success: false };
  };

  const onRefresh = async () => {
    setRefreshing(true);

    // Redo health check
    const healthResult = await checkHealth();

    // If health check is successful, refetch sessions and messages
    if (healthResult && healthResult.success) {
      // Refetch all sessions
      const sessions = await ChatService.getAllSessions();

      // Refetch messages for all sessions
      if (sessions && sessions.length > 0) {
        await Promise.all(
          sessions.map(session => ChatService.getMessages(session.id))
        );
      }
    }

    setRefreshing(false);
  };

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Image
            source={require("../assets/mobile_app_lobster.png")}
            style={styles.lobsterImage}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome, {userFirstName}</Text>
          <Text style={styles.subtitle}>How can I help you today?</Text>

          {/* Server Status - Tappable */}
          <TouchableOpacity
            style={styles.serverStatus}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.serverStatusLabel}>Server Status: </Text>
            <Text style={styles.serverStatusMode}>
              {serverMode === 'local' ? 'Local Simulation' : 'Server'}
            </Text>
            {serverMode === 'server' && healthStatus && (
              <>
                <View style={[
                  styles.statusDot,
                  healthStatus === 'online' ? styles.statusOnline : styles.statusOffline
                ]} />
                <Text style={styles.serverStatusText}>
                  {healthStatus === 'online' ? 'Online' : 'Offline'}
                </Text>
              </>
            )}
          </TouchableOpacity>
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
  serverStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  serverStatusLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  serverStatusMode: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  serverStatusText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusOnline: {
    backgroundColor: "#4CAF50",
  },
  statusOffline: {
    backgroundColor: "#F44336",
  },
});

