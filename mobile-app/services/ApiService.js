import SettingsService from "./SettingsService";

class ApiService {
  // Get the base URL from settings
  static getBaseUrl() {
    return SettingsService.getServerUrl();
  }

  // Health check endpoint
  static async checkHealth() {
    try {
      const baseUrl = this.getBaseUrl();
      if (!baseUrl) {
        throw new Error("Server URL not configured");
      }

      const response = await fetch(`${baseUrl}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Health check failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Get all sessions
  static async getSessions() {
    try {
      const baseUrl = this.getBaseUrl();
      if (!baseUrl) {
        throw new Error("Server URL not configured");
      }

      const response = await fetch(`${baseUrl}/api/sessions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      return { success: false, error: error.message };
    }
  }

  // Create a new session
  static async createSession(title) {
    try {
      const baseUrl = this.getBaseUrl();
      if (!baseUrl) {
        throw new Error("Server URL not configured");
      }

      const response = await fetch(`${baseUrl}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Failed to create session:", error);
      return { success: false, error: error.message };
    }
  }

  // Get messages for a session
  static async getMessages(sessionId) {
    try {
      const baseUrl = this.getBaseUrl();
      if (!baseUrl) {
        throw new Error("Server URL not configured");
      }

      const response = await fetch(`${baseUrl}/api/sessions/${sessionId}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return { success: false, error: error.message };
    }
  }

  // Create a new message in a session
  static async createMessage(sessionId, text, sender = "user") {
    try {
      const baseUrl = this.getBaseUrl();
      if (!baseUrl) {
        throw new Error("Server URL not configured");
      }

      const response = await fetch(`${baseUrl}/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, sender }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Failed to create message:", error);
      return { success: false, error: error.message };
    }
  }
}

export default ApiService;

