import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

export default function CustomDrawerContent(props) {
  const { navigation } = props;

  // Sample conversation data
  const conversations = [
    { id: "1", title: "Project Discussion" },
    { id: "2", title: "Team Meeting Notes" },
    { id: "3", title: "Budget Planning" },
    { id: "4", title: "Marketing Strategy" },
    { id: "5", title: "Product Roadmap" },
  ];

  const navigateToConversation = (conversationId, title) => {
    navigation.navigate("Chat", { conversationId, title });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Main Navigation Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.drawerItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.drawerItemText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Conversations Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONVERSATIONS</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 0.5,
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
    backgroundColor: "#f8f8f8",
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
});

