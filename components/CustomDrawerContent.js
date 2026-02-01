import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import ChatService from "../services/ChatService";

export default function CustomDrawerContent(props) {
  const { navigation } = props;

  // Get conversations from ChatService
  const conversations = ChatService.getAllSessions();

  const navigateToConversation = (conversationId, title) => {
    navigation.navigate("Chat", { conversationId, title });
  };

  const createNewChat = () => {
    navigation.navigate("Chat", { conversationId: "new", title: "New Chat" });
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
        {/* Main Navigation Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Conversations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CONVERSATIONS</Text>
            <TouchableOpacity style={styles.newChatButton} onPress={createNewChat}>
              <Text style={styles.newChatButtonText}>+ New</Text>
            </TouchableOpacity>
          </View>
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationItem}
              onPress={() =>
                navigateToConversation(conversation.id, conversation.title)
              }
            >
              <Text style={styles.conversationText}>{conversation.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Profile Section - Pinned to Bottom */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => navigation.navigate("Settings")}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>WS</Text>
        </View>
        <Text style={styles.profileName}>Wouter Smet</Text>
        <Ionicons name="settings-outline" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 60,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 0.5,
  },
  newChatButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#000",
    borderRadius: 12,
  },
  newChatButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  drawerItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  conversationItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  conversationText: {
    fontSize: 15,
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  profileName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

