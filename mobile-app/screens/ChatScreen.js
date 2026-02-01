import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import ChatService from "../services/ChatService";
import ChatInput from "../components/ChatInput";
import SettingsService from "../services/SettingsService";

export default function ChatScreen({ route, navigation }) {
  const conversationId = route.params?.conversationId || "default";
  const conversationTitle = route.params?.title || "Chat";
  const initialMessage = route.params?.initialMessage;

  // Load messages from ChatService based on conversationId
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(SettingsService.isLocalMode());

  // Subscribe to settings changes
  useEffect(() => {
    const unsubscribe = SettingsService.subscribe(() => {
      setIsLocalMode(SettingsService.isLocalMode());
    });
    return unsubscribe;
  }, []);

  // Update the header title and load messages when conversation changes
  useEffect(() => {
    navigation.setOptions({
      title: conversationTitle,
    });

    // Load messages for this conversation
    loadMessages();
  }, [conversationId, conversationTitle, navigation]);

  const loadMessages = async () => {
    if (conversationId !== "new") {
      const loadedMessages = await ChatService.getMessages(conversationId);
      setMessages(loadedMessages);
    } else {
      setMessages([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  // Handle initial message from home screen
  useEffect(() => {
    if (initialMessage && initialMessage.trim() !== "") {
      handleInitialMessage();
    }
  }, [initialMessage]);

  const handleInitialMessage = async () => {
    // If this is a new conversation, create it first
    if (conversationId === "new") {
      const newSession = await ChatService.createNewSession("New Chat");
      navigation.setParams({ conversationId: newSession.id });
    }

    // Send the initial message
    await sendMessageToServer(initialMessage);
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const messageText = inputText;
    setInputText("");

    await sendMessageToServer(messageText);
  };

  const sendMessageToServer = async (messageText) => {
    // Add user message to the server
    const userMessage = await ChatService.addMessage(conversationId, messageText, "user");

    if (userMessage) {
      setMessages((prev) => [...prev, userMessage]);
    }

    // Show typing indicator
    setIsTyping(true);

    // Send bot response after 3 seconds
    setTimeout(async () => {
      const botResponse = ChatService.getRandomBotResponse();
      const botMessage = await ChatService.addMessage(conversationId, botResponse, "bot");

      if (botMessage) {
        setMessages((prev) => [...prev, botMessage]);
      }
      setIsTyping(false);
    }, 3000);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={[styles.messageText, isUser && styles.userText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  const TypingIndicator = () => {
    const [dots, setDots] = useState(".");

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev === "...") return ".";
          return prev + ".";
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <View style={[styles.messageBubble, styles.botBubble]}>
        <Text style={styles.messageText}>typing{dots}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {isLocalMode && (
        <TouchableOpacity
          style={styles.localModeNotice}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Text style={styles.localModeText}>
            ⚠️ Local Simulation Mode
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted={false}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={sendMessage}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  localModeNotice: {
    backgroundColor: "#FFF9C4", // Light yellow
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F9A825", // Darker yellow border
  },
  localModeText: {
    fontSize: 13,
    color: "#F57F17", // Dark yellow/orange text
    fontWeight: "600",
    textAlign: "center",
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#f0f0f0",
  },
  botBubble: {
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  userText: {
    color: "#000",
  },
});

