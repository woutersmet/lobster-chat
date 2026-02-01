import ApiService from "./ApiService";
import SettingsService from "./SettingsService";

// Cache for sessions and messages (used in server mode)
let sessionsCache = [];
let messagesCache = {};

// Mock chat sessions for local simulation mode
const mockChatSessions = {
  "1": {
    id: "1",
    title: "Project Discussion",
    messages: [
      { id: "1-1", text: "Let's discuss the new project timeline", sender: "bot" },
      { id: "1-2", text: "Sure, what's the deadline?", sender: "user" },
      { id: "1-3", text: "We're aiming for end of Q2", sender: "bot" },
      { id: "1-4", text: "That sounds reasonable", sender: "user" },
    ],
  },
  "2": {
    id: "2",
    title: "Team Meeting Notes",
    messages: [
      { id: "2-1", text: "Here are the key points from today's meeting", sender: "bot" },
      { id: "2-2", text: "Thanks! Can you summarize the action items?", sender: "user" },
      { id: "2-3", text: "1. Update documentation\n2. Review PRs\n3. Schedule follow-up", sender: "bot" },
    ],
  },
  "3": {
    id: "3",
    title: "Budget Planning",
    messages: [
      { id: "3-1", text: "Let's review the Q1 budget", sender: "bot" },
      { id: "3-2", text: "What's our current spending?", sender: "user" },
      { id: "3-3", text: "We're at 75% of allocated budget", sender: "bot" },
      { id: "3-4", text: "Good, we're on track then", sender: "user" },
      { id: "3-5", text: "Yes, looking healthy for this quarter", sender: "bot" },
    ],
  },
  "4": {
    id: "4",
    title: "Marketing Strategy",
    messages: [
      { id: "4-1", text: "What's our focus for the next campaign?", sender: "user" },
      { id: "4-2", text: "We should target social media and content marketing", sender: "bot" },
      { id: "4-3", text: "Agreed. What platforms?", sender: "user" },
      { id: "4-4", text: "LinkedIn and Twitter for B2B, Instagram for B2C", sender: "bot" },
    ],
  },
  "5": {
    id: "5",
    title: "Product Roadmap",
    messages: [
      { id: "5-1", text: "Here's the updated product roadmap", sender: "bot" },
      { id: "5-2", text: "What are the priority features?", sender: "user" },
      { id: "5-3", text: "User authentication, dashboard redesign, and API improvements", sender: "bot" },
      { id: "5-4", text: "Perfect, let's start with authentication", sender: "user" },
    ],
  },
};

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
  // Get all chat sessions (local or server based on mode)
  static async getAllSessions() {
    if (SettingsService.isLocalMode()) {
      // Return mock sessions in local mode
      return Object.values(mockChatSessions);
    }

    // Server mode
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
    if (SettingsService.isLocalMode()) {
      return mockChatSessions[sessionId] || null;
    }

    const session = sessionsCache.find(s => s.id === sessionId);
    return session || null;
  }

  // Get messages for a specific session (local or server based on mode)
  static async getMessages(sessionId) {
    if (SettingsService.isLocalMode()) {
      // Return mock messages in local mode
      const session = mockChatSessions[sessionId];
      return session ? session.messages : [];
    }

    // Server mode
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

  // Create a new session (local or server based on mode)
  static async createNewSession(title = "New Chat") {
    if (SettingsService.isLocalMode()) {
      // In local mode, create a temporary session
      return {
        id: "new",
        title: title,
        messages: [],
      };
    }

    // Server mode
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

  // Add a message to a session (local or server based on mode)
  static async addMessage(sessionId, text, sender = "user") {
    if (SettingsService.isLocalMode()) {
      // In local mode, add to mock sessions
      const newMessage = {
        id: Date.now().toString(),
        text: text,
        sender: sender,
      };

      // Create session if it doesn't exist (for "new" conversations)
      if (!mockChatSessions[sessionId]) {
        mockChatSessions[sessionId] = {
          id: sessionId,
          title: "New Chat",
          messages: [],
        };
      }

      mockChatSessions[sessionId].messages.push(newMessage);

      return newMessage;
    }

    // Server mode
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

