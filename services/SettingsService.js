// User settings data
let userSettings = {
  userName: "Wouter Smet",
  userInitials: "WS",
};

// Listeners for settings changes
const listeners = [];

class SettingsService {
  // Get user name
  static getUserName() {
    return userSettings.userName;
  }

  // Get user initials
  static getUserInitials() {
    return userSettings.userInitials;
  }

  // Get all user settings
  static getUserSettings() {
    return { ...userSettings };
  }

  // Update user name
  static setUserName(name) {
    userSettings.userName = name;
    // Auto-generate initials from name
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    userSettings.userInitials = initials;
    this.notifyListeners();
  }

  // Update user initials manually
  static setUserInitials(initials) {
    userSettings.userInitials = initials.toUpperCase().slice(0, 2);
    this.notifyListeners();
  }

  // Subscribe to settings changes
  static subscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of changes
  static notifyListeners() {
    listeners.forEach((listener) => listener(userSettings));
  }
}

export default SettingsService;

