import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ChatService from "../services/ChatService";
import ChatInput from "../components/ChatInput";

export default function ChatScreen({ route, navigation }) {
  const conversationId = route.params?.conversationId || "default";
  const conversationTitle = route.params?.title || "Chat";

  // Load messages from ChatService based on conversationId
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  // Update the header title and load messages when conversation changes
  useEffect(() => {
    navigation.setOptions({
      title: conversationTitle,
    });

    // Load messages for this conversation
    const loadedMessages = ChatService.getMessages(conversationId);
    setMessages(loadedMessages);
  }, [conversationId, conversationTitle, navigation]);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInputText("");
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted={false}
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

