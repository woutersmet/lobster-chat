import ApiService from "./ApiService";

// Cache for sessions and messages
let sessionsCache = [];
let messagesCache = {};

// Random bot responses
const BOT_RESPONSES = [
  "That's interesting! Tell me more.",
  "I understand what you mean.",
  "Great question! Let me think about that.",
  "I see where you're coming from.",
  "That makes sense to me.",
  "Thanks for sharing that with me.",
  "I appreciate your perspective.",
  "Could you elaborate on that?",
  "That's a good point.",
  "I'm here to help!",
];

class ChatService {
  // Get all chat sessions from the server
  static async getAllSessions() {
    const result = await ApiService.getSessions();
    if (result.success) {
      // Transform server data to match expected format
      sessionsCache = result.data.map(session => ({
        id: session.id.toString(),
        title: session.title,
        createdAt: session.createdAt,
      }));
      return sessionsCache;
    }
    // Return cached data if API call fails
    return sessionsCache;
  }

  // Get a specific session by ID
  static getSession(sessionId) {
    const session = sessionsCache.find(s => s.id === sessionId);
    return session || null;
  }

  // Get messages for a specific session from the server
  static async getMessages(sessionId) {
    const result = await ApiService.getMessages(sessionId);
    if (result.success) {
      // Transform server data to match expected format
      const messages = result.data.map(msg => ({
        id: msg.id.toString(),
        text: msg.text,
        sender: msg.sender,
        createdAt: msg.createdAt,
      }));
      messagesCache[sessionId] = messages;
      return messages;
    }
    // Return cached data if API call fails
    return messagesCache[sessionId] || [];
  }

  // Create a new session on the server
  static async createNewSession(title = "New Chat") {
    const result = await ApiService.createSession(title);
    if (result.success) {
      const newSession = {
        id: result.data.id.toString(),
        title: result.data.title,
        createdAt: result.data.createdAt,
      };
      sessionsCache.push(newSession);
      return newSession;
    }
    // Return a temporary session if API call fails
    return {
      id: "new",
      title: title,
      messages: [],
    };
  }

  // Add a message to a session on the server
  static async addMessage(sessionId, text, sender = "user") {
    const result = await ApiService.createMessage(sessionId, text, sender);
    if (result.success) {
      const newMessage = {
        id: result.data.id.toString(),
        text: result.data.text,
        sender: result.data.sender,
        createdAt: result.data.createdAt,
      };

      // Update cache
      if (!messagesCache[sessionId]) {
        messagesCache[sessionId] = [];
      }
      messagesCache[sessionId].push(newMessage);

      return newMessage;
    }
    return null;
  }

  // Get a random bot response
  static getRandomBotResponse() {
    return BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
  }
}

export default ChatService;

