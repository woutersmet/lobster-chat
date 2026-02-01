// User settings data
let userSettings = {
  firstName: "Wouter",
  lastName: "Smet",
};

// Listeners for settings changes
const listeners = [];

class SettingsService {
  // Get first name
  static getFirstName() {
    return userSettings.firstName;
  }

  // Get last name
  static getLastName() {
    return userSettings.lastName;
  }

  // Get full name
  static getFullName() {
    return `${userSettings.firstName} ${userSettings.lastName}`.trim();
  }

  // Get user initials (auto-generated)
  static getUserInitials() {
    const first = userSettings.firstName[0] || "";
    const last = userSettings.lastName[0] || "";
    return (first + last).toUpperCase();
  }

  // Get all user settings
  static getUserSettings() {
    return { ...userSettings };
  }

  // Update first name
  static setFirstName(firstName) {
    userSettings.firstName = firstName;
    this.notifyListeners();
  }

  // Update last name
  static setLastName(lastName) {
    userSettings.lastName = lastName;
    this.notifyListeners();
  }

  // Update both names
  static setNames(firstName, lastName) {
    userSettings.firstName = firstName;
    userSettings.lastName = lastName;
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

