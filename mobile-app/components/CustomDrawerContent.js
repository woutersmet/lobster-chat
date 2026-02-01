import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import ChatService from "../services/ChatService";
import SettingsService from "../services/SettingsService";

export default function CustomDrawerContent(props) {
  const { navigation } = props;

  // State for conversations
  const [conversations, setConversations] = useState([]);

  // Get user settings
  const [userName, setUserName] = useState(SettingsService.getFullName());
  const [userInitials, setUserInitials] = useState(
    SettingsService.getUserInitials()
  );

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Subscribe to settings changes
  useEffect(() => {
    const unsubscribe = SettingsService.subscribe(() => {
      setUserName(SettingsService.getFullName());
      setUserInitials(SettingsService.getUserInitials());
    });
    return unsubscribe;
  }, []);

  const loadConversations = async () => {
    const sessions = await ChatService.getAllSessions();
    setConversations(sessions);
  };

  const navigateToConversation = (conversationId, title) => {
    navigation.navigate("Chat", { conversationId, title });
  };

  const createNewChat = async () => {
    const newSession = await ChatService.createNewSession();
    navigation.navigate("Chat", { conversationId: newSession.id, title: newSession.title });
    // Reload conversations to show the new one
    loadConversations();
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
          <Text style={styles.avatarText}>{userInitials}</Text>
        </View>
        <Text style={styles.profileName}>{userName}</Text>
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

