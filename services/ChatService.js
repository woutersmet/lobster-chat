// Mock chat sessions with placeholder data
const chatSessions = {
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

class ChatService {
  // Get all chat sessions
  static getAllSessions() {
    return Object.values(chatSessions);
  }

  // Get a specific session by ID
  static getSession(sessionId) {
    return chatSessions[sessionId] || null;
  }

  // Get messages for a specific session
  static getMessages(sessionId) {
    const session = chatSessions[sessionId];
    return session ? session.messages : [];
  }

  // Create a new empty session
  static createNewSession() {
    return {
      id: "new",
      title: "New Chat",
      messages: [],
    };
  }

  // Add a message to a session (for future use)
  static addMessage(sessionId, message) {
    if (chatSessions[sessionId]) {
      chatSessions[sessionId].messages.push(message);
    }
  }
}

export default ChatService;

